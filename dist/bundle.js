function isNotObjectLike(obj) {
  return typeof obj !== "object" || obj === null;
}

function validCacheSize(size) {
  if (typeof size === "string") size = parseFloat(size);
  return (
    typeof size === "number" &&
    !isNaN(size) &&
    size === Math.floor(size) &&
    size >= -1 &&
    size <= Number.MAX_SAFE_INTEGER
  );
}

function checkObject(obj) {
  if (typeof obj !== "object" || obj === null)
    throw new SyntaxError("Invalid Object Type");
}

const hasOwn = Object.hasOwn || Object.call.bind(Object.hasOwnProperty);
const isArray =
  Array.isArray ||
  function (a) {
    return a && a.constructor === Array;
  };
const disallowedTokens = new Set([
  "this",
  "__proto__",
  "prototype",
  "constructor",
]);
const skipTokens = new Set(["['']", '[""]', "[``]", ""]);
const escapeReg = /\.|\[|\]|\"|\'|\s/;
var _cache = {};
var _allowKeys = false;
var _currentSize = 0;
var _cacheSize = 4096;

function tokenizePath(path, allowKeys) {
  if (path.length === 0) return [];
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
  return res.reverse();
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

function tokenize(path) {
  if (hasOwn(_cache, path)) {
    return _cache[path].slice(0) || [];
  }
  if (++_currentSize > _cacheSize && _cacheSize !== -1) {
    _cache = {};
    _currentSize = 1;
  }
  if (isArray(path)) return (_cache[path] = path.reverse()).slice(0);
  if (typeof path !== "string") throw new TypeError("Invalid Notation Type");
  if (path.length === 0) return [];
  const res = [],
    reg = /\[\s*(\d+)(?=\s*])|\[\s*(["'`])((?:\\.|(?!\2).)*)\2\s*]|[\w$]+/g;
  let a, token;
  while ((a = reg.exec(path))) {
    token = a[1] || a[3] || a[0];
    if (skipTokens.has(token)) continue;
    if (!_allowKeys && disallowedTokens.has(token))
      throw new SyntaxError("Disallowed Key encountered");
    res.push(token);
  }
  return (_cache[path] = res.reverse()).slice(0);
}

function set(object, path, value) {
  checkObject(object);
  path = tokenize(path);
  if (path.length === 0) return;
  for (let i = path.length; --i > 0; ) {
    obj = obj[path[i]];
    if (isNotObjectLike(obj)) {
      throw new EvalError("Could not fully evaluate the object path");
    }
  }
  obj[path[0]] = value;
}

function get(object, path, defaultValue) {
  checkObject(object);
  path = tokenize(path);
  if (path.length === 0) return obj;
  for (let i = path.length; --i > 0; ) {
    obj = obj[path[i]];
    if (isNotObjectLike(obj)) {
      if (defaultValue) return defaultValue;
      throw new EvalError("Could not fully evaluate the object path");
    }
  }
  return obj[path[0]];
}

function has(object, path, detailed = false) {
  checkObject(object);
  path = tokenize(path);
  //if (path.length === 0) return true;
  for (var i = path.length, key, prop; i-- > 0; ) {
    prop = obj[(key = path[i])];
    if ((!isNotObjectLike(prop) && i !== 0) || typeof prop !== "undefined") {
      obj = prop;
      continue;
    }
    if (detailed)
      return {
        success: false,
        depth: path.length - i - 1,
        left: ++i,
        key: key,
        currentObject: obj,
      };
    else return false;
  }
  if (detailed)
    return {
      success: true,
      depth: path.length - i - 1,
      left: ++i,
      key: null,
      currentObject: obj,
    };
  return true;
}

function remove(object, path) {
  checkObject(object);
  path = tokenize(path);
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

function create(object = {}, path = "") {
  checkObject(object);
  path = tokenize(path);
  if (path.length === 0) return;
  for (let i = path.length, key; --i > 0; ) {
    key = path[i];
    if (isNotObjectLike(obj[key])) obj[key] = {};
    obj = obj[key];
  }
  if (!hasOwn(obj, (path = path[0]))) obj[path] = {};
}

function keys(object) {
  checkObject(object);
  return keysIterator(object, "");
}

function getPaths(object) {
  checkObject(object);
  return keysIterator(object, "");
}

function clearCache() {
  _cache = {};
  _currentSize = 0;
}

function configure(options = {}) {
  if (isNotObjectLike(options) || isArray(options)) {
    throw new TypeError("Invalid Options Type");
  }
  if (typeof options.allowKeys === "boolean") {
    _allowKeys = options.allowKeys;
  }
  if (validCacheSize(options.cacheSize)) _cacheSize = options.cacheSize;
}

module.exports = {
  set,
  get,
  has,
  remove,
  create,
  keys,
  getPaths,
  configure,
  clearCache,
};
