"use strict";

var _ = require("lodash");
var fs = require("fs");
var path = require("path");

var licenseLookup = {
  "MIT/X11": "MIT",
  "BSD*": "BSD",
  "Apache 2.0": "Apache-2.0",
  "Apache License 2.0": "Apache-2.0",
};

function normalizeLicense(license) {
  return licenseLookup[license] || license;
}

function guessLicenseImpl(license) {
  if (_.isString(license)) {
    return normalizeLicense(license);
  } else if (license && license.type) {
    return normalizeLicense(license.type);
  } else {
    // console.error("Unknown license:", JSON.stringify(license));
    return "UNKNOWN";
  }
}

var licenseTexts = {
  "MIT": "mit.txt",
  "BSD-3-Clause": "bsd3.txt",
  "BSD-2-Clause": "bsd2.txt",
  "ISC": "isc.txt",
};

var regexes = _.mapValues(licenseTexts, function (filename) {
  var text = fs.readFileSync(path.join(__dirname, "..", "data", filename), "utf-8");
  var regexText = text.replace(/[^A-Za-z]+/g, "[\\s\\S]*");
  return new RegExp(regexText, "i");
});

function guessLicenseContents(contents) {
  var keys = _.keys(regexes);
  var len = keys.length;
  for (var i = 0; i < len; i++) {
    var regexp = regexes[keys[i]];
    if (contents.match(regexp)) {
      return keys[i];
    }
  }
}

function guessLicenseFiles(pkgInfo, p) {
  var readmeContents = pkgInfo.readme;
  var fileContents = !p ? [] : _.chain(fs.readdirSync(p))
    .filter(function (f) {
      return f.match(/readme/i) || f.match(/license/i);
    })
    .map(function (f) {
      try {
        return fs.readFileSync(path.join(p, f), "utf-8");
      } catch (e) {
        return null;
      }
    })
    .value();

  var contents = _.compact([readmeContents].concat(fileContents));

  var len = contents.length;
  for (var i = 0; i < len; i++) {
    var license = guessLicenseContents(contents[i]);
    if (license) {
      return license;
    }
  }
}

function guessLicenses(pkgInfo, p) {
  var license = pkgInfo.license || pkgInfo.licenses || pkgInfo.licence || pkgInfo.licences || [];

  if (!_.isArray(license)) {
    license = [license];
  }

  if (license.length === 0) {
    var readmeLicense = guessLicenseFiles(pkgInfo, p);
    if (readmeLicense) {
      license = [readmeLicense];
    }
  }

  if (license.length === 0) {
    return {
      licenses: ["UNKNOWN"],
    };
  }

  return {
    licenses: license.map(guessLicenseImpl).map(function (l) {
      // Map BSD to something more precise
      if (l === "BSD") {
        var filesLicense = guessLicenseFiles(pkgInfo, p);
        if (filesLicense === "BSD-2-Clause" || filesLicense === "BSD-3-Clause") {
          return filesLicense;
        }
      }
      return l;
    }),
  };
}

function markLicenses(licenseTree, markedLicenses) {
  var dependencies = _.mapValues(licenseTree.dependencies, function (subTree) {
    return markLicenses(subTree, markedLicenses);
  });

  var sub = _.every(dependencies, function (subTree) {
    return subTree.marked === true;
  });

  var curr = _.intersection(licenseTree.licenses, markedLicenses).length !== 0;

  return _.extend({
    licenses: licenseTree.licenses,
    marked: curr && sub,
    dependencies: dependencies,
  });
}

module.exports = {
  guessLicenses: guessLicenses,
  markLicenses: markLicenses,
  normalizeLicense: normalizeLicense,
  guessLicenseContents: guessLicenseContents,
};
