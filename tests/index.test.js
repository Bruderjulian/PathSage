const { deepEqual, throws, equal, doesNotThrow } = require("node:assert");
const { describe, it } = require("node:test");
const { PathSage, getPrivates } = require("../index.js");

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
    doesNotThrow(() => PathSage.configure());
    throws(() => PathSage.configure(true));

    PathSage.configure({
      allowKeys: true,
      cacheSize: 32,
    });
    let state = getPrivates();
    deepEqual(state.allowKeys, true);
    deepEqual(state.cacheSize, 32);

    PathSage.configure({ cacheSize: -2 });
    state = getPrivates();
    deepEqual(state.cacheSize, 32);
    deepEqual(state.allowKeys, true);

    PathSage.configure({
      allowKeys: false,
      cacheSize: 16,
    });
    state = getPrivates();
    deepEqual(state.allowKeys, false);
    deepEqual(state.cacheSize, 16);

    PathSage.configure({
      allowKeys: true,
    });
    state = getPrivates();
    deepEqual(state.allowKeys, true);
    deepEqual(state.cacheSize, 16);

    PathSage.configure({
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
    PathSage.configure({
      cacheSize: 2,
    });
    state = getPrivates();
    equal(state.cacheSize, 2);
    clearCache();

    let obj = { a: [1, 2], b: 4 };
    PathSage.getProperty(obj, "a[0]");
    state = getPrivates();
    equal(state.currentSize, 1);
    PathSage.getProperty(obj, "a[1]");
    state = getPrivates();
    equal(state.currentSize, 2);
    PathSage.getProperty(obj, "a[2]");
    state = getPrivates();
    equal(state.currentSize, 1);
  });

  // Methods
  it("throw Errors", function () {
    throws(() => PathSage.setProperty(1, ""));
    throws(() => PathSage.setProperty(undefined, ""));
    throws(() => PathSage.setProperty({}, {}));
    doesNotThrow(() => PathSage.setProperty({}, []));
    throws(() => PathSage.setProperty({}, 1));
    throws(() => PathSage.setProperty({}, undefined));
    throws(() => PathSage.setProperty(undefined, undefined));
    doesNotThrow(() => PathSage.setProperty({}, []));
    doesNotThrow(() => PathSage.setProperty({}, ""));

    throws(() => PathSage.getProperty(1, ""));
    throws(() => PathSage.getProperty(undefined, ""));
    throws(() => PathSage.getProperty({}, {}));
    doesNotThrow(() => PathSage.getProperty({}, []));
    throws(() => PathSage.getProperty({}, 1));
    throws(() => PathSage.getProperty({}, undefined));
    throws(() => PathSage.getProperty(undefined, undefined));
    doesNotThrow(() => PathSage.getProperty({}, []));
    doesNotThrow(() => PathSage.getProperty({}, ""));

    throws(() => PathSage.hasProperty(1, ""));
    throws(() => PathSage.hasProperty(undefined, ""));
    throws(() => PathSage.hasProperty({}, {}));
    doesNotThrow(() => PathSage.hasProperty({}, []));
    throws(() => PathSage.hasProperty({}, 1));
    throws(() => PathSage.hasProperty({}, undefined));
    throws(() => PathSage.hasProperty(undefined, undefined));
    doesNotThrow(() => PathSage.hasProperty({}, []));
    doesNotThrow(() => PathSage.hasProperty({}, ""));

    throws(() => PathSage.removeProperty(1, ""));
    throws(() => PathSage.removeProperty(undefined, ""));
    throws(() => PathSage.removeProperty({}, {}));
    doesNotThrow(() => PathSage.removeProperty({}, []));
    throws(() => PathSage.removeProperty({}, 1));
    throws(() => PathSage.removeProperty({}, undefined));
    throws(() => PathSage.removeProperty(undefined, undefined));
    doesNotThrow(() => PathSage.removeProperty({}, []));
    doesNotThrow(() => PathSage.removeProperty({}, ""));

    throws(() => PathSage.deleteProperty(1, ""));
    throws(() => PathSage.deleteProperty(undefined, ""));
    throws(() => PathSage.deleteProperty({}, {}));
    doesNotThrow(() => PathSage.deleteProperty({}, []));
    throws(() => PathSage.deleteProperty({}, 1));
    throws(() => PathSage.deleteProperty({}, undefined));
    throws(() => PathSage.deleteProperty(undefined, undefined));
    doesNotThrow(() => PathSage.deleteProperty({}, []));
    doesNotThrow(() => PathSage.deleteProperty({}, ""));

    throws(() => PathSage.create(1, ""));
    throws(() => PathSage.create({}, {}));
    throws(() => PathSage.create({}, 1));
    doesNotThrow(() => PathSage.create({}, []));
    doesNotThrow(() => PathSage.create({}, ""));
    doesNotThrow(() => PathSage.create({}, undefined));
    doesNotThrow(() => PathSage.create(undefined, undefined));
    doesNotThrow(() => PathSage.create(undefined, ""));

    throws(() => PathSage.keys(""));
    throws(() => PathSage.keys(true));
    throws(() => PathSage.keys(undefined));
    doesNotThrow(() => PathSage.keys({}));
    doesNotThrow(() => PathSage.keys([]));
    throws(() => PathSage.getPaths(""));
    throws(() => PathSage.getPaths(true));
    throws(() => PathSage.getPaths(undefined));
    doesNotThrow(() => PathSage.getPaths({}));
    doesNotThrow(() => PathSage.getPaths([]));
  });

  it("evaluate Keys", function () {
    let obj = { a: 1, b: [{ n: 1 }] };
    let out = PathSage.keys(obj);
    let out2 = PathSage.getPaths(obj);
    deepEqual(out, ["a", "b[0].n"]);
    deepEqual(out2, ["a", "b[0].n"]);
    deepEqual(out, out2);
    out = PathSage.keys([1, 2]);
    out2 = PathSage.getPaths([1, 2]);
    deepEqual(out, ["0", "1"]);
    deepEqual(out2, ["0", "1"]);
    deepEqual(out, out2);
  });

  it("setProperty", function () {
    clearCache();
    let obj = { a: [1, 2], b: 4 };
    PathSage.setProperty(obj, "a[0]", 5);
    deepEqual(obj, { a: [5, 2], b: 4 });
    testCache();

    clearCache();
    PathSage.setProperty(obj, "b", 6);
    deepEqual(obj, { a: [5, 2], b: 6 });
    testCache2();

    PathSage.setProperty(obj, "c", 7);
    deepEqual(obj, { a: [5, 2], b: 6, c: 7 });
  });

  it("getProperty", function () {
    clearCache();
    let obj = { a: [1, 2], b: 4 };
    let out = PathSage.getProperty(obj, "a[0]");
    deepEqual(out, 1);
    deepEqual(obj, obj);
    testCache();

    out = PathSage.getProperty(obj, "c");
    deepEqual(out, undefined);
    deepEqual(obj, obj);
  });

  it("hasProperty", function () {
    clearCache();
    let obj = { a: [1, 2], b: 4 };
    let out = PathSage.hasProperty(obj, "a[0]", false);
    deepEqual(out, true);
    deepEqual(obj, { a: [1, 2], b: 4 });
    testCache();

    out = PathSage.hasProperty(obj, "c", false);
    deepEqual(out, false);
    deepEqual(obj, { a: [1, 2], b: 4 });

    out = PathSage.hasProperty(obj, "c", true);
    deepEqual(out, { depth: 0, left: 1, failedKey: "c", currentObject: obj });
    deepEqual(obj, { a: [1, 2], b: 4 });
  });

  it("removeProperty", function () {
    clearCache();
    let obj = { a: [1, 2], b: 4 };
    PathSage.removeProperty(obj, "a[0]");
    deepEqual(obj, { a: [2], b: 4 });
    testCache();

    throws(() => PathSage.removeProperty(obj, "a[b]"));
    deepEqual(obj, { a: [2], b: 4 });

    clearCache();
    PathSage.removeProperty(obj, "b");
    deepEqual(obj, { a: [2] });
    testCache2();
  });

  it("deleteProperty", function () {
    clearCache();
    let obj = { a: [1, 2], b: 4 };
    PathSage.deleteProperty(obj, "a[0]");
    deepEqual(obj, { a: [2], b: 4 });
    testCache();

    clearCache();
    throws(() => PathSage.deleteProperty(obj, "a.b"));
    state = getPrivates();
    deepEqual(state.cache, { "a.b": ["b", "a"] });

    clearCache();
    PathSage.deleteProperty(obj, "b");
    deepEqual(obj, { a: [2] });
    testCache2();
  });

  it("create", function () {
    clearCache();
    let obj = {};
    PathSage.create(obj, "a[0]");
    deepEqual(obj, { a: { 0: {} } });
    testCache();
    PathSage.create(obj, "a.c");
    deepEqual(obj, { a: { 0: {}, c: {} } });
  });

  //Tokenizer (private)
  it("tokenizer", function () {
    let obj = { a: [1, 2], b: 4 };
    clearCache();

    let out = PathSage.getProperty(obj, "a[0]");
    deepEqual(out, 1);
    testCache();

    out = PathSage.getProperty(obj, "a[0]");
    deepEqual(out, 1);
    state = getPrivates();
    deepEqual(state.cache, { "a[0]": ["0", "a"] });
    deepEqual(state.currentSize, 1);

    out = PathSage.getProperty(obj, "b");
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
  PathSage.clearCache();
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
