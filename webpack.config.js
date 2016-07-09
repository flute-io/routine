const env = require('yargs').argv.mode;
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const componentName = 'Routine';

const common = {
	entry: __dirname + `/src/${componentName}.js`,
	devtool: 'source-map',
	output: {
		path: __dirname + '/lib',
		library: 'routine',
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	externals: {
		'react': {
			root: 'React',
			commonjs: 'react',
			commonjs2: 'react',
			amd: 'react'
		},
		'react-dom' : {
			root: 'ReactDOM',
			commonjs2: 'react-dom',
			commonjs: 'react-dom',
			amd: 'react-dom'
		}
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader!postcss-loader'
			},
			{
				test: /\.scss$/,
				loader: 'style-loader!css-loader!postcss-loader!sass-loader-once'
			},
			{
				test: /(\.jsx|\.js)$/,
				loader: 'babel',
				exclude: /(node_modules|bower_components)/
			}
		]
	},
	postcss: function () {
		return [
			autoprefixer
		];
	},
	resolve: {
		root: path.resolve('./src'),
		extensions: ['', '.js']
	}
};

if(env == 'build') {
	module.exports = merge(common, {
		output: {
			filename: componentName + '.min.js'
		},
		plugins: [
			new UglifyJsPlugin({ minimize: true })
		]
	});
}

if(env === 'dev') {
	module.exports = merge(common, {
		output: {
			filename: componentName + '.js'
		},
		plugins: [
			new CleanWebpackPlugin(['lib'])
		]
	});
}
