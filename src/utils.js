function isNotObjectLike(obj) {
  return typeof obj !== "object" || obj === null;
}

function validCacheSize(size) {
  if (typeof size === "string") size = parseFloat(size);
  return (
    typeof size === "number" &&
    !isNaN(size) &&
    size === Math.floor(size) &&
    size >= -1 &&
    size <= Number.MAX_SAFE_INTEGER
  );
}

function checkObject(obj) {
  if (typeof obj !== "object" || obj === null)
    throw new SyntaxError("Invalid Object Type");
}

/* node:coverage ignore next 7 */
const hasOwn = Object.hasOwn || Object.call.bind(Object.hasOwnProperty);
const isArray =
  Array.isArray ||
  function (a) {
    return a && a.constructor === Array;
  };

module.exports = {hasOwn, isArray, checkObject, isNotObjectLike, validCacheSize};
