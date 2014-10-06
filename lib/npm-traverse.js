"use strict";

var _ = require("lodash");
var fs = require("fs");
var path = require("path");

function getPkgInfo(p) {
  try {
    return JSON.parse(fs.readFileSync(path.join(p, "package.json"), "utf-8"));
  } catch (e) {
    return undefined;
  }
}

function traverseDependenciesImpl(p, f) {
  var pkgInfo = getPkgInfo(p);
  if (!pkgInfo) {
    return {};
  }

  var data = f(pkgInfo);
  var deps;
  try {
    deps = _.filter(fs.readdirSync(path.join(p, "node_modules")), function (dep) {
      return dep !== ".bin";
    });
  } catch (e) {
    deps = [];
  }

  var rec = _.zipObject(_.map(deps, function (dep) {
    return [dep, traverseDependenciesImpl(path.join(p, "node_modules", dep), f)];
  }));

  return _.extend({}, data, { dependencies: rec });
}

function traverseDependencies(f) {
  return traverseDependenciesImpl(".", f);
}

module.exports = {
  traverseDependencies: traverseDependencies,
};
