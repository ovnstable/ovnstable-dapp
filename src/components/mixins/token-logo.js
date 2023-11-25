import loadJSON from "@/utils/http-utils";

export const tokenLogo = {
    methods: {

        loadTokenImage(item) {
            if (item.symbol.includes(' (OLD)')) {
                return 'https://api.overnight.fi/root/odos/asset/tokens/' + item.symbol.replace(' (OLD)', '') + '.webp';
            }

            if (item.symbol === 'GND') {
                return require('@/assets/currencies/external/' + item.symbol + '.png');
            }

            if (item.symbol === 'LEX') {
                return require('@/assets/currencies/external/' + item.symbol + '.jpg');
            }

            if (item.symbol === 'PREMIA') {
                return require('@/assets/currencies/external/' + item.symbol + '.svg');
            }

            if (item.symbol === 'USDbC') {
                return require('@/assets/currencies/external/' + item.symbol + '.png');
            }

            if (item.symbol === 'axlUSDT') {
                return require('@/assets/currencies/external/' + item.symbol + '.webp');
            }

            if (item.symbol === 'BALD') {
                return require('@/assets/currencies/external/' + item.symbol + '.png');
            }

            if (item.symbol === 'OGRE') {
                return require('@/assets/currencies/external/' + item.symbol + '.webp');
            }

            if (item.symbol === 'KOKOS') {
                return require('@/assets/currencies/external/' + item.symbol + '.svg');
            }

            if (item.symbol === 'mooCurveWSTETH' ||
                item.symbol === 'mooOptimismBIFI' ||
                item.symbol === 'mooCurveFsBTC' ||
                item.symbol === 'mooCurveMIM' ||
                item.symbol === 'mooCurveFsUSD' ||
                item.symbol === 'mooAaveOPWBTC' ||
                item.symbol === 'mooAaveOpWBTC' ||
                item.symbol === 'FRAXBP-f' ||
                item.symbol === 'wstETHCRV' ||
                item.symbol === 'sUSD3CRV-f' ||
                item.symbol === 'seth-f' ||
                item.symbol === 'sbtc-f' ||
                item.symbol === 'mim3CRV-f' ||
                item.symbol === 'MIM3CRV-f' ||
                item.symbol === 'wstETHCRV' ||
                item.symbol === 'VSTFRAX-f' ||
                item.symbol === 'FRAXBP-f' ||
                item.symbol === 'USX2CRV3CRV-f' ||
                item.symbol === 'mooCurveWSTETH' ||
                item.symbol === 'mooAbrcdbrMIM-2CRV' ||
                item.symbol === 'mooCurve2Pool' ||
                item.symbol === 'mooArbitrumBIFI' ||
                item.symbol === 'gmdUSDC' ||
                item.symbol === 'fxUSD' ||
                item.symbol === '3c-f' ||
                item.symbol === 'aBascbETH' ||
                item.symbol === 'mooBIFIV2' ||
                item.symbol === 'mooVenusBNB' ||
                item.symbol === 'mooValasETH' ||
                item.symbol === 'ankrBNB' ||
                item.symbol === 'ceBNB' ||
                item.symbol === 'ceMATIC') {
                return require('@/assets/currencies/undefined.svg');
            }

            // return 'https://api.overnight.fi/root/odos/asset/tokens/' + item.symbol + '.webp';
                return require('@/assets/currencies/undefined.svg');
        },

        async loadOvernightTokenImage(token) {
            try {
                let tokenUrl = await this.loadCoingeckoOvernightTokenImage(token.symbol);
                if (tokenUrl) {
                    return tokenUrl;
                }

                return this.getOvnCoinBaseImagePath(token);
            } catch (e) {
                console.log("load Overnight Token Image failed ", token.symbol, e)
                return this.getOvnCoinBaseImagePath(token);
            }
        },
        getOvnCoinBaseImagePath(token) {
            if (token.symbol === 'ETH+') {
                return require('@/assets/currencies/stablecoins/' + token.symbol + '.svg');
            }
            return require('@/assets/currencies/stablecoins/' + token.symbol + '.png');
        },
        async loadCoingeckoOvernightTokenImage(symbol) {
            // example
            // https://api.coingecko.com/api/v3/coins/overnight-dai?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false
            let coinGeckoUrl = 'https://api.coingecko.com/api'
            let coinGeckoApiVersion = 'v3'
            let coinGeckoApiMethod = 'coins'
            let coinGeckoApiParams = 'localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false'

            let symbolInfo = 'overnight-' + symbol.replace("+", "").toLowerCase();
            let url = `${coinGeckoUrl}/${coinGeckoApiVersion}/${coinGeckoApiMethod}/${symbolInfo}?${coinGeckoApiParams}`;
            let coinInfo = await loadJSON(url);
            if (coinInfo.error) {
                console.log("Coingecko image not found", coinInfo)
                return null;
            }

            console.log('Coingeko info: ', coinInfo)
            return coinInfo.image.large
        },
    }
}
