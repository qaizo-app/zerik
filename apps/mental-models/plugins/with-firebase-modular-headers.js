// Expo config plugin: фиксит ошибку сборки iOS
//   "Include of non-modular header inside framework module 'RNFBApp...'"
// при @react-native-firebase + use_frameworks: static.
//
// Документированный фикс RNFirebase: глобальная переменная
//   $RNFirebaseAsStaticFramework = true
// в начале Podfile — заставляет Firebase-поды собираться как static
// framework корректно. Плюс на всякий случай выставляем
// CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES=YES в post_install.
//
// Переживает `expo prebuild`, т.к. применяется при каждой генерации.

const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const STATIC_FLAG = '$RNFirebaseAsStaticFramework = true';
const CLANG_MARKER = 'CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES';

const CLANG_INJECT = `
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |bc|
        bc.build_settings['${CLANG_MARKER}'] = 'YES'
      end
    end`;

const withFirebaseModularHeaders = (config) => {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfile = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      if (!fs.existsSync(podfile)) {
        console.warn('[with-firebase-modular-headers] Podfile not found:', podfile);
        return config;
      }
      let contents = fs.readFileSync(podfile, 'utf-8');

      // 1. $RNFirebaseAsStaticFramework = true — в самом верху (после первой строки)
      if (!contents.includes(STATIC_FLAG)) {
        const lines = contents.split('\n');
        // вставляем после ведущих require '...' строк, перед platform/target
        let insertAt = 0;
        for (let i = 0; i < lines.length; i++) {
          if (/^\s*(require|#|$)/.test(lines[i])) { insertAt = i + 1; continue; }
          break;
        }
        lines.splice(insertAt, 0, STATIC_FLAG);
        contents = lines.join('\n');
      }

      // 2. CLANG flag в post_install (belt-and-suspenders)
      if (!contents.includes(CLANG_MARKER) && /post_install do \|installer\|/.test(contents)) {
        contents = contents.replace(
          /post_install do \|installer\|/,
          `post_install do |installer|${CLANG_INJECT}`
        );
      }

      fs.writeFileSync(podfile, contents);
      return config;
    },
  ]);
};

module.exports = withFirebaseModularHeaders;
