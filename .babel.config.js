export const presets = ['babel-preset-expo'];
export const plugins = [
  [
    'module:react-native-dotenv',
    {
      moduleName: '@env',
      path: '.env',
      blacklist: null,
      whitelist: null,
      safe: false,
      allowUndefined: true
    },
  ],
];