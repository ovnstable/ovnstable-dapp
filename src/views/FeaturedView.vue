<template>
    <div>
        <div class="mt-10">
            <label class="title-label">featured</label>
        </div>
        <v-row v-if="isAllDataLoaded && !isResorting" align="center" justify="start" class="ma-0 toggle-row mt-10">
            <label class="tab-btn mr-4" @click="setTab('optimism')" v-bind:class="activeTabOptimism">Optimism</label>
            <label class="tab-btn mx-4" @click="setTab('arbitrum')" v-bind:class="activeTabArbitrum">Arbitrum</label>
            <label class="tab-btn mx-4" @click="setTab('zksync')" v-bind:class="activeTabZkSync">ZkSync</label>
            <label class="tab-btn mx-4" @click="setTab('bsc')" v-bind:class="activeTabBsc">BSC</label>
            <label class="tab-btn mx-4" @click="setTab('polygon')" v-bind:class="activeTabPolygon">Polygon</label>
        </v-row>

        <div class="mt-7 cards-list-container">
            <v-row v-if="!isAllDataLoaded || isResorting">
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
                       v-for="card in sortedCardList.filter(value => (!value.openPrototype && !value.data.archive && value.hasCap)).slice(0, 3)"
                       :key="card.id">
                    <v-row class="fill-height">
                        <component
                            class="ma-3"
                            v-bind:key="card.id"
                            v-bind:is="card.name"
                            :card-data="card"
                            :network-name="tab"
                        ></component>
                    </v-row>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import Ets from "@/components/market/cards/ets/Ets";
import UsdPlus from "@/components/market/cards/hold/UsdPlus";
import InsuranceCard from "@/components/insurance/cards/insurance/InsuranceCard";
import {axios} from "@/plugins/http-axios";
import loadJSON from "@/utils/http-utils";
import {productInfoApiService} from "@/services/product-info-api-service";


export default {
    name: "FeaturedView",

    components: {
        Ets,
        UsdPlus,
        InsuranceCard,
    },

    data: () => ({
        openedList: false,
        tab: 'optimism',
        avgApy: null,
        sortedCardList: [],
        cardEtsList: [],

        isResorting: true,

        isClientDataLoading: true,
        isProductsInfoLoading: true,

        etsList: [],

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
    ...mapGetters('network', ['appApiUrl', 'networkName', 'networkId', 'polygonConfig', 'bscConfig', 'opConfig', 'arConfig', 'zkConfig', 'switchToOtherNetwork', 'getParams']),
    ...mapGetters('accountData', ['account']),
      ...mapGetters('etsAction', ['etsNetworkNames']),
      ...mapGetters('web3', ['contracts', 'web3']),

    isAllDataLoaded: function () {
      return !this.isClientDataLoading &&
          !this.isProductsInfoLoading;
    },

    tabNetworkId: function() {
      let params;
      params = this.getParams(this.tab);

      return params.networkId;
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
  },
  watch: {
      networkName: function (newVal, oldVal) {
          this.setTab(newVal);
          this.loadData();
      },

        etsList: function (newVal, oldVal) {
          if (newVal) {
            this.loadData();
          }
        },

    isAllDataLoaded: function (newVal, oldVal) {
      if (newVal) {
        this.getUsdPlusAvgMonthApy();
        //this.getSortedCardList();
      }
    },
  },

  created() {
  },

  mounted() {
      console.log(this.$route.query.tabName);
      this.loadEtsList();
      this.setTab(this.networkName);
      this.loadData();
  },

  methods: {
    // ...mapGetters('network', ['getParams']),

        async setTab(tabName) {
            this.isResorting = true;
            this.tab = tabName;
            this.initTabName('/featured', {tabName: this.tab});

            console.log('this.cardEtsList ', this.cardEtsList)
            this.sortedCardList = this.getSortedCardList(this.cardEtsList, false)
            await this.getUsdPlusAvgMonthApy();
            this.isResorting = false;
            console.log("NetworkParams : ", this.getParams(this.tab));
        },

      initTabName(path, queryParams) {
          this.$router.push({
              path: path,
              query: queryParams ? queryParams : {}
          });
      },

        loadData() {
          this.isClientDataLoading = true;
          this.isProductsInfoLoading = true;
          this.refreshMarket();
        },

        async loadEtsList() {
          let list = [];

          for (let i = 0; i < this.etsNetworkNames.length; i++) {
              let etses = await loadJSON(`https://api.overnight.fi/${this.etsNetworkNames[i]}/usd+/design_ets/list`);
              // May add some fields
              list.push(...etses);
          }

          this.etsList = list;
          console.log("ETSs be loaded", this.etsList );
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
          console.log('Futured View: refreshMarket this.etsList', this.etsList);
          if (this.etsList && !this.isStartLoading) {
              try {
                  this.isStartLoading = true;

                  this.isProductsInfoLoading = true;
                  this.isClientDataLoading = true;

                  await this.refreshStrategyData();
                  await this.refreshClientData();

                  this.isStartLoading = false
              } catch (e) {
                  console.error("Error when refresh market data:", e)
              }
          }
      },


      async refreshStrategyData() {
          console.log('MarketData: refreshStrategyData', this.etsList);

          this.isProductsInfoLoading = true;

          productInfoApiService.getAllProducts(this.appApiUrl)
              .then(data => {
                  console.log("Future Products loaded: ", data);
                  this.cardEtsList = data;
                  this.isResorting = true;
                  this.sortedCardList = this.getSortedCardList(this.cardEtsList, true);
                  this.isProductsInfoLoading = false;
                  this.isResorting = false;
              }).catch(e => {
              console.error("Error when load products. ", e);
              this.isProductsInfoLoading = false;
              this.isResorting = false;
          });
      },

      async refreshClientData() {
          console.log('MarketData: refreshClientData', this.etsList);
          this.isClientDataLoading = true;
          if (!this.account){
              this.isClientDataLoading = false;
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
                          console.log('MarketData: refreshClientData5', this.etsList);
                          profitDay = value.profit;
                      }).catch(reason => {
                          console.log('Error get data: ' + reason);
                      })

                  this.addEtsClientData({ name: refreshParams.strategyName, data: profitDay});
                  this.isClientDataLoading = false;
              })
          );
      },

    getSortedCardList(_cardList, isFirst) {
        let networkId = this.networkId;
        let cardList = _cardList;

        cardList.forEach(ets => {
            console.log("Ets type: ", ets.id)
            if (!ets.type || ets.type === 'ETS') {
                ets.type = 'ETS';
                ets.name = 'Ets';

                if (ets.id) {
                    ets.id = 'ets' + ets.chain + ets.name
                }
            }
        });


        if (isFirst) {

            cardList.push({
                id: 'usdPlus' + networkId,
                type: 'usdPlus',
                name: 'UsdPlus',
                prototype: false,
                data: {archive: false},
                chain: networkId,
                hasUsdPlus: true,
                overcapEnabled: false,
                hasCap: true,
                tvl: null, //this.usdPlusValue,
                monthApy: this.avgApy ? this.avgApy.value : 0,
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

        }
      // this.etsList.forEach(ets => {
      //   cardList.push(
      //       {
      //         id: 'ets' + ets.chain + ets.name,
      //         type: 'ets',
      //         name: 'Ets',
      //         isPrototype: ets.prototype,
      //         isOpenPrototype: ets.openPrototype,
      //         isArchive: ets.archive,
      //         data: ets,
      //         chain: ets.chain,
      //         hasUsdPlus: ets.hasUsdPlus,
      //         overcapEnabled: (!!(ets.maxSupply && ets.maxSupply > 0)),
      //         hasCap: ets.maxSupply ? (this.totalSupply[ets.name] < ets.maxSupply) : true,
      //         tvl: this.totalSupply[ets.name],
      //         monthApy: (this.etsStrategyData[ets.name] && this.etsStrategyData[ets.name].apy) ? this.etsStrategyData[ets.name].apy : 0,
      //         cardOpened: false,
      //       },
      //   );
      // });


      cardList.sort(function (a, b) {
          if (!a.prototype && b.prototype) return -1;
          if (a.prototype && !b.prototype) return 1;

          if (!a.data.archive && b.data.archive) return -1;
          if (a.data.archive && !b.data.archive) return 1;

          if (a.chain === networkId && b.chain !== networkId) return -1;
          if (a.chain !== networkId && b.chain === networkId) return 1;

          if (a.monthApy > b.monthApy) return -1;
          if (a.monthApy < b.monthApy) return 1;

          if (a.hasCap && !b.hasCap) return -1;
          if (!a.hasCap && b.hasCap) return 1;

        return 0;
      });
        console.log("CardList: ", cardList);

      cardList[0].cardOpened = true;
      return cardList;
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
