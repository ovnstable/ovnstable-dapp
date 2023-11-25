const zlib = require("zlib");

module.exports = {
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
            watchOptions: {
                ignored: [/node_modules/, /public/],
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
            }
        },
        module: {
            rules:  [
                {
                    test: /\.js|mjs$/,
                    exclude: (_) => !/node_modules\/(@web3auth|@ethereumjs|@walletconnect|@web3-onboard|@web3modal|eth-block-tracker|@eth-block-tracker|superstruct|@superstruct|@coinbase|@web3-onboard\/coinbase|@coinbase\/wallet-sdk)/.test(_),
                    loader: 'babel-loader'
                }
            ],
        },
        optimization: {
          splitChunks: {
            chunks: "all",
          },
        },
    },

    transpileDependencies: [
        'vuetify'
    ]
}
