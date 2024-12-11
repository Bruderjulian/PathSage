const { deepEqual, throws, equal, doesNotThrow } = require("node:assert");
const { describe, it } = require("node:test");
const { unPathify, getPrivates } = require("../index.js");

describe("API Tests", function () {
  it("defaults", function () {
    let defaults = {
      cache: {},
      cacheSize: -1,
      currentSize: 0,
      allowKeys: false,
    };
    let state = getPrivates();
    deepEqual(state, defaults);
  });
  it("must handle configurations", function () {
    doesNotThrow(() => unPathify.configure());
    throws(() => unPathify.configure(true));
    unPathify.configure({
      allowKeys: true,
      cacheSize: 32,
    });
    let state = getPrivates();
    deepEqual(state.allowKeys, true);
    deepEqual(state.cacheSize, 32);

    unPathify.configure({ cacheSize: -2 });
    state = getPrivates();
    deepEqual(state.cacheSize, 32);
    deepEqual(state.allowKeys, true);

    unPathify.configure({
      allowKeys: false,
      cacheSize: 16,
    });
    state = getPrivates();
    deepEqual(state.allowKeys, false);
    deepEqual(state.cacheSize, 16);

    unPathify.configure({
      allowKeys: true,
    });
    state = getPrivates();
    deepEqual(state.allowKeys, true);
    deepEqual(state.cacheSize, 16);

    unPathify.configure({
      cacheSize: 2.3,
    });
    state = getPrivates();
    deepEqual(state.allowKeys, true);
    deepEqual(state.cacheSize, 2);
  });

  it("clear Cache", function () {
    clearCache();
  });

  it("auto clear Cache", function () {
    unPathify.configure({
      cacheSize: 2,
    });
    state = getPrivates();
    equal(state.cacheSize, 2);
    clearCache();

    let obj = { a: [1, 2], b: 4 };
    unPathify.getProperty(obj, "a[0]");
    state = getPrivates();
    equal(state.currentSize, 1);
    unPathify.getProperty(obj, "a[1]");
    state = getPrivates();
    equal(state.currentSize, 2);
    unPathify.getProperty(obj, "a[2]");
    state = getPrivates();
    equal(state.currentSize, 1);
  });

  // Methods
  it("throw Errors", function () {
    throws(() => unPathify.setProperty(1, ""));
    throws(() => unPathify.setProperty(undefined, ""));
    throws(() => unPathify.setProperty({}, {}));
    throws(() => unPathify.setProperty({}, []));
    throws(() => unPathify.setProperty({}, 1));
    throws(() => unPathify.setProperty({}, undefined));
    throws(() => unPathify.setProperty(undefined, undefined));

    throws(() => unPathify.getProperty(1, ""));
    throws(() => unPathify.getProperty(undefined, ""));
    throws(() => unPathify.getProperty({}, {}));
    throws(() => unPathify.getProperty({}, []));
    throws(() => unPathify.getProperty({}, 1));
    throws(() => unPathify.getProperty({}, undefined));
    throws(() => unPathify.getProperty(undefined, undefined));

    throws(() => unPathify.hasProperty(1, ""));
    throws(() => unPathify.hasProperty(undefined, ""));
    throws(() => unPathify.hasProperty({}, {}));
    throws(() => unPathify.hasProperty({}, []));
    throws(() => unPathify.hasProperty({}, 1));
    throws(() => unPathify.hasProperty({}, undefined));
    throws(() => unPathify.hasProperty(undefined, undefined));

    throws(() => unPathify.removeProperty(1, ""));
    throws(() => unPathify.removeProperty(undefined, ""));
    throws(() => unPathify.removeProperty({}, {}));
    throws(() => unPathify.removeProperty({}, []));
    throws(() => unPathify.removeProperty({}, 1));
    throws(() => unPathify.removeProperty({}, undefined));
    throws(() => unPathify.removeProperty(undefined, undefined));

    throws(() => unPathify.deleteProperty(1, ""));
    throws(() => unPathify.deleteProperty(undefined, ""));
    throws(() => unPathify.deleteProperty({}, {}));
    throws(() => unPathify.deleteProperty({}, []));
    throws(() => unPathify.deleteProperty({}, 1));
    throws(() => unPathify.deleteProperty({}, undefined));
    throws(() => unPathify.deleteProperty(undefined, undefined));

    throws(() => unPathify.create(1, ""));
    throws(() => unPathify.create({}, {}));
    throws(() => unPathify.create({}, []));
    throws(() => unPathify.create({}, 1));
    throws(() => unPathify.create({}, undefined));
    doesNotThrow(() => unPathify.create(undefined, undefined));
    doesNotThrow(() => unPathify.create(undefined, ""));

    throws(() => unPathify.keys(""));
    throws(() => unPathify.keys(true));
    throws(() => unPathify.keys(undefined));
    throws(() => unPathify.getPaths(""));
    throws(() => unPathify.getPaths(true));
    throws(() => unPathify.getPaths(undefined));

    throws(() => unPathify.validate(true));
    throws(() => unPathify.validate(undefined));
    throws(() => unPathify.validate({}));
    doesNotThrow(() => unPathify.validate([]));
    doesNotThrow(() => unPathify.validate(""));
  });

  it("evaluate Keys", function () {
    let obj = { a: 1, b: [{ n: 1 }] };
    let out = unPathify.keys(obj);
    let out2 = unPathify.getPaths(obj);
    deepEqual(out, ["a", "b[0].n"]);
    deepEqual(out2, ["a", "b[0].n"]);
    deepEqual(out, out2);
    out = unPathify.keys([1, 2]);
    out2 = unPathify.getPaths([1, 2]);
    deepEqual(out, ["0", "1"]);
    deepEqual(out2, ["0", "1"]);
    deepEqual(out, out2);
  });

  it("validate Tokens", function () {
    doesNotThrow(() => unPathify.validate([]));
    doesNotThrow(() => unPathify.validate(["a"]));
    doesNotThrow(() => unPathify.validate(["a", "1"]));
    throws(() => unPathify.validate([1]));
    throws(() => unPathify.validate([true]));
    throws(() => unPathify.validate([[]]));
    throws(() => unPathify.validate([{}]));
    throws(() => unPathify.validate(["1", 1]));
  });

  it("validate String", function () {
    doesNotThrow(() => unPathify.validate(""));
    doesNotThrow(() => unPathify.validate("[]"));
    doesNotThrow(() => unPathify.validate("a.1"));
    doesNotThrow(() => unPathify.validate("a.[1]"));
    throws(() => unPathify.validate("[[]}"));
    throws(() => unPathify.validate("{{}]"));
    throws(() => unPathify.validate("'''"));
    throws(() => unPathify.validate("```"));
  });

  it("setProperty", function () {
    clearCache();
    let obj = { a: [1, 2], b: 4 };
    unPathify.setProperty(obj, "a[0]", 5);
    deepEqual(obj, { a: [5, 2], b: 4 });
    testCache();

    clearCache();
    unPathify.setProperty(obj, "b", 6);
    deepEqual(obj, { a: [5, 2], b: 6 });
    testCache2();

    unPathify.setProperty(obj, "c", 7);
    deepEqual(obj, { a: [5, 2], b: 6, c: 7 });
  });

  it("getProperty", function () {
    clearCache();
    let obj = { a: [1, 2], b: 4 };
    let out = unPathify.getProperty(obj, "a[0]");
    deepEqual(out, 1);
    deepEqual(obj, obj);
    testCache();

    out = unPathify.getProperty(obj, "c");
    deepEqual(out, undefined);
    deepEqual(obj, obj);
  });

  it("hasProperty", function () {
    clearCache();
    let obj = { a: [1, 2], b: 4 };
    let out = unPathify.hasProperty(obj, "a[0]", false);
    deepEqual(out, true);
    deepEqual(obj, { a: [1, 2], b: 4 });
    testCache();

    out = unPathify.hasProperty(obj, "c", false);
    deepEqual(out, false);
    deepEqual(obj, { a: [1, 2], b: 4 });

    out = unPathify.hasProperty(obj, "c", true);
    deepEqual(out, { depth: 0, left: 1, failedKey: "c", currentObject: obj });
    deepEqual(obj, { a: [1, 2], b: 4 });
  });

  it("removeProperty", function () {
    clearCache();
    let obj = { a: [1, 2], b: 4 };
    unPathify.removeProperty(obj, "a[0]");
    deepEqual(obj, { a: [2], b: 4 });
    testCache();

    clearCache();
    unPathify.removeProperty(obj, "b");
    deepEqual(obj, { a: [2] });
    testCache2();
  });

  it("deleteProperty", function () {
    clearCache();
    let obj = { a: [1, 2], b: 4 };
    unPathify.deleteProperty(obj, "a[0]");
    deepEqual(obj, { a: [2], b: 4 });
    testCache();

    clearCache();
    throws(() => unPathify.deleteProperty(obj, "a.b"));
    state = getPrivates();
    deepEqual(state.cache, { "a.b": ["b", "a"] });

    clearCache();
    unPathify.deleteProperty(obj, "b");
    deepEqual(obj, { a: [2] });
    testCache2();
  });

  //Tokenizer (private)
  it("tokenizer", function () {
    let obj = { a: [1, 2], b: 4 };
    clearCache();

    let out = unPathify.getProperty(obj, "a[0]");
    deepEqual(out, 1);
    testCache();

    out = unPathify.getProperty(obj, "a[0]");
    deepEqual(out, 1);
    state = getPrivates();
    deepEqual(state.cache, { "a[0]": ["0", "a"] });
    deepEqual(state.currentSize, 1);

    out = unPathify.getProperty(obj, "b");
    deepEqual(out, 4);
    state = getPrivates();
    deepEqual(state.cache, {
      "a[0]": ["0", "a"],
      b: ["b"],
    });
    deepEqual(state.currentSize, 2);
  });
});

function clearCache() {
  unPathify.clearCache();
  state = getPrivates();
  deepEqual(state.cache, {});
  deepEqual(state.currentSize, 0);
}

function testCache() {
  state = getPrivates();
  deepEqual(state.cache, { "a[0]": ["0", "a"] });
  deepEqual(state.currentSize, 1);
}

function testCache2() {
  state = getPrivates();
  deepEqual(state.cache, { b: ["b"] });
  deepEqual(state.currentSize, 1);
}
