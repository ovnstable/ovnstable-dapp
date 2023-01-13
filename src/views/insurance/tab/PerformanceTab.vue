<template>
    <div>
      <v-row class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-5' : 'mt-10'" justify="start" align="center">
          <v-col class="info-card-body-bottom">
              <v-row align="center" justify="start" class="ma-0">
                  <v-col class="ml-n3 mt-n3">
                      <v-btn outlined class="rate-tab-btn" @click="rateTab=1" v-bind:class="activeRateApy">
                          APY
                      </v-btn>
                  </v-col>
                  <v-col class="mr-n3 mt-n3">
                      <v-btn outlined class="rate-tab-btn" @click="rateTab=3" v-bind:class="activeRateTvl">
                          TVL
                      </v-btn>
                  </v-col>
              </v-row>

              <ChartApy class="mx-n3" v-if="rateTab === 1" :data="insuranceApyData.polygon" :usdPlusData="usdPlusApyData.polygon" :insurance-data="insuranceData"/>
              <ChartTvl class="mx-n3" v-if="rateTab === 3" :data="insuranceTvlData.polygon" :insurance-data="insuranceData"/>
          </v-col>
      </v-row>

      <v-row class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-5' : 'mt-4'" justify="start" align="center">
        <v-col class="info-card-body-bottom">
          <v-row align="center" justify="start" class="ma-0">
            <label class="section-title-label">Insurance payouts</label>
          </v-row>

          <v-row align="center" justify="center">
            <v-col :cols="!$wu.isFull() ? 12 : 8">
              <Table
                  v-if="!$wu.isMobile()"
                  :profit-label="' per USD+'"
                  :payout-data="payouts"/>

              <Table
                  v-else
                  minimized
                  :profit-label="' per USD+'"
                  :payout-data="payouts"/>

              <v-row justify="center" align="center" class="ma-0 mb-10 scroll-container">
                <label class="table-scroll-label">scroll to see more</label>
              </v-row>
            </v-col>

            <v-col :cols="!$wu.isFull() ? 12 : 4">
              <Doughnut :size="280" color="#3D8DFF" :last-date="lastPayoutDate"/>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import ChartApy from "@/components/insurance/strategy/chart/ChartApy";
import ChartTvl from "@/components/insurance/strategy/chart/ChartTvl";
import Doughnut from "@/components/market/strategy/payouts/Doughnut.vue";
import Table from "@/components/market/strategy/payouts/Table.vue";

export default {
    name: "PerformanceTab",

    components: {
        ChartTvl,
        ChartApy,
        Doughnut,
        Table
    },

    data: () => ({
        rateTab: 1,
    }),

    props: {

        insuranceData: {
            type: Object,
        },
    },

    watch: {
    },

    computed: {
      ...mapGetters('insuranceData', ['insuranceStrategyData', 'insuranceApyData', 'insuranceTvlData', 'usdPlusApyData']),

    activeRateApy: function () {
          return {
              'rate-tab-button': this.rateTab === 1,
              'rate-tab-button-in-active': this.rateTab !== 1,
          }
      },

      activeRateDist: function () {
          return {
              'rate-tab-button': this.rateTab === 2,
              'rate-tab-button-in-active': this.rateTab !== 2,
          }
      },

      activeRateTvl: function () {
          return {
              'rate-tab-button': this.rateTab === 3,
              'rate-tab-button-in-active': this.rateTab !== 3,
          }
      },

      lastPayoutDate: function () {
        let data = this.insuranceStrategyData.polygon;
        return data ? data.payouts[data.payouts.length - 1].date : null`;`
      },
      payouts: function () {
        let data = this.insuranceStrategyData.polygon;
        return data ? data.payouts : null;
      }
    },

    methods: {
        openLink(url) {
            window.open(url, '_blank').focus();
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

    .title-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.03em;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .card-info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.03em;
    }

    .info-card-icon {
        width: 20px;
        height: 20px;
    }

    .title-card-text-bottom {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .title-card-debank {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .rate-tab-btn {
        height: 32px !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
        letter-spacing: 0.03em !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .title-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .card-info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.02em;
    }

    .info-card-icon {
        width: 24px;
        height: 24px;
    }

    .title-card-text-bottom {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .title-card-debank {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.04em;
    }

    .rate-tab-btn {
        height: 40px !important;
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

    .title-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .card-info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.02em;
    }

    .info-card-icon {
        width: 24px;
        height: 24px;
    }

    .title-card-text-bottom {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .title-card-debank {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.04em;
    }

    .rate-tab-btn {
        height: 40px !important;
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
    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .title-card-text {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .card-info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.02em;
    }

    .info-card-icon {
        width: 24px;
        height: 24px;
    }

    .title-card-text-bottom {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .title-card-debank {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.04em;
    }

    .rate-tab-btn {
        height: 40px !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }
}

.section-title-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    text-transform: uppercase;
    color: var(--secondary-gray-text);
}

.info-card-container {
    background: var(--secondary);
    border-radius: 4px;
}

.info-card-container-bottom {
    border-radius: 4px;
}

.info-card-container-debank {
    background: var(--secondary);
    border-radius: 4px;
    cursor: pointer !important;
}

.info-card-body {
    margin: 5% 3%;
}

.info-card-body-bottom {
    margin: 2% 2% !important;
}

.info-row {
    border-top: 1px solid var(--secondary-border);
}

.title-card-text {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.card-info {
    font-family: 'Roboto', sans-serif;
    color: var(--secondary-gray-text);
}

.card-info-value {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.title-card-text-bottom {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.label-light {
    color: white !important;
}

.title-card-debank {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #fe815f;
    cursor: pointer !important;
}

.table-scroll-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-gray-text);
}

.scroll-container {
    height: 24px !important;
    background: var(--scroll-color) !important;
}

.rate-tab-btn {
    width: 100% !important;

    font-family: 'Roboto', sans-serif !important;
    text-align: center !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.rate-tab-button {
    background: rgba(28, 149, 231, 0.1);
    border-radius: 4px;
    border: none !important;
    color: var(--links-blue) !important;
}

.rate-tab-button-in-active {
    border-radius: 4px;
    color: #707A8B !important;
    border: 1px solid var(--main-border) !important;
}

.debank-icon {
    margin-top: -2px !important;
}
</style>
