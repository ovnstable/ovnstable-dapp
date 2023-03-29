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
              <v-row align="center" justify="start" class="ma-0">
                  <v-col class="ml-n3 mt-n3">
                      <v-btn outlined class="rate-tab-btn" @click="rateTab=1" v-bind:class="activeRateApy">
                          CUMULATIVE RETURN
                      </v-btn>
                  </v-col>
                  <v-col class="mr-n3 mt-n3">
                      <v-btn outlined class="rate-tab-btn" @click="rateTab=3" v-bind:class="activeRateTvl">
                          TVL
                      </v-btn>
                  </v-col>
              </v-row>

              <ChartApy class="mx-n3" v-if="rateTab === 1" :data="insurancePerformanceData.polygon" :usdPlusData="usdPlusApyData.polygon" :insurance-data="insuranceData" :compound-data="compoundData"/>
              <ChartTvl class="mx-n3" v-if="rateTab === 3" :data="insuranceTvlData.polygon" :insurance-data="insuranceData"/>
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
import moment from "moment/moment";
import {axios} from "@/plugins/http-axios";

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
        isUsdPlusPayoutsDataLoading: true,
        isClientDataLoading: true,
        isStrategyDataLoading: true,

        insuranceStrategyData: {},
        insuranceClientData: {},
        insuranceApyData: {},
        insurancePerformanceData: {},
        insuranceTvlData: {},
        insuranceRedemptionData: {},

        usdPlusApyData: {},

        compoundData: {
          day: 0.00,
          week: 0.00,
          month: 0.00,
          all: 0.00,
        }
      }),

    props: {

        insuranceData: {
            type: Object,
        },
    },

    watch: {

    },

    computed: {
      ...mapGetters('network', ['appApiUrl', 'networkId', 'polygonConfig', 'bscConfig', 'opConfig', 'arConfig', 'zkConfig']),
      ...mapGetters('accountData', ['account']),
      ...mapGetters('web3', ['contracts', 'web3']),

      isAllDataLoaded: function () {
        return !this.isUsdPlusPayoutsDataLoading && !this.isClientDataLoading && !this.isStrategyDataLoading;
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
        let data = this.insuranceStrategyData.polygon;
        return data ? data.payouts[0].payableDate : null;
      },
      payouts: function () {
        let data = this.insuranceStrategyData.polygon;
        return data ? data.payouts.sort(
            function(o1,o2){
              return moment(o2.payableDate).isBefore(moment(o1.payableDate)) ? -1 : moment(o2.payableDate).isAfter(moment(o1.payableDate)) ? 1 : 0;
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

        let insuranceChainList = [
          {
            chainName: 'polygon',
            chainId: 137
          }
        ];

        for (let insuranceChain of insuranceChainList) {
          this.refreshStrategyData({chain: insuranceChain});
        }

        for (let insuranceChain of insuranceChainList) {
          this.refreshClientData( {chain: insuranceChain});
        }

        this.refreshUsdPlusPayoutsData("polygon");
        this.refreshUsdPlusPayoutsData("bsc");
        this.refreshUsdPlusPayoutsData("optimism");
        this.refreshUsdPlusPayoutsData("arbitrum");
        this.refreshUsdPlusPayoutsData("zksync");
      },

      async refreshStrategyData(refreshParams) {
        let appApiUrl;

        this.isStrategyDataLoading = true;

        switch (refreshParams.chain.chainId) {
          case 137:
            appApiUrl = this.polygonConfig.appApiUrl;
            break;
          case 10:
            appApiUrl = this.opConfig.appApiUrl;
            break;
          case 56:
            appApiUrl = this.bscConfig.appApiUrl;
            break;
          case 42161:
            appApiUrl = this.arConfig.appApiUrl;
            break;
          case 324:
            appApiUrl = this.zkConfig.appApiUrl;
            break;
          default:
            appApiUrl = this.polygonConfig.appApiUrl;
            break;
        }

        let fetchOptions = {
          headers: {
            "Access-Control-Allow-Origin": appApiUrl
          }
        };

        let avgApy;
        let avgApyStrategyMonth;
        let strategyData;

        await fetch(appApiUrl + '/widget/avg-apy-info/month', fetchOptions)
            .then(value => value.json())
            .then(value => {
              avgApy = value;
              avgApy.date = moment(avgApy.date).format("DD MMM. ‘YY");
            }).catch(reason => {
              console.log('Error get data: ' + reason);
            })

        await fetch(appApiUrl + '/insurance/avg-apy-info/month', fetchOptions)
            .then(value => value.json())
            .then(value => {
              avgApyStrategyMonth = value;
              avgApyStrategyMonth.date = moment(avgApyStrategyMonth.date).format("DD MMM. ‘YY");
            }).catch(reason => {
              console.log('Error get data: ' + reason);
            })

        await fetch(appApiUrl + '/insurance/', fetchOptions)
            .then(value => value.json())
            .then(value => {
              strategyData = value;

              strategyData.apy = (avgApyStrategyMonth && avgApyStrategyMonth.value) ? (avgApyStrategyMonth.value) : strategyData.lastApy;
              strategyData.diffApy = (avgApy && avgApy.value && strategyData.apy) ? (strategyData.apy - avgApy.value) : null;

              strategyData.chainId = refreshParams.chain.chainId;

              strategyData.payouts.sort(
                  function(o1,o2){
                    return moment(o1.payableDate).isBefore(moment(o2.payableDate)) ? -1 : moment(o1.payableDate).isAfter(moment(o2.payableDate)) ? 1 : 0;
                  }
              );

              let clientData = strategyData.payouts;

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

              let startValue = 1;
              let accumulator = startValue;
              let accumulatorDay = startValue;
              let accumulatorWeek = startValue;
              let accumulatorMonth = startValue;

              // let i = 0;
              let clientDataPreferment = [...clientData];
              let clientDataLengthCounter = clientDataPreferment.length;
              for (let i = 0; i < clientDataPreferment.length; i++){
                const payout = clientDataPreferment[i];
                try {

                  // all
                  accumulator = accumulator * (1 + payout.dailyProfit);
                  payout.comp =  (accumulator * 100 / startValue - 100);
                  payout.comp =  parseFloat(payout.comp ? payout.comp : 0.0).toFixed(3);
                  widgetDataDict[moment(payout.payableDate).format('DD.MM.YYYY')] = payout.comp;

                  // date
                  if (i === 0) {
                    this.compoundData.firstDate = moment(payout.payableDate).format('MMM D, YYYY');
                  }


                  // week
                  if (clientDataLengthCounter <= 7) {
                    accumulatorWeek = accumulatorWeek * (1 + payout.dailyProfit);
                  }

                  // month
                  if (clientDataLengthCounter <= 30) {
                    accumulatorMonth = accumulatorMonth * (1 + payout.dailyProfit);
                  }

                  // day
                  if (clientDataLengthCounter === 1) {
                    // day
                    accumulatorDay = accumulatorDay * (1 + payout.dailyProfit);
                    let dayComp = (accumulatorDay * 100 / startValue - 100);
                    this.compoundData.day = parseFloat(dayComp ? dayComp : 0.0).toFixed(3)


                    // week
                    let weekComp = (accumulatorWeek * 100 / startValue - 100);
                    this.compoundData.week = parseFloat(weekComp ? weekComp : 0.0).toFixed(3)

                    // month
                    let monthComp = (accumulatorMonth * 100 / startValue - 100);
                    this.compoundData.month = parseFloat(monthComp ? monthComp : 0.0).toFixed(3)

                    this.compoundData.all = payout.comp // last payout comp
                  }

                  clientDataLengthCounter--;
                } catch (e) {
                  console.error("strategyData build Widget Data Dict insurance error:", e)
                }
              }

              for(let key in widgetDataDict) {
                widgetData.labels.push(key);
                widgetData.datasets[0].data.push(widgetDataDict[key] > 500 ? 500.00 : widgetDataDict[key]);
              }

              this.addInsurancePerformanceData({name: refreshParams.chain.chainName, data: widgetData});


              let widgetTvlDataDict = {};
              let widgetTvlData = {
                labels: [],
                datasets: [
                  {
                    fill: false,
                    borderColor: '#1C95E7',
                    data: [],
                  }
                ]
              };

              [...clientData].forEach(item => {
                try {
                  widgetTvlDataDict[moment(item.payableDate).format('DD.MM.YYYY')] = parseFloat(item.tvl ? item.tvl : 0.0).toFixed(2);
                } catch (e) {
                  console.error("strategyData build Widget Tvl Dict insurance error:", e)
                }
              });

              for(let key in widgetTvlDataDict) {
                widgetTvlData.labels.push(key);
                widgetTvlData.datasets[0].data.push(widgetTvlDataDict[key]);
              }

              this.addInsuranceTvlData({ name: refreshParams.chain.chainName, data: widgetTvlData});
            }).catch(reason => {
              console.log('Error get data: ' + reason);
            })

        this.addInsuranceStrategyData({ name: refreshParams.chain.chainName, data: strategyData});
        this.isStrategyDataLoading = false;
      },

      async refreshClientData(refreshParams) {
        let appApiUrl;

        this.isClientDataLoading = true;

        switch (refreshParams.chain.chainId) {
          case 137:
            appApiUrl = this.polygonConfig.appApiUrl;
            break;
          case 10:
            appApiUrl = this.opConfig.appApiUrl;
            break;
          case 56:
            appApiUrl = this.bscConfig.appApiUrl;
            break;
          case 42161:
            appApiUrl = this.arConfig.appApiUrl;
            break;
          case 324:
            appApiUrl = this.zkConfig.appApiUrl;
            break;
          default:
            appApiUrl = this.polygonConfig.appApiUrl;
            break;
        }

        if (!this.account){
          this.isClientDataLoading = false;
          return;
        }

        let account = this.account.toLowerCase();
        let profitDay = null;

        let fetchOptions = {
          headers: {
            "Access-Control-Allow-Origin": appApiUrl
          }
        };

        await fetch(appApiUrl + '/insurance/account/' + account, fetchOptions)
            .then(value => value.json())
            .then(value => {
              profitDay = value.profit;
            }).catch(reason => {
              console.log('Error get data: ' + reason);
            })

        this.addInsuranceClientData({ name: refreshParams.chain.chainName, data: profitDay});
        this.isClientDataLoading = false;

        await this.refreshIsNeedRedemption();
      },

      async refreshUsdPlusPayoutsData(network) {
        console.log('InsuranceData: refreshUsdPlusPayoutsData', network);

        this.isUsdPlusPayoutsDataLoading = true;

        let appApiUrl;

        switch (network) {
          case "polygon":
            appApiUrl = this.polygonConfig.appApiUrl;
            break;
          case "bsc":
            appApiUrl = this.bscConfig.appApiUrl;
            break;
          case "optimism":
            appApiUrl = this.opConfig.appApiUrl;
            break;
          case "arbitrum":
            appApiUrl = this.arConfig.appApiUrl;
            break;
          case "zksync":
            appApiUrl = this.zkConfig.appApiUrl;
            break;
        }

        let fetchOptions = {
          headers: {
            "Access-Control-Allow-Origin": appApiUrl
          }
        };

        let resultDataList;

        axios.get(appApiUrl + `/dapp/payouts`, fetchOptions)
            .then(value => {
              let clientData = value.data;
              let widgetDataDict = {};

              [...clientData].reverse().forEach(item => {
                widgetDataDict[moment(item.payableDate).format('DD.MM.YYYY')] = parseFloat(item.annualizedYield ? item.annualizedYield : 0.0).toFixed(2);
              });

              resultDataList = widgetDataDict;

              this.addUsdPlusApyData({name: network, data: resultDataList});
              this.isUsdPlusPayoutsDataLoading = false;
            }).catch(e => {
              console.error("Error when load insurance payouts: ", e);
              this.isUsdPlusPayoutsDataLoading = false;
        })
      },

      async refreshIsNeedRedemption() {
        console.log('Insurance/redemptionCheck')

        let account = this.account;

        if (account) {
          let insurance = {
            chainName: 'polygon'
          }

          let date = await this.contracts.insurance[insurance.chainName + '_exchanger'].methods.withdrawRequests(account).call();
          try {
            date = parseFloat(date);
          } catch (e) {
            date = null;
          }

          if (date !== null) {
            let redemptionData = {
              request: null,
              date: null,
              hours: 0,
            }

            if (date === 0) {
              redemptionData.request = 'NEED_REQUEST';
              redemptionData.date = null;
              redemptionData.hours = 0;
            } else if (date > 0) {
              date = new Date(date  * 1000);
              let currentDate = new Date();

              if (currentDate.getTime() > date.getTime()) {
                let withdrawPeriod = await this.contracts.insurance[insurance.chainName + '_exchanger'].methods.withdrawPeriod().call();
                let withdrawDate = new Date(date.getTime() + (withdrawPeriod * 1000));

                if (withdrawDate.getTime() > currentDate.getTime()){
                  let hours = moment.duration(moment(withdrawDate).diff(moment(currentDate))).asHours();
                  redemptionData.request = 'CAN_WITHDRAW';
                  redemptionData.date = date;
                  redemptionData.hours = hours;
                } else {
                  redemptionData.request = 'NEED_REQUEST';
                  redemptionData.date = null;
                  redemptionData.hours = 0;
                }
              } else {
                let hours = moment.duration(moment(date).diff(moment(currentDate))).asHours();
                redemptionData.request = 'NEED_WAIT';
                redemptionData.date = date;
                redemptionData.hours = hours;
              }
            }

            console.log("REDEMPTION REQUEST: " + JSON.stringify(redemptionData))

            this.insuranceRedemptionData = redemptionData;
          }
        }
      },

      addInsuranceStrategyData(insuranceDataParams) {
        let insuranceData = this.insuranceStrategyData;
        let data = insuranceDataParams.data;

        if (!data.tvl || data.tvl < 0.0001) {
          if (data.payouts && data.payouts.length > 0) {
            data.tvl = data.payouts[data.payouts.length - 1].tvl;
          }
        }

        insuranceData[insuranceDataParams.name] = data;

        this.insuranceStrategyData = null;
        this.insuranceStrategyData = insuranceData;
      },

      addInsuranceClientData(insuranceClientDataParams) {
        this.insuranceClientData[insuranceClientDataParams.name] = insuranceClientDataParams.data;
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

      addUsdPlusApyData(usdPlusApyDataParams) {
        this.usdPlusApyData[usdPlusApyDataParams.name] = usdPlusApyDataParams.data;
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
