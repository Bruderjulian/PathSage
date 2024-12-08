type ObjectLike = object | unknown[];
export interface HasResult {
  depth: number;
  Left: number;
  object: ObjectLike;
  key: String;
}

/**
 * static class containing the API for modifying nested objects with dot/bracket notation
 * @name unPathify
 * @author BruderJulian <https://github.com/Bruderjulian>
 * @version 1.1
 */
export declare class unPathify {
  /**
   *  Set the property at the given path to the given value.
   *  @param {ObjectLike} object - Object or array to set the value in
   *  @param {string} path - Path of the property, using the notation
   *  @param {unknown} value - the value to set
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
   *  @throws {EvalError} - if the path could not be fully evaluated
   */
  static setProperty(object: ObjectLike, path: string, value: unknown): void;

  /**
   *  Get the value of the property at the given path.
   *  @param {ObjectLike} object - Object or array to get the value from.
   *  @param {string} path - Path of the property, using the notation
   *  @returns {unknown} - the value of the property
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
   *  @throws {EvalError} - if the path could not be fully evaluated.
   */
  static getProperty(object: ObjectLike, path: string): unknown;

  /**
   *  Check whether the property at the given path exists.
   *  @param {ObjectLike} object - Object or array to check.
   *  @param {string} path - Path of the property, using the notation
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
   *  @throws {EvalError} - if the path could not be fully evaluated.
   */
  static hasProperty(
    object: ObjectLike,
    path: string,
    detailed: boolean
  ): boolean | HasResult;

  /**
   * Remove the property at the given path.
   *  @param {ObjectLike} object - Object or array to remove the property from.
   *  @param {string} path - Path of the property, using the notation
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
   *  @throws {EvalError} - if the path could not be fully evaluated.
   */
  static removeProperty(object: ObjectLike, path: string): void;

  /**
   * Remove the property at the given path.
   * @param {ObjectLike} object - Object or array to remove the property from.
   * @param {string} path - Path of the property, using the notation
   * @alias removeProperty
   * @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
   * @throws {EvalError} - if the path could not be fully evaluated.
   */
  static deleteProperty(object: ObjectLike, path: string): void;

  /**
   * Returns an array including every path. Non-empty objects or arrays are iterated and not included themselves.
   * @param {ObjectLike} object - The object to iterate through.
   * @throws {SyntaxError} - if the object is `undefined` or `null`
   */
  static keys(object: ObjectLike): string[];

  /**
   * Returns an array including every path. Non-empty objects or arrays are iterated and not included themselves.
   * @param {ObjectLike} object - The object to iterate through.
   * @alias keys()
   * @throws {SyntaxError} - if the object is `undefined` or `null`
   */
  static getPaths(object: ObjectLike): string[];

  /**
   * configures the parser and cache
   * @param {object} [options]
   * @param {boolean} options.allowKeys - allows special keys (.constructor, .prototype, etc).
   * @param {boolean} options.cacheSize - defines the cache size (if equal to -1, the cache won't be cleared)
   */
  static configure(options?: object): void;

  /**
   * Clears the entire cache
   * @static
   * @since 1.1
   */
  static clearCache(): void;
}
