const assert = require("node:assert");
const { describe, it } = require("node:test");
const utils = require("../src/utils.js");

describe("utils", () => {
  /*
  it("isArray", function () {
    assert.ok(utils.isArray([]));
    assert.ok(utils.isArray(new Array()));
    assert.equal(utils.isArray(arguments), false);
    assert.equal(utils.isArray({}), false);
    assert.equal(utils.isArray(true), false);
    assert.equal(utils.isArray(""), false);
  });
  */
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
