const { hasOwn, isArray, isNotObjectLike } = require("./utils");

const disallowedTokens = new Set([
  "this",
  "__proto__",
  "prototype",
  "constructor",
]);
const skipTokens = new Set(["['']", '[""]', "[``]", ""]);
const escapeReg = /\.|\[|\]|\"|\'|\s/;

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
  //if (!isArray(res)) throw new SyntaxError("Could not tokenize Notation");
  return res;
}

function evalSetProperty(obj, path, value) {
  if (path.length === 0) return;
  for (let i = path.length; --i > 0; ) {
    obj = obj[path[i]];
    if (isNotObjectLike(obj)) {
      throw new EvalError("Could not fully evaluate the object path");
    }
  }
  obj[path[0]] = value;
}

function evalGetProperty(obj, path) {
  if (path.length === 0) return obj;
  for (let i = path.length; --i > 0; ) {
    obj = obj[path[i]];
    if (isNotObjectLike(obj)) {
      throw new EvalError("Could not fully evaluate the object path");
    }
  }
  return obj[path[0]];
}

function evalRemoveProperty(obj, path) {
  if (path.length === 0) {
    for (const key of Object.keys(obj)) delete obj[key];
    return;
  }
  for (let i = path.length; --i > 0; ) {
    obj = obj[path[i]];
    if (isNotObjectLike(obj)) {
      throw new EvalError("Could not fully evaluate the object path");
    }
  }
  if (isArray(obj)) {
    const key = parseInt(path[0], 10);
    if (isNaN(key)) throw new SyntaxError("key is not a Number");
    obj.splice(key, 1);
  } else delete obj[path[0]];
}

function evalHas(obj, path, detailed) {
  if (path.length === 0) return true;
  for (let i = path.length, key, prop; i-- > 0; ) {
    prop = obj[(key = path[i])];
    if ((!isNotObjectLike(prop) && i !== 0) || typeof prop !== "undefined") {
      obj = prop;
      continue;
    }
    // prettier-ignore
    if (detailed) return {
      depth: path.length - i - 1,
      left: ++i,
      failedKey: key,
      currentObject: obj,
    };
    else return false;
  }
  return true;
}

function evalCreate(obj, path) {
  if (path.length === 0) return obj;
  for (let i = path.length, key; --i > 0; ) {
    key = path[i];
    if (isNotObjectLike(obj[key])) obj[key] = {};
    obj = obj[key];
  }
  if (!hasOwn(obj, (path = path[0]))) obj[path] = {};
}

function keysIterator(obj, currentPath) {
  let keys = Object.keys(obj);
  if (keys.length === 0) return currentPath ? [currentPath] : [];
  const paths = [];
  let key, value, newPath;
  for (key of keys) {
    value = obj[key];
    newPath =
      currentPath === ""
        ? key
        : escapeReg.test(key)
        ? key.includes("'")
          ? `${currentPath}.["${key}"]`
          : `${currentPath}.['${key}']`
        : Array.isArray(obj)
        ? `${currentPath}[${key}]`
        : `${currentPath}.${key}`;
    if (typeof value === "object" && value !== null) {
      paths.push(...keysIterator(value, newPath));
    } else paths.push(newPath);
  }
  return paths;
}

module.exports = {
  tokenizePath,
  evalSetProperty,
  evalGetProperty,
  evalRemoveProperty,
  evalCreate,
  evalHas,
  keysIterator,
};
