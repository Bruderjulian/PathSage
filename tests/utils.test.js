const {equal, ok, throws, doesNotThrow, deepEqual} = require("node:assert");
const { describe, it } = require("node:test");
var utils = require("../src/utils.js");

const func = function () {};

describe("utils", () => {
  it("isArray", function () {
    ok(utils.isArray([]));
    ok(utils.isArray(new Array()));
    //equal(utils.isArray(), false);
    equal(utils.isArray(true), false);
    equal(utils.isArray(""), false);
    equal(utils.isArray(arguments), false);
    equal(utils.isArray({}), false);
    equal(utils.isArray(new Object()), false);
    equal(utils.isArray(Object.create(null)), false);
    equal(utils.isArray(func), false);
    equal(utils.isArray(Symbol([])), false);
  });
  it("hasOwn", function () {
    equal(utils.hasOwn({}, ""), false);
    equal(utils.hasOwn({ a: 1 }, "a"), true);
    equal(utils.hasOwn({ a: {} }, "a"), true);
    equal(utils.hasOwn({ a: [] }, "a"), true);
    equal(utils.hasOwn({ a: undefined }, "a"), true);
    equal(utils.hasOwn({ a: null }, "a"), true);

    equal(utils.hasOwn({}, "a"), false);
    equal(utils.hasOwn([], 0), false);
    equal(utils.hasOwn([], "0"), false);
    equal(utils.hasOwn([1], 0), true);
    equal(utils.hasOwn([1], "0"), true);
    equal(utils.hasOwn([undefined], 0), true);
    equal(utils.hasOwn([null], "0"), true);

    equal(utils.hasOwn(new Array([1]), 0), true);
    equal(utils.hasOwn(new Array([1]), "0"), true);
    equal(utils.hasOwn(new Object([1]), 0), true);
    equal(utils.hasOwn(new Object([1]), "0"), true);
    // sparse Arrays
    equal(utils.hasOwn(new Array(1), "0"), false);
    equal(utils.hasOwn(new Array(1), 0), false);

    equal(utils.hasOwn(arguments, 0), true);
    equal(utils.hasOwn(arguments, "0"), true);
    equal(utils.hasOwn(new Object(arguments), 0), true);
    equal(utils.hasOwn(new Object(arguments), "0"), true);
    equal(utils.hasOwn(new Array(arguments), 0), true);
    equal(utils.hasOwn(new Array(arguments), "0"), true);

    equal(utils.hasOwn(Object.create(null), ""), false);
    equal(utils.hasOwn(Object.create(null), "a"), false);
    equal(utils.hasOwn(Object.create(null)), false);
    equal(utils.hasOwn({}), false);
    equal(utils.hasOwn([]), false);
    equal(utils.hasOwn(new Object({})), false);
    equal(utils.hasOwn(new Object([])), false);
    equal(utils.hasOwn(new Object(Object.create(null)), ""), false);
    equal(utils.hasOwn(new Object(Object.create(null)), "a"), false);
    equal(utils.hasOwn(new Object(Object.create(null))), false);
  });
  it("entries", function () {
    deepEqual(utils.entries({ a: 1 }), [["a", 1]]);
    deepEqual(utils.entries([1]), [["0", 1]]);
    deepEqual(utils.entries({ a: 1, b: { v: 1 } }), [
      ["a", 1],
      ["b", { v: 1 }],
    ]);
    deepEqual(utils.entries(Object.create(null)), []);
    deepEqual(utils.entries({}), []);
    deepEqual(utils.entries([]), []);
  });
  Object.entries = undefined;
  Object.hasOwn = undefined;
  Array.isArray = undefined;
  utils = fresh("../src/utils.js");

  it("isArray Mock", function () {
    ok(utils.isArray([]));
    ok(utils.isArray(new Array()));
    //equal(utils.isArray(), false);
    equal(utils.isArray(true), false);
    equal(utils.isArray(""), false);
    equal(utils.isArray(arguments), false);
    equal(utils.isArray({}), false);
    equal(utils.isArray(new Object()), false);
    equal(utils.isArray(Object.create(null)), false);
    equal(utils.isArray(func), false);
    equal(utils.isArray(Symbol([])), false);
  });
  it("hasOwn Mock", function () {
    equal(utils.hasOwn({}, ""), false);
    equal(utils.hasOwn({ a: 1 }, "a"), true);
    equal(utils.hasOwn({ a: {} }, "a"), true);
    equal(utils.hasOwn({ a: [] }, "a"), true);
    equal(utils.hasOwn({ a: undefined }, "a"), true);
    equal(utils.hasOwn({ a: null }, "a"), true);

    equal(utils.hasOwn({}, "a"), false);
    equal(utils.hasOwn([], 0), false);
    equal(utils.hasOwn([], "0"), false);
    equal(utils.hasOwn([1], 0), true);
    equal(utils.hasOwn([1], "0"), true);
    equal(utils.hasOwn([undefined], 0), true);
    equal(utils.hasOwn([null], "0"), true);

    equal(utils.hasOwn(new Array([1]), 0), true);
    equal(utils.hasOwn(new Array([1]), "0"), true);
    equal(utils.hasOwn(new Object([1]), 0), true);
    equal(utils.hasOwn(new Object([1]), "0"), true);
    // sparse Arrays
    equal(utils.hasOwn(new Array(1), "0"), false);
    equal(utils.hasOwn(new Array(1), 0), false);

    equal(utils.hasOwn(arguments, 0), true);
    equal(utils.hasOwn(arguments, "0"), true);
    equal(utils.hasOwn(new Object(arguments), 0), true);
    equal(utils.hasOwn(new Object(arguments), "0"), true);
    equal(utils.hasOwn(new Array(arguments), 0), true);
    equal(utils.hasOwn(new Array(arguments), "0"), true);

    equal(utils.hasOwn(Object.create(null), ""), false);
    equal(utils.hasOwn(Object.create(null), "a"), false);
    equal(utils.hasOwn(Object.create(null)), false);
    equal(utils.hasOwn({}), false);
    equal(utils.hasOwn([]), false);
    equal(utils.hasOwn(new Object({})), false);
    equal(utils.hasOwn(new Object([])), false);
    equal(utils.hasOwn(new Object(Object.create(null)), ""), false);
    equal(utils.hasOwn(new Object(Object.create(null)), "a"), false);
    equal(utils.hasOwn(new Object(Object.create(null))), false);
  });
  it("entries Mock", function () {
    deepEqual(utils.entries({ a: 1 }), [["a", 1]]);
    deepEqual(utils.entries([1]), [["0", 1]]);
    deepEqual(utils.entries({ a: 1, b: { v: 1 } }), [
      ["a", 1],
      ["b", { v: 1 }],
    ]);
    deepEqual(utils.entries(Object.create(null)), []);
    deepEqual(utils.entries({}), []);
    deepEqual(utils.entries([]), []);
  });
  it("checkObject", function () {
    doesNotThrow(() => utils.checkObject({}));
    doesNotThrow(() => utils.checkObject([]));
    doesNotThrow(() => utils.checkObject(new Object({})));
    doesNotThrow(() => utils.checkObject(new Array([])));
    throws(() => utils.checkObject());
    throws(() => utils.checkObject(""));
    throws(() => utils.checkObject(1));
    throws(() => utils.checkObject(true));
    throws(() => utils.checkObject(null));
    throws(() => utils.checkObject(undefined));
    throws(() => utils.checkObject(func));
    throws(() => utils.checkObject(Symbol({})));
  });
  it("isNotObjectLike", function () {
    equal(utils.isNotObjectLike({}), false);
    equal(utils.isNotObjectLike([]), false);
    equal(utils.isNotObjectLike(Object.create(null)), false);
    equal(utils.isNotObjectLike(arguments), false);
    equal(utils.isNotObjectLike(null), true);
    equal(utils.isNotObjectLike(undefined), true);
    equal(utils.isNotObjectLike(true), true);
    equal(utils.isNotObjectLike(""), true);
    equal(utils.isNotObjectLike(1), true);
    equal(utils.isNotObjectLike(Symbol("")), true);
  });
  it("isObject", function () {
    ok(utils.isObject({}));
    ok(utils.isObject(new Object({})));
    ok(utils.isObject(new Object(arguments)));
    // review Objects with Null Prototype
    ok(utils.isObject(Object.create(null)));

    equal(utils.isObject([]), false);
    equal(utils.isObject(new Array([])), false);
    equal(utils.isObject(new Object([])), false);
    equal(utils.isObject(), false);
    equal(utils.isObject(""), false);
    equal(utils.isObject(1), false);
    equal(utils.isObject(true), false);
    equal(utils.isObject(null), false);
    equal(utils.isObject(undefined), false);
    equal(utils.isObject(func), false);
    equal(utils.isObject(Symbol({})), false);
  });
  it("validCacheSize", function () {
    ok(utils.validCacheSize(-1));
    ok(utils.validCacheSize(0));
    ok(utils.validCacheSize(256));
    ok(utils.validCacheSize(2.0));
    ok(utils.validCacheSize(parseInt("1", 10)));
    ok(utils.validCacheSize(parseInt("1.5", 10)));
    equal(utils.validCacheSize(parseInt("-2", 10)), false);
    equal(utils.validCacheSize(-2), false);
    equal(utils.validCacheSize(new Number(1)), false);

    equal(utils.validCacheSize(), false);
    equal(utils.validCacheSize(undefined), false);
    equal(utils.validCacheSize(null), false);
    equal(utils.validCacheSize(NaN), false);
    equal(utils.validCacheSize(true), false);
    equal(utils.validCacheSize(""), false);
    equal(utils.validCacheSize([]), false);
    equal(utils.validCacheSize({}), false);
  });
  it("checkNotation", function () {
    doesNotThrow(() => utils.checkNotation(""));
    doesNotThrow(() => utils.checkNotation(""));
    doesNotThrow(() => utils.checkNotation(``));
    doesNotThrow(() => utils.checkNotation("a.b.c"));
    throws(() => utils.checkNotation());
    throws(() => utils.checkNotation(false));
    throws(() => utils.checkNotation(1));
    throws(() => utils.checkNotation([]));
    throws(() => utils.checkNotation({}));
    throws(() => utils.checkNotation(Object.create(null)));
    throws(() => utils.checkNotation(new Array()));
    throws(() => utils.checkNotation(arguments));
    throws(() => utils.checkNotation(new Object()));
    throws(() => utils.checkNotation(new Symbol("")));
    throws(() => utils.checkNotation(func));
  });
  describe("checkNotation Brackets", function () {
    it("Throws", function () {
      throws(() => utils.checkNotation("a[[[["));
      throws(() => utils.checkNotation("a["));
      throws(() => utils.checkNotation("a]"));
      throws(() => utils.checkNotation("["));
      throws(() => utils.checkNotation("]"));
      throws(() => utils.checkNotation("[]]]]]]]]]]]]]]]]]]]]]]]]]"));
    });
    it("NotThrows", function () {
      doesNotThrow(() => utils.checkNotation("a[0]"));
      doesNotThrow(() => utils.checkNotation("[]"));
      doesNotThrow(() => utils.checkNotation("a[[[[]]]]"));
    });
  });
  describe("checkNotation Quotes", function () {
    it("Throws", function () {
      throws(() => utils.checkNotation("'"));
      throws(() => utils.checkNotation("`"));
      throws(() => utils.checkNotation('"'));
      throws(() => utils.checkNotation("a.b'"));
      throws(() => utils.checkNotation("a.b`"));
      throws(() => utils.checkNotation('a.b"'));
      throws(() => utils.checkNotation("'"));
      throws(() => utils.checkNotation("`"));
      throws(() => utils.checkNotation('"'));
      throws(() => utils.checkNotation("'a.b"));
      throws(() => utils.checkNotation("`a.b"));
      throws(() => utils.checkNotation('"a.b'));
    });
    it("NotThrows", function () {
      doesNotThrow(() => utils.checkNotation("''"));
      doesNotThrow(() => utils.checkNotation("``"));
      doesNotThrow(() => utils.checkNotation('""'));
      doesNotThrow(() => utils.checkNotation("'a.b'"));
      doesNotThrow(() => utils.checkNotation("`a.b`"));
      doesNotThrow(() => utils.checkNotation('"a.b"'));

      doesNotThrow(() => utils.checkNotation(`["a'b"]`));
      doesNotThrow(() => utils.checkNotation(`['a"b']`));
      doesNotThrow(() => utils.checkNotation(`['a"""b']`));
    });
  });
});

function fresh(file) {
  file = require.resolve(file);
  var tmp = require.cache[file];
  delete require.cache[file];
  var mod = require(file);
  require.cache[file] = tmp;
  return mod;
}
