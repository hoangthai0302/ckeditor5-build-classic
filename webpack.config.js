/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );
const { bundler, styles } = require( '@ckeditor/ckeditor5-dev-utils' );
const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );
const BabiliPlugin = require( 'babel-minify-webpack-plugin' );
const buildConfig = require( './build-config' );

module.exports = {
    devtool: 'source-map',

    entry: path.resolve( __dirname, 'src', 'ckeditor.js' ),

    output: {
        path: path.resolve( __dirname, 'build' ),
        filename: 'ckeditor.js',
        libraryTarget: 'umd',
        libraryExport: 'default',
        library: buildConfig.moduleName
    },

    plugins: [
        new CKEditorWebpackPlugin( {
            language: buildConfig.config.language,
            additionalLanguages: ['ru']
        } ),
        // new BabiliPlugin( null, {
        //     comments: false
        // } ),
        new webpack.BannerPlugin( {
            banner: bundler.getLicenseBanner(),
            raw: true
        } ),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.NormalModuleReplacementPlugin(
            /\.\.\/\.\.\/theme\/icons\/bold\.svg/,
            '../../../../../theme/icons/bold.svg'
        ),
        new webpack.NormalModuleReplacementPlugin(
            /\.\.\/\.\.\/theme\/icons\/underline\.svg/,
            '../../../../../theme/icons/underline.svg'
        ),
        new webpack.NormalModuleReplacementPlugin(
            /\.\.\/\.\.\/theme\/icons\/strikethrough\.svg/,
            '../../../../../theme/icons/strikethrough.svg'
        ),
        new webpack.NormalModuleReplacementPlugin(
            /\.\.\/\.\.\/theme\/icons\/italic\.svg/,
            '../../../../../theme/icons/italic.svg'
        ),
        new webpack.NormalModuleReplacementPlugin(
            /\.\.\/theme\/icons\/align-center\.svg/,
            '../../../../theme/icons/align-center.svg'
        ),
        new webpack.NormalModuleReplacementPlugin(
            /\.\.\/theme\/icons\/align-justify\.svg/,
            '../../../../theme/icons/align-justify.svg'
        ),
        new webpack.NormalModuleReplacementPlugin(
            /\.\.\/theme\/icons\/align-left\.svg/,
            '../../../../theme/icons/align-left.svg'
        ),
        new webpack.NormalModuleReplacementPlugin(
            /\.\.\/theme\/icons\/align-right\.svg/,
            '../../../../theme/icons/align-right.svg'
        ),
        new webpack.NormalModuleReplacementPlugin(
            /@ckeditor\/ckeditor5-core\/theme\/icons\/quote\.svg/,
            '../../../../theme/icons/blockquote.svg'
        ),
        new webpack.NormalModuleReplacementPlugin(
            /\.\.\/theme\/icons\/numberedlist\.svg/,
            '../../../../theme/icons/numberedlist.svg'
        ),
        new webpack.NormalModuleReplacementPlugin(
            /\.\.\/theme\/icons\/bulletedlist\.svg/,
            '../../../../theme/icons/bulletedlist.svg'
        )
    ],

    module: {
        rules: [
            {
                test: /\.svg$/,
                use: [ 'raw-loader' ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            singleton: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: styles.getPostCssConfig( {
                            themeImporter: {
                                themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
                            },
                            minify: true
                        } )
                    },
                ]
            }
        ]
    }
};
