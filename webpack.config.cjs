const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = (env) => {
  const isProduction = env.mode === "production";

  return {
    target: "node",
    mode: isProduction ? "production" : "development",
    entry: "./src/server.ts",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "server.bundle.js",
      clean: true,
    },
    stats: "errors-only",
    resolve: {
      extensions: [".ts", ".js"],
    },
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    devtool: isProduction ? false : "inline-source-map",
  };
};
