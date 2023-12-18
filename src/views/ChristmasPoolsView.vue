<template>
  <div>
    <div class="mt-10">
      <label class="title-label">Christmas Pools</label>
    </div>

    <div class="christmas-banner">
      <h1>
        CHRISTMAS POOLS OFFER
      </h1>
      <img
        class="christmas-banner__network"
        :src="require('@/assets/network/arbitrum.svg')"
      />
      <div
        class="snowflakes"
        aria-hidden="true"
        v-for="item in [1, 2, 3]"
        :key="item"
      >
        <div class="snowflake">
          <div class="inner">❅</div>
        </div>
        <div class="snowflake">
          <div class="inner">❅</div>
        </div>
        <div class="snowflake">
          <div class="inner">❅</div>
        </div>
        <div class="snowflake">
          <div class="inner">❅</div>
        </div>
        <div class="snowflake">
          <div class="inner">❅</div>
        </div>
        <div class="snowflake">
          <div class="inner">❅</div>
        </div>
        <div class="snowflake">
          <div class="inner">❅</div>
        </div>
        <div class="snowflake">
          <div class="inner">❅</div>
        </div>
        <div class="snowflake">
          <div class="inner">❅</div>
        </div>
        <div class="snowflake">
          <div class="inner">❅</div>
        </div>
        <div class="snowflake">
          <div class="inner">❅</div>
        </div>
        <div class="snowflake">
          <div class="inner">❅</div>
        </div>
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
import Pool from "@/components/market/cards/pool/Pool.vue";

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
        platform: "Convex",
        prototype: false,
        title: "USDC.e/USD+",
        tvl: 276742.1266166399,
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
        platform: "Convex",
        prototype: false,
        title: "USD+/ETH+",
        tvl: 276742.1266166399,
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
        platform: "Convex",
        prototype: false,
        title: "ETH+/WETH",
        tvl: 276742.1266166399,
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
<style scoped>
.christmas-banner {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-radius: 8px;
  color: #fff;
  margin: 20px 0;
  padding: 40px 16px;
  background: radial-gradient(
    108.67% 595.92% at 100% -3.25%,
    #001845 0%,
    #001845 27.05%,
    #0c255b 52.07%,
    #29a0f0 100%
  );
}

.christmas-banner__network {
  position: relative;
  z-index: 2;
  width: 120px;
  height: 120px;
  margin-right: 100px;
}

.christmas-banner h1 {
  position: relative;
  z-index: 2;
  max-width: 400px;
  font-size: 36px;
}
.cards-feature {
  gap: 30px;
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

.snowflake,
.snowflake .inner {
  animation-iteration-count: infinite;
  animation-play-state: running;
}
@keyframes snowflakes-fall {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(110vh);
  }
}
@keyframes snowflakes-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(80px);
  }
}

.snowflakes {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

.snowflake {
  color: #a3dfff;
  font-size: 1em;
  font-family: Arial, sans-serif;
  text-shadow: 0 0 5px #000;
}

.snowflake {
  position: absolute;
  top: -30px;
  z-index: 1;
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
  animation-name: snowflakes-shake;
  animation-duration: 3s;
  animation-timing-function: ease-in-out;
}
.snowflake .inner {
  animation-duration: 10s;
  animation-name: snowflakes-fall;
  animation-timing-function: linear;
}
.snowflake:nth-of-type(0) {
  left: 1%;
  animation-delay: 0s;
}
.snowflake:nth-of-type(0) .inner {
  animation-delay: 0s;
}
.snowflake:first-of-type {
  left: 10%;
  animation-delay: 1s;
}
.snowflake:first-of-type .inner,
.snowflake:nth-of-type(8) .inner {
  animation-delay: 1s;
}
.snowflake:nth-of-type(2) {
  left: 20%;
  animation-delay: 0.5s;
}
.snowflake:nth-of-type(2) .inner,
.snowflake:nth-of-type(6) .inner {
  animation-delay: 6s;
}
.snowflake:nth-of-type(3) {
  left: 30%;
  animation-delay: 2s;
}
.snowflake:nth-of-type(11) .inner,
.snowflake:nth-of-type(3) .inner {
  animation-delay: 4s;
}
.snowflake:nth-of-type(4) {
  left: 40%;
  animation-delay: 2s;
}
.snowflake:nth-of-type(10) .inner,
.snowflake:nth-of-type(4) .inner {
  animation-delay: 2s;
}
.snowflake:nth-of-type(5) {
  left: 50%;
  animation-delay: 3s;
}
.snowflake:nth-of-type(5) .inner {
  animation-delay: 8s;
}
.snowflake:nth-of-type(6) {
  left: 60%;
  animation-delay: 2s;
}
.snowflake:nth-of-type(7) {
  left: 70%;
  animation-delay: 1s;
}
.snowflake:nth-of-type(7) .inner {
  animation-delay: 2.5s;
}
.snowflake:nth-of-type(8) {
  left: 80%;
  animation-delay: 0s;
}
.snowflake:nth-of-type(9) {
  left: 90%;
  animation-delay: 1.5s;
}
.snowflake:nth-of-type(9) .inner {
  animation-delay: 3s;
}
.snowflake:nth-of-type(10) {
  left: 25%;
  animation-delay: 0s;
}
.snowflake:nth-of-type(11) {
  left: 65%;
  animation-delay: 2.5s;
}
</style>
