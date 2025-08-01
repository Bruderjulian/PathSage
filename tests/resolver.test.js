import { equal, deepEqual, throws } from "node:assert";
import { describe, it } from "node:test";
import {
  evalHas,
  evalCreate,
  keysIterator,
  evalGet,
  evalSet,
  evalRemove,
} from "../src/lib.js";

describe("resolvers", () => {
  it("evalSet", function () {
    let obj = {
      a: [{ n: {}, m: 1 }],
      b: { c: [3, 4], b: 2 },
      c: [[], [[[{ v: { f: { e: 5 } } }]]]],
    };
    let tokens = ["e", "f", "v", "0", "0", "0", "1", "c"];
    evalSet(obj, []);
    evalSet(obj, ["b", "b"], 1);
    deepEqual(obj, {
      a: [{ n: {}, m: 1 }],
      b: { c: [3, 4], b: 1 },
      c: [[], [[[{ v: { f: { e: 5 } } }]]]],
    });
    evalSet(obj, ["0", "c", "b"], 1);
    deepEqual(obj, {
      a: [{ n: {}, m: 1 }],
      b: { c: [1, 4], b: 1 },
      c: [[], [[[{ v: { f: { e: 5 } } }]]]],
    });
    evalSet(obj, ["n", "0", "a"], { h: 1 });
    deepEqual(obj, {
      a: [{ n: { h: 1 }, m: 1 }],
      b: { c: [1, 4], b: 1 },
      c: [[], [[[{ v: { f: { e: 5 } } }]]]],
    });
    evalSet(obj, tokens, "abc");
    deepEqual(obj, {
      a: [{ n: { h: 1 }, m: 1 }],
      b: { c: [1, 4], b: 1 },
      c: [[], [[[{ v: { f: { e: "abc" } } }]]]],
    });
    evalSet(obj, ["g"], "3");
    deepEqual(obj, {
      a: [{ n: { h: 1 }, m: 1 }],
      b: { c: [1, 4], b: 1 },
      c: [[], [[[{ v: { f: { e: "abc" } } }]]]],
      g: 3,
    });
    evalSet(obj, ["0"], 4);
    deepEqual(obj, {
      a: [{ n: { h: 1 }, m: 1 }],
      b: { c: [1, 4], b: 1 },
      c: [[], [[[{ v: { f: { e: "abc" } } }]]]],
      g: 3,
      0: 4,
    });
    evalSet(obj, ["2", "a"], 5);
    deepEqual(obj, {
      a: [{ n: { h: 1 }, m: 1 }, , 5],
      b: { c: [1, 4], b: 1 },
      c: [[], [[[{ v: { f: { e: "abc" } } }]]]],
      g: 3,
      0: 4,
    });
    throws(() => evalSet(obj, ["n", "2", "a"], 1));
    throws(() => evalSet(obj, ["n", "999", "a"], 1));
    throws(() => evalSet(obj, ["k", "g", "b"], 1));
  });

  it("evalGet", function () {
    let obj = {
      a: [{ n: {}, m: 1 }],
      b: { c: [3, 4], b: 2 },
      c: [[], [[[{ v: { f: { e: 5 } } }]]]],
    };
    let tokens = ["e", "f", "v", "0", "0", "0", "1", "c"];
    deepEqual(evalGet(obj, []), obj);
    deepEqual(evalGet(obj, ["b", "b"]), 2);
    deepEqual(evalGet(obj, ["c", "b"]), [3, 4]);
    deepEqual(evalGet(obj, ["n", "0", "a"]), {});
    deepEqual(evalGet(obj, tokens), 5);
    deepEqual(evalGet(obj, ["g"]), undefined);
    deepEqual(evalGet(obj, ["0"]), undefined);
    deepEqual(evalGet(obj, ["2", "a"]), undefined);
    throws(() => evalGet(obj, ["n", "2", "a"]));
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
    let out = {
      success: true,
      depth: 0,
      left: 0,
      key: null,
      currentObject: obj,
    };
    deepEqual(evalHas(obj, [], true), out);
    out = {
      success: true,
      depth: 2,
      left: 0,
      key: null,
      currentObject: "2",
    };
    deepEqual(evalHas(obj, ["b", "b"], true), out);
    out = {
      success: true,
      depth: 2,
      left: 0,
      key: null,
      currentObject: [3, 4],
    };
    deepEqual(evalHas(obj, ["0", "b"], true), out);
    out = {
      success: true,
      depth: 8,
      left: 0,
      key: null,
      currentObject: 5,
    };
    deepEqual(evalHas(obj, tokens, true), out);
    out = {
      success: false,
      depth: 6,
      left: 2,
      key: "d",
      currentObject: {f: {e: 5} },
    };
    tokens[1] = "d";
    deepEqual(evalHas(obj, tokens, true), out);
    out = {
      success: false,
      depth: 0,
      left: 1,
      key: "g",
      currentObject: obj,
    };
    deepEqual(evalHas(obj, ["g"], true), out);
    out = {
      success: false,
      depth: 0,
      left: 1,
      key: "0",
      currentObject: obj,
    };
    deepEqual(evalHas(obj, ["0"], true), out);
    out = {
      success: false,
      depth: 1,
      left: 2,
      key: "2",
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
    evalRemove(obj, tokens);
    deepEqual(obj, {
      a: [{ n: {}, m: 1 }],
      b: { c: [3, 4], b: 2 },
      c: [[], [[[{ v: {} }]]]],
    });
    evalRemove(obj, ["1", "c", "b"]);
    deepEqual(obj, {
      a: [{ n: {}, m: 1 }],
      b: { c: [3], b: 2 },
      c: [[], [[[{ v: {} }]]]],
    });
    evalRemove(obj, ["c", "b"]);
    deepEqual(obj, {
      a: [{ n: {}, m: 1 }],
      b: { b: 2 },
      c: [[], [[[{ v: {} }]]]],
    });
    evalRemove(obj, ["n", "0", "a"]);
    deepEqual(obj, {
      a: [{ m: 1 }],
      b: { b: 2 },
      c: [[], [[[{ v: {} }]]]],
    });
    evalRemove(obj, ["a"]);
    deepEqual(obj, {
      b: { b: 2 },
      c: [[], [[[{ v: {} }]]]],
    });
    throws(() => evalRemove(obj, ["j", "h"]));
    evalRemove(obj, []);
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
      `a[0].["k'""]`,
      "b.c[0]",
      "b.c[1]",
      "b.b",
      "c[0]",
      "c[1][0][0][0].v.f.e",
    ];
    deepEqual(keysIterator(obj, ""), paths);
  });
});
