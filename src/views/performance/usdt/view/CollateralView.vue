<template>
    <div class="page-container">
        <div class="mt-10">
            <label class="title-label">USDT+ Collateral</label>
        </div>

       <UsdtPlusTab v-if="networkId === 56"/>
        <div v-else class="ma-0 info-card-container d-flex">
          <div class="" :class="$wu.isMobile() ? 'ml-5 mr-5 mt-5' : 'ml-10 mr-5 my-5'" >
            <v-img class="currency" :src="require('@/assets/currencies/USDT+.svg')" />
          </div>
          <div class="info-card-container-box" :class="$wu.isMobile() ? 'mt-5 mb-5 mr-5' : 'mt-0'" >
            <label class="section-text">
              USDT+ is the equivalent of USD+, pegged to USDT 1:1. USDT+ consist of aUSDT (Aave) and USD+. It has been designed for boosted pools (Balancer and Beethoven) on Optimism. It cannot be minted separately.
            </label>
            <div class="section-text font-weight-bold">
              Switch on Optimism or Arbitrum chain to see USDT+ collateral.
            </div>
          </div>
        </div>

        <div v-if="networkId !== 56"
             :class="$wu.isMobile() ? 'flex-column' : ''"
             class="mt-3 buttons-div" >
            <v-btn class="footer-btn btn-filled mr-5" @click.stop="setWalletNetwork('56')">
                switch to bsc to mint
            </v-btn>
        </div>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import UsdtPlusTab from "@/views/performance/usdt/view/tab/UsdtPlusTab.vue";


export default {
    name: "CollateralUsdtView",

    components: {
        UsdtPlusTab,
    },

    data: () => ({
    }),

    watch: {

    },

    computed: {
      ...mapGetters("network", ['networkId']),

      activeTabUsd: function () {
            return {
                'tab-button': this.tab === 1,
                'tab-button-inactive': this.tab !== 1,
            }
        },

        activeTabUsdt: function () {
            return {
                'tab-button': this.tab === 2,
                'tab-button-inactive': this.tab !== 2,
            }
        },
    },

    methods: {
        ...mapActions('swapUsdtModal', ['showUsdtSwapModal', 'showUsdtMintView', 'showUsdtRedeemView']),
        ...mapActions("network", ["setWalletNetwork"]),

        openLink(url) {
            window.open(url, '_blank').focus();
        },

        mintAction() {
            this.showUsdtMintView();
            this.showUsdtSwapModal();
        },

        redeemAction() {
            this.showUsdtRedeemView();
            this.showUsdtSwapModal();
        }
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .section-title-label {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: 0.02em;
    }


    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 32px;
        line-height: 40px;
    }

    .wide-btn {
        font-size: 14px;
        line-height: 18px;
    }

    .section-text {
        font-size: 14px;
        line-height: 22px;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-filled, .btn-outlined {
        width: 40% !important;
    }


    .buttons-div {
        display: flex;
        gap: 10px;
    }

    .footer-btn {
        width: 100% !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .section-title-label {
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 24px;
      letter-spacing: 0.04em;
    }


    .wide-btn {
        font-size: 16px;
        line-height: 20px;
    }

    .section-text {
        font-size: 16px;
        line-height: 24px;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

}

/* full */
@media only screen and (min-width: 1400px) {
    .section-title-label {
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 24px;
      letter-spacing: 0.04em;
    }


  .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .wide-btn {
        font-size: 16px;
        line-height: 20px;
    }

    .section-text {
        font-size: 18px;
        line-height: 28px;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {

    .label-about {
      margin-top: 15px !important;
    }

    .section-title-label {
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 24px;
      letter-spacing: 0.04em;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 48px;
        line-height: 60px;
    }

    .wide-btn {
        font-size: 14px;
        line-height: 20px;
    }


    .section-text {
      font-size: 17px;
      line-height: 28px;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 15px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }
}

.page-container {
    margin-bottom: 5% !important;
}

.title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.wide-btn {
    min-width: 100% !important;
    height: 40px;
    border: 1px solid var(--input-placeholder);

    background-color: var(--action-btn-bg) !important;
    color: var(--zoom-btn-color);

    font-weight: 400;
    font-family: "Roboto", sans-serif;

    letter-spacing: 0.2;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    box-shadow: none;
}

.wide-btn:hover {
    background: var(--hover);
    color: rgba(28, 149, 231, 1) !important;
}

.tab-button-inactive {
    background: transparent !important;
}

.tab-button-upper {
    border-bottom: 2px solid var(--links-blue) !important;
    color: var(--links-blue) !important;
    cursor: pointer;
}

.info-card-container {
  background: var(--secondary);
  border-radius: 12px;
}

.info-card-container-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}

.section-title-label {
  font-family: 'Roboto', sans-serif;
  font-feature-settings: 'pnum' on, 'lnum' on;
  text-transform: none;
  color: var(--secondary-gray-text);
}

.section-text {
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  color: var(--main-gray-text);
}

.header-btn {
    border-radius: 4px !important;
    box-shadow: none !important;

    font-family: 'Roboto', sans-serif !important;
    text-align: center !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.btn-filled {
    background: var(--blue-gradient);
    color: #FFFFFF !important;
    width: 140px;
    height: 40px;
}

.btn-outlined {
    background-color: var(--main-background) !important;
    color: var(--links-blue);
    border: 1px solid #1C95E7;
    width: 140px;
    height: 40px;
}

.buttons-div {
    display: flex;
}

.footer-btn {
    width: 20%;
}

</style>
