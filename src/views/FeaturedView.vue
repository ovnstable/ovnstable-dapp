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
            <label class="tab-btn mx-4" @click="setTab('base')" v-bind:class="activeTabBase">Base</label>
            <label class="tab-btn mx-4" @click="setTab('linea')" v-bind:class="activeTabLinea">Linea</label>
            <label  v-if="isDeprecatedShow"
                    @click="setTab('polygon')" v-bind:class="activeTabPolygon"
                    class="tab-btn mx-4 text-deprecated">
                Polygon
                <div style="position: relative">
                    <div style="position:absolute;right: -26px;top: -23px;">
                        <Tooltip
                            text="Chain is deprecated"
                            right
                        />
                    </div>
                </div>
            </label>
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
                       v-for="card in sortedCardList"
                       :key="card.id">
                    <v-row class="fill-height">
                        <component
                            class="ma-3"
                            v-bind:key="card.id"
                            v-bind:is="card.name"
                            :card-data="card"
                            :network-name="tab"
                            :pool="card.name === 'Pool' ? getPoolById(card.originalId) : null"
                        ></component>
                    </v-row>
                </v-col>
            </v-row>
        </div>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import moment from "moment";
import UsdPlus from "@/components/market/cards/hold/UsdPlus";
import InsuranceCard from "@/components/insurance/cards/insurance/InsuranceCard";
import {poolApiService} from "@/services/pool-api-service";
import Pool from "@/components/market/cards/pool/Pool.vue";
import {pool} from "@/components/mixins/pool";
import Tooltip from "@/components/common/element/Tooltip.vue";


export default {
    name: "FeaturedView",
    mixins: [pool],
    components: {
        Tooltip,
        Pool,
        UsdPlus,
        InsuranceCard,
    },

    data: () => ({
        openedList: false,
        tab: 'optimism',
        avgApy: null,
        sortedCardList: [],

        isResorting: true,

        isClientDataLoading: true,
        isProductsInfoLoading: true,

        usdPlusApyData: {},

        currentTotalData: {},
        totalUsdPlusValue: null,
        // insuranceStrategyData: {},

        totalSupply: {},
        // totalInsuranceSupply: 0,

    }),

    computed: {
        ...mapGetters('accountData', ['account']),
        ...mapGetters('web3', ['contracts', 'web3']),
        ...mapGetters('deprecated', ['isDeprecatedShow']),

        isAllDataLoaded: function () {
            return !this.isClientDataLoading &&
               !this.isProductsInfoLoading && !this.isPoolsLoading;
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

    activeTabBase: function() {
      return {
          'tab-button': this.tab === 'base',
          'tab-button-in-active': this.tab !== 'base',
      }
    },
    activeTabLinea: function() {
      return {
          'tab-button': this.tab === 'linea',
          'tab-button-in-active': this.tab !== 'linea',
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
      },

    isAllDataLoaded: function (newVal, oldVal) {
      if (newVal) {
        this.getUsdPlusAvgMonthApy();
      }
    },
    },

    created() {
    },

    async mounted() {
        try {
            this.trackClick({action: 'featured_page_view', event_category: 'Page view', event_label: 'View featured page' });
        } catch (e) {
            console.error("Track error:", e);
        }

      console.log(this.$route.query.tabName);
      await this.loadPools();
      if (!this.$route.query.tabName) {
          this.setTab(this.networkName);
      }
      if (this.$route.query.tabName) {
          this.setTab(this.$route.query.tabName);
      }
    },

    methods: {
        ...mapActions('track', ['trackClick']),

        async setTab(tabName) {
            this.isResorting = true;
            this.tab = tabName;
            this.initTabName('/featured', {tabName: this.tab});

            this.initCards();
            console.log("sortedCardList: ", this.sortedCardList);
            await this.getUsdPlusAvgMonthApy();
            this.isClientDataLoading = false;
            this.isProductsInfoLoading = false;
            this.isResorting = false;
            console.log("NetworkParams : ", this.getParams(this.tab));
        },

      initTabName(path, queryParams) {
          this.$router.push({
              path: path,
              query: queryParams ? queryParams : {}
          });
      },

        async loadData() {
            this.isClientDataLoading = true;
            this.isProductsInfoLoading = true;
        },
        initCards() {
            this.sortedCardList = [];
            this.sortedCardList.push(this.getTabNetworkUsdCard(this.tab));

            let networkPool = this.getTabNetworkPoolCard(this.tab);
            if (networkPool) {
                this.sortedCardList.push(networkPool);
            }

            let notNetworkPool = this.getTopAnotherNetworkPoolCard(this.tab);
            if (notNetworkPool) {
                this.sortedCardList.push(notNetworkPool);
            }
        },
        getTabNetworkUsdCard(networkName) {
            return {
                id: 'usdPlus' + networkName,
                type: 'usdPlus',
                name: 'UsdPlus',
                prototype: false,
                data: {archive: false},
                chain: this.getParams(networkName).networkId,
                hasUsdPlus: true,
                overcapEnabled: false,
                hasCap: true,
                tvl: null, //this.usdPlusValue,
                monthApy: this.avgApy ? this.avgApy.value : 0,
            }
        },
        getTabNetworkPoolCard(networkName) {
            let pool = this.findTopPoolByNetwork(this.sortedPoolList, networkName);
            // if (!pool) {
            //     pool = this.findTopPoolExcludeNetwork(this.sortedPoolList, networkName);
            // }

            if (!pool) {
                console.log("Pool not found when load tab network.");
                return null
            }

            return {
                id: 'pool' + pool.id,
                originalId: pool.id,
                type: 'Pool',
                name: "Pool",
                prototype: false,
                data: pool.data,
                hasUsdPlus: true,
                overcapEnabled: false,
                title: pool.name,
                address: pool.address,
                hasCap: true,
                platform: pool.platform,
                chain: pool.chain,
                chainName: pool.chainName,
                apr: pool.apr,
                tvl: pool.tvl,
                zappable: pool.zappable,
                aggregators: pool.aggregators,
            }
        },
        getTopAnotherNetworkPoolCard(networkName) {
            let pool = this.findTopPoolExcludeNetwork(this.sortedPoolList, networkName);
            if (!pool) {
                console.log("Pool not found when load another tab network.");
                return null
            }

            return {
                id: 'pool' + pool.id,
                originalId: pool.id,
                type: 'Pool',
                name: "Pool",
                prototype: false,
                data: pool.data,
                hasUsdPlus: true,
                overcapEnabled: false,
                title: pool.name,
                address: pool.address,
                hasCap: true,
                platform: pool.platform,
                chain: pool.chain,
                chainName: pool.chainName,
                apr: pool.apr,
                tvl: pool.tvl,
                zappable: pool.zappable,
                aggregators: pool.aggregators,
            }
        },
        findTopPoolByNetwork(pools, networkName) {
            for (let i = 0; i < pools.length; i++) {
                let pool = pools[i];

                if (pool.feature && pool.chainName === networkName) {
                    // find first in network
                    return pool;
                }
            }

            return null;
        },
        findTopPoolExcludeNetwork(pools, networkName) {
            for (let i = 0; i < pools.length; i++) {
                let pool = pools[i];

                if (pool.feature && pool.chainName !== networkName) {
                    // find first in network
                    return pool;
                }
            }

            return null;
        },

        addUsdPlusApyData(usdPlusApyDataParams) {
            this.usdPlusApyData[usdPlusApyDataParams.name] = usdPlusApyDataParams.data;
            console.log('MarketData: refreshUsdPlusPayoutsData this.usdPlusApyData', this.usdPlusApyData);
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

        getPoolById(id) {
            for (let i = 0; i < this.pools.length; i++) {
                if (this.pools[i].id === id) {
                    return this.pools[i];
                }
            }

            return null;
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


    .toggle-row {
        max-width: 95% !important;
    }

    .toggle-row-second {
        max-width: 50% !important;
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

    .toggle-row {
        border-bottom: 2px solid var(--main-border);
        max-width: 200% !important;
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

    .toggle-row {
        border-bottom: 2px solid var(--main-border);
        max-width: 200% !important;
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

    .toggle-row {
        border-bottom: 2px solid var(--main-border);
        max-width: 200% !important;
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


.text-deprecated {
    color: var(--third-gray-text) !important;
}
</style>
