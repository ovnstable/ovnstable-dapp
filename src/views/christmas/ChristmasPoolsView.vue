<template>
  <div>
    <div class="mt-10">
      <label class="title-label">Christmas Pools</label>
    </div>

    <a
      class="banner-link"
      target="_blank"
      href="https://pancakeswap.finance/liquidity/6345?chain=arb"
    >
      <div class="christmas-banner">
        <div class="christmas-banner__content">
          <h1>
            Boosted Christmas Pools!
          </h1>
          <div class="christmas-banner__content__list mt-4">
            <h2>
              - maximize Your OVN rewards
            </h2>
            <h2>
              - 5 weeks boosted program
            </h2>
            <h2>
              - more USD+/ETH+ provide, more rewards you get
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

        <div class="snowflakes" aria-hidden="true">
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
    </a>

    <div class="mt-7 cards-list-container">
      <v-row v-if="isLoading">
        <v-row align="center" justify="center" class="py-15">
          <v-progress-circular
            width="2"
            size="24"
            color="#8FA2B7"
            indeterminate
          ></v-progress-circular>
        </v-row>
      </v-row>

      <v-row v-else class="cards-feature d-flex">
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
// https://routing-api.pancakeswap.com/v0/v3-pools-tvl/42161
// https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-arb
import Pool from "@/views/christmas/Pool.vue";

export default {
  name: "ChristmasPoolsView",
  components: {
    Pool
  },

  data: () => ({
    isLoading: true,
    poolsArr: [
      {
        pair: "usdc.e / usd+",
        networkName: "arbitrum",
        address: "0xd01075f7314a6436e8B74fc18069848229D0c555",
        aggregators: [],
        apr: 0,
        chain: 42161,
        chainName: "arbitrum",
        description:
          "Pool proportion is 90/10, here You can provide 90USD+/10USDC.e to earn biggest OVN rewards",
        link: "https://pancakeswap.finance/liquidity/6345?chain=arb",
        data: {
          aggregators: [],
          apr: 0,
          id: {
            address: "0xd01075f7314a6436e8B74fc18069848229D0c555",
            chain: "ARBITRUM",
            name: "USDC/USD+"
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
        address: "0x06c75011479E47280e8B7E72E9e0315C8b3A634d",
        aggregators: [],
        apr: 0,
        chain: 42161,
        chainName: "arbitrum",
        description:
          "Pool proportion is 50/50, here You can provide 50USD+/50ETH+ to earn biggest OVN rewards",
        link: "https://pancakeswap.finance/liquidity/6342?chain=arb",
        data: {
          aggregators: [],
          apr: 0,
          id: {
            address: "0x06c75011479E47280e8B7E72E9e0315C8b3A634d",
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
        address: "0xdAA80a051E22A7f7b0cfC33Aa29572fbDE65183E",
        aggregators: [],
        apr: 0,
        chain: 42161,
        chainName: "arbitrum",
        description:
          "Pool proportion is 90/10, here You can provide 90ETH+/10WETH to earn biggest OVN rewards",
        link: "https://pancakeswap.finance/liquidity/6346?chain=arb",
        data: {
          aggregators: [],
          apr: 0,
          id: {
            address: "0xdAA80a051E22A7f7b0cfC33Aa29572fbDE65183E",
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
  }),

  async mounted() {
    const query =
      "query getVolume($days: Int!, $address: String!) {  poolDayDatas(first: $days, orderBy: date, orderDirection: desc, where: { pool: $address }) {    volumeUSD    tvlUSD    feesUSD    protocolFeesUSD  }}";

    this.poolsArr = await Promise.all(
      this.poolsArr.map(async (_) => {
        const response = await fetch(
          "https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-arb",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify({
              operationName: "getVolume",
              query,
              variables: {
                address: _.address?.toLowerCase(),
                days: 7
              }
            })
          }
        );
        const data = (await response.json())?.data;

        return {
          ..._,
          tvl: data?.poolDayDatas[0]?.tvlUSD ?? "0"
        };
      })
    );

    this.isLoading = false;
  }
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

    .snowflakes {
      visibility: visible;
      opacity: 1;
    }
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

.snowflake {
  color: #fff;
  font-size: 1em;
  font-family: Arial, sans-serif;
  text-shadow: 0 0 5px #000;
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
  visibility: hidden;
  opacity: 0;
  transition: visibility 0.4s ease, opacity 0.4s ease;
}
.snowflake {
  position: fixed;
  top: -10%;
  z-index: 9999;
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
