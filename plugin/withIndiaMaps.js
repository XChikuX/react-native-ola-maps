const fs = require('fs');
const path = require('path');
const {
  AndroidConfig,
  withAndroidManifest,
  withAppBuildGradle,
  withDangerousMod,
  withInfoPlist,
  withPodfile,
  withProjectBuildGradle,
  withSettingsGradle,
} = require('@expo/config-plugins');

const MAPPLS_MAVEN = 'https://maven.mappls.com/repository/mappls/';
const MAPPLS_CLASSPATH =
  'classpath("com.mappls.services:mappls-services:1.0.0")';
const MAPPLS_PLUGIN = 'id("com.mappls.services.android")';
const DEFAULT_IOS_MESSAGE =
  'Allow $(PRODUCT_NAME) to access your location while using the app.';
const ANDROID_AUTH_FILE_SUFFIXES = ['a.conf', 'a.olf'];
const IOS_AUTH_FILE_SUFFIXES = ['i.conf', 'i.olf'];

const ensureContains = (source, fragment) =>
  source.includes(fragment) ? source : `${source}\n${fragment}`;

const insertIntoBlock = (source, blockStart, fragment) => {
  if (source.includes(fragment)) {
    return source;
  }

  const index = source.indexOf(blockStart);
  if (index === -1) {
    return ensureContains(source, fragment);
  }

  const insertionPoint = index + blockStart.length;
  return `${source.slice(0, insertionPoint)}\n  ${fragment}${source.slice(
    insertionPoint
  )}`;
};

const withLocationPermissions = (config, options) => {
  config = withAndroidManifest(config, (modConfig) => {
    const permissions = [
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION',
    ];

    if (options.backgroundLocation) {
      permissions.push('android.permission.ACCESS_BACKGROUND_LOCATION');
    }

    permissions.forEach((permission) => {
      AndroidConfig.Permissions.addPermission(modConfig.modResults, permission);
    });

    return modConfig;
  });

  config = withInfoPlist(config, (modConfig) => {
    modConfig.modResults.NSLocationWhenInUseUsageDescription =
      options.iosWhenInUsePermission || DEFAULT_IOS_MESSAGE;

    if (options.backgroundLocation) {
      modConfig.modResults.NSLocationAlwaysAndWhenInUseUsageDescription =
        options.iosAlwaysAndWhenInUseUsageDescription || DEFAULT_IOS_MESSAGE;
    }

    return modConfig;
  });

  return config;
};

const withMapplsNativeSetup = (config, options) => {
  config = withSettingsGradle(config, (modConfig) => {
    modConfig.modResults.contents = ensureContains(
      modConfig.modResults.contents,
      `maven { url '${MAPPLS_MAVEN}' }`
    );
    return modConfig;
  });

  config = withProjectBuildGradle(config, (modConfig) => {
    modConfig.modResults.contents = ensureContains(
      modConfig.modResults.contents,
      MAPPLS_CLASSPATH
    );
    return modConfig;
  });

  config = withAppBuildGradle(config, (modConfig) => {
    modConfig.modResults.contents = insertIntoBlock(
      modConfig.modResults.contents,
      'plugins {',
      MAPPLS_PLUGIN
    );
    return modConfig;
  });

  config = withPodfile(config, (modConfig) => {
    modConfig.modResults.contents = insertIntoBlock(
      modConfig.modResults.contents,
      'post_install do |installer|',
      '$MAPPLS_MAPS.post_install(installer)'
    );
    return modConfig;
  });

  config = withDangerousMod(config, [
    'android',
    async (modConfig) => {
      if (!options.androidConfigFilesDir) {
        return modConfig;
      }

      const sourceDir = path.resolve(
        modConfig.modRequest.projectRoot,
        options.androidConfigFilesDir
      );
      const targetDir = path.join(
        modConfig.modRequest.platformProjectRoot,
        'app'
      );

      if (fs.existsSync(sourceDir)) {
        for (const file of fs.readdirSync(sourceDir)) {
          if (
            ANDROID_AUTH_FILE_SUFFIXES.some((suffix) => file.endsWith(suffix))
          ) {
            fs.copyFileSync(
              path.join(sourceDir, file),
              path.join(targetDir, file)
            );
          }
        }
      }

      return modConfig;
    },
  ]);

  config = withDangerousMod(config, [
    'ios',
    async (modConfig) => {
      if (!options.iosConfigFilesDir) {
        return modConfig;
      }

      const sourceDir = path.resolve(
        modConfig.modRequest.projectRoot,
        options.iosConfigFilesDir
      );
      const targetDir = modConfig.modRequest.platformProjectRoot;

      if (fs.existsSync(sourceDir)) {
        for (const file of fs.readdirSync(sourceDir)) {
          if (IOS_AUTH_FILE_SUFFIXES.some((suffix) => file.endsWith(suffix))) {
            fs.copyFileSync(
              path.join(sourceDir, file),
              path.join(targetDir, file)
            );
          }
        }
      }

      return modConfig;
    },
  ]);

  return config;
};

const withIndiaMaps = (config, props = {}) => {
  const options = {
    backgroundLocation: false,
    iosWhenInUsePermission: DEFAULT_IOS_MESSAGE,
    iosAlwaysAndWhenInUseUsageDescription: DEFAULT_IOS_MESSAGE,
    ...props,
  };

  config = withLocationPermissions(config, options);
  config = withMapplsNativeSetup(config, options);
  return config;
};

module.exports = { withIndiaMaps };
