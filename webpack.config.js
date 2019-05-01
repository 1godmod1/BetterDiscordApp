const path = require("path");

module.exports = {
    mode: "development",
    target: "node",
    devtool: "none",
    entry: "./src/index.js",
    output: {
      filename: "PluginLibrary.js",
      path: path.resolve(__dirname, "release"),
      library: "BetterDiscord",
      libraryTarget: "var",
      libraryExport: "default"
    },
    externals: {
      electron: `window.require("electron")`,
      fs: `window.require("fs")`,
      path: `window.require("path")`,
      request: `window.require("request")`
    },
    resolve: {
      extensions: [".js"],
      modules: [
        path.resolve("src", "modules"),
        path.resolve("src", "structs"),
        path.resolve("src", "ui")
      ]
    },
    module: {
      rules: [{test: /\.css$/, use: "raw-loader"}]
    }
};