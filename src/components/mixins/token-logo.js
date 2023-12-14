import loadJSON from "@/utils/http-utils";

export const tokenLogo = {
  methods: {
    loadTokenImage(item) {
      try {
        if (item.symbol.includes(" (OLD)")) {
          return require("@/assets/currencies/select/" +
            item.symbol.replace(" (OLD)", "") +
            ".webp");
        }
        return require("@/assets/currencies/select/" + item.symbol + ".webp");
      } catch (error) {
        return require("@/assets/currencies/undefined.svg");
      }
    },

    async loadOvernightTokenImage(token) {
      try {
        // let tokenUrl = await this.loadCoingeckoOvernightTokenImage(token.symbol);
        // if (tokenUrl) {
        //     return tokenUrl;
        // }

        return this.getOvnCoinBaseImagePath(token);
      } catch (e) {
        return this.getOvnCoinBaseImagePath(token);
      }
    },
    getOvnCoinBaseImagePath(token) {
      try {
        if (token.symbol === "ETH+") {
          return require("@/assets/currencies/stablecoins/" +
            token.symbol +
            ".svg");
        } else {
          return require("@/assets/currencies/stablecoins/" +
            token.symbol +
            ".png");
        }
      } catch (error) {
        return require("@/assets/currencies/undefined.svg");
      }
    },
    async loadCoingeckoOvernightTokenImage(symbol) {
      // example
      // https://api.coingecko.com/api/v3/coins/overnight-dai?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false
      let coinGeckoUrl = "https://api.coingecko.com/api";
      let coinGeckoApiVersion = "v3";
      let coinGeckoApiMethod = "coins";
      let coinGeckoApiParams =
        "localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false";

      let symbolInfo = "overnight-" + symbol.replace("+", "").toLowerCase();
      let url = `${coinGeckoUrl}/${coinGeckoApiVersion}/${coinGeckoApiMethod}/${symbolInfo}?${coinGeckoApiParams}`;
      let coinInfo = await loadJSON(url);
      if (coinInfo.error) {
        console.log("Coingecko image not found", coinInfo);
        return null;
      }

      return coinInfo.image.large;
    }
  }
};
