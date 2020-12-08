module.exports = function (api) {
  api.cache(true);
  return {
    exclude: ['node_modules/libram/kolmafia.d.ts'],
    presets: [
      [
        '@babel/env',
        {
          targets: { rhino: '1.7' },
        },
      ],
      [
        '@babel/react',
        {
          runtime: 'automatic',
          importSource: '@emotion/react',
        },
      ],
      '@babel/typescript',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-transform-runtime',
      '@emotion/babel-plugin',
    ],
  };
};
