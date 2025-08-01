import { tokenizePath } from "../src/lib.js";
import { deepEqual, throws, doesNotThrow } from "node:assert";
import { describe, it } from "node:test";

describe("tokenizePath", () => {
  it("must handle an empty string", () => {
    deepEqual(tokenizePath(""), []);
  });
  it("must handle short syntax", () => {
    deepEqual(tokenizePath("a"), ["a"]); // one small letter
    deepEqual(tokenizePath("Z"), ["Z"]); // one capital letter
    deepEqual(tokenizePath("_"), ["_"]); // underscore
    deepEqual(tokenizePath("$"), ["$"]); // dollar
    deepEqual(tokenizePath("0"), ["0"]); // zero
  });
  it("must handle a simple path", () => {
    deepEqual(tokenizePath("a.b.c"), ["c", "b", "a"]);
    deepEqual(tokenizePath("abc.1._.$"), ["$", "_", "1", "abc"]);
  });
  it("must handle simple indexes", () => {
    deepEqual(tokenizePath("[0]"), ["0"]);
    deepEqual(tokenizePath("[0][1][2]"), ["2", "1", "0"]);
    deepEqual(tokenizePath('["a"]'), ["a"]);
    deepEqual(tokenizePath('["abc"]'), ["abc"]);
    deepEqual(tokenizePath("['a']"), ["a"]);
    deepEqual(tokenizePath("['abc']"), ["abc"]);
    deepEqual(tokenizePath("a[NaN].['0']", false, true), ["0", "NaN", "a"]);
  });
  it("must handle complex indexes", () => {
    deepEqual(tokenizePath('["a.b"]'), ["a.b"]);
    deepEqual(tokenizePath('1["a.b"].2'), ["2", "a.b", "1"]);
    deepEqual(tokenizePath('["one two"].last'), ["last", "one two"]);
    deepEqual(tokenizePath(`['1.two.$_'].last`), ["last", "1.two.$_"]);
  });
  it("must skip extra spaces correctly", () => {
    deepEqual(tokenizePath('[ "a.b" ]'), ["a.b"]);
    deepEqual(tokenizePath('[ " a . b " ]'), [" a . b "]);
    deepEqual(tokenizePath("[ 0 ]"), ["0"]);
    deepEqual(tokenizePath("[ 123 ]"), ["123"]);
  });
  it("must handle index with quotes", () => {
    deepEqual(tokenizePath(`["a'b"]`), [`a'b`]);
    deepEqual(tokenizePath(`['a"b']`), [`a"b`]);
  });
  it("must handle any complex scenario", () => {
    deepEqual(tokenizePath(`$[ "a'b" ].6[ 0 ]`), ["0", "6", "a'b", "$"]);
  });

  it("must skip Tokens correctly", () => {
    deepEqual(tokenizePath("a['']['0'][``][`1`]"), ["1", "0", "a"]);
    deepEqual(tokenizePath('a[""]["0"][``][`1`]'), ["1", "0", "a"]);
    deepEqual(tokenizePath(`a[''][""]['0']["0"]`), ["0", "0", "a"]);
  });
  it("must parse according to the Args", () => {
    throws(() => tokenizePath("a.constructor.b", false));
    throws(() => tokenizePath("a.__proto__.b", false));
    throws(() => tokenizePath("a.prototype.b", false));
    throws(() => tokenizePath("a.this.b", false));
    doesNotThrow(() => tokenizePath("a.constructor.b", true));
    doesNotThrow(() => tokenizePath("a.__proto.b", true));
    doesNotThrow(() => tokenizePath("a.prototype.b", true));
    doesNotThrow(() => tokenizePath("a.this.b", true));
  });
});
