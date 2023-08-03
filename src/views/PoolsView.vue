<template>
    <div class="mb-15">
        <div class="row">
            <div class="col-12 col-lg-6 col-md-6 col-sm-6">
                <div class="mt-lg-10 mt-md-5 mt-sm-3 mb-lg-10 mb-md-5 mb-sm-3">
                    <label class="title-label">ALL POOLS</label>
                </div>
            </div>
            <div v-if="lastUpdateAgoMinutes"
                 class="col-12 col-lg-6 col-md-6 col-sm-6">
                <div class="mt-lg-10 mt-md-5 mt-sm-3 mb-lg-10 mb-md-5 mb-sm-3">
                    <div class="updated-title">
                        Data updated <span class="update-time">{{lastUpdateAgoMinutes}}</span> min ago
                    </div>
                </div>
            </div>
        </div>

        <v-row v-if="isPoolsLoading">
          <v-row align="center" justify="center" class="py-15">
            <v-progress-circular
                width="2"
                size="24"
                color="#8FA2B7"
                indeterminate
            ></v-progress-circular>
          </v-row>
        </v-row>

       <div v-else>
           <div class="pools-header-container">
               <div class="row">
                   <div class="col-12 col-lg-12 col-md-12 col-sm-12">
                       <PoolFilter
                           :set-selected-tab-func="setSelectedTab"
                           :selected-tabs="selectedTabs"
                           :zap-filter-func="zapFilter"
                           :is-show-only-zap="isShowOnlyZap"
                           :apr-limit-filter-func="aprLimitFilter"
                           :update-search-func="updateSearch"
                           :is-show-apr-limit="isShowAprLimit"
                       ></PoolFilter>
                   </div>
               </div>
           </div>

           <div class="pools-container">
               <PoolTable :pools="filteredPools"
                          :is-show-only-zap="isShowOnlyZap"
                          :is-show-apr-limit="isShowAprLimit"
                          :open-zap-in-func="openZapIn"
                          :set-order-type-func="setOrderType"
                          :order-type="orderType"
               ></PoolTable>
           </div>
       </div>

        <ZapModal :set-show-func='setIsZapModalShow'
                  :zap-pool="currentZapPool"
                  :is-show="isZapModalShow"
                  :pool-tokens-for-zap-map="poolTokensForZapMap">
        </ZapModal>

        <template v-if="!isPoolsLoading">
            <v-row class="ma-0 mb-1 mt-5" align="center">
                <v-icon class="circle-icon" :size="$wu.isFull() ? 20 : 16">mdi-circle-multiple-outline</v-icon>
                <label class="show-more ml-2" @click="openPoolList = !openPoolList">Pools with TVL less than $300K</label>
                <div class="select-bar-main-container ml-7" @click="openPoolList = !openPoolList">
                    <v-row justify="end" align="center" class="select-bar-container">
                        <v-icon color="var(--secondary-gray-text)" >
                            {{ openPoolList ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                        </v-icon>
                    </v-row>
                </div>
            </v-row>
            <v-divider class="prototypes-list-divider"></v-divider>

            <template v-if="openPoolList">

            <PoolTable class="mt-2"
                         :pools="filteredPoolsForSecondTab"
                         :is-show-only-zap="isShowOnlyZap"
                         :is-show-apr-limit="isShowAprLimit"
                         :open-zap-in-func="openZapIn"
                         :set-order-type-func="setOrderType"
                         :order-type="orderType"
            ></PoolTable>
        </template>

        </template>
    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";

import {poolApiService} from "@/services/pool-api-service";
import ZapModal from "@/components/zap/modals/ZapModal.vue";
import PoolFilter from "@/components/pool/PoolFilter.vue";
import PoolTable from "@/components/pool/PoolTable.vue";
import {pool} from "@/components/mixins/pool";

const moment = require('moment');

export default {
    name: "PoolsView",
    mixins: [pool],
    components: {
        PoolTable,
        PoolFilter,
        ZapModal,
    },

    data: () => ({
        avgApy: null,
        sortedPoolList: [],
        sortedPoolSecondList: [],
        pools: [],
        isPoolsLoading: true,
        openPoolList: false,

        selectedTabs: ['ALL'], // ALL or networkName,
        isShowOnlyZap: false,
        isShowAprLimit: false,
        aprLimitForFilter: 100,
        searchQuery: null,

        orderType: "APR" // APR, APR_UP, APR_DOWN, TVL, TVL_UP, TVL_DOWN
    }),

    computed: {
        ...mapGetters('network', [
            'appApiUrl',
            'networkId',
            'networkName',
            'allNetworkConfigs',
            'getParams'
        ]),

        filteredPools () {
            if (this.orderType === 'APR') {
                // last step filter
                return this.getSortedPools(this.filteredBySearchQueryPools);
            }

            if (this.orderType === 'APR_UP') {
                // last step filter
                return this.filteredBySearchQueryPools.sort((a, b) => b.apr - a.apr);
            }

            if (this.orderType === 'APR_DOWN') {
                // last step filter
                return this.filteredBySearchQueryPools.sort((a, b) => a.apr - b.apr);
            }

            if (this.orderType === 'TVL') {
                // last step filter. same like type 'APR'
                return this.getSortedPools(this.filteredBySearchQueryPools);
            }

            if (this.orderType === 'TVL_UP') {
                // last step filter
                return this.filteredBySearchQueryPools.sort((a, b) => b.tvl - a.tvl);
            }

            if (this.orderType === 'TVL_DOWN') {
                // last step filter
                return this.filteredBySearchQueryPools.sort((a, b) => a.tvl - b.tvl);
            }

            console.error("Order type not found when order pools", this.orderType);
            return []
        },

        filteredPoolsForSecondTab: function() {
            if (this.orderType === 'APR') {
                // last step filter
                return this.getSortedSecondPools(this.filteredBySearchQuerySecondPools);
            }

            if (this.orderType === 'APR_UP') {
                // last step filter
                return this.filteredBySearchQuerySecondPools.sort((a, b) => b.apr - a.apr);
            }

            if (this.orderType === 'APR_DOWN') {
                // last step filter
                return this.filteredBySearchQuerySecondPools.sort((a, b) => a.apr - b.apr);
            }

            if (this.orderType === 'TVL') {
                // last step filter. same like type 'APR'
                return this.getSortedSecondPools(this.filteredBySearchQuerySecondPools);
            }

            if (this.orderType === 'TVL_UP') {
                // last step filter
                return this.filteredBySearchQuerySecondPools.sort((a, b) => b.tvl - a.tvl);
            }

            if (this.orderType === 'TVL_DOWN') {
                // last step filter
                return this.filteredBySearchQuerySecondPools.sort((a, b) => a.tvl - b.tvl);
            }

            console.error("Order type not found when order pools", this.orderType);
            return []
        },

        filteredBySearchQueryPools: function () {
            if (!this.searchQuery) {
                return this.filteredAprPools;
            }

           return this.filteredAprPools.filter(pool =>
                pool.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                pool.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                pool.chainName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                pool.address.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                pool.platform.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        filteredBySearchQuerySecondPools: function () {
            if (!this.searchQuery) {
                return this.filteredAprSecondPools;
            }

            return this.filteredAprSecondPools.filter(pool =>
                pool.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                pool.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                pool.chainName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                pool.address.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                pool.platform.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        filteredAprPools: function () {
            if (!this.isShowAprLimit) {
                return this.filteredZappablePools;
            }

            return this.filteredZappablePools.filter(pool =>
                pool.apr && pool.tvl < 300000 && this.aprLimitForFilter <= pool.apr*1
            )
        },
        filteredAprSecondPools: function () {
            if (!this.isShowAprLimit) {
                return this.filteredZappableSecondPools;
            }

            return this.filteredZappableSecondPools.filter(pool =>
                pool.apr && pool.tvl < 10000 && this.aprLimitForFilter <= pool.apr*1
            )
        },

        filteredZappablePools: function () {
            if (!this.isShowOnlyZap) {
                return this.filteredByTabPools;
            }

            return this.filteredByTabPools.filter(pool =>
                this.isShowOnlyZap && pool.zappable
            )
        },
        filteredZappableSecondPools: function () {
            if (!this.isShowOnlyZap) {
                return this.filteredBySecondTabPools;
            }

            return this.filteredBySecondTabPools.filter(pool =>
                this.isShowOnlyZap && pool.zappable
            )
        },
        filteredByTabPools: function () {
            if (this.selectedTabs.length === 1 && this.selectedTabs.includes('ALL')) {
                return this.sortedPoolList
            }

            return this.sortedPoolList.filter(pool => this.selectedTabs.includes(this.getParams(pool.chain).networkName));
        },
        filteredBySecondTabPools: function () {
            if (this.selectedTabs.length === 1 && this.selectedTabs.includes('ALL')) {
                return this.sortedPoolSecondList
            }

            return this.sortedPoolSecondList.filter(pool => this.selectedTabs.includes(this.getParams(pool.chain).networkName));
        },

        lastUpdateAgoMinutes: function () {
            if (!this.sortedPoolList || !this.sortedPoolList.length) {
                return null;
            }

            let firstPool = this.sortedPoolList[0].data;
            let lastUpdateDate = firstPool.updateDate;
            if (!lastUpdateDate) {
                return null;
            }

            const lastUpdateMoment = moment.utc(lastUpdateDate);
            const now = moment.utc();
            return now.diff(lastUpdateMoment, 'minutes');
        }
    },
    watch: {
        networkId: function () {
            this.loadPools();
        }
    },
    created() {
    },

    async mounted() {
        await this.loadPools();

        try {
            this.trackClick({action: 'pools_page_view', event_category: 'Page view', event_label: 'View pools page' });
        } catch (e) {
            console.error("Track error:", e);
        }
    },

    methods: {
        ...mapActions('track', ['trackClick']),


        updateSearch(searchQuery) {
            this.searchQuery = searchQuery;
        },
        setOrderType(orderType) {
            this.orderType = orderType;
        },
        zapFilter(isShow) {
            this.isShowOnlyZap = isShow;
            console.log("Is show zap? ", this.isShowOnlyZap);
        },
        aprLimitFilter(isShow, limit) {
            this.isShowAprLimit = isShow;
            this.aprLimitForFilter = limit;
            console.log("Apr limit ", isShow, limit);
        },
        setSelectedTab(tab) {
            if (tab === 'ALL' && !this.tabExistInTabs(this.selectedTabs, tab)) {
                this.selectedTabs = [tab];
                return;
            }

            // remove all if click other
            if (tab !== 'ALL' && !this.tabExistInTabs(this.selectedTabs, tab)) {
                this.selectedTabs = this.selectedTabs.filter(selectedTab => selectedTab !== 'ALL')
            }

            if (this.tabExistInTabs(this.selectedTabs, tab)) {
                this.selectedTabs = this.selectedTabs.filter(selectedTab => selectedTab !== tab)
                if (this.selectedTabs.length === 0) {
                    this.selectedTabs = ['ALL'];
                }

                return;
            }

            this.selectedTabs.push(tab);
        },
        tabExistInTabs(tabs, tab) {
            for (let i = 0; i < tabs.length; i++) {
                if (tab === tabs[i]) {
                    return true;
                }
            }

            return false;
        },

      async loadPools() {
        this.isPoolsLoading = true;
        this.clearAllFilters();

        this.pools = [];
        let networkConfigList = [...this.allNetworkConfigs];

        for (let networkConfig of networkConfigList) {
          await poolApiService.getAllPools(networkConfig.appApiUrl)
              .then(data => {
                  if (data) {

                  data.forEach(pool => {
                    let token0Icon;
                    let token1Icon;
                    let token2Icon;
                    let token3Icon;

                    let tokenNames = pool.id.name.split('/');

                    try {
                      token0Icon = require('@/assets/currencies/farm/' + tokenNames[0] + '.svg');
                    } catch (e) {
                      try {
                        token0Icon = require('@/assets/currencies/farm/' + tokenNames[0] + '.png');
                      } catch (ex) {
                        // token0Icon = require('@/assets/currencies/undefined.svg');
                        token0Icon = null;
                      }
                    }

                    try {
                      token1Icon = require('@/assets/currencies/farm/' + tokenNames[1] + '.svg');
                    } catch (e) {
                      try {
                        token1Icon = require('@/assets/currencies/farm/' + tokenNames[1] + '.png');
                      } catch (ex) {
                        // token1Icon = require('@/assets/currencies/undefined.svg');
                        token1Icon = null;
                      }
                    }

                    if (tokenNames[2]) {
                        try {
                            token2Icon = require('@/assets/currencies/farm/' + tokenNames[2] + '.svg');
                        } catch (e) {
                            try {
                                token2Icon = require('@/assets/currencies/farm/' + tokenNames[2] + '.png');
                            } catch (ex) {
                                // token2Icon = require('@/assets/currencies/undefined.svg');
                                token2Icon = null;
                            }
                        }
                    }

                      if (tokenNames[3]) {
                          try {
                              token3Icon = require('@/assets/currencies/farm/' + tokenNames[3] + '.svg');
                          } catch (e) {
                              try {
                                  token3Icon = require('@/assets/currencies/farm/' + tokenNames[3] + '.png');
                              } catch (ex) {
                                  // token3Icon = require('@/assets/currencies/undefined.svg');
                                  token3Icon = null;
                              }
                          }
                      }

                    if (pool && pool.tvl && pool.tvl >= 0) {

                        // todo move to backend
                        if (this.zapPlatformSupportList.includes(pool.platform)
                        && Object.keys(this.poolTokensForZapMap)
                                .some(item => item.toLowerCase() === pool.id.address.toLowerCase())) {
                            pool.zappable = true;
                        }


                        // todo move to backend
                        pool = this.initAggregators(pool);


                        this.pools.push({
                        id: (pool.id.name + pool.tvl + pool.platform),
                        name: networkConfig.networkName === 'arbitrum' ? pool.id.name.toUpperCase().replace('USDC', 'USDC.e') : pool.id.name.toUpperCase(),// + ' ' + pool.id.address,
                        token0Icon: token0Icon,
                        token1Icon: token1Icon,
                        token2Icon: token2Icon,
                        token3Icon: token3Icon,
                        chain: networkConfig.networkId,
                        chainName: networkConfig.networkName,
                        address: pool.id.address,
                        platform: pool.platform,
                        tvl: pool.tvl,
                        apr: pool.apr,
                        skimEnabled: pool.skimEnabled,
                        explorerUrl: networkConfig.explorerUrl,
                        feature: pool.feature,
                        zappable: pool.zappable,
                        cardOpened: false,
                        data: pool,
                        aggregators: pool.aggregators,
                        poolNameForAgregator: pool.poolNameForAgregator,
                        isOpened: pool.aggregators && pool.aggregators.length ? false : true, // pools without aggregators always is opened
                        stableFishUrl: null,
                      });
                    }
                  })
                }
              }).catch(reason => {
                console.log('Error get pools data: ' + reason);
              })
        }

          // todo move to backend
          this.pools = this.initFeature(this.pools);



          this.sortedPoolList = this.getSortedPools(this.pools);
          this.sortedPoolSecondList = this.getSortedSecondPools(this.pools);
          this.isPoolsLoading = false;

          const map = new Map();
          // map.set('0x667002F9DC61ebcBA8Ee1Cbeb2ad04060388f223', '1586'); // 1. Velodrome USD+/DAI+
          map.set('0x0d20ef7033b73ea0c9c320304b05da82e2c14e33', '1482'); // 2. Chronos FRAX/USD+
          map.set('0x1561d9618db2dcfe954f5d51f4381fa99c8e5689', '1577'); // 3. Thena USDT+/USD+
          map.set('0xbbd7ff1728963a5eb582d26ea90290f84e89bd66', '1481'); // 4. Chronos DOLA/USD+
          map.set('0xb260163158311596ea88a700c5a30f101d072326', '1479'); // 5. Chronos USD+/DAI+
          map.set('0xcd78e225e36e724c9fb4bd8287296557d728cda7', '1483'); // 6. Chronos LUSD/USD+
          // map.set('', ''); // 8. Arbidex USD+/USDC.e ****
          // map.set('0x571102a88928d74c049849af094a289c27fb794e', '1020'); // 7. SushiSwap USD+/USDC
          // map.set('0xd95E98fc33670dC033424E7Aa0578D742D00f9C7', '712'); // 8. Velodrome USD+/USDC
          // map.set('0x421a018cc5839c4c0300afb21c725776dc389b1a', '603'); // 9. Dystopia USD+/USDC
          // map.set('0x37e7D30CC180A750C83D68ED0C2511dA10694d63', '1021'); // 10. Velodrome USD+/LUSD


          for (let i = 0; i < this.pools.length; i++) {
              let pool = this.pools[i];
              let stableFishId = map.get(pool.address)

              if (stableFishId) {
                  pool.stableFishUrl = 'https://stable.fish/defi/' + stableFishId
              }
          }
      },

        getSortedPools(pools) {
            let topPools = pools.filter(pool => pool.tvl >= 300000);
            topPools = topPools.sort((a, b) => {
                if (a.feature && !b.feature) {
                    return -1; // a comes first when a is featured and b is not
                } else if (!a.feature && b.feature) {
                    return 1; // b comes first when b is featured and a is not
                } else if (a.apr !== b.apr) {
                    return b.apr - a.apr; // sort by APR number
                } else {
                    return b.tvl - a.tvl; // sort by TVL number
                }
            });

            return [...topPools];
        },

        getSortedSecondPools(pools) {
            let secondPools = pools.filter(pool => pool.tvl < 300000 && pool.tvl > 40000);
            secondPools = secondPools.sort((a, b) => {
                if (a.apr !== b.apr) {
                    return b.apr - a.apr; // sort by APR number
                } else {
                    return b.tvl - a.tvl; // sort by TVL number
                }
            })

            return [...secondPools];
        },

        initFeature(pools) {
            const topValuesByType = {};

            pools.forEach(entry => {
                const { chain, apr } = entry;
                if (entry.tvl < 500000) {
                    return;
                }

                if (!topValuesByType[chain] || (apr > topValuesByType[chain].apr)) {
                    topValuesByType[chain] = entry;
                }
            });

            const topTvlArray = Object.values(topValuesByType);
            topTvlArray.forEach(pool => {
                if (pool.apr) {
                    pool.feature = true;
                }
            })

            return pools;
        },
        initAggregators(pool) {
            pool.aggregators = [];
            // usd+ dola arb
            let poolAddress = pool.id.address;

            // dola usd+ chronos
          /*  if (poolAddress === '0xbbd7ff1728963a5eb582d26ea90290f84e89bd66')  {
                pool.aggregators.push({
                    id: ('Aggregator' + pool.id.name + pool.tvl + pool.platform),
                    name: pool.id.name,
                    address: pool.id.address,
                    platform: 'Beefy',
                    zappable: false,
                })
            }*/

            if (pool.platform === 'Defiedge' || pool.platform === 'Gnd') {
                pool.aggregators.push({
                    id: ('Aggregator' + pool.id.name + pool.tvl + pool.platform),
                    name: pool.id.name,
                    address: pool.id.address,
                    platform: 'Uniswap',
                    zappable: false,
                    link: 'https://info.uniswap.org/#/optimism/pools/' + pool.id.address
                })

                pool.poolNameForAgregator = 'Uniswap';
            }

            if (poolAddress === '0x1F3cA66c98d682fA1BeC31264692daD4f17340BC')  {
                pool.aggregators.push({
                    id: ('Aggregator' + pool.id.name + pool.tvl + pool.platform),
                    name: pool.id.name,
                    address: pool.id.address,
                    platform: 'Beefy',
                    zappable: false,
                    link: 'https://app.beefy.com/vault/thena-hay-usd+'
                })
            }

            if (poolAddress === '0xa99817d2d286c894f8f3888096a5616d06f20d46')  {
                pool.aggregators.push({
                    id: ('Aggregator' + pool.id.name + pool.tvl + pool.platform),
                    name: pool.id.name,
                    address: pool.id.address,
                    platform: 'Beefy',
                    zappable: false,
                    link: 'https://app.beefy.com/vault/velodrome-usd+-dola'
                })
            }

            if (poolAddress === '0x219fbc3ed20152a9501ddaa47f2a8c193e32d0c6')  {
                pool.aggregators.push({
                    id: ('Aggregator' + pool.id.name + pool.tvl + pool.platform),
                    name: pool.id.name,
                    address: pool.id.address,
                    platform: 'Beefy',
                    zappable: false,
                    link: 'https://app.beefy.com/vault/solidlizard-usd+-usdc'
                })
            }

            if (poolAddress === '0x69c28d5bbe392ef48c0dc347c575023daf0cd243')  {
                pool.aggregators.push({
                    id: ('Aggregator' + pool.id.name + pool.tvl + pool.platform),
                    name: pool.id.name,
                    address: pool.id.address,
                    platform: 'Beefy',
                    zappable: false,
                    link: 'https://app.beefy.com/vault/velodrome-usd+-dai+',
                })
            }

            if (poolAddress === '0x8a9cd3dce710e90177b4332c108e159a15736a0f')  {
                pool.aggregators.push({
                    id: ('Aggregator' + pool.id.name + pool.tvl + pool.platform),
                    name: pool.id.name,
                    address: pool.id.address,
                    platform: 'Beefy',
                    zappable: false,
                    link: 'https://app.beefy.com/vault/velodrome-usd+-lusd',
                })
            }

            if (poolAddress === '0x67124355cce2ad7a8ea283e990612ebe12730175')  {
                pool.aggregators.push({
                    id: ('Aggregator' + pool.id.name + pool.tvl + pool.platform),
                    name: pool.id.name,
                    address: pool.id.address,
                    platform: 'Beefy',
                    zappable: false,
                    link: 'https://app.beefy.com/vault/velodrome-usdp-usdc',
                })
            }


            if (poolAddress === '0xeb9153afbaa3a6cfbd4fce39988cea786d3f62bb') {
                pool.aggregators.push({
                    id: ('Aggregator' + pool.id.name + pool.tvl + pool.platform),
                    name: pool.id.name,
                    address: pool.id.address,
                    platform: 'Ennead',
                    zappable: false,
                })
            }

/*            if (pool.id.address === '0x88beb144352bd3109c79076202fac2bceab87117') {
                pool.aggregators.push({
                    id: ('Aggregator' + 'Magpie' + pool.id.name + pool.tvl + pool.platform),
                    name: pool.id.name,
                    address: pool.id.address,
                    platform: 'Magpie',
                    zappable: false,
                })

                pool.aggregators.push({
                    id: ('Aggregator'+ 'Wombax' + pool.id.name + pool.tvl + pool.platform),
                    name: pool.id.name,
                    address: pool.id.address,
                    platform: 'Wombax',
                    zappable: false,
                })
            }*/

            return pool;
        },
        clearAllFilters() {
                this.isShowOnlyZap = false;
                this.isShowAprLimit = false;
                this.selectedTabs = ['ALL'];
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

    .updated-title {
        text-align: left!important;
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
}

/* full */
@media only screen and (min-width: 1400px) {
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
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 48px;
        line-height: 60px;
    }
}

.title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.updated-title {
    text-align: right;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: var(--pools-updated-time-color);
}

.update-time {
    color: var(--pools-updated-time-minutes-color);
}

.show-more {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
    color: var(--main-gray-text);
    cursor: pointer;
    text-transform: uppercase;
}

.prototypes-list-divider {
    border-color: var(--fourth-gray-text) !important;
}
</style>
