import loadJSON from "@/utils/http-utils";

export const tokenLogo = {
    methods: {

        loadTokenImage(item) {
            if (item.symbol.includes(' (OLD)')) {
                return 'https://api.overnight.fi/root/odos/asset/tokens/' + item.symbol.replace(' (OLD)', '') + '.webp';
            }

            if (item.symbol === 'GND') {
                return '/assets/currencies/external/' + item.symbol + '.png';
            }

            if (item.symbol === 'LEX') {
                return '/assets/currencies/external/' + item.symbol + '.jpg';
            }

            if (item.symbol === 'PREMIA') {
                return '/assets/currencies/external/' + item.symbol + '.svg';
            }

            if (item.symbol === 'USDbC') {
                return '/assets/currencies/external/' + item.symbol + '.png';
            }

            if (item.symbol === 'axlUSDT') {
                return '/assets/currencies/external/' + item.symbol + '.webp';
            }

            if (item.symbol === 'BALD') {
                return '/assets/currencies/external/' + item.symbol + '.png';
            }

            if (item.symbol === 'OGRE') {
                return '/assets/currencies/external/' + item.symbol + '.webp';
            }

            if (item.symbol === 'KOKOS') {
                return '/assets/currencies/external/' + item.symbol + '.svg';
            }

            return 'https://api.overnight.fi/root/odos/asset/tokens/' + item.symbol + '.webp';
        },

        async loadOvernightTokenImage(token) {
            try {
                let tokenUrl = await this.loadCoingeckoOvernightTokenImage(token.symbol);
                if (tokenUrl) {
                    return tokenUrl;
                }

                return '/assets/currencies/stablecoins/' + token.symbol + '.png';
            } catch (e) {
                console.log("load Overnight Token Image failed ", e)
                return '/assets/currencies/stablecoins/' + token.symbol + '.png';
            }
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
