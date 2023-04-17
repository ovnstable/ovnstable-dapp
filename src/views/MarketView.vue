<template>
  <div>
    <div class="mt-10">
      <label class="title-label">exchange-traded strategies (ETS)</label>
    </div>

    <div v-if="!isAllDataLoaded" class="mt-7 cards-list-container">
      <v-row>
        <v-row align="center" justify="center" class="py-15">
          <v-progress-circular
              width="2"
              size="24"
              color="#8FA2B7"
              indeterminate
          ></v-progress-circular>
        </v-row>
      </v-row>
    </div>
    <div v-else class="mt-7 cards-list-container">
      <template>
        <v-row class="ma-0 mb-1 mt-10" align="center">
            <v-icon class="prototypes-icon" :size="$wu.isFull() ? 20 : 16">mdi-check-bold</v-icon>
            <label class="prototypes-label prototypes-label-available ml-2">AVAILABLE capacity</label>
        </v-row>
        <v-divider class="prototypes-list-divider"></v-divider>

        <EtsListHeader/>

        <EtsListCard class="mt-2"
                     v-for="(component, i) in sortedCardList.filter(value => (value.type === 'ETS' && !value.prototype && !value.openPrototype && !value.data.archive && value.hasCap))"
                     :featured="i < 3"
                     :key="component.id"
                     :card-data="component"/>
      </template>

      <template>
        <v-row class="ma-0 mb-1 mt-5" align="center">
            <v-icon class="prototypes-icon" :size="$wu.isFull() ? 20 : 16">mdi-close-thick</v-icon>
            <label class="prototypes-label ml-2" @click="openCollateralList = !openCollateralList">Full capacity</label>
            <div class="select-bar-main-container ml-7" @click="openCollateralList = !openCollateralList">
                <v-row justify="end" align="center" class="select-bar-container">
                    <v-icon color="var(--secondary-gray-text)" >
                        {{ openCollateralList ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                    </v-icon>
                </v-row>
            </div>
        </v-row>
        <v-divider class="prototypes-list-divider"></v-divider>

        <template v-if="openCollateralList">
          <EtsListHeader />

          <EtsListCard class="mt-2"
                       v-for="component in sortedCardList.filter(value => (value.type === 'ETS' && !value.prototype && !value.openPrototype && !value.data.archive && !value.hasCap))"
                       :key="component.id"
                       :card-data="component"/>
        </template>

      </template>

      <template v-if="sortedCardList.filter(value => (value.prototype || value.openPrototype)).length > 0" >
        <v-row class="ma-0 mb-1 mt-5" align="center">
          <v-icon class="prototypes-icon" :size="$wu.isFull() ? 20 : 16">mdi-test-tube</v-icon>
          <label class="prototypes-label ml-2" @click="openPrototypeList = !openPrototypeList">Prototypes</label>
          <div class="select-bar-main-container ml-7" @click="openPrototypeList = !openPrototypeList">
            <v-row justify="end" align="center" class="select-bar-container">
                <v-icon color="var(--secondary-gray-text)" >
                    {{ openPrototypeList ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                </v-icon>
            </v-row>
          </div>
        </v-row>
        <v-divider class="prototypes-list-divider"></v-divider>

        <template v-if="openPrototypeList">
          <EtsListHeader />

          <EtsListCard class="mt-2"
                       v-for="component in sortedCardList.filter(value => (value.type === 'ETS' && (value.prototype || value.openPrototype)))"
                       :key="component.id"
                       :card-data="component"/>
        </template>

      </template>

      <v-row>
        <v-row class="ma-0 mt-10 align-center pl-4">
            <router-link :to="{ name: 'MarketArchiveView' }">
                <div class="ets-archive-button" @click="() => { window.location }">
                    See ETS archive <img :src="require('@/assets/icon/archiveArrow.svg')" class="archive-arrow" alt="->">
                </div>
            </router-link>
        </v-row>
      </v-row>
    </div>

    <resize-observer @notify="$forceUpdate()"/>
  </div>
</template>

<script>

import {mapGetters} from "vuex";
import EtsListCard from "@/components/market/cards/ets/list/EtsListCard";
import EtsListHeader from "@/components/market/cards/ets/list/EtsListHeader";
import moment from "moment";
import {productInfoApiService} from "@/services/product-info-api-service";
import loadJSON from "@/utils/http-utils";

export default {
  name: "MarketView",

  components: {
    EtsListHeader,
    EtsListCard,
  },

  data: () => ({
        openCollateralList: false,
        openPrototypeList: false,
        openArchiveList: false,
        tab: 1,
        sortedCardList: [],

        isStartLoading: false,
        isProductsInfoLoading: true,
        isClientDataLoading: true,

        etsList: [],

        etsTvlData: {},
        etsApyData: {},
        etsClientData: {},
        etsStrategyData: {},

        currentTotalData: {},
        totalUsdPlusValue: null,

        totalSupply: {},

  }),

  computed: {
    ...mapGetters('network', ['appApiUrl', 'networkId', 'polygonConfig', 'bscConfig', 'opConfig', 'arConfig', 'zkConfig']),
    ...mapGetters('accountData', ['account']),
    ...mapGetters('etsAction', ['etsNetworkNames']),
    ...mapGetters('web3', ['contracts', 'web3']),

    isAllDataLoaded: function () {
      return !this.isProductsInfoLoading && !this.isClientDataLoading;
    },
  },
  watch: {
    etsList: function (newVal, oldVal) {
      if (newVal) {
        this.loadData();
      }
    },

    isAllDataLoaded: function (newVal, oldVal) {
      if (newVal) {
        //this.getSortedCardList();
      }
    },
  },

  created() {
  },

  mounted() {
        console.log(this.$route.query.tabName);
        this.initTab();

        this.loadEtsList();
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
      if (this.etsList && !this.isStartLoading) {
        try {
          this.isStartLoading = true;

          this.isProductsInfoLoading = true;
          this.isClientDataLoading = true;

          await this.refreshStrategyData();
          this.refreshClientData();

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
            console.log("Products loaded: ", data);
            this.sortedCardList = this.getSortedCardList(data);
            this.isProductsInfoLoading = false;
          }).catch(e => {
            console.error("Error when load products. ", e);
            this.isProductsInfoLoading = false;
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
                  profitDay = value.profit;
                }).catch(reason => {
                  console.log('Error get data: ' + reason);
                })

            this.addEtsClientData({ name: refreshParams.strategyName, data: profitDay});
            this.isClientDataLoading = false;
          })
      );
    },
    getSortedCardList(cardList) {

      let networkId = this.networkId;

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

      cardList[0].cardOpened = true;
      return cardList;
    },
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

  .prototypes-label {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.04em;
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

  .prototypes-label {
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.04em;
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

  .prototypes-label {
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
    letter-spacing: 0.04em;
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

  .prototypes-label {
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0.04em;
  }
}

.cards-list-container {
  margin-bottom: 15% !important;
  width: 100% !important;
}


.title-label {
  font-family: 'Roboto', sans-serif;
  text-transform: uppercase;
  font-feature-settings: 'pnum' on, 'lnum' on;
  color: var(--main-gray-text);
}

.prototypes-list-divider {
  border-color: var(--fourth-gray-text) !important;
}

.prototypes-label {
  font-family: 'Roboto', sans-serif;
  text-transform: uppercase;
  font-feature-settings: 'pnum' on, 'lnum' on;
  color: var(--main-gray-text);
  cursor: pointer;
}

.prototypes-label-available {
    cursor: default;
}

.prototypes-icon {
  color: var(--main-gray-text);
}

.select-bar-main-container {
  cursor: pointer;
}

.archive-label {
  cursor: pointer;
}

.ets-archive-button {
    position: absolute;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 28px;
    color: #1C95E7;
    cursor: pointer;
}

.ets-archive-button:hover {
    text-decoration: underline #1C95E7;
}

.archive-arrow {
    position: absolute;
    top: 8px;
    padding-left: 5px;
}
</style>
