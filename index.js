const {
  tokenizePath,
  evalNotation,
  deepKeysIterator,
  setFn,
  getFn,
  hasFn,
  removeFn,
} = require("./src/lib");
const {
  isNotObjectLike,
  validCacheSize,
  checkObject,
  checkPath,
  checkNotation,
  isArray,
} = require("./src/utils");
const env = require("process").env.NODE_ENV || "prod";

/**
 * A object, which is not null.
 * @typedef {(Object|any[])} ObjectLike
 */

/**
 * static class containing the API.
 * @name unpathify
 * @author BruderJulian <https://github.com/Bruderjulian>
 * @version 1.1
 */

// Todo: test EvalErrors, Class Key Iteration
class unPathify {
  static #cache = {};
  static #allowKeys = false;
  static #parseNumbers = false;
  static #maxCount = 0;
  static #currentSize = 0;
  static #cacheSize = 16;

  /**
   *  Set the property at the given path to the given value.
   *
   *  @param {ObjectLike} object - Object or array to set the value in.
   *  @param {string} path - Path of the property in the object, using the path notation.
   *  @param {any} value - Value to set at the path.
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is not a string
   *  @throws {EvalError} - if the path could not be fully evaluated.
   *  @static
   *  @since 1.0
   */
  static setProperty(object, path, value) {
    checkPath(path);
    checkObject(object);
    evalNotation(setFn.bind(null, value), object, this.#tokenize(path));
  }

  /**
   *  Get the value of the property at the given path.
   *
   *  @param {ObjectLike} object - Object or array to get the value from.
   *  @param {string} path - Path of the property in the object, using the path notation.
   *  @returns {any} the value at the path.
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is not a string
   *  @throws {EvalError} - if the path could not be fully evaluated.
   *  @static
   *  @since 1.0
   */
  static getProperty(object, path) {
    checkPath(path);
    checkObject(object);
    return evalNotation(getFn, object, this.#tokenize(path));
  }

  /**
   *  Check whether the property at the given path exists.
   *
   *  @param {ObjectLike} object - Object or array to check.
   *  @param {string} path - Path of the property in the object, using the path notation.
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is not a string
   *  @throws {EvalError} - if the path could not be fully evaluated.
   *  @static
   *  @since 1.0
   */
  static hasProperty(object, path) {
    checkPath(path);
    checkObject(object);
    return evalNotation(hasFn, object, this.#tokenize(path));
  }

  /**
   * Remove the property at the given path.
   *
   *  @param {ObjectLike} object - Object or array to remove the value from.
   *  @param {string} path - Path of the property in the object, using the path notation.
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is not a string
   *  @throws {EvalError} - if the path could not be fully evaluated.
   *  @static
   *  @since 1.0
   */
  static removeProperty(object, path) {
    checkPath(path);
    checkObject(object);
    evalNotation(removeFn, object, this.#tokenize(path));
  }

  /**
   * Remove the property at the given path.
   *
   * @param {ObjectLike} object - Object or array to remove the value from.
   * @param {string} path - Path of the property in the object, using the path notation.
   * @alias removeProperty
   * @throws {SyntaxError} - if the object is `undefined` or `null` or path is not a string
   * @throws {EvalError} - if the path could not be fully evaluated.
   * @static
   * @since 1.0
   */
  static deleteProperty(object, path) {
    checkPath(path);
    checkObject(object);
    evalNotation(removeFn, object, this.#tokenize(path));
  }

  /**
   * Returns an array including every path. Non-empty plain objects and arrays are recursed and are not included themselves.
   *
   * @param {ObjectLike} object - The object to iterate through.
   * @throws {SyntaxError} - if the object is `undefined` or `null`
   * @static
   * @since 1.0
   */
  static keys(object) {
    checkObject(object);
    return deepKeysIterator(object, []);
  }

  /**
   * Returns an array including every path. Non-empty plain objects and arrays are recursed and are not included themselves.
   *
   * @param {ObjectLike} object - The object to iterate through.
   * @throws {SyntaxError} - if the object is `undefined` or `null`
   * @alias keys()
   * @static
   * @since 1.0
   */
  static getPaths(object) {
    checkObject(object);
    return deepKeysIterator(object, []);
  }

  /**
   * Clears the entire cache
   * @static
   * @since 1.0
   */
  static clearCache() {
    this.#cache = {};
    this.#currentSize = 0;
    this.#maxCount = 0;
  }

  /**
   * Clears the entire cache in a smart way by only removing the lower half of entries (defined by the usage count)
   * @static
   * @since 1.0
   */
  static clearCacheSmart() {
    var threshold = this.#maxCount / 2;
    var count;
    for (const key of Object.keys(this.#cache)) {
      count = this.#cache[key].count;
      if (count < threshold || count == 0) {
        delete this.#cache[key];
        this.#currentSize--;
      }
    }
  }

  /**
   * configures the parser and the cache
   * @param {Object} [options]
   * @param {boolean} options.allowKeys - allows special keys (.constuctor, .prototype, etc).
   * @param {boolean} options.parseNumbers - parses the stringifed numbers back to a number
   * @param {boolean} options.cacheSize - defines the cache size (if equal to -1, the cache won't be cleared)
   */
  static configure(options = {}) {
    if (isNotObjectLike(options) || isArray(options))
      throw new TypeError("Invalid Options Type");
    if (typeof options.allowKeys === "boolean") {
      this.#allowKeys = options.allowKeys;
    }
    if (typeof options.parseNumbers === "boolean") {
      this.#parseNumbers = options.parseNumbers;
    }
    if (validCacheSize(options.cacheSize)) {
      this.#cacheSize = options.cacheSize;
    }
  }

  /**
   * tokenizes a path and handles cache accessing/adding.
   * @private
   * @param {string} path - path to tokenize
   * @returns {string[]} - parsed tokens
   */
  static #tokenize(path) {
    if (Object.hasOwn(this.#cache, path)) {
      let container = this.#cache[path];
      if (++container.count > this.#maxCount) {
        this.#maxCount = container.count;
      }
      return container.value;
    }
    checkNotation(path);
    var tokens = tokenizePath(
      path,
      this.#allowKeys,
      this.#parseNumbers
    ).reverse();
    if (this.#currentSize >= this.#cacheSize && this.#cacheSize !== -1) {
      this.clearCacheSmart();
    }
    this.#cache[path] = {
      value: tokens,
      count: 1,
    };
    this.#currentSize++;
    if (this.#maxCount == 0) this.#maxCount++;
    return tokens;
  }

  static _getPrivates() {
    if (env !== "test") return;
    return {
      cache: this.#cache,
      maxCount: this.#maxCount,
      cacheSize: this.#cacheSize,
      currentSize: this.#currentSize,
      allowKeys: this.#allowKeys,
      parseNumbers: this.#parseNumbers,
    };
  }
}

if (env !== "test") {
  unPathify._getPrivates = undefined;
  delete unPathify._getPrivates;
}
module.exports = unPathify;
