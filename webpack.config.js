const path = require('path');

module.exports = {
  entry: './server.js', // Adjust to your entry file
  target: 'node', // Specify that the target is Node.js
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Output directory
    clean: true, // Clean the output directory before each build
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply this rule to JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Use Babel to transpile
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'], // Resolve .js files
  },
  mode: 'development', // Change to 'production' for production builds
};
