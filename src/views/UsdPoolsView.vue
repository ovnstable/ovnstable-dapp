<template>
    <div class="mb-15">
        <div class="mt-10 mb-10">
            <label class="title-label">usd+ pools</label>
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
         <PoolListHeader/>
         <PoolListCard class="mt-2" v-for="component in sortedCardList.filter(value => (value.tvl > 100000))" :card-data="component" :key="component.id"/>
         <resize-observer @notify="$forceUpdate()"/>
       </div>
    </div>
</template>

<script>

import {mapGetters} from "vuex";
import PoolListHeader from "@/components/market/cards/pool/list/PoolListHeader";
import PoolListCard from "@/components/market/cards/pool/list/PoolListCard";

import {poolApiService} from "@/services/pool-api-service";

export default {
    name: "UsdPools",

    components: {
        PoolListCard,
        PoolListHeader,
    },

    data: () => ({
        avgApy: null,
        sortedCardList: [],
        pools: [],
        isPoolsLoading: true,
    }),

    computed: {
        ...mapGetters('network', ['appApiUrl', 'networkId', 'polygonConfig', 'bscConfig', 'opConfig', 'arConfig', 'zkConfig']),
    },

    created() {
    },

    mounted() {
        this.initTab();
        this.loadPools();
    },

    methods: {
      setTab(tabId) {
          this.tab = tabId;
      },

      initTab() {
          if (this.$route.query.tabName === 'usd-pools') {
              this.setTab(1);
          }
      },

      async loadPools() {
        this.isPoolsLoading = true;

        this.pools = [];
        let networkConfigList = [this.opConfig, this.polygonConfig, this.bscConfig, this.arConfig, this.zkConfig];

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
                      this.pools.push({
                        name: pool.id.name,
                        token0Icon: token0Icon,
                        token1Icon: token1Icon,
                        token2Icon: token2Icon,
                        token3Icon: token3Icon,
                        chain: networkConfig.networkId,
                        chainName: networkConfig.networkName,
                        address: pool.id.address,
                        dex: pool.platform,
                        tvl: pool.tvl,
                        apr: pool.apr,
                        explorerUrl: networkConfig.explorerUrl,
                      });
                    }
                  })
                }
              }).catch(reason => {
                console.log('Error get pools data: ' + reason);
              })
        }

        this.sortedCardList = this.getSortedPoolList();
        this.isPoolsLoading = false;
      },
      getSortedPoolList() {
        let networkId = this.networkId;
        let sortedPoolList = [];

        for (let i = 0; i < this.pools.length; i++) {
          let pool = this.pools[i];
          sortedPoolList.push(
              {
                id: (pool.name + pool.tvl + pool.chain),
                type: 'pool',
                name: 'Pool',
                data: pool,
                chain: pool.chain,
                hasUsdPlus: true,
                overcapEnabled: false,
                hasCap: true,
                tvl: pool.tvl,
                apr: pool.apr,
                monthApy: 0,
                cardOpened: false,
              },
          );
        }

        sortedPoolList.sort(function (a, b) {
          if (a.chain === networkId && b.chain !== networkId) return -1;
          if (a.chain !== networkId && b.chain === networkId) return 1;

          return (a.tvl > b.tvl) ? -1 : (a.tvl < b.tvl ? 1 : 0);
        });

        return sortedPoolList;
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
