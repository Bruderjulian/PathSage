function isNotObjectLike(obj) {
  return typeof obj !== "object" || obj === null;
}

function isObject(obj) {
  return typeof obj === "object" && !isArray(obj) && obj !== null;
}

function entriesPolyFill(obj) {
  let keys = Object.keys(obj);
  let key;
  for (let i = 0, len = keys.length; i < len; i++) {
    key = keys[i];
    keys[i] = [key, obj[key]];
  }
  return keys;
}

//hardcoded limit at 256 for now
function validCacheSize(size) {
  return typeof size === "number" && !isNaN(size) && size >= -1;
}

function checkObject(obj) {
  if (typeof obj !== "object" || obj === null)
    throw new SyntaxError("Invalid Object Type");
}

function checkTokens(tokens) {
  for (let i = 0, len = tokens.length; i < len; i++) {
    if (typeof tokens[i] !== "string")
      throw new TypeError("Invalid Token Type");
  }
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
  let current;
  for (let i = 0, len = path.length; i < len; i++) {
    current = path[i];
    if (current === "[") counter++;
    else if (current === "]") counter--;
  }
  return counter === 0;
}

function checkQuotes(path) {
  let current;
  let quote;
  for (let i = 0, len = path.length; i < len; i++) {
    current = path[i];
    if (current === "'" || current === '"' || current === "`") {
      if (!quote) quote = current;
      else if (quote === current) quote = undefined;
    }
  }
  return typeof quote === "undefined";
}

const hasOwn = Object.hasOwn || Object.prototype.hasOwnProperty;
const entries = Object.entries || entriesPolyFill;
const isArray = Array.isArray;

module.exports = {
  isObject,
  validCacheSize,
  checkObject,
  checkNotation,
  checkTokens,
  hasOwn,
  isArray,
  isNotObjectLike,
  entries,
};
