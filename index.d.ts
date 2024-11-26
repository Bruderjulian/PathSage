type ObjectLike = object | unknown[];

/**
 * static class containing the API.
 * @name unpathify
 * @author BruderJulian <https://github.com/Bruderjulian>
 * @version 1.1
 */
declare class unpathify {
  /**
   *  Set the property at the given path to the given value.
   *
   *  @param {ObjectLike} object - Object or array to set the value in.
   *  @param {string} path - Path of the property in the object, using the path notation.
   *  @param {unknown} value - Value to set at the path.
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is not a string
   *  @throws {EvalError} - if the path could not be fully evaluated.
   *  @static
   *  @since 1.0
   */
  static setProperty(object: ObjectLike, path: string, value: unknown): void;

  /**
   *  Get the value of the property at the given path.
   *
   *  @param {ObjectLike} object - Object or array to get the value from.
   *  @param {string} path - Path of the property in the object, using the path notation.
   *  @returns {unknown} the value at the path.
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is not a string
   *  @throws {EvalError} - if the path could not be fully evaluated.
   *  @static
   *  @since 1.0
   */
  static getProperty(object: ObjectLike, path: string): void;

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
  static hasProperty(object: ObjectLike, path: string): boolean;

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
  static removeProperty(object: ObjectLike, path: string): void;

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
  static deleteProperty(object: ObjectLike, path: string): void;

  /**
   * Returns an array including every path. Non-empty plain objects and arrays are recursed and are not included themselves.
   *
   * @param {ObjectLike} object - The object to iterate through.
   * @throws {SyntaxError} - if the object is `undefined` or `null`
   * @static
   * @since 1.0
   */
  static keys(object: ObjectLike): string[];

  /**
   * Returns an array including every path. Non-empty plain objects and arrays are recursed and are not included themselves.
   *
   * @param {ObjectLike} object - The object to iterate through.
   * @alias keys()
   * @throws {SyntaxError} - if the object is `undefined` or `null`
   * @static
   * @since 1.0
   */
  static getPaths(object: ObjectLike): string[];

  /**
   * configures the parser and the cache
   * @param {object} [options]
   * @param {boolean} options.allowKeys - allows special keys (.constuctor, .prototype, etc).
   * @param {boolean} options.parseNumbers - parses the stringifed numbers back to a number
   * @param {boolean} options.cacheSize - defines the cache size (if equal to -1, the cache won't be cleared)
   */
  static configure(options?: object = {}): void;

  /**
   * Clears the entire cache
   * @static
   * @since 1.0
   */
  static clearCache(): void;
  /**
   * Clears the entire cache in a smart way by only removing the lower half of entries (defined by the usage count)
   * @static
   * @since 1.0
   */
  static clearCacheSmart(): void;
}