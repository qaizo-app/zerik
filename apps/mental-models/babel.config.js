module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        root: ['./'],
        alias: {
          '@engine': '../../engine',
          '@app':    './',
          '@design': '../../design',
          '@content': '../../content'
        }
      }],
      'react-native-reanimated/plugin'
    ]
  };
};
