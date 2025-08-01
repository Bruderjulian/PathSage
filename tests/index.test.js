import { deepEqual, throws, equal, doesNotThrow } from "node:assert";
import { describe, it } from "node:test";
import * as PathSage from "../index.js";

describe("API Tests", function () {
  it("defaults", function () {
    const defaults = {
      cache: {},
      cacheSize: 4096,
      currentSize: 0,
      allowKeys: false,
    };
    const state = PathSage.getPrivates();
    deepEqual(state, defaults);
  });
  it("configure", function () {
    doesNotThrow(() => PathSage.configure());
    doesNotThrow(() => PathSage.configure(undefined));
    doesNotThrow(() => PathSage.configure({}));
    doesNotThrow(() => PathSage.configure(new Object()));
    doesNotThrow(() => PathSage.configure(new Object({})));
    doesNotThrow(() => PathSage.configure(Object.create(null)));
    throws(() => PathSage.configure([]));
    throws(() => PathSage.configure(new Array()));
    throws(() => PathSage.configure(""));
    throws(() => PathSage.configure(1));
    throws(() => PathSage.configure(true));
    throws(() => PathSage.configure(false));
    throws(() => PathSage.configure(NaN));
    throws(() => PathSage.configure(null));
    throws(() => PathSage.configure(func));
    throws(() => PathSage.configure(Symbol({})));
    throws(() => PathSage.configure(Symbol([])));

    PathSage.configure({
      allowKeys: true,
      cacheSize: 32,
    });
    let state = PathSage.getPrivates();
    deepEqual(state.allowKeys, true);
    deepEqual(state.cacheSize, 32);

    PathSage.configure({ cacheSize: -2 });
    state = PathSage.getPrivates();
    deepEqual(state.cacheSize, 32);
    deepEqual(state.allowKeys, true);

    PathSage.configure({
      allowKeys: false,
      cacheSize: 16,
    });
    state = PathSage.getPrivates();
    deepEqual(state.allowKeys, false);
    deepEqual(state.cacheSize, 16);

    PathSage.configure({
      allowKeys: true,
    });
    state = PathSage.getPrivates();
    deepEqual(state.allowKeys, true);
    deepEqual(state.cacheSize, 16);
  });

  it("clear Cache", function () {
    clearCache();
  });

  it("auto clear Cache", function () {
    PathSage.configure({
      cacheSize: 2,
    });
    let state = PathSage.getPrivates();
    equal(state.cacheSize, 2);
    clearCache();

    let obj = { a: [1, 2], b: 4 };
    PathSage.get(obj, "a[0]");
    state = PathSage.getPrivates();
    equal(state.currentSize, 1);
    PathSage.get(obj, "a[1]");
    state = PathSage.getPrivates();
    equal(state.currentSize, 2);
    PathSage.get(obj, "a[2]");
    state = PathSage.getPrivates();
    equal(state.currentSize, 1);
  });

  // Methods
  it("throw Errors", function () {
    throws(() => PathSage.set(1, ""));
    throws(() => PathSage.set(undefined, ""));
    throws(() => PathSage.set({}, {}));
    doesNotThrow(() => PathSage.set({}, []));
    throws(() => PathSage.set({}, 1));
    throws(() => PathSage.set({}, undefined));
    throws(() => PathSage.set(undefined, undefined));
    doesNotThrow(() => PathSage.set({}, []));
    doesNotThrow(() => PathSage.set({}, ""));

    throws(() => PathSage.get(1, ""));
    throws(() => PathSage.get(undefined, ""));
    throws(() => PathSage.get({}, {}));
    doesNotThrow(() => PathSage.get({}, []));
    throws(() => PathSage.get({}, 1));
    throws(() => PathSage.get({}, undefined));
    throws(() => PathSage.get(undefined, undefined));
    doesNotThrow(() => PathSage.get({}, []));
    doesNotThrow(() => PathSage.get({}, ""));

    throws(() => PathSage.has(1, ""));
    throws(() => PathSage.has(undefined, ""));
    throws(() => PathSage.has({}, {}));
    doesNotThrow(() => PathSage.has({}, []));
    throws(() => PathSage.has({}, 1));
    throws(() => PathSage.has({}, undefined));
    throws(() => PathSage.has(undefined, undefined));
    doesNotThrow(() => PathSage.has({}, []));
    doesNotThrow(() => PathSage.has({}, ""));

    throws(() => PathSage.remove(1, ""));
    throws(() => PathSage.remove(undefined, ""));
    throws(() => PathSage.remove({}, {}));
    doesNotThrow(() => PathSage.remove({}, []));
    throws(() => PathSage.remove({}, 1));
    throws(() => PathSage.remove({}, undefined));
    throws(() => PathSage.remove(undefined, undefined));
    doesNotThrow(() => PathSage.remove({}, []));
    doesNotThrow(() => PathSage.remove({}, ""));

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

  it("set", function () {
    clearCache();
    let obj = { a: [1, 2], b: 4 };
    PathSage.set(obj, "a[0]", 5);
    deepEqual(obj, { a: [5, 2], b: 4 });
    testCache();

    clearCache();
    PathSage.set(obj, "b", 6);
    deepEqual(obj, { a: [5, 2], b: 6 });
    testCache2();

    PathSage.set(obj, "c", 7);
    deepEqual(obj, { a: [5, 2], b: 6, c: 7 });
  });

  it("get", function () {
    clearCache();
    let obj = { a: [1, 2], b: 4 };
    let out = PathSage.get(obj, "a[0]");
    deepEqual(out, 1);
    deepEqual(obj, obj);
    testCache();

    out = PathSage.get(obj, "c");
    deepEqual(out, undefined);
    deepEqual(obj, obj);
  });

  it("has", function () {
    clearCache();
    let obj = { a: [1, 2], b: 4 };
    let out = PathSage.has(obj, "a[0]", false);
    deepEqual(out, true);
    deepEqual(obj, { a: [1, 2], b: 4 });
    testCache();

    out = PathSage.has(obj, "c", false);
    deepEqual(out, false);
    deepEqual(obj, { a: [1, 2], b: 4 });

    out = PathSage.has(obj, "c", true);
    deepEqual(out, {
      success: false,
      depth: 0,
      left: 1,
      key: "c",
      currentObject: obj,
    });
    deepEqual(obj, { a: [1, 2], b: 4 });
  });

  it("remove", function () {
    clearCache();
    let obj = { a: [1, 2], b: 4 };
    PathSage.remove(obj, "a[0]");
    deepEqual(obj, { a: [2], b: 4 });
    testCache();

    throws(() => PathSage.remove(obj, "a[b]"));
    deepEqual(obj, { a: [2], b: 4 });

    clearCache();
    PathSage.remove(obj, "b");
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

    let out = PathSage.get(obj, "a[0]");
    deepEqual(out, 1);
    testCache();

    out = PathSage.get(obj, "a[0]");
    deepEqual(out, 1);
    let state = PathSage.getPrivates();
    deepEqual(state.cache, { "a[0]": ["0", "a"] });
    deepEqual(state.currentSize, 1);

    out = PathSage.get(obj, "b");
    deepEqual(out, 4);
    state = PathSage.getPrivates();
    deepEqual(state.cache, {
      "a[0]": ["0", "a"],
      b: ["b"],
    });
    deepEqual(state.currentSize, 2);
  });
});

function clearCache() {
  PathSage.clearCache();
  const state = PathSage.getPrivates();
  deepEqual(state.cache, {});
  deepEqual(state.currentSize, 0);
}

function testCache() {
  const state = PathSage.getPrivates();
  deepEqual(state.cache, { "a[0]": ["0", "a"] });
  deepEqual(state.currentSize, 1);
}

function testCache2() {
  const state = PathSage.getPrivates();
  deepEqual(state.cache, { b: ["b"] });
  deepEqual(state.currentSize, 1);
}
