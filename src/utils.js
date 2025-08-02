function isNotObjectLike(obj) {
  return typeof obj !== "object" || obj === null;
}

function validCacheSize(size) {
  if (typeof size === "string") size = parseFloat(size, 10);
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

/*
export function checkNotation(path) {
  if (typeof path !== "string") throw new TypeError("Invalid Notation Type");
  if (path.length === 0) return;
  if (!checkBrackets(path)) {
    throw new SyntaxError("All brackets must be placed correctly");
  }
  if (!checkQuotes(path)) {
    throw new SyntaxError("All Quotes must be placed correctly");
  }
}

export function checkBrackets(path) {
  let counter = 0;
  let current, i, len;
  for (i = 0, len = path.length; i < len; i++) {
    current = path[i];
    if (current === "[") counter++;
    else if (current === "]") counter--;
  }
  return counter === 0;
}

export function checkQuotes(path) {
  let quote, i, len, current;
  for (i = 0, len = path.length; i < len; i++) {
    current = path[i];
    if (current === "'" || current === '"' || current === "`") {
      if (!quote) quote = current;
      else if (quote === current) quote = undefined;
    }
  }
  return typeof quote === "undefined";
}
*/

/* node:coverage ignore next 7 */
const hasOwn = Object.hasOwn || Object.call.bind(Object.hasOwnProperty);
const isArray =
  Array.isArray ||
  function (a) {
    return a && a.constructor === Array;
  };

module.exports = {hasOwn, isArray, checkObject, isNotObjectLike, validCacheSize};
