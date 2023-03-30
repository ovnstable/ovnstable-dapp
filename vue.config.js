const zlib = require("zlib");

module.exports = {
    chainWebpack: config => {
        config.optimization.delete('splitChunks')
    },
    pluginOptions: {
        compression: {
            modes: ['production'],
            brotli: {
                filename: '[file].br[query]',
                algorithm: 'brotliCompress',
                include: /\.(js|css|html|svg|json|map)(\?.*)?$/i,
                compressionOptions: {
                    params: {
                        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                    },
                },
                minRatio: 0.8,
            },
            gzip: {
                filename: '[file].gz[query]',
                algorithm: 'gzip',
                include: /\.(js|css|html|svg|json|map)(\?.*)?$/i,
                minRatio: 0.8,
            }
        }
    },

    configureWebpack: {
        devServer: {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
            }
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                {
                    test: /\.js\.map$/,
                    loader: 'source-map-loader',
                    enforce: 'pre',
                },
            ]
        }
    },

    transpileDependencies: [
        'vuetify'
    ]
}
