type ObjectLike = object | unknown[];
export interface HasResult {
  depth: number;
  left: number;
  currentObject: ObjectLike;
  key: String;
}

/**
 * Library for working with nested objects with path notations
 * @name unPathify
 * @author BruderJulian <https://github.com/Bruderjulian>
 * @version 1.2
 */
export declare class unPathify {
  /**
   *  Set a property at a given path to a given value.
   *  @param {ObjectLike} object - Object or array to set the value in
   *  @param {string} path - Path of the property, using the notation
   *  @param {unknown} value - the value to set
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
   *  @throws {EvalError} - if the path could not be fully evaluated
   */
  static setProperty(object: ObjectLike, path: string, value: unknown): void;

  /**
   *  Get the value of a property in an Object at a given path.
   *  @param {ObjectLike} object - Object or array to get the value from.
   *  @param {string} path - Path of the property, using the notation
   *  @returns {unknown} - the value of the property
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
   *  @throws {EvalError} - if the path could not be fully evaluated.
   */
  static getProperty(object: ObjectLike, path: string): unknown;

  /**
   *  Check whether a property in an Object at a given path exists.
   *  @param {ObjectLike} object - Object or array to check.
   *  @param {string} path - Path of the property, using the notation
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
   */
  static hasProperty(object: ObjectLike, path: string): boolean;

  /**
   *  Check whether a property in an Object at a given path exists. If not, it returns a more detailed report
   *  @param {ObjectLike} object - Object or array to check.
   *  @param {string} path - Path of the property, using the notation
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
   */
  static hasProperty(
    object: ObjectLike,
    path: string,
    detailed: boolean
  ): boolean | HasResult;

  /**
   *  Remove a property from an Object at a given path.
   *  @param {ObjectLike} object - Object or array to remove the property from.
   *  @param {string} path - Path of the property, using the notation
   *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
   *  @throws {EvalError} - if the path could not be fully evaluated.
   */
  static removeProperty(object: ObjectLike, path: string): void;

  /**
   * Remove a property in an Object at a given path.
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
   * Creates a path in the Object or Array
   * @param {ObjectLike} object - The object to create path in
   * @throws {SyntaxError} - if the object is `undefined` or `null`
   */
  static create(object: ObjectLike): ObjectLike;

  /**
   * Checks if the path is valid. If an array of tokens is supplied, the type of all elements is checked.
   * @param {String | String[]} path - path to validate.
   * @throws {SyntaxError} - the path (as a string) is invalid due brackets or quotes
   * @throws {TypeError} - the path has the wrong type or some elements of the tokens have the wrong type
   */
  static validate(path: String | String[]): void;

  /**
   * Configures the cache, tokenizer and validator.
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
