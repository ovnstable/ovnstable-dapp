<template>
    <div class="mb-15">
        <div class="mt-10 mb-10">
            <label class="title-label">ALL POOLS</label>
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
                   <div class="col-12 col-lg-9 col-md-9 col-sm-12">
                       <PoolFilter
                           :set-selected-tab-func="setSelectedTab"
                           :selected-tab="selectedTab"
                           :zap-filter-func="zapFilter"
                           :is-show-only-zap="isShowOnlyZap"
                           :apr-limit-filter-func="aprLimitFilter"
                           :is-show-apr-limit="isShowAprLimit"
                       ></PoolFilter>
                   </div>
                   <div class="col-12 col-lg-3 col-md-3 col-sm-12">
<!--                       Search-->
                   </div>
               </div>
           </div>
           <div class="pools-container">
               <PoolTable :pools="filteredPools"
                          :open-zap-in-func="openZapIn"></PoolTable>
           </div>
<!--         <PoolListHeader/>
         <PoolListCard class="mt-2"
                       v-for="component in sortedPoolList.filter(value => (value.tvl > 100000))"
                       :key="component.id"
                       :card-data="component"
                        :open-zap-in-func="openZapIn"/>
         <resize-observer @notify="$forceUpdate()"/>-->
       </div>

        <ZapModal :set-show-func='setIsZapModalShow'
                  :zap-pool="currentZapPool"
                  :is-show="isZapModalShow"></ZapModal>
    </div>
</template>

<script>

import {mapGetters} from "vuex";
import PoolListHeader from "@/components/market/cards/pool/list/PoolListHeader";
import PoolListCard from "@/components/market/cards/pool/list/PoolListCard";

import {poolApiService} from "@/services/pool-api-service";
import ZapModal from "@/components/zap/modals/ZapModal.vue";
import PoolFilter from "@/components/pool/PoolFilter.vue";
import PoolTable from "@/components/pool/PoolTable.vue";

export default {
    name: "PoolsView",

    components: {
        PoolTable,
        PoolFilter,
        ZapModal,
    },

    data: () => ({
        avgApy: null,
        sortedPoolList: [],
        pools: [],
        isPoolsLoading: true,
        isZapModalShow: false,
        currentZapPool: null,

        selectedTab: 'ALL', // ALL or networkName,
        isShowOnlyZap: false,
        isShowAprLimit: false,
        aprLimitForFilter: 100,

        featuredPoolsAddresses: [
            '0x88beb144352bd3109c79076202fac2bceab87117',
            '0x69c28d5bbe392ef48c0dc347c575023daf0cd243',
            '0xb260163158311596ea88a700c5a30f101d072326'
        ]
    }),

    computed: {
        ...mapGetters('network', ['appApiUrl', 'networkId', 'networkName', 'allNetworkConfigs', 'getParams']),

        filteredPools: function () {
            if (!this.isShowAprLimit) {
                return this.filteredZappablePools;
            }

            return this.filteredZappablePools.filter(pool =>
                pool.apr && this.aprLimitForFilter <= pool.apr*1
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
        filteredByTabPools: function () {
            if (this.selectedTab === 'ALL') {
                return this.sortedPoolList
            }

            return this.sortedPoolList.filter(pool => this.getParams(pool.chain).networkName === this.selectedTab)
        }
    },

    created() {
    },

    async mounted() {
        await this.loadPools();
    },

    methods: {
        setIsZapModalShow(isShow) {
            this.isZapModalShow = isShow;
        },

        openZapIn(pool) {
            console.log("Zap open for pool: ", pool);
            this.currentZapPool = pool;
            this.setIsZapModalShow(true);
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
            this.selectedTab = tab;
        },

      async loadPools() {
        this.isPoolsLoading = true;

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

                    if (pool && pool.tvl && pool.tvl >= 10000.00) {

                        // todo move to backend
                        if (pool.platform === 'Chronos' && this.networkName === 'arbitrum') {
                            pool.zappable = true;
                        }

                        // todo move to backend
                        if (this.featuredPoolsAddresses.find(
                            item => item.toLowerCase() === pool.id.address.toLowerCase())
                        ) {
                            pool.feature = true;
                        }

                        // todo move to backend
                        // if ()


                      this.pools.push({
                        id: (pool.id.name + pool.tvl + pool.platform),
                        name: pool.id.name,
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
                        aggregators: pool.aggregators
                      });
                    }
                  })
                }
              }).catch(reason => {
                console.log('Error get pools data: ' + reason);
              })
        }


          this.sortedPoolList = this.pools.sort((a, b) => {
              if (a.feature && !b.feature) {
                  return -1; // a comes first when a is featured and b is not
              } else if (!a.feature && b.feature) {
                  return 1; // b comes first when b is featured and a is not
              } else if (a.apr !== b.apr) {
                  return b.apr- a.apr; // sort by APR number
              } else {
                  return b.tvl - a.tvl; // sort by TVL number
              }
          });

          this.isPoolsLoading = false;
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

</style>
