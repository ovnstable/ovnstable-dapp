<template>
    <div class="page-container">
        <div class="mt-10">
            <label class="title-label">Collateral</label>
        </div>

       <DaiPlusTab v-if="networkId === 10 || networkId === 42161"/>
        <div v-else class="ma-0 info-card-container d-flex mt-3">
          <div class="" :class="$wu.isMobile() ? 'ml-5 mr-5 mt-5' : 'ml-10 mr-5 my-5'" >
            <v-img class="currency" :src="require('@/assets/currencies/DAI+.svg')" />
          </div>
          <div class="info-card-container-box" :class="$wu.isMobile() ? 'mt-5 mb-5 mr-5' : 'mt-0'" >
            <label class="section-text">
              DAI+ is the equivalent of USD+, pegged to DAI 1:1. DAI+ consist of aDAI (Aave) and USD+. It has been designed for boosted pools (Balancer and Beethoveen) on Optimism. It cannot be minted separately.
            </label>
            <div class="font-weight-bold">
              Switch on Optimism or Arbitrum chain to see DAI+ collateral.
            </div>
          </div>
        </div>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import DaiPlusTab from "@/views/performance/dai/view/tab/DaiPlusTab.vue";


export default {
    name: "CollateralDaiView",

    components: {
        DaiPlusTab,
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

        activeTabDai: function () {
            return {
                'tab-button': this.tab === 2,
                'tab-button-inactive': this.tab !== 2,
            }
        },
    },

    methods: {
        ...mapActions('swapDaiModal', ['showDaiSwapModal', 'showDaiMintView']),

        openLink(url) {
            window.open(url, '_blank').focus();
        },

        mintAction() {
            this.showDaiMintView();
            this.showDaiSwapModal();
        },
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


</style>
