"use strict";

var _ = require("lodash");
var fs = require("fs");
var path = require("path");

var licenseLookupData ={
  "Apache-2.0": [
    "Apache 2",
    "Apache 2.0",
    "Apache License 2.0",
    "Apache Public License (version 2)",
    "Apache Public License v2",
    "Apache v2",
    "Apache Version 2.0",
    "Apache2",
    "http://www.apache.org/licenses/LICENSE-2.0",
    "apache20",
    "Apache License 2",
    "Apache License V2",
    "Apache License V2.0",
    "Apache License Version 2.0",
    "Apache License v2.0",
    "Apache License, Version 2.0",
    "Apache License, Version 2.0, http://www.apache.org/licenses/LICENSE-2.0",
    "Apache V2.0",
    "Apache Version 2",
    "Apache v2.0",
    "Apache, v2.0",
    "Apache-2",
    "Apache2.0",
    "apache20",
    "APACHE2.0",
    "APACHE2_0",
    "Apache 2 License",
    "Apache 2.0 License",
    "Apache Licence 2.0",
    "Apache Software License 2.0",
    "Apache, Version 2.0",
    "Apache-V2",
    "Apache-v2",
    "Apache Public License, Version 2",
    "Apache v2 License",
    "http://www.apache.org/licenses/LICENSE-2.0.txt",
    "APACHE LICENCE V2",
    "apache2 actually",
    "Apache License Version 2",
    "Apache-v2.0",
    "ApacheV2",
    "Apachev2",
    "APACHEv2",
    "Apache License Version 2",
    "Apache-v2.0",
    "ApacheV2",
    "Apachev2",
  ],
  "ISC": [
    "ISC (http://www.isc.org/software/license)",
    "ISC License",
  ],
  "BSD": [
    "BSD*",
    "\"BSD\""
  ],
  "BSD-3-Clause": [
    "BSD-3",
    "BSD 3-Clause",
    "3-clause BSD",
    "BSD3",
    "BSD 3",
    "BSD 3-Clause License",
    "BSD New",
    "new BSD",
    "New BSD License",
    "New-BSD",
    "BS3 3-Clause",
    "Standard 3-clause BSD",
  ],
  "BSD-2-Clause": [
    "BSD2",
    "BSD-2",
    "BSD 2-clause license",
    "BSD-2-clause",
    "BSD 2-Clause",
    "BSD 2-clause",
    "2-clause BSD",
    "BSD 2 Clause",
    "BSD-2 Clause",
    "Simplified BSD License",
  ],
  "MITNFA": [
    "MIT +no-false-attribs",
  ],
  "MIT": [
    "MIT (http://mootools.net/license.txt)",
    "http://opensource.org/licenses/MIT",
    "MIT License (MIT)",
    "The MIT Licence",
    "The MIT License",
    "The MIT License (MIT)",
    "MIT / http://rem.mit-license.org",
    "MIT (Expat)",
    "MIT License",
    "MIT (ricardo.mit-license.org)",
    "MIT Expat",
    "MIT License - http://opensource.org/licenses/MIT",
    "MIT License, http://www.opensource.org/licenses/MIT",
    "MIT Licensed. http://www.opensource.org/licenses/mit-license.php",
    "MIT+BSD Dual License",
    "MIT-License",
    "MIT Licence",
    "MIT, Copyright (c) 2013 Michael Schoonmaker",
    "MIT / http://www.highcharts.com/license/",
    "MIT <http://opensource.org/licenses/MIT>",
    "MIT and LGPL",
    "MIT-Expat",
    "Apache License, 2.0",
  ],
  "AGPL-3.0": [
    "AGPL-3",
    "AGPL-3.0",
    "AGPLV3",
    "AGPLv3",
    "Affero GPL v3",
    "AGPL 3.0",
    "AGPL v3",
    "AGPL3",
    "AGPLv3+",
  ],
  "GPL": [
    "GNU General Public License",
    "GNU General Public",
  ],
  "LGPL": [
    "GNU Library General Public License",
    "LGPL+",
    "LPGL", // typo
  ],
  "GPL-2.0": [
    "GPL2",
    "GPLv2",
    "GNU GPL v2",
    "GNU GPLv2",
    "GPL V2",
    "GPL v2",
    "GNU/GPLv2",
    "GNU GPL 2",
    "GPL-2.0+",
    "GPL-v2",
    "GPL2+",
    "GPL V.2",
    "GPLv2 (or later)",
    "GNUv2",
    "GPL 2",
    "GLP v2.0", // typo
  ],
  "GPL-3.0": [
    "GPL3.0",
    "GPL-v3",
    "GPL v3",
    "GPLv3",
    "GPLv3+",
    "GNU GPL v3.0",
    "GNU GPLv3",
    "GNU v3",
    "GNU v3",
    "GPL-3.0+",
    "GPL3",
    "GNU GPL v3",
    "GNU/GPLv3 by Free Software Foundation",
    "GNUv3",
    "GPL 3",
    "GPL 3.0",
    " GPL-3.0+",
    "GPL Version 3",
    "GPL-3",
    "GPL/V3",
    "GPL3.0+",
    "gpl-v3.0",
    "licenses/GPL-3.0",
    "GPL v3.0",
    "GPL v3+",
  ],
  "LGPL-2.1": [
    "LGPL 2.1+",
    "LGPL2.1",
    "LGPL 2.1",
    "LGPL-2.0+",
    "LGPLv2.1",
    "LGPLv2",
    "LGPLv21",
  ],
  "LGPL-3.0": [
    "LGPL v3",
    "LGPL-3.0",
    "LGPLv3",
    "LGPLv3+",
    "LGPLv3.0",
    "LGPL Version 3.0",
    "LGPL-3.0+",
    "LPGL-3.0",
    "LPGLv3",
    "LGPL-3",
    "LGPL3.0",
    "LPGL-3.0",
    "LGPL 3",
    "LGPL3",
    "LGPL3+",
    "LPGL-3.0",
    "LGPL 3.0",
    "LGPL-2.1+",
  ],
  "Artistic-2.0": [
    "Artistic License 2.0",
  ],
  "MPL-1.1": [
  ],
  "MPL-2.0": [
    "MPL 2.0",
    "MPL v2.0",
    "MPLv2",
    "MPL2",
    "MPL2.0",
    "MPLv2.0",
    "Mozilla Public License, version 2.0",
  ],
  "Unlicense": [
    "Unlicence",
    "http://unlicense.org/",
    "Public-domain (Unlicense)",
    "The Unlicense",
    "Unlicense <http://unlicense.org/>",
  ],
  "WTFPL": [
    "WTFPL 2",
    "WTFPL – Do What the Fuck You Want to Public License",
    "© 2014 WTFPL – Do What the Fuck You Want to Public License.",
    "WTFPLv2",
    "http://wtfpl.org/",
  ],
  "Zlib": [
  ],
};

var licenseLookup = {
  "Available under MIT and BSD licenses. See [https://github.com/ryanvanoss/node-yui3skins/blob/master/LICENSE].": ["MIT", "BSD-3-Clause"],
  "BSD-2-Clause, MIT": ["BSD-2-Clause", "MIT"],
  "GPL-3, MIT": ["GPL-3.0", "MIT"],
  "gpl-mit": ["GPL", "MIT"],
  "ISC / BSD-2-Clause": ["ISC", "BSD-2-Clause"],
  "ISC / GPL": ["ISC", "GPL"],
  "MIT and LGPL": ["MIT", "LGPL"],
  "MIT, BSD, GPL": ["MIT", "BSD", "GPL"],
  "MIT/Apache 2.0": ["MIT", "Apache-2.0"],
  "MIT/GPL": ["MIT", "GPL"],
  "MIT/GPLv2": ["MIT", "GPL-2.0"],
  "MPL 1.1/LGPL 2.1/GPL 2.0": ["MPL-1.1", "LGPL-2.1", "GPL-2.0"],
  "WTFPL / BSD-3-Clause / MIT / zlib": ["WTFPL", "BSD-3-Clause", "MIT", "Zlib"],
};

_.each(licenseLookupData, function (spellings, license) {
  licenseLookup[license.toUpperCase()] = license;
  _.each(spellings, function (spelling) {
    licenseLookup[spelling.toUpperCase()] = license;
  });
});

function normalizeLicense(license) {
  return licenseLookup[license.toUpperCase().trim()] || licenseLookup[license.toUpperCase().trim().replace(/[^A-Za-z0-9]/g, "")] || license;
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
    licenses: _.chain(license)
      .map(guessLicenseImpl)
      .flatten()
      .map(function (l) {
        // Map BSD to something more precise
        if (l === "BSD") {
          var filesLicense = guessLicenseFiles(pkgInfo, p);
          if (filesLicense === "BSD-2-Clause" || filesLicense === "BSD-3-Clause") {
            return filesLicense;
          }
        }
        return l;
      })
      .sortBy()
      .uniq(true)
      .value(),
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
