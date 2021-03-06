#!/usr/bin/env node
"use strict";

var MANIFEST_FILE = "npm-freeze-manifest.json";

var _ = require("lodash");
var chalk = require("chalk");
var fs = require("fs");
var path = require("path");
var program = require("commander");
var utils = require("../lib/npm-freeze.js");
var npmTraverse = require("../lib/npm-traverse.js");

var version = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf-8")).version;

function traverseDependencies() {
  return npmTraverse.traverseDependencies(function (pkgInfo) {
    return { version: pkgInfo.version };
  });
}

var colors = {
  major: "red",
  minor: "yellow",
  patch: "cyan",
  build: "magenta",
  prerelease: "magenta",
};

function printDiff(diff, pkg, indent, verbose, level) {
  var aVersion = diff.versions[0];
  var bVersion = diff.versions[1];
  if (aVersion !== bVersion) {
    var diffLevel = utils.symSemverDiff(aVersion, bVersion);
    var print;
    switch (level) {
      case "major": print = diffLevel === "major"; break;
      case "minor": print = diffLevel === "major" || diffLevel === "minor"; break;
      default: print = !diffLevel;
    }
    if (print || !utils.diffZero(diff, level)) {
      console.log(utils.indentBlock(indent) + pkg, chalk[colors[diffLevel]](aVersion + " -> " + bVersion));
    }
  } else if (verbose || !utils.diffZero(diff, level)) {
    console.log(utils.indentBlock(indent) + pkg, chalk.grey(aVersion));
  }

  _.each(diff.dependencies, function (depDiff, subpkg) {
    printDiff(depDiff, subpkg, indent + 1, verbose, level);
  });
}

function rootPackageName() {
  try {
    return JSON.parse(fs.readFileSync("package.json", "utf-8")).name;
  } catch (e) {
    return "@";
  }
}

program
  .version(version);

program
  .command("manifest")
  .description("generate manifest from installed node_modules tree")
  .action(function () {
    if (!fs.existsSync(MANIFEST_FILE)) {
      var dependencies = traverseDependencies();
      var json = JSON.stringify(dependencies, null, 2);
      fs.writeFile(MANIFEST_FILE, json);
    } else {
      console.error(MANIFEST_FILE + " already exists");
    }
  });

program
  .command("check")
  .description("check that installed dependencies are according to manifest")
  .option("-v, --verbose", "More verbose output")
  .option("--major", "Show only major differences")
  .option("--minor", "Show only minor differences")
  .action(function (args) {
    var manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf-8"));
    var dependencies = traverseDependencies();
    if (_.isEqual(manifest, dependencies)) {
      console.log(chalk.green("OK"));
    } else {
      console.log(chalk.red("There are differing versions installed"));
      var level;
      if (args.minor) { level = "minor"; }
      if (args.major) { level = "major"; }
      var diff = utils.calculateDiff(manifest, dependencies);
      printDiff(diff, rootPackageName(), 0, args.verbose, level);
      process.exit(1);
    }
  });

program
  .command("*")
  .description("Print help")
  .action(function () {
    console.log(program.help());
  });

program.parse(process.argv);
