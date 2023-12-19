<template>
  <div>
    <div class="mt-10">
      <label class="title-label">Christmas Pools</label>
    </div>

    <div class="christmas-banner">
      <div class="christmas-banner__content">
        <h1>
          Boosted Christmas Pools!
        </h1>
        <div class="christmas-banner__content__list mt-4">
          <h2>
            - maximize Your USD+, ETH+ rewards
          </h2>
          <h2>
            - 5 weeks boosted program
          </h2>
          <h2>
            - best APY in the market
          </h2>
        </div>
      </div>
      <div class="christmas-banner_images">
        <img
          class="christmas-banner__network"
          :src="require('@/assets/network/arbitrum.svg')"
        />
        <img class="christmas-banner__char" src="/christmas_char.png" />
      </div>
    </div>

    <div class="mt-7 cards-list-container">
      <v-row class="cards-feature d-flex">
        <Pool
          v-for="card in poolsArr"
          :key="card.id"
          class="ma-3"
          v-bind:is="card.name"
          :card-data="card"
          :network-name="card.networkName"
          :pool="card"
        />
      </v-row>
    </div>
  </div>
</template>

<script>
import Pool from "@/views/christmas/Pool.vue";

export default {
  name: "ChristmasPoolsView",
  components: {
    Pool
  },

  data: () => ({
    poolsArr: [
      {
        pair: "usdc.e / usd+",
        networkName: "arbitrum",
        address: "0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013",
        aggregators: Array[0],
        apr: 41.73340959313001,
        chain: 42161,
        chainName: "arbitrum",
        description:
          "Pool proportion is 90%/10%, here You can provide 90USD+/10USDC.e and maximize rewards to the highest yield of USD+",
        link: "https://pancakeswap.finance/pools",
        data: {
          aggregators: [],
          apr: 41.73340959313001,
          id: {
            address: "0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013",
            chain: "ARBITRUM",
            name: "USDC.e/USD+"
          }
        },
        hasCap: true,
        hasUsdPlus: true,
        id: "poolUSD+/FRAX276742.1266166399Curve",
        name: "Pool",
        originalId: "USD+/FRAX276742.1266166399Curve",
        overcapEnabled: false,
        platform: "Pancake",
        prototype: false,
        title: "USDC.e/USD+",
        tvl: "0",
        type: "Pool",
        zappable: false,
        addToSync: true,
        token0Icon: require("@/assets/currencies/USD+.png"),
        token1Icon: require("@/assets/currencies/select/FRAX.webp"),
        token2Icon: undefined,
        token3Icon: undefined
      },
      {
        pair: "USD+/ETH+",
        networkName: "arbitrum",
        address: "0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013",
        aggregators: Array[0],
        apr: 20.73340959313001,
        chain: 42161,
        chainName: "arbitrum",
        description:
          "Pool proportion is 50%/50%, here You can provide 50USD+/50ETH+ and maximize rewards to the highest yield of USD+ and ETH+ both",
        link: "https://pancakeswap.finance/pools",
        data: {
          aggregators: [],
          apr: 20.73340959313001,
          id: {
            address: "0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013",
            chain: "ARBITRUM",
            name: "USD+/ETH+"
          }
        },
        hasCap: true,
        hasUsdPlus: true,
        id: "poolUSD+/FRAX276742.1266166399Curve2",
        name: "Pool",
        originalId: "USD+/FRAX276742.1266166399Curve",
        overcapEnabled: false,
        platform: "Pancake",
        prototype: false,
        title: "USD+/ETH+",
        tvl: "0",
        type: "Pool",
        zappable: false,
        token0Icon: require("@/assets/currencies/USD+.png"),
        token1Icon: require("@/assets/currencies/ETH+.svg"),
        token2Icon: undefined,
        token3Icon: undefined
      },
      {
        pair: "ETH+/WETH",
        networkName: "arbitrum",
        address: "0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013",
        aggregators: Array[0],
        apr: 19.73340959313001,
        chain: 42161,
        chainName: "arbitrum",
        description:
          "Pool proportion is 90%/10%, here You can provide 90ETH+/10WETH and maximize rewards to the highest yield of WETH+",
        link: "https://pancakeswap.finance/pools",
        data: {
          aggregators: [],
          apr: 41.73340959313001,
          id: {
            address: "0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013",
            chain: "ARBITRUM",
            name: "ETH+/WETH"
          }
        },
        hasCap: true,
        hasUsdPlus: true,
        id: "poolUSD+/FRAX276742.1266166399Curve3",
        name: "Pool",
        originalId: "USD+/FRAX276742.1266166399Curve",
        overcapEnabled: false,
        platform: "Pancake",
        prototype: false,
        title: "ETH+/WETH",
        tvl: "0",
        type: "Pool",
        zappable: false,
        token0Icon: require("@/assets/currencies/ETH+.svg"),
        token1Icon: require("@/assets/currencies/WETH.svg"),
        token2Icon: undefined,
        token3Icon: undefined
      }
    ]
  })
};
</script>
<style lang="scss" scoped>
.christmas-banner {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-radius: 8px;
  min-height: 300px;
  color: #fff;
  margin: 20px 0 30px 0;
  padding: 40px 24px;
  background-image: url("/christmas_banner.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  box-shadow: 0 0 4px 3px rgb(53, 158, 213);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: unset;
  }
}

.christmas-banner__images {
  position: absolute;
  bottom: 0;
  right: 20px;
}

.christmas-banner__char {
  position: absolute;
  bottom: 0;
  right: 20px;
  height: 100%;
  object-fit: contain;
}

.christmas-banner__content {
  display: flex;
  flex-direction: column;
}

.christmas-banner__network {
  position: absolute;
  right: 50px;
  width: 100%;
  z-index: 2;
  width: 120px;
  height: 120px;
  margin-right: 20%;
  margin-left: auto;
}

.christmas-banner h1 {
  position: relative;
  z-index: 2;
  max-width: 700px;
  font-size: 36px;
}
.cards-feature {
  gap: 30px;
}

.christmas-banner__content__list {
  background-color: rgba(45, 55, 75, 0.2);
  padding: 12px 20px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

/* mobile */
@media only screen and (max-width: 650px) {
  .christmas-banner {
    display: none;
  }
}
/* mobile */
@media only screen and (max-width: 960px) {
  .tab-btn {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
  }

  .title-label {
    font-style: normal;
    font-weight: 300;
    font-size: 32px;
    line-height: 40px;
  }

  .toggle-row {
    max-width: 95% !important;
  }

  .toggle-row-second {
    max-width: 50% !important;
  }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
  .tab-btn {
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 28px;
  }

  .title-label {
    font-style: normal;
    font-weight: 300;
    font-size: 54px;
    line-height: 60px;
  }

  .toggle-row {
    border-bottom: 2px solid var(--main-border);
    max-width: 200% !important;
  }
}

/* full */
@media only screen and (min-width: 1400px) {
  .tab-btn {
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 28px;
  }

  .title-label {
    font-style: normal;
    font-weight: 300;
    font-size: 54px;
    line-height: 60px;
  }

  .toggle-row {
    border-bottom: 2px solid var(--main-border);
    max-width: 200% !important;
  }
}

@media only screen and (min-width: 1300px) {
  .tab-btn {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;
  }

  .title-label {
    font-style: normal;
    font-weight: 300;
    font-size: 48px;
    line-height: 60px;
  }

  .toggle-row {
    border-bottom: 2px solid var(--main-border);
    max-width: 200% !important;
  }
}

.tab-button {
  border-bottom: 2px solid var(--links-blue) !important;
  color: var(--links-blue) !important;
  cursor: pointer;
}

.tab-button-in-active {
  cursor: pointer;
}

.tab-btn {
  font-feature-settings: "liga" off;
  color: var(--secondary-gray-text);
  margin-bottom: -2px;
  cursor: pointer;
}

.tab-btn-disabled {
  cursor: default;
}

.toggle-row {
  border-bottom: 2px solid var(--main-border);
}

.cards-list-container {
  margin-bottom: 15% !important;
  width: 100% !important;
}

.toggle-row {
  width: 100% !important;
}

.title-label {
  text-transform: uppercase;
  font-feature-settings: "pnum" on, "lnum" on;
  color: var(--main-gray-text);
}

.text-deprecated {
  color: #707a8b;
}
</style>
