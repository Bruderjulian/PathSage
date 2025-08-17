const {
  tokenizePath,
  evalCreate,
  evalHas,
  keysIterator,
  evalSet,
  evalGet,
  evalRemove,
} = require("../src/lib.js");

const {
  isArray,
  hasOwn,
  isNotObjectLike,
  validCacheSize,
  checkObject,
} = require("../src/utils.js");

var _cache = {};
var _allowKeys = false;
var _currentSize = 0;
var _cacheSize = 4096;

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
  return (_cache[path] = tokenizePath(path, _allowKeys)).slice(0);
}

function set(object, path, value) {
  checkObject(object);
  evalSet(object, tokenize(path), value);
}

function get(object, path, defaultValue) {
  checkObject(object);
  return evalGet(object, tokenize(path), defaultValue);
}

function has(object, path, detailed = false) {
  checkObject(object);
  return evalHas(object, tokenize(path), detailed);
}

function remove(object, path) {
  checkObject(object);
  evalRemove(object, tokenize(path));
}

function create(object = {}, path = "") {
  checkObject(object);
  evalCreate(object, tokenize(path));
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

function getPrivates() {
  return {
    cache: _cache,
    cacheSize: _cacheSize,
    currentSize: _currentSize,
    allowKeys: _allowKeys,
  };
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
  getPrivates,
};
