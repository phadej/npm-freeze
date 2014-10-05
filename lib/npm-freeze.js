"use strict";

var _ = require("lodash");
var semverDiff = require("semver-diff");

function indentBlock(indent) {
  var res = "";
  for (var i = 0; i < indent; i++) {
    res += "  ";
  }
  return res;
}

function symSemverDiff(versionA, versionB) {
  if (!versionA || !versionB) {
    return "major";
  }
  return semverDiff(versionA, versionB) || semverDiff(versionB, versionA);
}

function calculateDiff(a, b) {
  var aVersion = (a && a.version) || "";
  var bVersion = (b && b.version) || "";

  var versions = [aVersion, bVersion];

  var aDependencies = (a && a.dependencies) || {};
  var bDependencies = (b && b.dependencies) || {};
  var subpackages = _.uniq(_.sortBy(_.union(_.keys(aDependencies), _.keys(bDependencies))), true);

  var dependencies = _.zipObject(_.map(subpackages, function (pkg) {
    return [pkg, calculateDiff(aDependencies[pkg], bDependencies[pkg])];
  }));

  return {
    versions: versions,
    dependencies: dependencies,
  };
}

function diffZero(diff, level) {
  var versDiff = symSemverDiff(diff.versions[0], diff.versions[1]);
  var vers;
  switch (level) {
    case "major": vers = versDiff !== "major"; break;
    case "minor": vers = versDiff !== "major" && versDiff !== "minor"; break;
    default: vers = !versDiff; break;
  }

  var dependencies = _.every(diff.dependencies, function (subDiff) {
    return diffZero(subDiff, level);
  });
  return vers && dependencies;
}

module.exports = {
  indentBlock: indentBlock,
  calculateDiff: calculateDiff,
  diffZero: diffZero,
  symSemverDiff: symSemverDiff,
};
