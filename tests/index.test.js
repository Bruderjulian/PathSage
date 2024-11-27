require("process").env.NODE_ENV = "test";
const { deepEqual, throws } = require("node:assert");
const { describe, it } = require("node:test");
const unPathify = require("../index.js");

describe("API Tests", function () {
  it("defaults", function () {
    let defaults = {
      cache: {},
      maxCount: 0,
      cacheSize: 16,
      currentSize: 0,
      allowKeys: false,
      parseNumbers: false,
    };
    let state = unPathify._getPrivates();
    deepEqual(state, defaults);
  });
  it("must handle configurations", function () {
    unPathify.configure({
      allowKeys: true,
      parseNumbers: true,
      cacheSize: 32,
    });
    let state = unPathify._getPrivates();
    deepEqual(state.allowKeys, true);
    deepEqual(state.parseNumbers, true);
    deepEqual(state.cacheSize, 32);

    unPathify.configure({ cacheSize: -2 });
    state = unPathify._getPrivates();
    deepEqual(state.cacheSize, 32);
    deepEqual(state.allowKeys, true);
    deepEqual(state.parseNumbers, true);

    unPathify.configure({
      allowKeys: false,
      parseNumbers: false,
      cacheSize: 16,
    });
    state = unPathify._getPrivates();
    deepEqual(state.allowKeys, false);
    deepEqual(state.parseNumbers, false);
    deepEqual(state.cacheSize, 16);
  });

  it("must remove Test Methods", function () {
    require("process").env.NODE_ENV = "prod";
    delete require.cache[require.resolve("../index.js")];
    let unPathify2 = require("../index.js");
    deepEqual(unPathify2._getPrivates, undefined);
  });

  it("clear Cache", function () {
    clearCache();
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

    throws(() => unPathify.keys(""));
    throws(() => unPathify.keys(true));
    throws(() => unPathify.keys(undefined));
    throws(() => unPathify.getPaths(""));
    throws(() => unPathify.getPaths(true));
    throws(() => unPathify.getPaths(undefined));
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
    let out = unPathify.hasProperty(obj, "a[0]");
    deepEqual(out, true);
    deepEqual(obj, obj);
    testCache();

    out = unPathify.hasProperty(obj, "c");
    deepEqual(out, false);
    deepEqual(obj, obj);
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
    throws(()=> unPathify.deleteProperty(obj, "a.b"));
    state = unPathify._getPrivates();
    deepEqual(state.cache, { "a.b": { value: ["b", "a"], count: 1 } });

    clearCache();
    unPathify.deleteProperty(obj, "b");
    deepEqual(obj, { a: [2] });
    testCache2();
  });

  it("clearCacheSmart", function () {
    clearCache();
    let obj = { a: [1, 2], b: 4 };
    unPathify.getProperty(obj, "a[0]");
    unPathify.getProperty(obj, "a[0]");
    unPathify.getProperty(obj, "a[0]");
    unPathify.getProperty(obj, "b");

    state = unPathify._getPrivates();
    deepEqual(state.cache, {
      "a[0]": { value: ["0", "a"], count: 3 },
      b: { value: ["b"], count: 1 },
    });
    deepEqual(state.maxCount, 3);
    deepEqual(state.currentSize, 2);

    unPathify.clearCacheSmart();
    state = unPathify._getPrivates();
    deepEqual(state.cache, {
      "a[0]": { value: ["0", "a"], count: 3 },
    });
    deepEqual(state.maxCount, 3);
    deepEqual(state.currentSize, 1);
  });

  it("auto smart clear", function () {
    unPathify.configure({ cacheSize: 2 });
    unPathify.configure({ cacheSize: -1 });
    clearCache();
    let obj = { a: [1, 2], b: 4 };
    unPathify.getProperty(obj, "a[0]");
    unPathify.getProperty(obj, "a[0]");
    unPathify.getProperty(obj, "a[0]");
    unPathify.getProperty(obj, "b");
    unPathify.getProperty(obj, "a[1]");

    state = unPathify._getPrivates();
    deepEqual(state.cache, {
      "a[0]": { value: ["0", "a"], count: 3 },
      "a[1]": { value: ["1", "a"], count: 1 },
      b: { value: ["b"], count: 1 },
    });
    deepEqual(state.maxCount, 3);
    deepEqual(state.currentSize, 3);

    unPathify.configure({ cacheSize: 2 });
    unPathify.getProperty(obj, "a[1]");

    state = unPathify._getPrivates();
    deepEqual(state.cache, {
      "a[0]": { value: ["0", "a"], count: 3 },
      "a[1]": { value: ["1", "a"], count: 2 },
      b: { value: ["b"], count: 1 },
    });
    deepEqual(state.maxCount, 3);
    deepEqual(state.currentSize, 3);

    unPathify.getProperty(obj, "c");
    state = unPathify._getPrivates();
    deepEqual(state.cache, {
      "a[0]": { value: ["0", "a"], count: 3 },
      "a[1]": { value: ["1", "a"], count: 2 },
      c: { value: ["c"], count: 1 },
    });
    deepEqual(state.maxCount, 3);
    deepEqual(state.currentSize, 3);
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
    state = unPathify._getPrivates();
    deepEqual(state.cache, { "a[0]": { value: ["0", "a"], count: 2 } });
    deepEqual(state.maxCount, 2);
    deepEqual(state.currentSize, 1);

    out = unPathify.getProperty(obj, "b");
    deepEqual(out, 4);
    state = unPathify._getPrivates();
    deepEqual(state.cache, {
      "a[0]": { value: ["0", "a"], count: 2 },
      b: { value: ["b"], count: 1 },
    });
    deepEqual(state.maxCount, 2);
    deepEqual(state.currentSize, 2);
  });
});

function clearCache() {
  unPathify.clearCache();
  state = unPathify._getPrivates();
  deepEqual(state.cache, {});
  deepEqual(state.maxCount, 0);
  deepEqual(state.currentSize, 0);
}

function testCache() {
  state = unPathify._getPrivates();
  deepEqual(state.cache, { "a[0]": { value: ["0", "a"], count: 1 } });
  deepEqual(state.maxCount, 1);
  deepEqual(state.currentSize, 1);
}

function testCache2() {
  state = unPathify._getPrivates();
  deepEqual(state.cache, { b: { value: ["b"], count: 1 } });
  deepEqual(state.maxCount, 1);
  deepEqual(state.currentSize, 1);
}
