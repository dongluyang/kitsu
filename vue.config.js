module.exports = {
    chainWebpack: config => {
    config.resolve.alias.set('vue', '@vue/compat')

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 3
            }
          }
        }
      })
  },
  devServer: {
    proxy: {
      '/api': {
        target: process.env.KITSU_API_TARGET || 'http://localhost:5000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/socket.io': {
        target: process.env.KITSU_EVENT_TARGET || 'http://127.0.0.1:5001',
        ws: true
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/variables.scss";`,
        implementation: require('sass')
      }
    }
  }
}
