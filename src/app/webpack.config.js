const path = require("path");

module.exports = {
  entry: {
    configViewer: "./src/app/index.tsx"
  },
  output: {
    path: path.resolve(__dirname, "../../out"),
    filename: "main.js"
  },
  devtool: "eval-source-map",
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
        options: {
          configFile: './tsconfig.app.json',
        }
      }
    ]
  },
  performance: {
    hints: false
  }
};