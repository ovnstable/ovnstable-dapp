<template>
    <div class="mb-15">
        <div class="mt-10 mb-10">
            <label class="title-label">usd+ pools</label>
        </div>

        <PoolListHeader/>

        <PoolListCard class="mt-2" v-for="(component, i) in sortedPoolList" v-if="component.type === 'pool'"
                      :card-data="component"/>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapGetters} from "vuex";
import PoolListHeader from "@/components/market/cards/pool/list/PoolListHeader";
import PoolListCard from "@/components/market/cards/pool/list/PoolListCard";
import moment from "moment";

export default {
    name: "UsdPools",

    components: {
        PoolListCard,
        PoolListHeader,
    },

    data: () => ({
        avgApy: null,
        sortedCardList: [],
    }),

    computed: {
        ...mapGetters('network', ['appApiUrl', 'networkId', 'polygonConfig', 'bscConfig', 'opConfig']),
        ...mapGetters('marketData', ['etsStrategyData']),
        ...mapGetters("statsData", ['currentTotalData', 'totalUsdPlusValue']),
        ...mapGetters('supplyData', ['totalSupply', 'totalInsuranceSupply']),
        ...mapGetters('poolAction', ['poolList']),

        activeTabName: function() {
            return this.$route.query.tabName || 'usd-pools';
        },

        sortedPoolList: function () {

            let networkId = this.networkId;

            let poolList = [];

            this.poolList.forEach(pool => {
                poolList.push(
                    {
                        type: 'pool',
                        name: 'Pool',
                        data: pool,
                        chain: pool.chain,
                        hasUsdPlus: true,
                        overcapEnabled: false,
                        hasCap: true,
                        tvl: pool.tvl,
                        monthApy: 0,
                        cardOpened: false,
                    },
                );
            });

            poolList.sort(function (a, b) {
                if (a.chain === networkId && b.chain !== networkId) return -1;
                if (a.chain !== networkId && b.chain === networkId) return 1;

                return (a.tvl > b.tvl) ? -1 : (a.tvl < b.tvl ? 1 : 0);
            });

            poolList[0].cardOpened = true;

            return poolList;
        },
    },

    watch: {
    },

    created() {
    },

    mounted() {
        this.initTab();
    },

    methods: {
        setTab(tabId) {
            this.tab = tabId;
        },

        initTab() {
            if (this.$route.query.tabName === 'usd-pools') {
                this.setTab(1);
            }
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
