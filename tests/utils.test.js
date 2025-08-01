import { equal, ok, throws, doesNotThrow } from "node:assert";
import { describe, it } from "node:test";
import * as utils from "../src/utils.js";

const func = function () {};
function isObject(o) {
  return !utils.isNotObjectLike(o) && !utils.isArray(o);
}

describe("utils", async function () {
  it("isArray", function () {
    ok(utils.isArray([]));
    ok(utils.isArray(new Array()));
    ok(utils.isArray(new Array(2)));
    equal(utils.isArray(), false);
    equal(utils.isArray(true), false);
    equal(utils.isArray(false), false);
    equal(utils.isArray(1), false);
    equal(utils.isArray(undefined), false);
    equal(utils.isArray(NaN), false);
    equal(utils.isArray(""), false);
    equal(utils.isArray(arguments), false);
    equal(utils.isArray({}), false);
    equal(utils.isArray(new Object()), false);
    equal(utils.isArray(Object.create(null)), false);
    equal(utils.isArray(func), false);
    equal(utils.isArray(Symbol([])), false);
    equal(utils.isArray(Symbol({})), false);
    equal(utils.isArray(Symbol("")), false);
    equal(utils.isArray(Symbol(1)), false);
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
  it("checkObject", function () {
    doesNotThrow(() => utils.checkObject({}));
    doesNotThrow(() => utils.checkObject([]));
    doesNotThrow(() => utils.checkObject(new Array()), false);
    doesNotThrow(() => utils.checkObject(new Object()), false);
    doesNotThrow(() => utils.checkObject(new Object({})), false);
    doesNotThrow(() => utils.checkObject(new Object(arguments)), false);
    doesNotThrow(() => utils.checkObject(Object.create(null)));
    throws(() => utils.checkObject(Object));
    throws(() => utils.checkObject());
    throws(() => utils.checkObject(""));
    throws(() => utils.checkObject(1));
    throws(() => utils.checkObject(true));
    throws(() => utils.checkObject(false));
    throws(() => utils.checkObject(NaN));
    throws(() => utils.checkObject(null));
    throws(() => utils.checkObject(undefined));
    throws(() => utils.checkObject(func));
    throws(() => utils.checkObject(Symbol({})));
    throws(() => utils.checkObject(Symbol([])));
    throws(() => utils.checkObject(Symbol("")));
    throws(() => utils.checkObject(Symbol()));
    throws(() => utils.checkObject(BigInt(1)));
  });
  it("isNotObjectLike", function () {
    equal(utils.isNotObjectLike({}), false);
    equal(utils.isNotObjectLike([]), false);
    equal(utils.isNotObjectLike(new Array()), false);
    equal(utils.isNotObjectLike(new Object()), false);
    equal(utils.isNotObjectLike(new Object({})), false);
    equal(utils.isNotObjectLike(new Object(arguments)), false);
    equal(utils.isNotObjectLike(Object.create(null)), false);
    ok(utils.isNotObjectLike(Object));
    ok(utils.isNotObjectLike());
    ok(utils.isNotObjectLike(""));
    ok(utils.isNotObjectLike(1));
    ok(utils.isNotObjectLike(true));
    ok(utils.isNotObjectLike(false));
    ok(utils.isNotObjectLike(NaN));
    ok(utils.isNotObjectLike(null));
    ok(utils.isNotObjectLike(undefined));
    ok(utils.isNotObjectLike(func));
    ok(utils.isNotObjectLike(Symbol({})));
    ok(utils.isNotObjectLike(Symbol([])));
    ok(utils.isNotObjectLike(Symbol("")));
    ok(utils.isNotObjectLike(Symbol()));
    ok(utils.isNotObjectLike(BigInt(1)));
  });
  it("isObject", function () {
    ok(isObject({}));
    equal(isObject([]), false);
    equal(isObject(new Array()), false);
    ok(isObject(new Object()));
    ok(isObject(new Object({})));
    ok(isObject(new Object(arguments)));
    ok(isObject(Object.create(null)));
    equal(isObject(Object), false);
    equal(isObject(), false);
    equal(isObject(""), false);
    equal(isObject(1), false);
    equal(isObject(true), false);
    equal(isObject(false), false);
    equal(isObject(NaN), false);
    equal(isObject(null), false);
    equal(isObject(undefined), false);
    equal(isObject(func), false);
    equal(isObject(Symbol({})), false);
    equal(isObject(Symbol([])), false);
    equal(isObject(Symbol("")), false);
    equal(isObject(Symbol()), false);
    equal(isObject(BigInt(1)), false);
  });
  it("validCacheSize", function () {
    equal(utils.validCacheSize(-2), false);
    ok(utils.validCacheSize(-1));
    ok(utils.validCacheSize(0));
    ok(utils.validCacheSize(1));
    ok(utils.validCacheSize(256));
    equal(utils.validCacheSize("-2"), false);
    ok(utils.validCacheSize("-1"));
    ok(utils.validCacheSize("0"));
    ok(utils.validCacheSize("1"));
    ok(utils.validCacheSize("256"));

    equal(utils.validCacheSize(-2.0), false);
    equal(utils.validCacheSize(-1.0), true);
    equal(utils.validCacheSize(0.0), true);
    equal(utils.validCacheSize(1.0), true);
    equal(utils.validCacheSize(256.0), true);
    equal(utils.validCacheSize(-1.1), false);
    equal(utils.validCacheSize(0.1), false);
    equal(utils.validCacheSize(1.1), false);
    equal(utils.validCacheSize(256.1), false);
    equal(utils.validCacheSize(Number.MAX_SAFE_INTEGER - 1), true);
    equal(utils.validCacheSize(Number.MAX_SAFE_INTEGER), true);
    equal(utils.validCacheSize(Number.MAX_SAFE_INTEGER + 1), false);
    equal(utils.validCacheSize("-2.0"), false);
    equal(utils.validCacheSize("-1.0"), true);
    equal(utils.validCacheSize("0.0"), true);
    equal(utils.validCacheSize("1.0"), true);
    equal(utils.validCacheSize("256.0"), true);
    equal(utils.validCacheSize("-1.1"), false);
    equal(utils.validCacheSize("0.1"), false);
    equal(utils.validCacheSize("1.1"), false);
    equal(utils.validCacheSize("256.1"), false);

    equal(utils.validCacheSize(), false);
    equal(utils.validCacheSize(undefined), false);
    equal(utils.validCacheSize(null), false);
    equal(utils.validCacheSize(NaN), false);
    equal(utils.validCacheSize(true), false);
    equal(utils.validCacheSize(false), false);
    equal(utils.validCacheSize(""), false);
    equal(utils.validCacheSize([]), false);
    equal(utils.validCacheSize({}), false);

    equal(utils.validCacheSize(NaN), false);
    equal(utils.validCacheSize(new Number(1)), false);
    equal(utils.validCacheSize(0x1), true);
    equal(utils.validCacheSize(0b1), true);
    equal(utils.validCacheSize(0o1), true);
    equal(utils.validCacheSize(BigInt(1)), false);
    equal(utils.validCacheSize(Symbol(256)), false);
    equal(utils.validCacheSize(new Object(1)), false);
    equal(utils.validCacheSize(new Array()), false);
    equal(utils.validCacheSize(Object.create(null)), false);
  });
  /*
  it("checkNotation", function () {
    doesNotThrow(() => utils.checkNotation(""));
    doesNotThrow(() => utils.checkNotation(""));
    doesNotThrow(() => utils.checkNotation(``));
    doesNotThrow(() => utils.checkNotation("a.b.c"));
    throws(() => utils.checkNotation());
    throws(() => utils.checkNotation(false));
    throws(() => utils.checkNotation(true));
    throws(() => utils.checkNotation(undefined));
    throws(() => utils.checkNotation(NaN));
    throws(() => utils.checkNotation(1));
    throws(() => utils.checkNotation([]));
    throws(() => utils.checkNotation({}));
    throws(() => utils.checkNotation(Object.create(null)));
    throws(() => utils.checkNotation(new Array()));
    throws(() => utils.checkNotation(arguments));
    throws(() => utils.checkNotation(new Object()));
    throws(() => utils.checkNotation(Symbol("")));
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
  */
});
