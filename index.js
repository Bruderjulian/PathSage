const {
  tokenizePath,
  evalNotation,
  deepKeysIterator,
  setFn,
  getFn,
  hasFn,
  removeFn,
  createFn,
  hasFn2,
} = require("./src/lib");
const {
  isNotObjectLike,
  validCacheSize,
  checkObject,
  checkPath,
  checkNotation,
  isArray,
  checkTokens,
} = require("./src/utils");
const env = require("process").env.NODE_ENV || "prod";

// Todo: test EvalErrors, Class Key Iteration
class unPathify {
  static #cache = {};
  static #allowKeys = false;
  static #currentSize = 0;
  static #cacheSize = -1;

  static setProperty(object, path, value) {
    checkPath(path);
    checkObject(object);
    evalNotation(setFn.bind(null, value), object, this.#tokenize(path));
  }

  static getProperty(object, path) {
    checkPath(path);
    checkObject(object);
    return evalNotation(getFn, object, this.#tokenize(path));
  }

  static hasProperty(object, path, detailed = false) {
    checkPath(path);
    checkObject(object);
    return evalNotation(
      detailed == true ? hasFn2 : hasFn,
      object,
      this.#tokenize(path)
    );
  }

  static removeProperty(object, path) {
    checkPath(path);
    checkObject(object);
    evalNotation(removeFn, object, this.#tokenize(path));
  }

  static deleteProperty(object, path) {
    checkPath(path);
    checkObject(object);
    evalNotation(removeFn, object, this.#tokenize(path));
  }

  static create(object, path) {
    checkPath(path);
    checkObject(object);
    evalNotation(createFn, object, this.#tokenize(path));
  }

  static hasDetailed(object, path) {
    checkPath(path);
    checkObject(object);
    return evalNotation(hasFn2, object, this.#tokenize(path));
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
    this.#cache = {};
    this.#currentSize = 0;
  }

  static configure(options = {}) {
    if (isNotObjectLike(options) || isArray(options))
      throw new TypeError("Invalid Options Type");
    if (typeof options.allowKeys === "boolean") {
      this.#allowKeys = options.allowKeys;
    }
    if (validCacheSize(options.cacheSize)) {
      this.#cacheSize = options.cacheSize;
    }
  }

  static #tokenize(path) {
    if (Object.hasOwn(this.#cache, path)) {
      return this.#cache[path] || [];
    }
    checkNotation(path);
    var tokens = tokenizePath(path, this.#allowKeys).reverse();
    if (this.#currentSize > this.#cacheSize && this.#cacheSize !== -1) {
      this.clearCache();
    }
    this.#cache[path] = tokens;
    this.#currentSize++;
    return tokens;
  }

  static _getPrivates() {
    if (env !== "test") return;
    return {
      cache: this.#cache,
      cacheSize: this.#cacheSize,
      currentSize: this.#currentSize,
      allowKeys: this.#allowKeys,
    };
  }
}

if (env !== "test") {
  unPathify._getPrivates = undefined;
  delete unPathify._getPrivates;
}
module.exports = unPathify;
