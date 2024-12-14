const assert = require("node:assert");
const { describe, it } = require("node:test");
var utils = require("../src/utils.js");

describe("utils", () => {
  it("isArray", function () {
    assert.ok(utils.isArray([]));
    assert.ok(utils.isArray(new Array()));
    assert.equal(utils.isArray(arguments), false);
    assert.equal(utils.isArray({}), false);
    assert.equal(utils.isArray(true), false);
    assert.equal(utils.isArray(""), false);
  });
  it("hasOwn", function () {
    assert.equal(utils.hasOwn({}, ""), false);
    assert.equal(utils.hasOwn({ a: 1 }, "a"), true);
    assert.equal(utils.hasOwn({ a: {} }, "a"), true);
    assert.equal(utils.hasOwn({ a: [] }, "a"), true);
    assert.equal(utils.hasOwn({}, "a"), false);
    assert.equal(utils.hasOwn([], 0), false);
    assert.equal(utils.hasOwn([1], 0), true);
    assert.equal(utils.hasOwn([1], "0"), true);
    assert.equal(utils.hasOwn([], "0"), false);

    assert.equal(utils.hasOwn(Object.create(null), ""), false);
    assert.equal(utils.hasOwn(Object.create(null), "a"), false);
    assert.equal(utils.hasOwn({}), false);
    assert.equal(utils.hasOwn([]), false);
    assert.equal(utils.hasOwn(Object.create(null)), false);
  });
  it("entries", function () {
    assert.deepEqual(utils.entries({ a: 1 }), [["a", 1]]);
    assert.deepEqual(utils.entries([1]), [["0", 1]]);
    assert.deepEqual(utils.entries({ a: 1, b: { v: 1 } }), [
      ["a", 1],
      ["b", { v: 1 }],
    ]);
    assert.deepEqual(utils.entries(Object.create(null)), []);
    assert.deepEqual(utils.entries({}), []);
    assert.deepEqual(utils.entries([]), []);
  });
  Object.entries = undefined;
  Object.hasOwn = undefined;
  Array.isArray = undefined;
  utils = fresh("../src/utils.js");

  it("isArray Mock", function () {
    assert.ok(utils.isArray([]));
    assert.ok(utils.isArray(new Array()));
    assert.equal(utils.isArray(arguments), false);
    assert.equal(utils.isArray({}), false);
    assert.equal(utils.isArray(true), false);
    assert.equal(utils.isArray(""), false);
  });
  it("hasOwn Mock", function () {
    assert.equal(utils.hasOwn({}, ""), false);
    assert.equal(utils.hasOwn({ a: 1 }, "a"), true);
    assert.equal(utils.hasOwn({ a: {} }, "a"), true);
    assert.equal(utils.hasOwn({ a: [] }, "a"), true);
    assert.equal(utils.hasOwn({}, "a"), false);
    assert.equal(utils.hasOwn([], 0), false);
    assert.equal(utils.hasOwn([1], 0), true);
    assert.equal(utils.hasOwn([1], "0"), true);
    assert.equal(utils.hasOwn([], "0"), false);

    assert.equal(utils.hasOwn(Object.create(null), ""), false);
    assert.equal(utils.hasOwn(Object.create(null), "a"), false);
    assert.equal(utils.hasOwn({}), false);
    assert.equal(utils.hasOwn([]), false);
    assert.equal(utils.hasOwn(Object.create(null)), false);
  });
  it("entries", function () {
    assert.deepEqual(utils.entries({ a: 1 }), [["a", 1]]);
    assert.deepEqual(utils.entries([1]), [["0", 1]]);
    assert.deepEqual(utils.entries({ a: 1, b: { v: 1 } }), [
      ["a", 1],
      ["b", { v: 1 }],
    ]);
    assert.deepEqual(utils.entries(Object.create(null)), []);
    assert.deepEqual(utils.entries({}), []);
    assert.deepEqual(utils.entries([]), []);
  });
  it("checkObject", function () {
    assert.equal(utils.checkObject({}), undefined);
    assert.equal(utils.checkObject([]), undefined);
    assert.throws(() => utils.checkObject(null));
    assert.throws(() => utils.checkObject());
    assert.throws(() => utils.checkObject(""));
  });
  it("isObject", function () {
    assert.ok(utils.isObject({}));
    // review Objects with Null Prototype
    assert.ok(utils.isObject(Object.create(null)));
    assert.equal(utils.isObject([]), false);
    assert.equal(utils.isObject(null), false);
    assert.equal(utils.isObject(), false);
    assert.equal(utils.isObject(""), false);
  });
  it("validCacheSize", function () {
    assert.ok(utils.validCacheSize(-1));
    assert.ok(utils.validCacheSize(0));
    assert.ok(utils.validCacheSize(256));
    assert.ok(utils.validCacheSize(2.0));
    assert.equal(utils.validCacheSize("1"), false);
    assert.equal(utils.validCacheSize(), false);
    assert.equal(utils.validCacheSize(true), false);
    assert.equal(utils.validCacheSize(null), false);
    assert.equal(utils.validCacheSize(NaN), false);
    assert.equal(utils.validCacheSize(-2), false);
  });
  it("checkNotation", function () {
    assert.doesNotThrow(() => utils.checkNotation(""));
    assert.doesNotThrow(() => utils.checkNotation(""));
    assert.doesNotThrow(() => utils.checkNotation(``));
    assert.doesNotThrow(() => utils.checkNotation("a.b.c"));
    assert.throws(() => utils.checkNotation());
    assert.throws(() => utils.checkNotation(false));
  });
  describe("checkNotation Brackets", function () {
    it("Throws", function () {
      assert.throws(() => utils.checkNotation("a[[[["));
      assert.throws(() => utils.checkNotation("a["));
      assert.throws(() => utils.checkNotation("a]"));
      assert.throws(() => utils.checkNotation("["));
      assert.throws(() => utils.checkNotation("]"));
      assert.throws(() => utils.checkNotation("[]]]]]]]]]]]]]]]]]]]]]]]]]"));
    });
    it("NotThrows", function () {
      assert.doesNotThrow(() => utils.checkNotation("a[0]"));
      assert.doesNotThrow(() => utils.checkNotation("[]"));
      assert.doesNotThrow(() => utils.checkNotation("a[[[[]]]]"));
    });
  });
  describe("checkNotation Quotes", function () {
    it("Throws", function () {
      assert.throws(() => utils.checkNotation("'"));
      assert.throws(() => utils.checkNotation("`"));
      assert.throws(() => utils.checkNotation('"'));
      assert.throws(() => utils.checkNotation("a.b'"));
      assert.throws(() => utils.checkNotation("a.b`"));
      assert.throws(() => utils.checkNotation('a.b"'));
      assert.throws(() => utils.checkNotation("'"));
      assert.throws(() => utils.checkNotation("`"));
      assert.throws(() => utils.checkNotation('"'));
      assert.throws(() => utils.checkNotation("'a.b"));
      assert.throws(() => utils.checkNotation("`a.b"));
      assert.throws(() => utils.checkNotation('"a.b'));
    });
    it("NotThrows", function () {
      assert.doesNotThrow(() => utils.checkNotation("''"));
      assert.doesNotThrow(() => utils.checkNotation("``"));
      assert.doesNotThrow(() => utils.checkNotation('""'));
      assert.doesNotThrow(() => utils.checkNotation("'a.b'"));
      assert.doesNotThrow(() => utils.checkNotation("`a.b`"));
      assert.doesNotThrow(() => utils.checkNotation('"a.b"'));

      assert.doesNotThrow(() => utils.checkNotation(`["a'b"]`));
      assert.doesNotThrow(() => utils.checkNotation(`['a"b']`));
      assert.doesNotThrow(() => utils.checkNotation(`['a"""b']`));
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
