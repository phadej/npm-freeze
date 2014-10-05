/* global describe:true, it:true */

var npmFreeze = require("../lib/npm-freeze.js");
var jsc = require("jsverify");
var assert = require("assert");
var chai = require("chai");

describe("indentBlock", function () {
  it("returns 2*n spaces", function () {
    jsc.assert(jsc.forall("nat", function (n) {
      var indent = npmFreeze.indentBlock(n);
      return indent.length === 2 * n && !!indent.match(/^ *$/);
    }));
  });
});

describe("diffZero", function () {
  it("returns false if versions differ", function () {
    assert(!npmFreeze.diffZero({
      versions: ["0.0.0", "0.0.1"],
      dependencies: {},
    }));
  });

  it("returns false if some dependencies differ", function () {
    assert(!npmFreeze.diffZero({
      versions: ["0.0.0", "0.0.0"],
      dependencies: {
        "foo": {
          versions: ["0.1.0", "0.2.0"],
          dependencies: {},
        },
      },
    }));
  });

  it("returns true for identical objects", function () {
    // TODO: use jsverify
    assert(npmFreeze.diffZero({
      versions: ["0.0.0", "0.0.0"],
      dependencies: {
        "foo": {
          versions: ["0.1.0", "0.1.0"],
          dependencies: {},
        },
      },
    }));
  });
});

describe("calculateDiff", function () {
  it("pulls version info", function () {
    var a = { version: "0.0.0" };
    var b = { version: "0.0.1" };
    var actual = npmFreeze.calculateDiff(a, b);
    var expected = {
      versions: ["0.0.0", "0.0.1"],
      dependencies: {},
    };
    chai.expect(actual).to.deep.equal(expected);
  });

  it("pulls empty version info", function () {
    var a = {};
    var b = {};
    var actual = npmFreeze.calculateDiff(a, b);
    var expected = {
      versions: ["", ""],
      dependencies: {},
    };
    chai.expect(actual).to.deep.equal(expected);
  });

  it("compares recursively", function () {
    var a = {
      version: "0.0.0",
      dependencies: {
        fiksi: { version: "1.0.0" },
        foksi: { version: "2.0.0" },
      },
    };
    var b = {
      version: "0.0.1",
      dependencies: {
        fiksi: { version: "1.0.1" },
        fuksi: { version: "3.0.0" },
      },
    };
    var actual = npmFreeze.calculateDiff(a, b);
    var expected = {
      versions: ["0.0.0", "0.0.1"],
      dependencies: {
        fiksi: { versions: ["1.0.0", "1.0.1"], dependencies: {}},
        foksi: { versions: ["2.0.0", ""], dependencies: {}},
        fuksi: { versions: ["", "3.0.0"], dependencies: {}},
      },
    };
    chai.expect(actual).to.deep.equal(expected);
  });
});
