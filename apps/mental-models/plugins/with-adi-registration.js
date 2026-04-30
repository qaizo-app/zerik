// Expo config plugin: копирует assets/adi-registration.properties в
// android/app/src/main/assets/ во время prebuild. Нужно для верификации
// владения package name в Google Play Console (Android Developer Verification).
//
// Без этого плагина файл из assets/ попадает только в JS-бандл и не виден
// нативной части APK, которую Google Play проверяет.

const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withAdiRegistration = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const platformProjectRoot = config.modRequest.platformProjectRoot;

      const src  = path.join(projectRoot, 'assets', 'adi-registration.properties');
      const dest = path.join(platformProjectRoot, 'app', 'src', 'main', 'assets', 'adi-registration.properties');

      if (!fs.existsSync(src)) {
        console.warn('[with-adi-registration] source file not found at', src);
        return config;
      }

      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      console.log('[with-adi-registration] copied to', dest);

      return config;
    }
  ]);
};

module.exports = withAdiRegistration;
