/* global describe:true, it:true */

"use strict";

var fs = require("fs");
var chai = require("chai");
var npmLicenseCheck = require("../lib/npm-license-check.js");

describe("license normalize", function () {
  it("normalizes some common license names", function () {
    chai.expect(npmLicenseCheck.normalizeLicense("Apache 2.0")).to.equal("Apache-2.0");
    chai.expect(npmLicenseCheck.normalizeLicense("MIT")).to.equal("MIT");
  });
});

describe("markLicenses", function () {
  it("marked true if subtree have only markedLicenses", function () {
    var actual = npmLicenseCheck.markLicenses({
      licenses: ["MIT"],
      dependencies: {
        foo: {
          licenses: ["BSD-2-Clause"],
          dependencies: {},
        },
        bar: {
          licenses: ["BSD-3-Clause"],
          dependencies: {},
        },
      },
    }, ["MIT", "BSD-2-Clause", "BSD-3-Clause"]);

    var expected = {
      licenses: ["MIT"],
      marked: true,
      dependencies: {
        foo: {
          licenses: ["BSD-2-Clause"],
          marked: true,
          dependencies: {},
        },
        bar: {
          licenses: ["BSD-3-Clause"],
          marked: true,
          dependencies: {},
        },
      },
    };

    chai.expect(actual).to.deep.equal(expected);
  });

  it("marked false if subtree have only markedLicenses", function () {
    var actual = npmLicenseCheck.markLicenses({
      licenses: ["MIT"],
      dependencies: {
        foo: {
          licenses: ["BSD-2-Clause"],
          dependencies: {},
        },
        bar: {
          licenses: ["BSD-3-Clause"],
          dependencies: {},
        },
      },
    }, ["BSD-3-Clause"]);

    var expected = {
      licenses: ["MIT"],
      marked: false,
      dependencies: {
        foo: {
          licenses: ["BSD-2-Clause"],
          marked: false,
          dependencies: {},
        },
        bar: {
          licenses: ["BSD-3-Clause"],
          marked: true,
          dependencies: {},
        },
      },
    };

    chai.expect(actual).to.deep.equal(expected);
  });
});

describe("guessLicenses", function () {
  it("accepts data from different fields", function () {
    chai.expect(npmLicenseCheck.guessLicenses({ license: "MIT"})).to.deep.equal({ licenses: ["MIT"] });
    chai.expect(npmLicenseCheck.guessLicenses({ licenses: "MIT"})).to.deep.equal({ licenses: ["MIT"] });
    chai.expect(npmLicenseCheck.guessLicenses({ licence: "MIT"})).to.deep.equal({ licenses: ["MIT"] });
    chai.expect(npmLicenseCheck.guessLicenses({ licences: "MIT"})).to.deep.equal({ licenses: ["MIT"] });
  });

  it("accepts data from array", function () {
    chai.expect(npmLicenseCheck.guessLicenses({ licenses: ["MIT"]})).to.deep.equal({ licenses: ["MIT"] });
  });

  it("accepts data from object", function () {
    chai.expect(npmLicenseCheck.guessLicenses({ license: { type: "MIT" }})).to.deep.equal({ licenses: ["MIT"] });
  });

  it("returns unknown in other cases", function () {
    chai.expect(npmLicenseCheck.guessLicenses({ license: {}})).to.deep.equal({ licenses: ["UNKNOWN"] });
  });

  it("guesses license from readme field", function () {
    chai.expect(npmLicenseCheck.guessLicenses({
      readme: fs.readFileSync("test/fixtures/dir-readme/README", "utf-8"),
    }, "test/fixtures/dir-readme")).to.deep.equal({ licenses: ["MIT"] });

    chai.expect(npmLicenseCheck.guessLicenses({
      readme: fs.readFileSync("test/fixtures/dir-readme/README", "utf-8"),
    })).to.deep.equal({ licenses: ["MIT"] });
  });

  it("guesses license from readme file", function () {
    chai.expect(npmLicenseCheck.guessLicenses({}, "test/fixtures/dir-readme")).to.deep.equal({ licenses: ["MIT"] });
    chai.expect(npmLicenseCheck.guessLicenses({}, "test/fixtures/dir-readme-no-guess")).to.deep.equal({ licenses: ["UNKNOWN"] });
    chai.expect(npmLicenseCheck.guessLicenses({}, "test/fixtures/dir-readme-broken")).to.deep.equal({ licenses: ["UNKNOWN"] });
  });

  it("guesses license from license file", function () {
    chai.expect(npmLicenseCheck.guessLicenses({}, "test/fixtures/dir-license")).to.deep.equal({ licenses: ["MIT"] });
  });

  it("tries to refine BSD license", function () {
    // TODO: in this cases we could inform about error
    chai.expect(npmLicenseCheck.guessLicenses({ license: "BSD" }, "test/fixtures/dir-license")).to.deep.equal({ licenses: ["BSD"] });
    chai.expect(npmLicenseCheck.guessLicenses({ license: "BSD" }, "test/fixtures/dir-bsd-license")).to.deep.equal({ licenses: ["BSD-3-Clause"] });
  });
});

describe("text recognizer", function () {
  it("recognizes istanbul license", function () {
    var contents = fs.readFileSync("test/fixtures/istanbul-license", "utf-8");
    var license = npmLicenseCheck.guessLicenseContents(contents);

    chai.expect(license).to.equal("BSD-3-Clause");
  });

  it("recognizes uglify-js license", function () {
    var contents = fs.readFileSync("test/fixtures/uglify-js-license", "utf-8");
    var license = npmLicenseCheck.guessLicenseContents(contents);

    chai.expect(license).to.equal("BSD-2-Clause");
  });

  it("recognizes commander license", function () {
    var contents = fs.readFileSync("test/fixtures/commander-license", "utf-8");
    var license = npmLicenseCheck.guessLicenseContents(contents);

    chai.expect(license).to.equal("MIT");
  });
});
