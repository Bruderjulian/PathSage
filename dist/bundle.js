function isNotObjectLike(obj) {
  return "object" != typeof obj || null === obj;
}
function checkObject(obj) {
  if ("object" != typeof obj || null === obj)
    throw SyntaxError("Invalid Object Type");
}
const hasOwn = Object.hasOwn || Object.call.bind(Object.hasOwnProperty),
  isArray =
    Array.isArray ||
    function (a) {
      return a && a.constructor === Array;
    },
  disallowedTokens = new Set(["this", "__proto__", "prototype", "constructor"]),
  skipTokens = new Set(["['']", '[""]', "[``]", ""]),
  escapeReg = /\.|\[|\]|\"|\'|\s/;

function keysIterator(obj, currentPath) {
  let keys = Object.keys(obj);
  if (0 === keys.length) return currentPath ? [currentPath] : [];
  const paths = [];
  let key, value, newPath;
  for (key of keys)
    if (
      ((value = obj[key]),
      (newPath =
        "" === currentPath
          ? key
          : escapeReg.test(key)
          ? key.includes("'")
            ? `${currentPath}.["${key}"]`
            : `${currentPath}.['${key}']`
          : Array.isArray(obj)
          ? `${currentPath}[${key}]`
          : `${currentPath}.${key}`),
      "object" == typeof value && null !== value)
    )
      paths.push(...keysIterator(value, newPath));
    else paths.push(newPath);
  return paths;
}
var _cache = {},
  _allowKeys = false,
  _currentSize = 0,
  _cacheSize = 4096;
function tokenize(path) {
  if (hasOwn(_cache, path)) return _cache[path].slice(0) || [];
  if (++_currentSize > _cacheSize && -1 !== _cacheSize)
    (_cache = {}), (_currentSize = 1);
  if (isArray(path)) return (_cache[path] = path.reverse()).slice(0);
  if ("string" != typeof path) throw TypeError("Invalid Notation Type");
  return (_cache[path] = (function (path) {
    if (0 === path.length) return [];
    const res = [],
      reg = /\[\s*(\d+)(?=\s*])|\[\s*(["'`])((?:\\.|(?!\2).)*)\2\s*]|[\w$]+/g;
    let a, token;
    while ((a = reg.exec(path))) {
      if (((token = a[1] || a[3] || a[0]), !skipTokens.has(token))) {
        if (!_allowKeys && disallowedTokens.has(token))
          throw SyntaxError("Disallowed Key encountered");
        res.push(token);
      }
    }
    if (!isArray(res)) throw SyntaxError("Could not tokenize Notation");
    return res.reverse();
  })(path)).slice(0);
}
function set(object, path, value) {
  checkObject(object);
  path = tokenize(path);
  if (0 === path.length) return;
  for (let i = path.length; --i > 0; ) {
    if (isNotObjectLike((object = object[path[i]]))) {
      throw EvalError("Could not fully evaluate the object path");
    }
  }
  object[path[0]] = value;
}
function get(obj, path) {
  checkObject(obj);
  path = tokenize(path);
  if (0 === path.length) return obj;
  for (let i = path.length; --i > 0; )
    if (isNotObjectLike((obj = obj[path[i]])))
      throw EvalError("Could not fully evaluate the object path");
  return obj[path[0]];
}
function has(object, path, detailed = false) {
  checkObject(object);
  path = tokenize(path);
  for (var key, prop, i = path.length; i-- > 0; ) {
    if (
      (!isNotObjectLike((prop = object[(key = path[i])])) && 0 !== i) ||
      void 0 !== prop
    ) {
      object = prop;
      continue;
    }
    if (detailed)
      return {
        success: false,
        depth: path.length - i - 1,
        left: ++i,
        key: key,
        currentObject: object,
      };
    return false;
  }
  return detailed
    ? {
        success: true,
        depth: path.length - i - 1,
        left: ++i,
        key: null,
        currentObject: object,
      }
    : true;
}
function remove(object, path) {
  checkObject(object);
  path = tokenize(path);
  if (0 === path.length) {
    for (const key of Object.keys(object)) delete object[key];
    return;
  }
  for (let i = path.length; --i > 0; ) {
    if (isNotObjectLike((object = object[path[i]]))) {
      throw EvalError("Could not fully evaluate the object path");
    }
  }
  if (isArray(object)) {
    const key = parseInt(path[0], 10);
    if (isNaN(key)) throw SyntaxError("key is not a Number");
    object.splice(key, 1);
  } else delete object[path[0]];
}
function create(object = {}, path = "") {
  checkObject(object);
  path = tokenize(path);
  if (0 === path.length) return;
  for (let i = path.length, key; --i > 0; ) {
    if (isNotObjectLike(obj[(object = path[i])])) object[key] = {};
    object = object[key];
  }
  if (!hasOwn(object, (path = path[0]))) object[path] = {};
}
function keys(object) {
  return checkObject(object), keysIterator(object, "");
}
function getPaths(object) {
  return checkObject(object), keysIterator(object, "");
}
function clearCache() {
  _cache = {};
  _currentSize = 0;
}
function configure(options = {}) {
  if (isNotObjectLike(options) || isArray(options))
    throw TypeError("Invalid Options Type");
  if ("boolean" == typeof options.allowKeys) _allowKeys = options.allowKeys;
  let size = options.cacheSize;
  if ("string" == typeof size) size = parseFloat(size, 10);
  if (
    "number" == typeof size &&
    !isNaN(size) &&
    size === Math.floor(size) &&
    size >= -1 &&
    size <= Number.MAX_SAFE_INTEGER
  ) {
    _cacheSize = options.cacheSize;
  }
}

(function (global, factory) {
  if (typeof module === "object" && typeof module.exports === "object")
    factory();
  else if (typeof define === "function" && define.amd) define([], factory);
  else if (
    (global = typeof globalThis !== "undefined" ? globalThis : global || self)
  )
    factory();
})(this, function () {
  "use strict";
  module.exports = {
    set,
    get,
    has,
    remove,
    create,
    keys,
    getPaths,
    configure,
    clearCache
  };
});