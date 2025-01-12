var _cache = {};
var _allowKeys = false;
var _currentSize = 0;
var _cacheSize = -1;

const disallowedTokens = new Set([
  "this",
  "__proto__",
  "prototype",
  "constructor",
]);
const skipTokens = new Set(["['']", '[""]', "[``]", ""]);
const escapeReg = /\.|\[|\]|\"|\'|\s/;

const hasOwn = Object.hasOwn || Object.call.bind(Object.hasOwnProperty);
const isArray = Array.isArray || isArray2;

function isNotObjectLike(obj) {
  return typeof obj !== "object" || obj === null;
}

function isObject(obj) {
  return typeof obj === "object" && !isArray(obj) && obj !== null;
}

function validCacheSize(size) {
  return typeof size === "number" && !isNaN(size) && size >= -1;
}

function checkObject(obj) {
  if (typeof obj !== "object" || obj === null)
    throw new SyntaxError("Invalid Object Type");
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
  let current, i, len;
  for (i = 0, len = path.length; i < len; i++) {
    current = path[i];
    if (current === "[") counter++;
    else if (current === "]") counter--;
  }
  return counter === 0;
}

function checkQuotes(path) {
  let quote, i, len, current;
  for (i = 0, len = path.length; i < len; i++) {
    current = path[i];
    if (current === "'" || current === '"' || current === "`") {
      if (!quote) quote = current;
      else if (quote === current) quote = undefined;
    }
  }
  return typeof quote === "undefined";
}

function isArray2(a) {
  return a && a.constructor === Array;
}

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
  //if (!isArray(res)) throw new SyntaxError("Could not tokenize Notation");
  return res;
}

function evalSetProperty(obj, path, value) {
  if (path.length === 0) return;
  for (let i = path.length; --i > 0; ) {
    obj = obj[path[i]];
    if (isNotObjectLike(obj)) {
      throw new EvalError("Could not fully evaluate the object path");
    }
  }
  obj[path[0]] = value;
}

function evalGetProperty(obj, path) {
  if (path.length === 0) return obj;
  for (let i = path.length; --i > 0; ) {
    obj = obj[path[i]];
    if (isNotObjectLike(obj)) {
      throw new EvalError("Could not fully evaluate the object path");
    }
  }
  return obj[path[0]];
}

function evalRemoveProperty(obj, path) {
  if (path.length === 0) {
    for (const key of Object.keys(obj)) delete obj[key];
    return;
  }
  for (let i = path.length; --i > 0; ) {
    obj = obj[path[i]];
    if (isNotObjectLike(obj)) {
      throw new EvalError("Could not fully evaluate the object path");
    }
  }
  if (isArray(obj)) {
    const key = parseInt(path[0], 10);
    if (isNaN(key)) throw new SyntaxError("key is not a Number");
    obj.splice(key, 1);
  } else delete obj[path[0]];
}

function evalHas(obj, path, detailed) {
  if (path.length === 0) return true;
  for (let i = path.length, key, prop; i-- > 0; ) {
    prop = obj[(key = path[i])];
    if ((!isNotObjectLike(prop) && i !== 0) || typeof prop !== "undefined") {
      obj = prop;
      continue;
    }
    // prettier-ignore
    if (detailed) return {
      depth: path.length - i - 1,
      left: ++i,
      failedKey: key,
      currentObject: obj,
    };
    else return false;
  }
  return true;
}

function evalCreate(obj, path) {
  if (path.length === 0) return obj;
  for (let i = path.length, key; --i > 0; ) {
    key = path[i];
    if (isNotObjectLike(obj[key])) obj[key] = {};
    obj = obj[key];
  }
  if (!hasOwn(obj, (path = path[0]))) obj[path] = {};
}

function keysIterator(obj, currentPath) {
  let keys = Object.keys(obj);
  if (keys.length === 0) return currentPath ? [currentPath] : [];
  const paths = [];
  let key, value, newPath;
  for (key of keys) {
    value = obj[key];
    newPath =
      currentPath === ""
        ? key
        : escapeReg.test(key)
        ? key.includes("'")
          ? `${currentPath}.["${key}"]`
          : `${currentPath}.['${key}']`
        : Array.isArray(obj)
        ? `${currentPath}[${key}]`
        : `${currentPath}.${key}`;
    if (typeof value === "object" && value !== null) {
      paths.push(...keysIterator(value, newPath));
    } else paths.push(newPath);
  }
  return paths;
}

class PathSage {
  static setProperty(object, path, value) {
    checkObject(object);
    evalSetProperty(object, tokenize(path), value);
  }

  static getProperty(object, path) {
    checkObject(object);
    return evalGetProperty(object, tokenize(path));
  }

  static hasProperty(object, path, detailed = false) {
    checkObject(object);
    return evalHas(object, tokenize(path), detailed);
  }

  static removeProperty(object, path) {
    checkObject(object);
    evalRemoveProperty(object, tokenize(path));
  }

  static deleteProperty(object, path) {
    checkObject(object);
    evalRemoveProperty(object, tokenize(path));
  }

  static create(object = {}, path = "") {
    checkObject(object);
    evalCreate(object, tokenize(path));
  }

  static keys(object) {
    checkObject(object);
    return keysIterator(object, "");
  }

  static getPaths(object) {
    checkObject(object);
    return keysIterator(object, "");
  }

  static clearCache() {
    _cache = {};
    _currentSize = 0;
  }

  static configure(options = {}) {
    if (!isObject(options)) {
      throw new TypeError("Invalid Options Type");
    }
    if (typeof options.allowKeys === "boolean") {
      _allowKeys = options.allowKeys;
    }
    let size = parseInt(options.cacheSize, 10);
    if (validCacheSize(size)) _cacheSize = size;
  }
}

function tokenize(path) {
  if (_cache.hasOwnProperty(path)) {
    return _cache[path].slice(0) || [];
  }
  if (++_currentSize > _cacheSize && _cacheSize !== -1) {
    _cache = {};
    _currentSize = 1;
  }
  if (isArray(path)) return (_cache[path] = path.reverse()).slice(0);
  checkNotation(path);
  return (_cache[path] = tokenizePath(path, _allowKeys).reverse()).slice(0);
}

function getPrivates() {
  return {
    cache: _cache,
    cacheSize: _cacheSize,
    currentSize: _currentSize,
    allowKeys: _allowKeys,
  };
}

module.exports = { PathSage, getPrivates };
