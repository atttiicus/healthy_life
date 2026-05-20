// UnoCSS 通过 postcss.config.js 接入，不使用 webpack 插件
// (unocss/webpack 会向 webpack 注入 options=null 的 loader，与 UniApp 的 chain-webpack 不兼容)
module.exports = {
  configureWebpack: () => {
    if (process.env.NODE_ENV !== 'production') return
    return {
      optimization: {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 20000,
          maxSize: 60000,
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              name(module) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                return `npm.${packageName.replace('@', '')}`
              },
            },
          },
        },
      },
    }
  },
  chainWebpack: (config) => {
    config.module
      .rule('mjs$')
      .test(/\.mjs$/)
      .include.add(/node_modules/)
      .end()
      .type('javascript/auto')
  },
}
