function isObject(obj) {
  return typeof obj === "object" && !Array.isArray(obj) && obj !== null;
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
  if (!isArray(tokens)) throw new TypeError("Invalid Token Array");
  for (let i = 0, len = path.length; i < len; i++) {
    if (typeof path !== "string" || typeof path !== "number") {
      throw new TypeError("Invalid Token Type");
    }
  }
}

function checkNotation(path) {
  if (typeof path !== "string") throw new SyntaxError("Invalid Notation Type");
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

module.exports = {
  isObject,
  validCacheSize,
  checkObject,
  checkNotation,
  checkTokens,
};
