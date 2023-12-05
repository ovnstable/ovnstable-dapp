<template>
    <div class="mb-15">
        <div class="row">
            <div class="col-12 col-lg-6 col-md-6 col-sm-6">
                <div class="mt-lg-5 mt-md-5 mt-sm-5 mb-lg-10 mb-md-5 mb-sm-5">
                    <label v-if="type === 'OVN'" class="title-label">
                        OVN POOLS
                    </label>
                    <label v-else class="title-label">
                        ALL POOLS
                    </label>
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
            <div v-if="typeOfPool === 'ALL'" class="pools-header-container">
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
                           :type-of-pool="typeOfPool"
                ></PoolTable>
            </div>
        </div>

        <ZapModal :set-show-func='setIsZapModalShow'
                  :zap-pool="currentZapPool"
                  :is-show="isZapModalShow"
                  :type-of-pool="typeOfPool"
                  :pool-tokens-for-zap-map="poolTokensForZapMap">
        </ZapModal>

        <template v-if="!isPoolsLoading && typeOfPool === 'ALL'">
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

import {mapActions} from "vuex";

import ZapModal from "@/components/zap/modals/ZapModal.vue";
import PoolFilter from "@/components/pool/PoolFilter.vue";
import PoolTable from "@/components/pool/PoolTable.vue";
import {pool} from "@/components/mixins/pool";


export default {
    name: "PoolsContainer",
    mixins: [pool],
    props: {
        type: { // OVN, ALL
            type: String,
            required: true
        }
    },
    components: {
        PoolTable,
        PoolFilter,
        ZapModal,
    },

    data: () => ({
        avgApy: null,

        openPoolList: false,

        selectedTabs: ['ALL'], // ALL or networkName,
        isShowOnlyZap: false,
        isShowAprLimit: false,
        aprLimitForFilter: 15,
        searchQuery: null,

        orderType: "APR" // APR, APR_UP, APR_DOWN, TVL, TVL_UP, TVL_DOWN
    }),

    computed: {
        filteredPools () {
            if (this.orderType === 'APR') {
                // last step filter
                return this.getSortedPools(this.filteredBySearchQueryPools, this.typeOfPool === 'OVN');
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
                return this.getSortedPools(this.filteredBySearchQueryPools, this.typeOfPool === 'OVN');
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
                pool.apr && this.aprLimitForFilter <= pool.apr*1
            )
        },
        filteredAprSecondPools: function () {
            if (!this.isShowAprLimit) {
                return this.filteredZappableSecondPools;
            }

            return this.filteredZappableSecondPools.filter(pool =>
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

            const lastUpdateMoment = this.$dayjs.utc(lastUpdateDate);
            const now = this.$dayjs.utc();    
            return now.diff(lastUpdateMoment, 'minutes');
        }
    },
    watch: {
        networkId: function () {
            this.clearAllFilters();
            this.loadPools();
        }
    },
    async mounted() {
        if (this.type === 'OVN') {
            this.typeOfPool = 'OVN';
        } else {
            this.typeOfPool = 'ALL';
        }

        this.clearAllFilters();
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

@media only screen and (min-width: 1300px) {
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
