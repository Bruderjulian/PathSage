function validCacheSize(size) {
  return typeof size === "number" && !isNaN(size) && size >= -1;
}

function checkObject(obj) {
  if (typeof obj !== "object" || obj === null)
    throw new SyntaxError("Invalid Object Type");
}

function checkTokens(tokens) {
  for (let i = 0, len = tokens.length; i < len; i++) {
    if (typeof tokens[i] !== "string")
      throw new TypeError("Invalid Token Type");
  }
}

function checkNotation(path) {
  if (typeof path !== "string") throw new TypeError("Invalid Notation Type");
  if (path.length === 0) return;
  if (!checkBrackets(path)) {
    throw new SyntaxError("All brackets must be placed correctly");
  }
  if (!checkQuotes(path)) {
    throw new SyntaxError("All Quotes must be placed correctly");
  }
}

function checkBrackets(path) {
  let counter = 0;
  let current;
  for (let i = 0, len = path.length; i < len; i++) {
    current = path[i];
    if (current === "[") counter++;
    else if (current === "]") counter--;
  }
  return counter === 0;
}

function checkQuotes(path) {
  let current;
  let quote;
  for (let i = 0, len = path.length; i < len; i++) {
    current = path[i];
    if (current === "'" || current === '"' || current === "`") {
      if (!quote) quote = current;
      else if (quote === current) quote = undefined;
    }
  }
  return typeof quote === "undefined";
}

const isArray = Array.isArray;
function isNotObjectLike(obj) {
  return typeof obj !== "object" || obj === null;
}

var func;
const disallowedTokens = new Set([
  "this",
  "__proto__",
  "prototype",
  "constructor",
]);
const skipTokens = new Set(["['']", '[""]', "[``]", ""]);

const getFn = function (data, obj, key) {
  return obj[key];
}.bind(null, null);

const setFn = function (data, obj, key) {
  obj[key] = data;
};

const removeFn = function (data, obj, key) {
  if (isArray(obj)) {
    key = parseInt(key, 10);
    if (isNaN(key)) throw "key is NaN";
    obj.splice(key, 1);
  } else delete obj[key];
}.bind(null, null);

function tokenizePath(path, allowKeys) {
  const res = [],
    reg = /\[\s*(\d+)(?=\s*])|\[\s*(["'`])((?:\\.|(?!\2).)*)\2\s*]|[\w$]+/g;
  let a, token;
  while ((a = reg.exec(path))) {
    token = a[1] || a[3] || a[0];
    if (skipTokens.has(token)) continue;
    if (!allowKeys && disallowedTokens.has(token))
      throw new SyntaxError("Disallowed Key encountered");
    res.push(token);
  }
  if (!isArray(res)) throw new SyntaxError("Could not tokenize Notation");
  return res;
}

function evalProperty(obj, path) {
  if (path.length === 1) return func(obj, path[0]);
  const prop = obj[path.pop()];
  if (isNotObjectLike(prop)) {
    throw new EvalError("Could not fully evaluate the object path");
  }
  return evalProperty(prop, path);
}

function evalHas(obj, path, detailed, depth) {
  if (path.length === 0) return true;
  const key = path.pop();
  const prop = obj[key];
  if (
    (isNotObjectLike(prop) && path.length !== 0) ||
    !Object.hasOwn(obj, key)
  ) {
    return detailed
      ? {
          depth: depth,
          left: ++path.length,
          failedKey: key,
          currentObject: obj,
        }
      : false;
  }
  return evalHas(prop, path, detailed, ++depth);
}

function evalCreate(obj, path) {
  if (path.length === 1) {
    const key = path[0];
    if (!Object.hasOwn(obj, key)) obj[key] = {};
    return obj;
  }
  const key = path.pop();
  let prop = obj[key];
  if (isNotObjectLike(prop, key)) {
    obj[key] = prop = {};
  }
  evalCreate(prop, path);
  return obj;
}

function evalSingle(fn, obj, pathArr) {
  if (pathArr.length === 0) return obj;
  func = fn;
  return evalProperty(obj, pathArr);
}

function escapePath(token) {
  if (/\.|\[|\]|\"|\'|\s/.test(token)) {
    return token.includes('"') ? `['${token}']` : `["${token}"]`;
  }
  return token;
}

function stringifyPath(tokens) {
  let result = "";
  let token;
  let len = tokens.length;
  let i = 0;
  if (len === 1 || !isArray(tokens)) return escapePath(tokens[0]);
  for (; i < len; i++) {
    token = tokens[i];
    if (typeof token === "number") {
      result += `[${token}]`;
    } else {
      token = escapePath(token);
      result += i === 0 ? token : `.${token}`;
    }
  }
  return result;
}

function deepKeysIterator(obj, path) {
  var result = [];
  var numbered = isArray(obj);
  for (let [key, value] of Object.entries(obj)) {
    if (numbered) key = parseInt(key, 10);
    if (
      typeof value !== "object" ||
      value === null ||
      Object.keys(value).length === 0
    ) {
      if (path.length > 0) result.push(stringifyPath([...path, key]));
      else result.push(stringifyPath([key]));
    } else result.push(...deepKeysIterator(value, [...path, key]));
  }
  return result;
}
var _cache = {};
var _allowKeys = false;
var _currentSize = 0;
var _cacheSize = -1;

class unPathify {

  static setProperty(object, path, value) {
    checkObject(object);
    evalSingle(setFn.bind(null, value), object, tokenize(path));
  }

  static getProperty(object, path) {
    checkObject(object);
    return evalSingle(getFn, object, tokenize(path));
  }

  static hasProperty(object, path, detailed = false) {
    checkObject(object);
    return evalHas(object, tokenize(path), detailed, 0);
  }

  static removeProperty(object, path) {
    checkObject(object);
    evalSingle(removeFn, object, tokenize(path));
  }

  static deleteProperty(object, path) {
    checkObject(object);
    evalSingle(removeFn, object, tokenize(path));
  }

  static create(object, path) {
    if (object === undefined) return {};
    checkObject(object);
    evalCreate(object, tokenize(path));
  }

  static validate(path) {
    if (isArray(path)) checkTokens(path);
    else checkNotation(path);
  }

  static keys(object) {
    checkObject(object);
    return deepKeysIterator(object, []);
  }

  static getPaths(object) {
    checkObject(object);
    return deepKeysIterator(object, []);
  }

  static clearCache() {
    _cache = {};
    _currentSize = 0;
  }

  static configure(options = {}) {
    if (isNotObjectLike(options) || isArray(options)) {
      throw new TypeError("Invalid Options Type");
    }
    if (typeof options._allowKeys === "boolean") {
      _allowKeys = options._allowKeys;
    }
    let size = parseInt(options._cacheSize, 10);
    if (validCacheSize(size)) _cacheSize = size;
  }
}

function tokenize(path) {
  if (Object.hasOwn(_cache, path)) {
    return _cache[path].slice(0) || [];
  }
  checkNotation(path);
  var tokens = tokenizePath(path, _allowKeys).reverse();
  if (++_currentSize > _cacheSize && _cacheSize !== -1) {
    _cache = {};
    _currentSize = 1;
  }
  _cache[path] = tokens;
  return tokens.slice(0);
}

module.exports = unPathify;
