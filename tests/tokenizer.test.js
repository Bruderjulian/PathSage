const { tokenizePath } = require("../src/lib.js");
const { deepEqual, throws, doesNotThrow } = require("node:assert");
const { describe, it } = require("node:test");

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
    deepEqual(tokenizePath("a.b.c"), ["a", "b", "c"]);
    deepEqual(tokenizePath("abc.1._.$"), ["abc", "1", "_", "$"]);
  });
  it("must handle simple indexes", () => {
    deepEqual(tokenizePath("[0]"), ["0"]);
    deepEqual(tokenizePath("[0][1][2]"), ["0", "1", "2"]);
    deepEqual(tokenizePath('["a"]'), ["a"]);
    deepEqual(tokenizePath('["abc"]'), ["abc"]);
    deepEqual(tokenizePath("['a']"), ["a"]);
    deepEqual(tokenizePath("['abc']"), ["abc"]);
  });
  it("must handle complex indexes", () => {
    deepEqual(tokenizePath('["a.b"]'), ["a.b"]);
    deepEqual(tokenizePath('1["a.b"].2'), ["1", "a.b", "2"]);
    deepEqual(tokenizePath('["one two"].last'), ["one two", "last"]);
    deepEqual(tokenizePath(`['1.two.$_'].last`), ["1.two.$_", "last"]);
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
    deepEqual(tokenizePath(`$[ "a'b" ].6[ 0 ]`), ["$", `a'b`, "6", "0"]);
  });

  it("must skip Tokens correctly", () => {
    deepEqual(tokenizePath("a['']['0'][``][`1`]"), ["a", "0", "1"]);
    deepEqual(tokenizePath('a[""]["0"][``][`1`]'), ["a", "0", "1"]);
    deepEqual(tokenizePath(`a[''][""]['0']["0"]`), ["a", "0", "0"]);
  });
  it("must parse according to the Args", () => {
    deepEqual(tokenizePath("a[0].['0']", false, true), ["a", 0, "0"]);
    deepEqual(tokenizePath("a[NaN].['0']", false, true), ["a", "NaN", 0]);
    deepEqual(tokenizePath("a[0].['0']", false, false), ["a", "0", "0"]);
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
