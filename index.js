import {
  tokenizePath,
  evalCreate,
  evalHas,
  keysIterator,
  evalSetProperty,
  evalGetProperty,
  evalRemoveProperty,
} from "./src/lib.js";

import {
  isArray,
  isNotObjectLike,
  validCacheSize,
  checkObject,
  checkNotation,
} from "./src/utils.js";

//TODO: change default cache size
var _cache = {};
var _allowKeys = false;
var _currentSize = 0;
var _cacheSize = 4096;

export function set(object, path, value) {
  checkObject(object);
  evalSetProperty(object, tokenize(path), value);
}

export function get(object, path) {
  checkObject(object);
  return evalGetProperty(object, tokenize(path));
}

export function has(object, path, detailed = false) {
  checkObject(object);
  return evalHas(object, tokenize(path), detailed);
}

export function remove(object, path) {
  checkObject(object);
  evalRemoveProperty(object, tokenize(path));
}

export function create(object = {}, path = "") {
  checkObject(object);
  evalCreate(object, tokenize(path));
}

export function keys(object) {
  checkObject(object);
  return keysIterator(object, "");
}

export function getPaths(object) {
  checkObject(object);
  return keysIterator(object, "");
}

export function clearCache() {
  _cache = {};
  _currentSize = 0;
}

export function configure(options = {}) {
  if (isNotObjectLike(options) || isArray(options)) {
    throw new TypeError("Invalid Options Type");
  }
  if (typeof options.allowKeys === "boolean") {
    _allowKeys = options.allowKeys;
  }
  if (validCacheSize(options.cacheSize)) _cacheSize = options.cacheSize;
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

export function getPrivates() {
  return {
    cache: _cache,
    cacheSize: _cacheSize,
    currentSize: _currentSize,
    allowKeys: _allowKeys,
  };
}