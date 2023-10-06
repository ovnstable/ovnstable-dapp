<template>
    <div>
      <v-row v-if="!isAllDataLoaded">
        <v-row align="center" justify="center" class="py-15">
          <v-progress-circular
              width="2"
              size="24"
              color="#8FA2B7"
              indeterminate
          ></v-progress-circular>
        </v-row>
      </v-row>
      <v-row v-if="isAllDataLoaded" class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-5' : 'mt-5'" justify="start" align="center">
          <v-col class="info-card-body-bottom">
              <ChartApy class="mx-n3" :data="insurancePerformanceData.optimism" :payouts="payoutsData" />
          </v-col>
      </v-row>

      <v-row v-if="isAllDataLoaded" class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-5' : 'mt-4'" justify="start" align="center">
        <v-col class="info-card-body-bottom">
          <v-row align="center" justify="start" class="ma-0">
            <label class="section-title-label">Insurance payouts</label>
          </v-row>

          <v-row align="center" justify="center">
            <v-col :cols="!$wu.isFull() ? 12 : 8">

              <Table
                  v-if="!$wu.isMobile()"
                  :profit-label="' OVN per 1 INS'"
                  :payout-data="payouts"/>


              <Table
                  v-else
                  minimized
                  :profit-label="' OVN per 1 INS'"
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
import Doughnut from "@/components/market/strategy/payouts/Doughnut.vue";
import Table from "@/components/market/strategy/payouts/InsuranceTable.vue";
import moment from "moment/moment";
import {insuranceApiService} from "@/services/insurance-api-service";

export default {
    name: "PerformanceTab",

    components: {
        ChartApy,
        Doughnut,
        Table
    },

    data: () => ({
        rateTab: 1,
        isStrategyDataLoading: true,

        payoutsData: [],

        insuranceApyData: {},
        insurancePerformanceData: {},
        insuranceTvlData: {},
        insuranceRedemptionData: {},
     }),

    props: {

    },

    watch: {

    },

    computed: {
      ...mapGetters('network', ['appApiUrl', 'networkId', 'polygonConfig', 'bscConfig', 'opConfig', 'arConfig', 'baseConfig', 'lineaConfig', 'zkConfig']),
      ...mapGetters('accountData', ['account']),
      ...mapGetters('web3', ['contracts', 'web3']),

      isAllDataLoaded: function () {
        return !this.isStrategyDataLoading;
      },

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
        let data = this.payoutsData;
        return data ? data[0].date : null;
      },
      payouts: function () {
        let data = this.payoutsData;
        return data ? data.sort(
            function(o1,o2){
              return moment(o2.date).isBefore(moment(o1.date)) ? -1 : moment(o2.date).isAfter(moment(o1.date)) ? 1 : 0;
            }
        ) : null;
      }
    },

    mounted() {
      this.loadData();
    },

    methods: {
        openLink(url) {
            window.open(url, '_blank').focus();
        },

      loadData() {
          this.refreshInsurance();
      },
      async refreshInsurance() {
        console.log('InsuranceData: refreshInsurance');
        await this.refreshStrategyData();
      },

      async refreshStrategyData() {
        this.isStrategyDataLoading = true;
        let strategyData;

         let url = "https://api.overnight.fi/optimism/usd+";
         insuranceApiService.getPayouts(url)
            .then(value => {
                console.log('InsuranceData: refreshStrategyData', value)
                this.payoutsData = value;
                strategyData = value;

                // strategyData.apy = (avgApyStrategyMonth && avgApyStrategyMonth.value) ? (avgApyStrategyMonth.value) : strategyData.lastApy;
                // strategyData.diffApy = (avgApy && avgApy.value && strategyData.apy) ? (strategyData.apy - avgApy.value) : null;

                strategyData.sort(
                    function (o1, o2) {
                        return moment(o1.date).isBefore(moment(o2.date)) ? -1 : moment(o1.date).isAfter(moment(o2.date)) ? 1 : 0;
                    }
                );

                let clientData = strategyData;

                let widgetDataDict = {};
                let widgetData = {
                    labels: [],
                    datasets: [
                        {
                            fill: false,
                            borderColor: '#1C95E7',
                            data: [],
                        }
                    ]
                };

                let clientDataPreferment = [...clientData];
                for (let i = 0; i < clientDataPreferment.length; i++) {
                    const payout = clientDataPreferment[i];
                    try {
                        console.log("InsuranceData: refreshStrategyData payout: ", payout);


                        // all
                        widgetDataDict[moment(payout.date).format('DD.MM.YYYY')] = payout.apy;
                    } catch (e) {
                        console.error("strategyData build Widget Data Dict insurance error:", e)
                    }
                }

                for (let key in widgetDataDict) {
                    widgetData.labels.push(key);
                    // widgetData.datasets[0].data.push(widgetDataDict[key] > 500 ? 500.00 : widgetDataDict[key]);
                    widgetData.datasets[0].data.push(widgetDataDict[key]);
                }

                console.log("InsuranceData: refreshStrategyData widgetData: ", widgetData);
                this.addInsurancePerformanceData({name: 'optimism', data: widgetData});
                this.isStrategyDataLoading = false;
            }).catch(reason => {
              console.log('Error get data: ' + reason);
                this.isStrategyDataLoading = false;
            })
      },

      addInsuranceApyData(insuranceApyDataParams) {
        this.insuranceApyData[insuranceApyDataParams.name] = insuranceApyDataParams.data;
      },

      addInsurancePerformanceData(insurancePerformanceDataParams) {
        this.insurancePerformanceData[insurancePerformanceDataParams.name] = insurancePerformanceDataParams.data;
      },

      addInsuranceTvlData(insuranceTvlDataParams) {
        this.insuranceTvlData[insuranceTvlDataParams.name] = insuranceTvlDataParams.data;
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
    border-radius: 12px;
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
