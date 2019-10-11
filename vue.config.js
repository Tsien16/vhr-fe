/**
 * Created with WebStorm.
 * @author tsien
 * @version 1.0.0
 * @date 2019/9/24 0024 16:44
 */

module.exports = {
  devServer: {
    host:'localhost',
    port: 8080,
    proxy: {
      "/": {
        target: "http://localhost:8000",
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          "^/": ""
        }
      }
    }
  }
};
