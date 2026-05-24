// Expo config plugin: фиксит ошибку сборки iOS
//   "Include of non-modular header inside framework module 'RNFBApp...'"
// которая возникает при @react-native-firebase + use_frameworks: static.
//
// Внедряет CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES=YES в
// post_install блок Podfile — для всех Pod-таргетов. Переживает
// `expo prebuild`, потому что применяется каждый раз при генерации.

const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const MARKER = 'CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES';

const INJECT = `
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |bc|
        bc.build_settings['${MARKER}'] = 'YES'
      end
    end`;

const withFirebaseModularHeaders = (config) => {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfile = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      if (!fs.existsSync(podfile)) {
        console.warn('[with-firebase-modular-headers] Podfile not found at', podfile);
        return config;
      }
      let contents = fs.readFileSync(podfile, 'utf-8');
      if (contents.includes(MARKER)) return config; // already injected

      if (/post_install do \|installer\|/.test(contents)) {
        contents = contents.replace(
          /post_install do \|installer\|/,
          `post_install do |installer|${INJECT}`
        );
      } else {
        // Нет post_install блока — добавим свой перед закрывающим end таргета
        contents += `\npost_install do |installer|${INJECT}\nend\n`;
      }
      fs.writeFileSync(podfile, contents);
      return config;
    },
  ]);
};

module.exports = withFirebaseModularHeaders;
