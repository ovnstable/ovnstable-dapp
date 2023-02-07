<template>
    <div>
        <div class="mt-10">
            <label class="title-label">featured</label>
        </div>

        <div class="mt-7 cards-list-container">
          <v-row v-if="!isAllDataLoaded && isResorting">
            <v-row align="center" justify="center" class="py-15">
              <v-progress-circular
                  width="2"
                  size="24"
                  color="#8FA2B7"
                  indeterminate
              ></v-progress-circular>
            </v-row>
          </v-row>
            <v-row v-else class="d-flex" justify="start">
                <v-col :cols="$wu.isMobile() ? 12 : ($wu.isTablet() ? 6 : 4)"
                       v-for="card in sortedCardList.filter(value => (!value.isPrototype && !value.isArchive)).slice(0, 3)"
                       :key="card.id">
                    <v-row class="fill-height">
                        <component
                            class="ma-3"
                            v-bind:key="card.id"
                            :card-data="card"
                            v-bind:is="card.name"
                        ></component>
                    </v-row>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import moment from "moment";
import Ets from "@/components/market/cards/ets/Ets";
import UsdPlus from "@/components/market/cards/hold/UsdPlus";
import InsuranceCard from "@/components/insurance/cards/insurance/InsuranceCard";

import {widgetApiService} from "@/services/widget-api-service";
import {usdPlusApiService} from "@/services/usd-plus-api-service";

import {insuranceApiService} from "@/services/insurance-api-service";
import {axios} from "@/plugins/http-axios";


export default {
    name: "FeaturedView",

    components: {
        Ets,
        UsdPlus,
        InsuranceCard,
    },

    data: () => ({
      openedList: false,
      tab: null,
      avgApy: null,
      sortedCardList: [],

      isResorting: true,

      isStrategyDataLoading: true,
      isClientDataLoading: true,
      isTotalSupplyLoading: true,
      isUsdPlusPayoutsDataLoading: true,

      etsTvlData: {},
      etsApyData: {},
      etsClientData: {},
      etsStrategyData: {},
      usdPlusApyData: {},

      currentTotalData: {},
      totalUsdPlusValue: null,
      // insuranceStrategyData: {},

      totalSupply: {},
      // totalInsuranceSupply: 0,

    }),

  computed: {
    ...mapGetters('network', ['appApiUrl', 'networkId', 'polygonConfig', 'bscConfig', 'opConfig']),
    ...mapGetters('accountData', ['account']),
    ...mapGetters('web3', ['contracts', 'web3']),
    // ...mapGetters('supplyData', ['totalSupply', 'totalInsuranceSupply']),
    // ...mapGetters('insuranceData', ['insuranceStrategyData']),
    ...mapGetters('etsAction', ['etsList']),

    isAllDataLoaded: function () {
      return !this.isStrategyDataLoading &&
          !this.isClientDataLoading &&
          !this.isUsdPlusPayoutsDataLoading &&
          !this.isTotalSupplyLoading;
    },

    activeTabName: function() {
      return this.$route.query.tabName || 'featured';
    },

    activeTabFeatured: function () {
      return {
        'tab-button': this.tab === 1,
        'tab-button-in-active': this.tab !== 1,
      }
    },

    activeTabHedged: function () {
      return {
        'tab-button': this.tab === 2,
        'tab-button-in-active': this.tab !== 2,
      }
    },

    activeTabUsd: function () {
      return {
        'tab-button': this.tab === 3,
        'tab-button-in-active': this.tab !== 3,
      }
    },

    activeTabPools: function () {
      return {
        'tab-button': this.tab === 4,
        'tab-button-in-active': this.tab !== 4,
      }
    },
  },
  watch: {
    networkId: function (newVal, oldVal) {
      this.getUsdPlusAvgMonthApy();
      this.getSortedCardList();
    },

    etsList: function (newVal, oldVal) {
      if (newVal) {
        this.loadData();
      }
    },

    isAllDataLoaded: function (newVal, oldVal) {
      if (newVal) {
        this.getUsdPlusAvgMonthApy();
        this.getSortedCardList();
      }
    },

    activeTabName() {
      this.initTab();
    },
  },

  created() {
  },

  mounted() {
    console.log(this.$route.query.tabName);
    this.initTab();
    this.loadData();
  },

  methods: {

    setTab(tabId) {
      this.tab = tabId;
    },

    initTab() {
      if(this.$route.query.tabName === 'featured') {
        this.setTab(1);
      }

      if(this.$route.query.tabName === 'ets') {
        this.setTab(2);
      }

      if(this.$route.query.tabName === 'usdPlus') {
        this.setTab(3);
      }

      if(this.$route.query.tabName === 'usdPlusPools') {
        this.setTab(4);
      }
    },

    loadData() {
      this.isStrategyDataLoading = true;
      this.isClientDataLoading = true;
      this.isUsdPlusPayoutsDataLoading = true;
      this.isTotalSupplyLoading = true;
      this.refreshMarket();
    },

    addEtsStrategyData(etsDataParams) {
      let data = etsDataParams.data;

      if (!data.tvl || data.tvl < 0.0001) {
        if (data.timeData && data.timeData.length > 0) {
          data.tvl = data.timeData[data.timeData.length - 1].tvl;
        }
      }

      this.etsStrategyData[etsDataParams.name] = data;
    },
    addEtsClientData(etsClientDataParams) {
      this.etsClientData[etsClientDataParams.name] = etsClientDataParams.data;
    },

    addEtsApyData(etsApyDataParams) {
      this.etsApyData[etsApyDataParams.name] = etsApyDataParams.data;
    },

    addEtsTvlData(etsTvlDataParams) {
      this.etsTvlData[etsTvlDataParams.name] = etsTvlDataParams.data;
    },

    addUsdPlusApyData(usdPlusApyDataParams) {
      this.usdPlusApyData[usdPlusApyDataParams.name] = usdPlusApyDataParams.data;
      console.log('MarketData: refreshUsdPlusPayoutsData this.usdPlusApyData', this.usdPlusApyData);
    },

    async refreshSupply() {

      console.log('Supply: refreshSupply start');

      let networkId = this.networkId;

      let resultSupply = {};

      let etsList = this.etsList;

      for (let i = 0; i < etsList.length; i++) {
        let ets = etsList[i];
        let etsSupply = null;

        if (ets.chain === networkId) {
          try {
            etsSupply = await this.contracts[ets.tokenContract].methods.totalSupply().call();
            etsSupply = this.web3.utils.fromWei(etsSupply, ets.etsTokenDecimals === 18 ? 'ether' : 'mwei');
          } catch (e) {
            try {
              etsSupply = this.etsStrategyData[ets.name].tvl;
            } catch (ex) {
              //console.error('Equal chain supply error. Name:' + ets.name + ' chain: ' + ets.chain, ex)
            }
          }
        } else {
          try {
            etsSupply = this.etsStrategyData[ets.name].tvl;
          } catch (ex) {
            //console.error('Supply error. Name:' + ets.name + ' chain: ' + ets.chain, ex)
          }
        }

        resultSupply[ets.name] = etsSupply;
      }

      this.totalSupply = resultSupply;
      this.isTotalSupplyLoading = false;
      console.log('Supply: refreshSupply end', this.totalSupply);

    },

    async refreshInsuranceSupply() {

      console.log('Supply: refreshInsuranceSupply');

      let networkId = this.networkId;

      let resultSupply = {};

      let insuranceList = [
        {
          chainName: 'polygon',
          chainId: 137,
        },
      ];

      for (let i = 0; i < insuranceList.length; i++) {
        let insurance = insuranceList[i];
        let supply;

        if (insurance.chainId === networkId) {
          try {
            supply = await this.contracts.insurance[insurance.chainName + '_m2m'].methods.totalNetAssets().call()
            supply = this.web3.utils.fromWei(supply, 'mwei');
          } catch (e) {
            supply = this.insuranceStrategyData[insurance.chainName].lastTvl;
          }
        } else {
          try {
            supply = this.insuranceStrategyData[insurance.chainName].lastTvl;
          } catch (e) {
            console.log("Error: ", e)
          }
        }

        resultSupply[insurance.chainName] = supply;
      }

      this.totalInsuranceSupply = resultSupply;
    },

    async refreshMarket() {
      console.log('MarketData: refreshMarket this.etsList', this.etsList);
      if (this.etsList) {
        await this.refreshStrategyData();
        await this.refreshClientData();
        await this.refreshUsdPlusPayoutsData();
        await this.refreshSupply();
        // await this.refreshInsuranceSupply();
      }
    },

    async refreshStrategyData() {
      console.log('MarketData: refreshStrategyData', this.etsList);

      this.isStrategyDataLoading = true;

      await Promise.all(
          this.etsList.map(async ets => {

            let refreshParams = {contractAddress: ets.address, strategyName: ets.name, chain: ets.chain};
            let appApiUrl;

            switch (refreshParams.chain) {
              case 137:
                appApiUrl = this.polygonConfig.appApiUrl;
                break;
              case 10:
                appApiUrl = this.opConfig.appApiUrl;
                break;
              case 56:
                appApiUrl = this.bscConfig.appApiUrl;
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

            console.log('MarketData: refreshStrategyData ', appApiUrl);

            await fetch(appApiUrl + '/widget/avg-apy-info/month', fetchOptions)
                .then(value => value.json())
                .then(value => {
                  avgApy = value;
                  avgApy.date = moment(avgApy.date).format("DD MMM. ‘YY");
                }).catch(reason => {
                  console.log('Error get data: ' + reason);
                })

            await fetch(appApiUrl + '/hedge-strategies/' + refreshParams.contractAddress + '/avg-apy-info/month', fetchOptions)
                .then(value => value.json())
                .then(value => {
                  avgApyStrategyMonth = value;
                  avgApyStrategyMonth.date = moment(avgApyStrategyMonth.date).format("DD MMM. ‘YY");
                }).catch(reason => {
                  console.log('Error get data: ' + reason);
                })

            await fetch(appApiUrl + '/hedge-strategies/' + refreshParams.contractAddress, fetchOptions)
                .then(value => value.json())
                .then(value => {
                  strategyData = value;
                  strategyData.lastApy = strategyData.apy;
                  strategyData.apy = (avgApyStrategyMonth && avgApyStrategyMonth.value) ? (avgApyStrategyMonth.value) : strategyData.apy;
                  strategyData.diffApy = (avgApy && avgApy.value && strategyData.apy) ? (strategyData.apy - avgApy.value) : null;

                  /* TODO: get onChain */
                  strategyData.targetHealthFactor = 1.2;

                  strategyData.payoutItems.sort(
                      function(o1,o2){
                        return moment(o1.payableDate).isBefore(moment(o2.payableDate)) ? -1 : moment(o1.payableDate).isAfter(moment(o2.payableDate)) ? 1 : 0;
                      }
                  );

                  strategyData.timeData.sort(
                      function(o1,o2){
                        return moment(o1.date).isBefore(moment(o2.date)) ? -1 : moment(o1.date).isAfter(moment(o2.date)) ? 1 : 0;
                      }
                  );

                  let clientData = strategyData.timeData;

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

                  [...clientData].forEach(item => {
                    widgetDataDict[moment(item.date).format('DD.MM.YYYY')] = parseFloat(item.apy ? item.apy : 0.0).toFixed(2);
                  });

                  for(let key in widgetDataDict) {
                    widgetData.labels.push(key);
                    widgetData.datasets[0].data.push(widgetDataDict[key]);
                  }

                  this.addEtsApyData({ name: refreshParams.strategyName, data: widgetData});

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
                    widgetTvlDataDict[moment(item.date).format('DD.MM.YYYY')] = parseFloat(item.tvl ? item.tvl : 0.0).toFixed(2);
                  });

                  for(let key in widgetTvlDataDict) {
                    widgetTvlData.labels.push(key);
                    widgetTvlData.datasets[0].data.push(widgetTvlDataDict[key]);
                  }

                  console.log('MarketData: refreshStrategyData 3', widgetTvlData);
                  this.addEtsTvlData({ name: refreshParams.strategyName, data: widgetTvlData});
                }).catch(reason => {
                  console.error('Error load market data get data: ' + reason);
                })

            this.addEtsStrategyData({ name: refreshParams.strategyName, data: strategyData});
            this.isStrategyDataLoading = false;
          })
      );
    },

    async refreshClientData() {
      console.log('MarketData: refreshClientData', this.etsList);
      this.isClientDataLoading = true;

      if (!this.account){
        this.isClientDataLoading = true;
        return;
      }

      await Promise.all(
          this.etsList.map(async ets => {

            let refreshParams = {contractAddress: ets.address, strategyName: ets.name, chain: ets.chain};
            let appApiUrl;

            switch (refreshParams.chain) {
              case 137:
                appApiUrl = this.polygonConfig.appApiUrl;
                break;
              case 10:
                appApiUrl = this.opConfig.appApiUrl;
                break;
              case 56:
                appApiUrl = this.bscConfig.appApiUrl;
                break;
              default:
                appApiUrl = this.polygonConfig.appApiUrl;
                break;
            }

            let account = this.account.toLowerCase();
            let profitDay = null;

            let fetchOptions = {
              headers: {
                "Access-Control-Allow-Origin": appApiUrl
              }
            };

            await fetch(appApiUrl + '/hedge-strategies/' + refreshParams.contractAddress + '/account/' + account, fetchOptions)
                .then(value => value.json())
                .then(value => {
                  profitDay = value.profit;
                }).catch(reason => {
                  console.log('Error get data: ' + reason);
                })

            this.addEtsClientData({ name: refreshParams.strategyName, data: profitDay});
            this.isClientDataLoading = false;
          })
      );
    },

    async refreshUsdPlusPayoutsData() {
      console.log('MarketData: refreshUsdPlusPayoutsData');
      this.isUsdPlusPayoutsDataLoading = true;

      await Promise.all(
          ['polygon', 'bsc', 'optimism'].map(async network => {

            let appApiUrl;

            switch (network) {
              case "polygon":
                appApiUrl = this.polygonConfig.appApiUrl;
                break;
              case "bsc":
                appApiUrl =  this.bscConfig.appApiUrl;
                break;
              case "optimism":
                appApiUrl = this.opConfig.appApiUrl;
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

                  console.log('MarketData: refreshUsdPlusPayoutsData addapy', resultDataList);
                  this.addUsdPlusApyData({ name: network, data: resultDataList});
                  this.isUsdPlusPayoutsDataLoading = false;
                })
          })
      );
    },
    getSortedCardList() {
      let networkId = this.networkId;
      this.isResorting = true;

      let cardList = [
        {
          id: 'usdPlus' + networkId,
          type: 'usdPlus',
          name: 'UsdPlus',
          isPrototype: false,
          isArchive: false,
          chain: networkId,
          hasUsdPlus: true,
          overcapEnabled: false,
          hasCap: true,
          tvl: this.usdPlusValue,
          monthApy: this.avgApy ? this.avgApy.value : 0,
        },
      ];

      this.etsList.forEach(ets => {
        cardList.push(
            {
              id: 'ets' + ets.chain + ets.name,
              type: 'ets',
              name: 'Ets',
              isPrototype: ets.prototype,
              isOpenPrototype: ets.openPrototype,
              isArchive: ets.archive,
              data: ets,
              chain: ets.chain,
              hasUsdPlus: ets.hasUsdPlus,
              overcapEnabled: (!!(ets.maxSupply && ets.maxSupply > 0)),
              hasCap: ets.maxSupply ? (this.totalSupply[ets.name] < ets.maxSupply) : true,
              tvl: this.totalSupply[ets.name],
              monthApy: (this.etsStrategyData[ets.name] && this.etsStrategyData[ets.name].apy) ? this.etsStrategyData[ets.name].apy : 0,
              cardOpened: false,
            },
        );
      });
      //
      // if (networkId === 137) {
      //   cardList.push(
      //       {
      //         id: 'insurance' + networkId,
      //         type: 'insurance',
      //         name: 'InsuranceCard',
      //         isPrototype: false,
      //         isArchive: false,
      //         chain: networkId,
      //         hasUsdPlus: true,
      //         overcapEnabled: false,
      //         hasCap: this.totalInsuranceSupply,
      //         tvl: this.insuranceData.strategyData.lastApy,
      //         monthApy: this.insuranceData.strategyData.apy ? this.insuranceData.strategyData.apy : 0,
      //         cardOpened: false,
      //       },
      //   );
      // }


      cardList.sort(function (a, b) {
        if (!a.isPrototype && b.isPrototype) return -1;
        if (a.isPrototype && !b.isPrototype) return 1;

        if (!a.isArchive && b.isArchive) return -1;
        if (a.isArchive && !b.isArchive) return 1;

        if (a.chain === networkId && b.chain !== networkId) return -1;
        if (a.chain !== networkId && b.chain === networkId) return 1;

        if (a.monthApy > b.monthApy) return -1;
        if (a.monthApy < b.monthApy) return 1;

        if (a.hasCap && !b.hasCap) return -1;
        if (!a.hasCap && b.hasCap) return 1;

        return 0;
      });

      cardList[0].cardOpened = true;
      this.sortedCardList = cardList;
      console.log("Cards be sorted: 1", this.isResorting)
      this.isResorting = false;
      console.log("Cards be sorted: 2", this.isResorting)
    },

    async getUsdPlusAvgMonthApy() {
      let fetchOptions = {
        headers: {
          "Access-Control-Allow-Origin": this.appApiUrl
        }
      };

      await fetch(this.appApiUrl + '/widget/avg-apy-info/month', fetchOptions)
          .then(value => value.json())
          .then(value => {
            this.avgApy = value;
            this.avgApy.date = moment(this.avgApy.date).format("DD MMM. ‘YY");
          }).catch(reason => {
            console.log('Error get data: ' + reason);
          })
    },
  }
}

</script>
<style scoped>

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
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
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
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
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
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}
</style>
