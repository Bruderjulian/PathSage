const { doesNotThrow, equal, ok, deepEqual, throws } = require("node:assert");
const { describe, it } = require("node:test");
const {
  evalHas,
  evalCreate,
  deepKeysIterator,
  evalGetProperty,
} = require("../src/lib.js");

describe("resolvers", () => {
  it("keys", function () {
    let obj = {
      a: [{ n: new Date(), "h. ['": 6, 'j"': 7 }],
      b: { c: [3, 4], b: null },
      c: [[], [[[{ v: { f: { e: 5 } } }]]]],
    };
    obj.a[0][`k'"`] = 8;
    let paths = [
      "a[0].n",
      `a[0].["h. ['"]`,
      `a[0].['j"']`,
      `a[0].['k'"']`,
      "b.c[0]",
      "b.c[1]",
      "b.b",
      "c[0]",
      "c[1][0][0][0].v.f.e",
    ];
    deepEqual(deepKeysIterator(obj, []), paths);
  });
  it("evalGetProperty", function () {
    let obj = {
      a: [{ n: {}, m: 1 }],
      b: { c: [3, 4], b: 2 },
      c: [[], [[[{ v: { f: { e: 5 } } }]]]],
    };
    let tokens = ["e", "f", "v", "0", "0", "0", "1", "c"];
    deepEqual(evalGetProperty(obj, []), obj);
    deepEqual(evalGetProperty(obj, ["b", "b"]), 2);
    deepEqual(evalGetProperty(obj, ["c", "b"]), [3, 4]);
    deepEqual(evalGetProperty(obj, ["n", "0", "a"]), {});
    deepEqual(evalGetProperty(obj, tokens), 5);
    deepEqual(evalGetProperty(obj, ["g"]), null);
    deepEqual(evalGetProperty(obj, ["0"]), null);
    deepEqual(evalGetProperty(obj, ["2", "a"]), null);
    deepEqual(evalGetProperty(obj, ["n", "2", "a"]), null);

  });
  it("evalCreate", function () {
    let obj = {};
    let tokens = ["e", "f", "v", "0", "0", "0", "1", "c"];
    let obj2 = {
      a: { 2: { n: {} } },
      //c: [[], [[[{ v: { f: { e: 5 } } }]]]],
      c: { 1: { 0: { 0: { 0: { v: { f: { e: {} } } } } } } },
    };
    deepEqual(evalCreate({ a: 1 }, ["a"]), { a: 1 });
    deepEqual(evalCreate(obj, ["n", "2", "a"]), { a: { 2: { n: {} } } });
    deepEqual(evalCreate(obj, tokens), obj2);
  });
  it("evalHas", function () {
    let obj = {
      a: [{ n: {}, m: 1 }],
      b: { 0: [3, 4], b: 2 },
      c: [[], [[[{ v: { f: { e: 5 } } }]]]],
    };
    let tokens = ["e", "f", "v", "0", "0", "0", "1", "c"];
    equal(evalHas(obj, []), true);
    equal(evalHas(obj, ["b", "b"]), true);
    equal(evalHas(obj, ["0", "b"]), true);
    equal(evalHas(obj, ["n", "0", "a"]), true);
    equal(evalHas(obj, tokens), true);
    equal(evalHas(obj, ["g"]), false);
    equal(evalHas(obj, ["0"]), false);
    equal(evalHas(obj, ["2", "a"]), false);
    equal(evalHas(obj, ["n", "2", "a"]), false);
  });

  it("evalHas Detailed", function () {
    let obj = {
      a: [{ n: {}, m: 1 }],
      b: { 0: [3, 4], b: 2 },
      c: [[], [[[{ v: { f: { e: 5 } } }]]]],
    };
    let tokens = ["e", "f", "v", "0", "0", "0", "1", "c"];
    equal(evalHas(obj, [], true, 0), true);
    equal(evalHas(obj, ["b", "b"], true, 0), true);
    equal(evalHas(obj, ["0", "b"], true, 0), true);
    equal(evalHas(obj, tokens, true, 0), true);
    let out = {
      depth: 0,
      left: 1,
      failedKey: "g",
      currentObject: obj,
    };
    deepEqual(evalHas(obj, ["g"], true, 0), out);
    out = {
      depth: 0,
      left: 1,
      failedKey: "0",
      currentObject: obj,
    };
    deepEqual(evalHas(obj, ["0"], true, 0), out);
    out = {
      depth: 1,
      left: 2,
      failedKey: "2",
      currentObject: [{ n: {}, m: 1 }],
    };
    deepEqual(evalHas(obj, ["n", "2", "a"], true, 0), out);
  });
});
