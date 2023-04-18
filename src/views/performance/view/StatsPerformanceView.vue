<template>
    <div class="page-container">
        <div class="mt-10">
            <label class="title-label">usd+ Performance</label>
        </div>

        <v-row v-if="isDataLoaded" align="center" justify="start">
            <template v-if="$wu.isMobile()">
                <v-col cols="12" align="center" class="mt-10">
                    <v-btn  class="header-btn btn-filled mr-5" @click="mintAction">
                        Mint USD+
                    </v-btn>
                    <v-btn class="header-btn btn-outlined mr-5" @click="redeemAction">
                        Redeem USD+
                    </v-btn>
                </v-col>
            </template>
            <v-col cols="6">
                <v-row class="ma-0 mt-10 ml-3 toggle-row">
                    <label class="tab-btn mr-4" @click="setTab('optimism')" v-bind:class="activeTabOptimism">Optimism</label>
                    <label class="tab-btn mx-4" @click="setTab('arbitrum')" v-bind:class="activeTabArbitrum">Arbitrum</label>
                    <label class="tab-btn mx-4" @click="setTab('zksync')" v-bind:class="activeTabZkSync">ZkSync</label>
                    <label class="tab-btn mx-4" @click="setTab('bsc')" v-bind:class="activeTabBsc">BSC</label>
                    <label class="tab-btn mx-4" @click="setTab('polygon')" v-bind:class="activeTabPolygon">Polygon</label>
                </v-row>
            </v-col>
            <template v-if="!$wu.isMobile()">
                <v-col align="end" cols="6" class="mt-5">
                    <v-btn  class="header-btn btn-filled mr-5 mx-15" @click="mintAction">
                        Mint USD+
                    </v-btn>
                    <v-btn class="header-btn btn-outlined mr-3" @click="redeemAction">
                        Redeem USD+
                    </v-btn>
                </v-col>
            </template>
        </v-row>



      <v-row v-if="!isDataLoaded">
        <v-row align="center" justify="center" class="py-15">
          <v-progress-circular
              width="2"
              size="24"
              color="#8FA2B7"
              indeterminate
          ></v-progress-circular>
        </v-row>
      </v-row>

      <v-row v-if="isDataLoaded && !$wu.isMobile()" class="ma-0" justify="start" align="center">
        <v-col cols="6">
          <div class="info-card-container py-3">
            <LineChartApy :data="payoutsApyData" :network-name="tab"/>
          </div>
        </v-col>
        <v-col cols="6">
          <div class="info-card-container py-3">
            <LineChartTvl :data="payoutsTvlData" :network-name="tab"/>
          </div>
        </v-col>
      </v-row>

      <v-row v-else-if="isDataLoaded && $wu.isMobile()" class="ma-0 mt-2 info-card-container" justify="start" align="center">
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

          <LineChartApy class="mx-n3" v-if="rateTab === 1" :data="payoutsApyData" :network-name="tab"/>
          <LineChartTvl class="mx-n3" v-if="rateTab === 3" :data="payoutsTvlData" :network-name="tab"/>
        </v-col>
      </v-row>

      <v-row v-if="isDataLoaded" class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-5' : 'mt-4'" justify="start" align="center">
        <v-col class="info-card-body-bottom">
          <v-row align="center" justify="start" class="ma-0">
            <label class="section-title-label">USD+ payouts</label>
              <div class="balance-network-icon ml-3">
                  <v-img :src="icon"/>
              </div>
          </v-row>

          <v-row align="center" justify="center">
            <v-col :cols="!$wu.isFull() ? 12 : 8">
              <Table
                  v-if="!$wu.isMobile()"
                  :profit-label="assetName + ' per USD+'"
                  :payout-data="payouts"
                  :network-name="tab"
              />

              <Table
                  v-else
                  minimized
                  :profit-label="assetName + ' per USD+'"
                  :payout-data="payouts"/>

              <v-row justify="center" align="center" class="ma-0 mb-10 scroll-container">
                <label class="table-scroll-label">scroll to see more</label>
              </v-row>
            </v-col>

            <v-col :cols="!$wu.isFull() ? 12 : 4">
              <Doughnut :size="280" color="#3D8DFF" :last-date="lastPayoutDate" :network-name="tab"/>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <resize-observer v-if="isDataLoaded" @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import Table from "@/components/market/strategy/payouts/Table";
import Doughnut from "@/components/market/strategy/payouts/Doughnut";
import {mapActions, mapGetters} from "vuex";
import LineChartApy from "@/components/stats/widget/LineChartApy";
import LineChartTvl from "@/components/stats/widget/LineChartTvl";
import {axios} from "@/plugins/http-axios";
import moment from "moment/moment";
import {payoutsApiService} from "@/services/payouts-api-service";

import polygonIcon from "@/assets/network/polygon.svg";
import optimismIcon from "@/assets/network/op.svg";
import bscIcon from "@/assets/network/bsc.svg";
import arbitrumIcon from "@/assets/network/ar.svg";
import zksyncIcon from "@/assets/network/zk.svg";


export default {
    name: "StatsPerformanceView",

    components: {
        LineChartTvl,
        LineChartApy,
        Doughnut,
        Table,
    },

    data: () => ({
      tab: 'optimism',
      rateTab: 1,

      isPayoutsLoading: true,

      payoutsApyData: null,
      payoutsTvlData: null,
      payoutsApyDataDict: null,
      payouts: null,
    }),

    computed: {
      ...mapGetters("network", ['networkId', 'networkName', 'assetName', 'appApiUrl', 'switchToOtherNetwork', 'getParams']),

        isDataLoaded: function() {
            return !this.isPayoutsLoading;
        },

        tabNetworkName: function() {
            let params;
            params = this.getParams(this.tab)

            return params.networkName;
        },

        tabApiUrl: function() {
            let params;
            params = this.getParams(this.tab)

            return params.appApiUrl;
        },

        activeRateApy: function () {
            return {
                'rate-tab-button': this.rateTab === 1,
                'rate-tab-button-in-active': this.rateTab !== 1,
            }
        },

        activeRateTvl: function () {
            return {
                'rate-tab-button': this.rateTab === 3,
                'rate-tab-button-in-active': this.rateTab !== 3,
            }
        },

        lastPayoutDate: function () {
            return this.payouts && this.payouts.length ? this.payouts[0].payableDate : '';
        },

        activeTabOptimism: function() {
            return {
                'tab-button': this.tab === 'optimism',
                'tab-button-in-active': this.tab !== 'optimism',
            }
        },

        activeTabArbitrum: function() {
            return {
                'tab-button': this.tab === 'arbitrum',
                'tab-button-in-active': this.tab !== 'arbitrum',
            }
        },
        activeTabZkSync: function() {
            return {
                'tab-button': this.tab === 'zksync',
                'tab-button-in-active': this.tab !== 'zksync',
            }
        },

        activeTabBsc: function() {
            return {
                'tab-button': this.tab === 'bsc',
                'tab-button-in-active': this.tab !== 'bsc',
            }
        },

        activeTabPolygon: function() {
            return {
                'tab-button': this.tab === 'polygon',
                'tab-button-in-active': this.tab !== 'polygon',
            }
        },

        icon: function () {
            switch (this.tabNetworkName){
                case 'polygon':
                    return polygonIcon;
                case 'optimism':
                    return optimismIcon;
                case 'bsc':
                    return bscIcon;
                case 'arbitrum':
                    return arbitrumIcon;
                case 'zksync':
                    return zksyncIcon;
            }
        },
    },

    watch: {
        networkName: function (newVal, oldVal) {
            this.setTab(newVal);
            this.loadData(newVal);
        }
    },

    created() {

    },

    mounted() {
        console.log('Tab Name: ', this.$route.query.tabName);
        this.setTab(this.networkName);
        this.loadData();
    },

    methods: {
        ...mapActions('swapModal', ['showSwapModal', 'showMintView', 'showRedeemView']),

        setTab(tabName) {
            this.tab = tabName;
            this.initTabName('/stats', {tabName: this.tab});
            this.loadData();
            console.log("NetworkParams : ", this.getParams(this.tab));
        },

        initTabName(path, queryParams) {
            this.$router.push({
                path: path,
                query: queryParams ? queryParams : {}
            });
        },

        openLink(url) {
            window.open(url, '_blank').focus();
        },

        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },

        loadData() {
          this.payoutsApyData = null;
          this.payoutsTvlData = null;
          this.payoutsApyDataDict = null;
          this.payouts = null;

          this.loadPayouts(this.tabApiUrl);
        },

        loadPayouts(_appApiUrl) {
          this.isPayoutsLoading = true;

          payoutsApiService.getPayouts(_appApiUrl)
              .then(data => {
                this.payouts = data
                let clientData = data;

                let widgetDataDict = {};
                let widgetData = {
                  labels: [],
                  datasets: [
                    {
                      fill: false,
                      borderColor: '#69a5fd',
                      data: [],
                    }
                  ]
                };

                [...clientData].reverse().forEach(item => {
                  widgetDataDict[moment(item.payableDate).format('DD.MM.YYYY')] = parseFloat(item.annualizedYield ? item.annualizedYield : 0.0).toFixed(2);
                });

                this.payoutsApyDataDict = widgetDataDict;

                for(let key in widgetDataDict) {
                  widgetData.labels.push(key);
                  widgetData.datasets[0].data.push(widgetDataDict[key]);
                }

                this.payoutsApyData = widgetData;

                let widgetDataDictTvl = {};
                let widgetDataTvl = {
                  labels: [],
                  datasets: [
                    {
                      fill: false,
                      borderColor: '#69a5fd',
                      data: [],
                    }
                  ]
                };

                [...clientData].reverse().forEach(item => {
                  widgetDataDictTvl[moment(item.payableDate).format('DD.MM.YYYY')] = parseFloat(item.totalUsdc ? item.totalUsdc : 0.0).toFixed(2);
                });

                for(let key in widgetDataDictTvl) {
                  widgetDataTvl.labels.push(key);
                  widgetDataTvl.datasets[0].data.push(widgetDataDictTvl[key]);
                }

                this.payoutsTvlData = widgetDataTvl;

                this.isPayoutsLoading = false;
              })
              .catch(e => {
                this.isPayoutsLoading = false;
                console.error("Payouts loading error: ", e)
              })
        },

        redeemAction() {
            this.showRedeemView();
            this.showSwapModal();
        }
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 32px;
        line-height: 40px;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
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

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .ready-label {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 32px;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 15px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-filled, .btn-outlined {
        width: 40% !important;
    }

    .toggle-row {
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

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }

    .rate-tab-btn {
        height: 40px !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .ready-label {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 32px;
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

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }

    .rate-tab-btn {
        height: 40px !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .ready-label {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 32px;
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
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 48px;
        line-height: 60px;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 28px;
    }

    .rate-tab-btn {
        height: 40px !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .ready-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
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

.tab-button {
    border-bottom: 2px solid var(--links-blue) !important;
    color: var(--links-blue) !important;
    cursor: pointer !important;
}

.tab-button-in-active {
    color: var(--secondary-gray-text) !important;
    cursor: pointer !important;
}

.toggle-row {
    border-bottom: 2px solid var(--main-border);
    width: 200% !important;
}

.title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.info-card-container {
    background: var(--secondary);
    border-radius: 12px;
}

.info-card-body-bottom {
    margin: 2% 2% !important;
}

.section-title-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    text-transform: capitalize;
    color: var(--secondary-gray-text);
}

.scroll-container {
    height: 24px !important;
    background: var(--scroll-color) !important;
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

.ready-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--main-gray-text);
}

.tab-btn {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--secondary-gray-text);
    margin-bottom: -2px;
    cursor: pointer;
}

.tab-btn-disabled {
    cursor: default;
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

.balance-network-icon {
    width: 2% !important;
    height: auto !important;
}
</style>
