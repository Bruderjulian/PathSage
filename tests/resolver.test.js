const { doesNotThrow, equal, ok, deepEqual, throws } = require("node:assert");
const { describe, it } = require("node:test");
const {
  evalHas,
  evalCreate,
  deepKeysIterator,
  evalGetProperty,
  evalSetProperty,
  evalRemoveProperty,
} = require("../src/lib.js");

describe("resolvers", () => {
  it("evalSetProperty", function () {
    let obj = {
      a: [{ n: {}, m: 1 }],
      b: { c: [3, 4], b: 2 },
      c: [[], [[[{ v: { f: { e: 5 } } }]]]],
    };
    let tokens = ["e", "f", "v", "0", "0", "0", "1", "c"];
    evalSetProperty(obj, []);
    evalSetProperty(obj, ["b", "b"], 1);
    deepEqual(obj, {
      a: [{ n: {}, m: 1 }],
      b: { c: [3, 4], b: 1 },
      c: [[], [[[{ v: { f: { e: 5 } } }]]]],
    });
    evalSetProperty(obj, ["0", "c", "b"], 1);
    deepEqual(obj, {
      a: [{ n: {}, m: 1 }],
      b: { c: [1, 4], b: 1 },
      c: [[], [[[{ v: { f: { e: 5 } } }]]]],
    });
    evalSetProperty(obj, ["n", "0", "a"], { h: 1 });
    deepEqual(obj, {
      a: [{ n: { h: 1 }, m: 1 }],
      b: { c: [1, 4], b: 1 },
      c: [[], [[[{ v: { f: { e: 5 } } }]]]],
    });
    evalSetProperty(obj, tokens, "abc");
    deepEqual(obj, {
      a: [{ n: { h: 1 }, m: 1 }],
      b: { c: [1, 4], b: 1 },
      c: [[], [[[{ v: { f: { e: "abc" } } }]]]],
    });
    evalSetProperty(obj, ["g"], "3");
    deepEqual(obj, {
      a: [{ n: { h: 1 }, m: 1 }],
      b: { c: [1, 4], b: 1 },
      c: [[], [[[{ v: { f: { e: "abc" } } }]]]],
      g: 3,
    });
    evalSetProperty(obj, ["0"], 4);
    deepEqual(obj, {
      a: [{ n: { h: 1 }, m: 1 }],
      b: { c: [1, 4], b: 1 },
      c: [[], [[[{ v: { f: { e: "abc" } } }]]]],
      g: 3,
      0: 4,
    });
    evalSetProperty(obj, ["2", "a"], 5);
    deepEqual(obj, {
      a: [{ n: { h: 1 }, m: 1 }, , 5],
      b: { c: [1, 4], b: 1 },
      c: [[], [[[{ v: { f: { e: "abc" } } }]]]],
      g: 3,
      0: 4,
    });
    throws(() => evalSetProperty(obj, ["n", "2", "a"], 1));
    throws(() => evalSetProperty(obj, ["n", "999", "a"], 1));
    throws(() => evalSetProperty(obj, ["k", "g", "b"], 1));
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
    deepEqual(evalGetProperty(obj, ["g"]), undefined);
    deepEqual(evalGetProperty(obj, ["0"]), undefined);
    deepEqual(evalGetProperty(obj, ["2", "a"]), undefined);
    throws(() => evalGetProperty(obj, ["n", "2", "a"]));
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
    equal(evalHas(obj, [], true), true);
    equal(evalHas(obj, ["b", "b"], true), true);
    equal(evalHas(obj, ["0", "b"], true), true);
    equal(evalHas(obj, tokens, true), true);
    let out = {
      depth: 0,
      left: 1,
      failedKey: "g",
      currentObject: obj,
    };
    deepEqual(evalHas(obj, ["g"], true), out);
    out = {
      depth: 0,
      left: 1,
      failedKey: "0",
      currentObject: obj,
    };
    deepEqual(evalHas(obj, ["0"], true), out);
    out = {
      depth: 1,
      left: 2,
      failedKey: "2",
      currentObject: [{ n: {}, m: 1 }],
    };
    deepEqual(evalHas(obj, ["n", "2", "a"], true), out);
  });

  it("evalRemove", function () {
    let obj = {
      a: [{ n: {}, m: 1 }],
      b: { c: [3, 4], b: 2 },
      c: [[], [[[{ v: { f: { e: 5 } } }]]]],
    };
    let tokens = ["f", "v", "0", "0", "0", "1", "c"];
    evalRemoveProperty(obj, tokens);
    deepEqual(obj, {
      a: [{ n: {}, m: 1 }],
      b: { c: [3, 4], b: 2 },
      c: [[], [[[{ v: {} }]]]],
    });
    evalRemoveProperty(obj, ["1", "c", "b"]);
    deepEqual(obj, {
      a: [{ n: {}, m: 1 }],
      b: { c: [3], b: 2 },
      c: [[], [[[{ v: {} }]]]],
    });
    evalRemoveProperty(obj, ["c", "b"]);
    deepEqual(obj, {
      a: [{ n: {}, m: 1 }],
      b: { b: 2 },
      c: [[], [[[{ v: {} }]]]],
    });
    evalRemoveProperty(obj, ["n", "0", "a"]);
    deepEqual(obj, {
      a: [{ m: 1 }],
      b: { b: 2 },
      c: [[], [[[{ v: {} }]]]],
    });
    evalRemoveProperty(obj, ["a"]);
    deepEqual(obj, {
      b: { b: 2 },
      c: [[], [[[{ v: {} }]]]],
    });
    throws(() => evalRemoveProperty(obj, ["j", "h"]));
    evalRemoveProperty(obj, []);
    deepEqual(obj, {});
  });

  it("evalCreate", function () {
    let obj = {};
    let tokens = ["e", "f", "v", "0", "0", "0", "1", "c"];
    let obj2 = {
      a: { 2: { n: {} } },
      //c: [[], [[[{ v: { f: { e: 5 } } }]]]],
      c: { 1: { 0: { 0: { 0: { v: { f: { e: {} } } } } } } },
    };
    let obj1 = { a: 1 };
    evalCreate(obj1, ["a"]);
    deepEqual(obj1, { a: 1 });
    evalCreate(obj, ["n", "2", "a"]);
    deepEqual(obj, { a: { 2: { n: {} } } });
    evalCreate(obj, tokens);
    deepEqual(obj, obj2);
  });

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
});
