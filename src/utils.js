function isNotObjectLike(obj) {
  return typeof obj !== "object" || obj === null;
}

function isObject(obj) {
  return typeof obj === "object" && !isArray(obj) && obj !== null;
}

function validCacheSize(size) {
  return typeof size === "number" && !isNaN(size) && size >= -1;
}

function checkObject(obj) {
  if (typeof obj !== "object" || obj === null)
    throw new SyntaxError("Invalid Object Type");
}

function checkNotation(path) {
  if (typeof path !== "string") throw new TypeError("Invalid Notation Type");
  if (path.length === 0) return;
  if (!checkBrackets(path)) {
    throw new SyntaxError("All brackets must be placed correctly");
  }
  if (!checkQuotes(path)) {
    throw new SyntaxError("All Quotes must be placed correctly");
  }
}

function checkBrackets(path) {
  let counter = 0;
  let current, i, len;
  for (i = 0, len = path.length; i < len; i++) {
    current = path[i];
    if (current === "[") counter++;
    else if (current === "]") counter--;
  }
  return counter === 0;
}

function checkQuotes(path) {
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

function isArray2(a) {
  return a && a.constructor === Array;
}
const hasOwn = Object.hasOwn || Object.call.bind(Object.hasOwnProperty);
const isArray = Array.isArray || isArray2;

module.exports = {
  isObject,
  validCacheSize,
  checkObject,
  checkNotation,
  hasOwn,
  isArray,
  isNotObjectLike,
};
