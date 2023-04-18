<template>
    <div class="page-container">
        <div class="mt-10">
            <label class="title-label">dai+ Performance</label>
        </div>

        <div v-if="!isPayoutsLoading">
            <v-row v-if="networkId === 10 || networkId === 42161">
                <template v-if="$wu.isMobile()">
                    <v-col cols="12" align="center" class="mt-10">
                        <v-btn class="header-btn btn-filled mr-5" @click="mintAction">
                            Mint DAI+
                        </v-btn>
                        <v-btn class="header-btn btn-outlined" @click="redeemAction">
                            Redeem DAI+
                        </v-btn>
                    </v-col>
                </template>
                <v-col cols="6">
                    <v-row class="ma-0 mt-10 toggle-row ml-3">
                        <label class="tab-btn mr-4" @click="setTab('optimism')" v-bind:class="activeTabOptimism">Optimism</label>
                        <label class="tab-btn mx-4" @click="setTab('arbitrum')" v-bind:class="activeTabArbitrum">Arbitrum</label>
                    </v-row>
                </v-col>
                <template v-if="!$wu.isMobile()">
                    <v-col align="end" cols="6" class="mt-6">
                        <v-btn class="header-btn btn-filled mr-5" @click="mintAction">
                            Mint DAI+
                        </v-btn>
                        <v-btn class="header-btn btn-outlined mr-3" @click="redeemAction">
                            Redeem DAI+
                        </v-btn>
                    </v-col>
                </template>
            </v-row>
        </div>

      <div v-if="networkId === 10 || networkId === 42161">
        <v-row v-if="isPayoutsLoading">
          <v-row align="center" justify="center" class="py-15">
            <v-progress-circular
                width="2"
                size="24"
                color="#8FA2B7"
                indeterminate
            ></v-progress-circular>
          </v-row>
        </v-row>

        <v-row
            v-if="!isPayoutsLoading && !$wu.isMobile()"
            class="ma-0"
            justify="start"
            align="center"
        >
          <v-col cols="6">
            <div class="info-card-container py-3">
              <LineChartApy
                  :data="payoutsApyData"
                  asset-type="dai+"
                  :network-name="tab"
              />
            </div>
          </v-col>
          <v-col cols="6">
            <div class="info-card-container py-3">
              <LineChartTvl
                  :data="payoutsTvlData"
                  asset-type="dai+"
                  :network-name="tab"
              />
            </div>
          </v-col>
        </v-row>

        <v-row v-else-if="!isPayoutsLoading && $wu.isMobile()" class="ma-0 mt-5 info-card-container" justify="start" align="center">
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

            <LineChartApy
                  v-if="rateTab === 1"
                  :data="payoutsApyData"
                  class="mx-n3"
                  asset-type="dai+"
                  :network-name="tab"
            />
            <LineChartTvl
                v-if="rateTab === 3"
                :data="payoutsTvlData"
                class="mx-n3"
                asset-type="dai+"
                :network-name="tab"
            />
          </v-col>
        </v-row>

        <v-row v-if="!isPayoutsLoading" class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-5' : 'mt-4'" justify="start" align="center">
          <v-col class="info-card-body-bottom">
            <v-row align="center" justify="start" class="ma-0">
              <label class="section-title-label">DAI+ payouts</label>
                <div class="balance-network-icon ml-3">
                    <v-img :src="icon"/>
                </div>
            </v-row>

            <v-row align="center" justify="center">
              <v-col :cols="!$wu.isFull() ? 12 : 8">
                <Table
                    v-if="!$wu.isMobile()"
                    :profit-label="assetName + ' per DAI+'"
                    :payout-data="payouts"
                    :network-name="tab"
                />

                <Table
                    v-else
                    minimized
                    :profit-label="assetName + ' per DAI+'"
                    :payout-data="payouts"
                    :network-name="tab"
                />

                <v-row justify="center" align="center" class="ma-0 mb-10 scroll-container">
                  <label class="table-scroll-label">scroll to see more</label>
                </v-row>
              </v-col>

              <v-col :cols="!$wu.isFull() ? 12 : 4">
                <Doughnut
                      :last-date="lastPayoutDate"
                      :size="280"
                      color="#3D8DFF"
                      :network-name="tab"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>

      <div v-else class="ma-0 info-card-container d-flex mt-3">
        <div class="" :class="$wu.isMobile() ? 'ml-5 mr-5 mt-5' : 'ml-10 mr-5 my-5'" >
          <v-img class="currency" :src="require('@/assets/currencies/DAI+.svg')" />
        </div>
        <div class="info-card-container-box" :class="$wu.isMobile() ? 'mt-5 mb-5 mr-5' : 'mt-0'" >
          <label class="section-text">
            DAI+ is the equivalent of USD+, pegged to DAI 1:1. DAI+ consist of aDAI (Aave) and USD+. It has been designed for boosted pools (Balancer and Beethoven) on Optimism. It cannot be minted separately.
          </label>
          <div class="section-text font-weight-bold">
            Switch on Optimism or Arbitrum chain to see DAI+ collateral.
          </div>
        </div>
      </div>

        <div v-if="networkId !== 10 && networkId !== 42161"
             :class="$wu.isMobile() ? 'flex-column' : ''"
             class="mt-3 buttons-div" >
            <v-btn class="footer-btn btn-filled mr-5" @click.stop="setWalletNetwork('10')">
                switch to optimism to mint
            </v-btn>
            <v-btn class="footer-btn btn-filled" @click.stop="setWalletNetwork('42161')">
                switch to arbitrum to mint
            </v-btn>
        </div>


      <resize-observer v-if="!isPayoutsLoading" @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import Table from "@/components/market/strategy/payouts/Table";
import Doughnut from "@/components/market/strategy/payouts/Doughnut";
import {mapActions, mapGetters} from "vuex";
import LineChartApy from "@/components/stats/widget/LineChartApy";
import LineChartTvl from "@/components/stats/widget/LineChartTvl";
import moment from "moment/moment";
import {payoutsApiService} from "@/services/payouts-api-service";
import polygonIcon from "@/assets/network/polygon.svg";
import optimismIcon from "@/assets/network/op.svg";
import bscIcon from "@/assets/network/bsc.svg";
import arbitrumIcon from "@/assets/network/ar.svg";
import zksyncIcon from "@/assets/network/zk.svg";

export default {
    name: "StatsDaiPerformanceView",

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
      ...mapGetters("network", ['networkId', 'assetName', 'appApiUrl', 'apiUrl', 'getParams', 'networkName']),

        tabNetworkName: function() {
            let params;
            params = this.getParams(this.tab)

            return params.networkName;
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
            return this.payouts && this.payouts.length ? this.payouts[0].payableDate : '';
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
        ...mapActions('swapDaiModal', ['showDaiSwapModal', 'showDaiMintView', 'showDaiRedeemView']),
        ...mapActions("network", ["setWalletNetwork"]),

        setTab(tabName) {
            this.tab = tabName;
            if (this.tab === 'optimism') {
                this.initTabName('/stats/dai', {tabName: 'optimism'});
            }

            if (this.tab === 'arbitrum') {
                this.initTabName('/stats/dai', {tabName: 'arbitrum'});
            }

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
            this.showDaiMintView();
            this.showDaiSwapModal();
        },

        loadData() {
          this.payoutsApyData = null;
          this.payoutsTvlData = null;
          this.payoutsApyDataDict = null;
          this.payouts = null;

          this.loadPayouts();
        },

        loadPayouts() {
          this.isPayoutsLoading = true;

          payoutsApiService.getPayouts(this.apiUrl + `/${this.tabNetworkName}/dai+`)
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
            this.showDaiRedeemView();
            this.showDaiSwapModal();
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
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
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

    .section-text {
        font-size: 14px;
        line-height: 22px;
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

    .rate-tab-btn {
        height: 40px !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
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

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .section-text {
        font-size: 16px;
        line-height: 24px;
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

    .rate-tab-btn {
        height: 40px !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
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

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
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

    .rate-tab-btn {
        height: 40px !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 28px;
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

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 15px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .section-text {
      font-size: 17px;
      line-height: 28px;
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

.info-card-container-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
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

.section-text {
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  color: var(--main-gray-text);
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

.balance-network-icon {
    width: 2% !important;
    height: auto !important;
}
</style>
