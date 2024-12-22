const {
  tokenizePath,
  evalCreate,
  evalHas,
  deepKeysIterator,
  evalSetProperty,
  evalGetProperty,
  evalRemoveProperty,
} = require("./src/lib");

const {
  isObject,
  isArray,
  validCacheSize,
  checkObject,
  checkNotation,
  checkTokens,
} = require("./src/utils");

var _cache = {};
var _allowKeys = false;
var _seperator = ".";
var _currentSize = 0;
var _cacheSize = -1;

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
    return evalHas(object, tokenize(path), detailed, 0);
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
    if (!isObject(options)) {
      throw new TypeError("Invalid Options Type");
    }
    if (typeof options.allowKeys === "boolean") {
      _allowKeys = options.allowKeys;
    }
    if (typeof options.seperator === "string") {
      _seperator = options.seperator;
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
    seperator: _seperator,
  };
}

module.exports = { PathSage, getPrivates };
