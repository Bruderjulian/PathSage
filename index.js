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
  isNotObjectLike,
  validCacheSize,
  checkObject,
  checkNotation,
  isArray,
  checkTokens,
} = require("./src/utils");

var cache = {};
var allowKeys = false;
var currentSize = 0;
var cacheSize = -1;
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
    return evalHas(object, tokenize(path), 0, detailed);
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
    cache = {};
    currentSize = 0;
  }

  static configure(options = {}) {
    if (isNotObjectLike(options) || isArray(options))
      throw new TypeError("Invalid Options Type");
    if (typeof options.allowKeys === "boolean") {
      allowKeys = options.allowKeys;
    }
    let size = parseInt(options.cacheSize, 10);
    if (validCacheSize(size)) cacheSize = size;
  }
}

function tokenize(path) {
  if (typeof path !== "string") {
    throw new SyntaxError("Invalid Notation Type");
  }
  if (path.length === 0) return "";
  if (Object.hasOwn(cache, path)) {
    return cache[path] || [];
  }

  checkNotation(path);
  var tokens = tokenizePath(path, allowKeys).reverse();
  if (currentSize > cacheSize && cacheSize !== -1) {
    this.clearCache();
  }
  cache[path] = tokens;
  currentSize++;
  return tokens;
}

function getPrivates() {
  return {
    cache: cache,
    cacheSize: cacheSize,
    currentSize: currentSize,
    allowKeys: allowKeys,
  };
}

module.exports = {unPathify, getPrivates};
