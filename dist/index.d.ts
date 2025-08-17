type ObjectLike = object | unknown[];
export interface HasFailedResult {
  success: false;
  depth: number;
  left: number;
  currentObject: ObjectLike;
  key: string;
}
export interface HasSuccessResult {
  success: true;
  depth: number;
  left: number;
  currentObject: ObjectLike;
  key: null;
}
export interface ConfigOptions {
  allowKeys: boolean;
  cacheSize: number;
}

/** Library for working with nested objects with path notations
 * @name PathSage
 * @author BruderJulian <https://github.com/Bruderjulian>
 * @version 1.6.0 */

/**  Set a property at a given path to a given value.
 *  @param {ObjectLike} object - object to set the value in
 *  @param {string} path - path of the property, using the notation
 *  @param {unknown} value - the value to set
 *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
 *  @throws {EvalError} - if the path could not be fully evaluated
 */
export function set(object: ObjectLike, path: string, value: unknown): void;
/**  Get the value of a property in an object or array at a given path.
 *  @param {ObjectLike} object - object to get the value from.
 *  @param {string} path - path of the property, using the notation
 *  @returns {unknown} - the value of the property
 *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
 *  @throws {EvalError} - if the path could not be fully evaluated.
 */
export function get(
  object: ObjectLike,
  path: string,
  defaultValue: unknown
): unknown;
/**  Check whether a property in an object or array at a given path exists.
 *  @param {ObjectLike} object - object to check.
 *  @param {string} path - path of the property, using the notation
 *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
 */
export function has(object: ObjectLike, path: string): boolean;
/**  Check whether a property in an object or array at a given path exists.
 *  @param {ObjectLike} object - object to check.
 *  @param {string} path - path of the property, using the notation
 *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
 */
export function has(
  object: ObjectLike,
  path: string,
  detailed?: boolean
): boolean | HasFailedResult | HasSuccessResult;
/**  Remove a property from an object or array at a given path. If the path is empty, an empty object or array is returned.
 *  @param {ObjectLike} object - object to remove the property from.
 *  @param {string} path - path of the property, using the notation
 *  @throws {SyntaxError} - if the object is `undefined` or `null` or path is invalid
 *  @throws {EvalError} - if the path could not be fully evaluated.
 */
export function remove(object: ObjectLike, path: string): void;
/** Returns an array including every path. Non-empty objects or arrays are iterated and not included themselves.
 * @param {ObjectLike} object - The object to iterate through.
 * @throws {SyntaxError} - if the object is `undefined` or `null`
 */
export function keys(object: ObjectLike): string[];
/** Returns an array including every path. Non-empty objects or arrays are iterated and not included themselves.
 * @param {ObjectLike} object - The object to iterate through.
 * @throws {SyntaxError} - if the object is `undefined` or `null`
 * @alias keys() */
export function getPaths(object: ObjectLike): string[];
/** Creates a path in the object or array. If object is ´undefined´ or ´null´, an empty object will be returned.
 * @param {ObjectLike} object - The object to create path in
 * @param {string} path - The path to create
 */
export function create(object: ObjectLike, path: string): ObjectLike;
/** Configures the cache, tokenizer and validator.
 * @param {object} [options]
 * @param {boolean} options.allowKeys - allows special keys (.constructor, .prototype, etc).
 * @param {number} options.cacheSize - defines the cache size (if equal to -1, the cache won't be cleared)
 */
export function configure(options?: ConfigOptions): void;
/** Clears the entire cache */
export function clearCache(): void;
