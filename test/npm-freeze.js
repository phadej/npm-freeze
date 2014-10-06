/* global describe:true, it:true */
"use strict";

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

  it("returns true when level is 'major' if versions differ only in minor", function () {
    var actual = npmFreeze.diffZero({
      versions: ["0.1.0", "0.2.0"],
      dependencies: {},
    }, "major");

    chai.expect(actual).to.equal(true);
  });

  it("returns false when level is 'major' if versions differ only in major", function () {
    var actual = npmFreeze.diffZero({
      versions: ["1.0.0", "2.0.0"],
      dependencies: {},
    }, "major");

    chai.expect(actual).to.equal(false);
  });

  it("returns true when level is 'minor' if versions differ only in patch", function () {
    var actual = npmFreeze.diffZero({
      versions: ["0.0.0", "0.0.1"],
      dependencies: {},
    }, "minor");

    chai.expect(actual).to.equal(true);
  });

  it("returns false when level is 'minor' if versions differ only in minor", function () {
    var actual = npmFreeze.diffZero({
      versions: ["0.1.0", "0.2.0"],
      dependencies: {},
    }, "minor");

    chai.expect(actual).to.equal(false);
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

  it("level minor: returns true if all dependencies differ only in patch", function () {
    var actual = npmFreeze.diffZero({
      versions: ["0.0.0", "0.0.0"],
      dependencies: {
        "foo": {
          versions: ["0.0.0", "0.0.1"],
          dependencies: {},
        },
      },
    }, "minor");

    chai.expect(actual).to.equal(true);
  });

  it("level minor: returns false if all dependencies differ only in minor too", function () {
    var actual = npmFreeze.diffZero({
      versions: ["0.0.0", "0.0.0"],
      dependencies: {
        "foo": {
          versions: ["0.1.0", "0.2.0"],
          dependencies: {},
        },
      },
    }, "minor");

    chai.expect(actual).to.equal(false);
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

describe("symSemverDiff", function () {
  it("returns major if first version is majorly larger", function () {
    chai.expect(npmFreeze.symSemverDiff("2.0.0", "1.0.0")).to.equal("major");
  });
  it("returns minor if first version is minorly larger", function () {
    chai.expect(npmFreeze.symSemverDiff("1.1.0", "1.0.0")).to.equal("minor");
  });
  it("returns patch if first version is patchly larger", function () {
    chai.expect(npmFreeze.symSemverDiff("1.0.1", "1.0.0")).to.equal("patch");
  });
  it("returns 'major' if the first one is falsy", function () {
    chai.expect(npmFreeze.symSemverDiff("", "1.0.0")).to.equal("major");
  });
  it("returns 'major' if the second one is falsy", function () {
    chai.expect(npmFreeze.symSemverDiff("1.0.0", "")).to.equal("major");
  });
});
