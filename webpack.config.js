const env = require('yargs').argv.mode;
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');

const common = {
	entry: {
		ifThe: './src/ifThe.js',
		Routine: './src/Routine.js',
		defaults: './src/defaults',
		injector: './src/injector.js',
		usingThe: './src/usingThe.js',
		memoriser: './src/memoriser.js',
		ensureThat: './src/ensureThat.js',
		setupThe: './src/setupThe.js',
		withTheseInScope: './src/withTheseInScope.js'
	},
	devtool: 'source-map',
	output: {
		path: __dirname + '/lib',
		library: 'routine',
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	module: {
		loaders: [
			{
				test: /(\.js)$/,
				loader: 'babel',
				exclude: /(node_modules|bower_components)/
			}
		]
	},
	resolve: {
		root: path.resolve('./src'),
		extensions: ['', '.js']
	}
};

if(env == 'build') {
	module.exports = merge(common, {
		output: {
			filename: '[name].min.js'
		},
		plugins: [
			new UglifyJsPlugin({ minimize: true })
		]
	});
}

if(env === 'dev') {
	module.exports = merge(common, {
		output: {
			filename: '[name].js'
		},
		plugins: [
			new CleanWebpackPlugin(['lib'])
		]
	});
}
