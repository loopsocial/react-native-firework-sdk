const path = require('path');
const pkg = require('../package.json');

module.exports = {
  project: {
    ios: {
      automaticPodsInstallation: true,
    },
  },
  dependencies: {
    [pkg.name]: {
      root: path.join(__dirname, '..'),
      platforms: {
        // Codegen script incorrectly fails without this
        // So we explicitly specify the platforms with empty object
        ios: {},
        android: {
          // Specify the package name for Android autolinking
          packageInstance: 'new com.fireworksdk.bridge.FireworkSDKPackage()',
          sourceDir: '../android',
        },
      },
    },
  },
};
