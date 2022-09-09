<template>
    <v-container class="fill-height" fluid>

        <!-- TODO: remove file after DEV-267 done -->

<!--        <v-row align="center" justify="center">
            <v-col class="main-col">
                <v-row class="justify-start pt-15">
                    <label class="title-header">
                        <v-icon class="return-btn" @click='goToAction("/")'>
                            mdi-reply
                        </v-icon>
                        Farm
                    </label>
                </v-row>

                <v-row class="pb-5" justify="center">
                    <v-col>
                        <v-row class="pools-list-row">
                            <v-col class="pa-0 ma-0" cols="12">
                                <v-row class="ml-4 mr-4">
                                    <v-col class="header-title-row" cols="1" v-if="!isMobile">
                                        <v-row justify="center">
                                            <label class="header-title-label">Chain</label>
                                        </v-row>
                                    </v-col>
                                    <v-col class="header-title-row" cols="2" v-if="!isMobile">
                                        <v-row justify="center">
                                            <label class="header-title-label">Platform</label>
                                        </v-row>
                                    </v-col>
                                    <v-col class="header-title-row" :cols="isMobile ? 7 : 3">
                                        <v-row>
                                            <label class="header-title-label">Name</label>
                                        </v-row>
                                    </v-col>
                                    <v-col class="header-title-row" :cols="isMobile ? '' : 2">
                                        <v-row justify="end">
                                            <label class="header-title-label">TVL</label>
                                        </v-row>
                                    </v-col>
                                    <v-col class="header-title-row" :cols="isMobile ? '' : 4">
                                        <v-row justify="end">
                                            <label class="header-title-label">{{ isMobile ? '' : 'Link to deposit'}}</label>
                                        </v-row>
                                    </v-col>
                                </v-row>

                                <v-row class="pool-panel pool-row mx-0"
                                       align="center"
                                       v-for="(pool, i) in poolList"
                                       :key="i"
                                       @click="openPoolLink(pool)"
                                >
                                    <v-col class="header-title-row" cols="1" v-if="!isMobile">
                                        <v-row justify="center">
                                            <div class="currency-icon ml-8">
                                                <v-img :src="pool.chainIcon"/>
                                            </div>
                                        </v-row>
                                    </v-col>
                                    <v-col class="header-title-row" cols="2" v-if="!isMobile">
                                        <v-row justify="center">
                                            <label class="panel-header-title-label ml-6">
                                                {{ pool.platform }}
                                            </label>
                                        </v-row>
                                    </v-col>
                                    <v-col class="header-title-row" :cols="isMobile ? 7 : 3">
                                        <v-row>
                                            <div class="currency-icon ml-2">
                                                <v-img :src="pool.token0Icon"/>
                                            </div>
                                            <div class="currency-icon ml-1">
                                                <v-img :src="pool.token1Icon"/>
                                            </div>
                                            <label class="panel-header-title-label ml-2 pool-name-label">
                                                {{ pool.name }}
                                            </label>
                                        </v-row>
                                    </v-col>
                                    <v-col class="header-title-row" :cols="isMobile ? '' : 2">
                                        <v-row justify="end">
                                            <label class="panel-header-title-label">
                                                {{ pool.tvl ? "$" + $utils.formatMoneyComma(pool.tvl, 0) : '—' }}
                                            </label>
                                        </v-row>
                                    </v-col>
                                    <v-col class="header-title-row" :cols="isMobile ? '' : 4">
                                        <v-row justify="end">
                                            <div class="pool-link-icon mr-4">
                                                <v-img :src="require('@/assets/icon/out-white.svg')"/>
                                            </div>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>-->
    </v-container>
</template>

<script>

import {mapGetters} from "vuex";

export default {
    name: "FarmView",

    components: {
    },

    data: () => ({
    }),

    computed: {
        // ...mapGetters('farmData', ['poolList']),

        isMobile() {
            return window.innerWidth < 960;
        },
    },

    methods: {
        openPoolLink(item) {

            let url;
            let platform = item.platform.toLowerCase();

            switch (platform){
                case 'quickswap':
                    url = 'https://info.quickswap.exchange/#/pair/'
                    break;
                case 'dystopia':
                    url = 'https://www.dystopia.exchange/liquidity/'
                    break;
                case 'meshswap':
                    url = 'https://meshswap.fi/exchange/pool/detail/'
                    break;
            }

            window.open(url + item.link, '_blank');
        },

        goToAction(id) {
            this.$router.push(id);
        },
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {
    .main-col {
        max-width: 90vw !important;
    }

    .pool-row {
        height: 72px !important;
    }

    .currency-icon {
        width: 28px;
        height: 28px;
    }
}

@media only screen and (min-width: 1400px) {
    .main-col {
        max-width: 70vw !important;
    }

    .pool-row {
        height: 96px !important;
    }

    .currency-icon {
        width: 40px;
        height: 40px;
    }

    .return-btn {
        display: none !important;
    }
}

.pool-row {
    cursor: pointer !important;
}

.pool-panel {
    margin-bottom: 10px !important;
    border-radius: 20px !important;
    background-color: var(--secondary) !important;
}

.pools-list-row {
    padding-top: 30px !important;
}

.return-btn {
    color: #FE7F2D !important;
    cursor: pointer;
    margin-top: -6px;
}

.panel-header-title-label {
    font-family: 'Lato', sans-serif !important;
    font-style: normal;
    font-weight: 600;
    font-size: 16px !important;
    line-height: 24px !important;
}

.panel-header-title-label {
    color: white;
}

.header-title-label {
    font-family: 'Lato', sans-serif !important;
    font-style: normal;
    font-weight: 400;
    font-size: 14px !important;
    line-height: 24px !important;
}

.header-title-label {
    color: #4C586D !important;
}

.pool-link-icon {
    width: 24px !important;
    height: 24px !important;
    cursor: pointer !important;
}

.view-explorer-btn > label {
    cursor: pointer !important;
}

.header-title-row {
    margin-bottom: 4px !important;
}

.pool-name-label {
    align-self: center !important;
}

</style>
