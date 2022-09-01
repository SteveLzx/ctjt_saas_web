const path = require('path');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePlugin({
  outputFormat: 'human'
});

const port = process.env.port || 8088;
module.exports = {
  // runtimeCompiler: true,
  // publicPath: '/saas/',
  devServer: {
    compress: true, // 启动gzip压缩
    progress: true, // 显示打包进度条
    port,
    open: true,
    // before: () => require('./mock/express.ts'),
    proxy: {
      '/api': {
        target: 'http://localhost:80/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
      },
    },
  },
  configureWebpack: config => smp.wrap({
    name: '科技驾培',
    // devtool: 'source-map',
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 50 * 1024,
        maxSize: 200 * 1024,
        cacheGroups: {
          'ali-oss': {
            test: /ali-oss/,
            name: 'ali-oss'
          },
          wangeditor: {
            test: /wangeditor/,
            name: 'wangeditor'
          },
          'element-ui': {
            test: /element-ui/,
            name: 'element-ui'
          },
          'lay-excel': {
            test: /lay-excel/,
            name: 'lay-excel'
          }
        }
      }
    }
  }),
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "~@/assets/css/common.scss";',
        // sassOptions: {
        //   includePaths: [path.resolve(__dirname, '/src')],
        // }
      },
    },
  },
  productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  chainWebpack: (config) => {
    config.optimization
      .minimizer('terser')
      .tap(args => {
        const { terserOptions } = args[0];
        terserOptions.keep_classnames = true;
        terserOptions.keep_fnames = true;
        return args;
      });
    // config.plugins.delete('prefetch'); // 父chunk加载完成之后进行加载，闲置时下载
    config.plugins.delete('preload'); // 父chunk加载时并行加载，中等优先级立即下载
    config.cache(true);
    config.plugin('cache').use(HardSourceWebpackPlugin);
    // /* 添加分析工具 */
    // ******* jekins打包时相应环境切勿打开
    // if (process.env.NODE_ENV === 'production') {
    //   config
    //     .plugin('webpack-bundle-analyzer')
    //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    //     .end();
    // }
  }
};
