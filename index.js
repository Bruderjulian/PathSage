const {
  tokenizePath,
  evalSingle,
  evalCreate,
  evalHas,
  deepKeysIterator,
  setFn,
  getFn,
  removeFn,
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
var _currentSize = 0;
var _cacheSize = -1;
class PathSage {
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
  if (!isArray(path)) {
    checkNotation(path);
    path = tokenizePath(path, _allowKeys).reverse();
  } else path = path.reverse();
  if (++_currentSize > _cacheSize && _cacheSize !== -1) {
    _cache = {};
    _currentSize = 1;
  }
  _cache[path] = path;
  return path.slice(0);
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
