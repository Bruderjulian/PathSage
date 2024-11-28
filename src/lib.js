const isArray = Array.isArray;
function isNotObjectLike(obj) {
  return typeof obj !== "object" || obj === null;
}

var func;
const disallowedTokens = new Set([
  "this",
  "__proto__",
  "prototype",
  "constructor",
]);
const skipTokens = new Set(["['']", '[""]', "[``]", ""]);

const getFn = function (data, obj, key) {
  return obj[key];
}.bind(null, null);

const setFn = function (data, obj, key) {
  obj[key] = data;
};

const hasFn = function (data, obj, key) {
  return Object.hasOwn(obj, key);
}.bind(null, null);

const removeFn = function (data, obj, key) {
  if (isArray(obj)) {
    key = parseInt(key, 10);
    if (isNaN(key)) throw "key is NaN";
    obj.splice(key, 1);
  } else delete obj[key];
}.bind(null, null);

function tokenizePath(path, allowKeys) {
  const res = [],
    reg = /\[\s*(\d+)(?=\s*])|\[\s*(["'`])((?:\\.|(?!\2).)*)\2\s*]|[\w$]+/g;
  let a, token;
  while ((a = reg.exec(path))) {
    token = a[1] || a[3] || a[0];
    if (skipTokens.has(token)) continue;
    if (!allowKeys && disallowedTokens.has(token))
      throw new SyntaxError("Disallowed Key encountered");
    res.push(token);
  }
  if (!isArray(res)) throw new SyntaxError("Could not tokenize Notation");
  return res;
}

function extractProperty(obj, path) {
  if (path.length === 1) return func(obj, path[0]);
  const prop = obj[path.pop()];
  //if (path.length === 0) return prop;
  if (isNotObjectLike(prop)) {
    throw new EvalError("Could not fully evaluate the object path");
  }
  return extractProperty(prop, path);
}

function evalNotation(fn, obj, pathArr) {
  if (pathArr.length === 0) return obj;
  func = fn;
  return extractProperty(obj, pathArr);
}

function escapePath(token) {
  if (/\.|\[|\]|\"|\'|\s/.test(token)) {
    return token.includes('"') ? `['${token}']` : `["${token}"]`;
  }
  return token;
}

function entries(value) {
  if (isArray(value)) {
    let acc = [];
    let i = 0;
    for (; i < value.length; i++) acc.push([i, value[i]]);
    return acc;
  }
  return Object.entries(value);
}

function stringifyPath(tokens) {
  let result = "";
  let token;
  let len = tokens.length;
  let i = 0;
  if (len === 1 || !isArray(tokens)) return escapePath(tokens[0]);
  for (; i < len; i++) {
    token = tokens[i];
    if (typeof token === "number") {
      result += `[${token}]`;
    } else {
      token = escapePath(token);
      result += i === 0 ? token : `.${token}`;
    }
  }
  return result;
}

function deepKeysIterator(obj, path) {
  var result = [];
  var numbered = isArray(obj);
  for (const [key, value] of Object.entries(obj)) {
    if (numbered) key = parseInt(key, 10);
    if (
      typeof value !== "object" ||
      value === null ||
      Object.keys(value).length === 0
    ) {
      if (path.length > 0) result.push(stringifyPath([...path, key]));
      else result.push(stringifyPath([key]));
    } else result.push(...deepKeysIterator(value, [...path, key]));
  }
  return result;
}

module.exports = {
  tokenizePath,
  evalNotation,
  deepKeysIterator,
  setFn,
  getFn,
  hasFn,
  removeFn,
};
