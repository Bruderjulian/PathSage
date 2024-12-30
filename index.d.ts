type ObjectLike = object | unknown[];
export interface HasResult {
  depth: number;
  left: number;
  currentObject: ObjectLike;
  key: string;
}
export interface ConfigOptions {
  allowKeys: boolean;
  cacheSize: number;
}

/** Library for working with nested objects with path notations
 * @name PathSage
 * @author BruderJulian <https://github.com/Bruderjulian>
 * @version 1.5.0 */
export declare class PathSage {
  /**  Set a property at a given path to a given value.
   *  @param {ObjectLike} object - object to set the value in
   *  @param {string} path - path of the property, using the notation
   *  @param {unknown} value - the value to set
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
   *  @throws {EvalError} - if the path could not be fully evaluated
   */
  static setProperty(object: ObjectLike, path: string, value: unknown): void;
  /**  Get the value of a property in an object or array at a given path.
   *  @param {ObjectLike} object - object to get the value from.
   *  @param {string} path - path of the property, using the notation
   *  @returns {unknown} - the value of the property
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
   *  @throws {EvalError} - if the path could not be fully evaluated.
   */
  static getProperty(object: ObjectLike, path: string): unknown;
  /**  Check whether a property in an object or array at a given path exists.
   *  @param {ObjectLike} object - object to check.
   *  @param {string} path - path of the property, using the notation
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
   */
  static hasProperty(object: ObjectLike, path: string): boolean;
  /**  Check whether a property in an object or array at a given path exists.
   *  @param {ObjectLike} object - object to check.
   *  @param {string} path - path of the property, using the notation
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
   */
  static hasProperty(
    object: ObjectLike,
    path: string,
    detailed: boolean
  ): boolean | HasResult;
  /**  Remove a property from an object or array at a given path. If the path is empty, an empty object or array is returned.
   *  @param {ObjectLike} object - object to remove the property from.
   *  @param {string} path - path of the property, using the notation
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
   *  @throws {EvalError} - if the path could not be fully evaluated.
   */
  static removeProperty(object: ObjectLike, path: string): void;
  /** Delete a property in an object or array at a given path. If the path is empty, an empty object or array is returned.
   * @param {ObjectLike} object - object to remove the property from.
   * @param {string} path - path of the property, using the notation
   * @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
   * @throws {EvalError} - if the path could not be fully evaluated.
   * @alias removeProperty */
  static deleteProperty(object: ObjectLike, path: string): void;
  /** Returns an array including every path. Non-empty objects or arrays are iterated and not included themselves.
   * @param {ObjectLike} object - The object to iterate through.
   * @throws {SyntaxError} - if the object is `undefined` or `null`
   */
  static keys(object: ObjectLike): string[];
  /** Returns an array including every path. Non-empty objects or arrays are iterated and not included themselves.
   * @param {ObjectLike} object - The object to iterate through.
   * @throws {SyntaxError} - if the object is `undefined` or `null`
   * @alias keys() */
  static getPaths(object: ObjectLike): string[];
  /** Creates a path in the object or array. If object is ´undefined´ or ´null´, an empty object will be returned.
   * @param {ObjectLike} object - The object to create path in
   * @param {string} object - The path to create
   */
  static create(object: ObjectLike, path: string): ObjectLike;
  /** Configures the cache, tokenizer and validator.
   * @param {object} [options]
   * @param {boolean} options.allowKeys - allows special keys (.constructor, .prototype, etc).
   * @param {number} options.cacheSize - defines the cache size (if equal to -1, the cache won't be cleared)
   */
  static configure(options?: ConfigOptions): void;
  /** Clears the entire cache */
  static clearCache(): void;
}
