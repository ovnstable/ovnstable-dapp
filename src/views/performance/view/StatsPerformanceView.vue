<template>
    <div class="page-container">
        <div class="mt-10">
            <label class="title-label">Performance</label>
        </div>

        <div class="mt-7">
            <v-row align="center" justify="start" class="ma-0 toggle-row mt-10">
                <label class="tab-btn mr-4" v-bind:class="activeTabPolygon" @click="clickPolygon">
                    Polygon
                </label>
                <label class="tab-btn mx-4" v-bind:class="activeTabBsc" @click="clickBsc">
                    BSC
                </label>
                <label class="tab-btn mx-4" v-bind:class="activeTabAvalanche" @click="openLink('https://avax.overnight.fi/fund')">
                    Avalanche
                    <v-icon class="ml-n1 mb-5" small color="#C5C9D1">mdi-alpha</v-icon>
                </label>
                <label class="tab-btn ml-4" v-bind:class="activeTabOptimism" @click="openLink('https://op.overnight.fi/fund')">
                    Optimism
                    <v-icon class="ml-n1 mb-5" small color="#C5C9D1">mdi-alpha</v-icon>
                </label>
            </v-row>
        </div>

        <v-row v-if="!$wu.isMobile()" class="ma-0 mt-6" justify="start" align="center">
            <v-col class="info-card-container mr-2">
                <LineChartApy :data="payoutsApyData"/>
            </v-col>
            <v-col class="info-card-container ml-2">
                <LineChartTvl :data="payoutsTvlData"/>
            </v-col>
        </v-row>

        <v-row v-else class="ma-0 mt-5 info-card-container" justify="start" align="center">
            <v-col class="info-card-body-bottom">
                <v-row align="center" justify="start" class="ma-0">
                    <v-col class="ml-n3 mt-n3">
                        <v-btn outlined class="rate-tab-btn" @click="rateTab=1" v-bind:class="activeRateApy">
                            APY
                        </v-btn>
                    </v-col>
                    <v-col class="mr-n3 mt-n3">
                        <v-btn outlined class="rate-tab-btn" @click="rateTab=3" v-bind:class="activeRateTvl">
                            TVL
                        </v-btn>
                    </v-col>
                </v-row>

                <LineChartApy class="mx-n3" v-if="rateTab === 1" :data="payoutsApyData"/>
                <LineChartTvl class="mx-n3" v-if="rateTab === 3" :data="payoutsTvlData"/>
            </v-col>
        </v-row>

        <v-row class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-5' : 'mt-4'" justify="start" align="center">
            <v-col class="info-card-body-bottom">
                <v-row align="center" justify="start" class="ma-0">
                    <label class="section-title-label">USD+ payouts</label>
                </v-row>

                <v-row align="center" justify="center">
                    <v-col :cols="!$wu.isFull() ? 12 : 8">
                        <Table
                                v-if="!$wu.isMobile()"
                                :profit-label="assetName + ' per USD+'"
                                :payout-data="payouts"/>

                        <Table
                                v-else
                                minimized
                                :profit-label="assetName + ' per USD+'"
                                :payout-data="payouts"/>

                        <v-row justify="center" align="center" class="ma-0 mb-10 scroll-container">
                            <label class="table-scroll-label">scroll to see more</label>
                        </v-row>
                    </v-col>

                    <v-col :cols="!$wu.isFull() ? 12 : 4">
                        <Doughnut :size="280" color="#3D8DFF" :last-date="lastPayoutDate"/>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <div class="mt-12">
            <v-row align="center" justify="center" class="ma-0 mt-10">
                <label class="ready-label">Ready to use?</label>
            </v-row>
        </div>

        <v-row align="center" justify="center" class="ma-0" :class="$wu.isMobile() ? 'mt-7 mb-10' : 'mt-7'">
            <v-btn class="header-btn btn-filled" @click="mintAction">
                Mint USD+
            </v-btn>
        </v-row>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import Table from "@/components/market/strategy/payouts/Table";
import Doughnut from "@/components/market/strategy/payouts/Doughnut";
import {mapActions, mapGetters} from "vuex";
import LineChartApy from "@/components/stats/widget/LineChartApy";
import LineChartTvl from "@/components/stats/widget/LineChartTvl";

export default {
    name: "StatsPerformanceView",

    components: {
        LineChartTvl,
        LineChartApy,
        Doughnut,
        Table,
    },

    data: () => ({
        tab: null,
        rateTab: 1,
    }),

    computed: {
        ...mapGetters("network", ['networkId', 'assetName']),
        ...mapGetters('statsData', ['payouts', 'payoutsApyData', 'payoutsTvlData']),

        activeTabPolygon: function () {
            return {
                'tab-button': this.tab === 1,
                'tab-button-in-active': this.tab !== 1,
                'tab-btn-disabled': this.tab !== 1,
            }
        },

        activeTabBsc: function () {
            return {
                'tab-button': this.tab === 2,
                'tab-button-in-active': this.tab !== 2,
                'tab-btn-disabled': this.tab !== 2,
            }
        },

        activeTabAvalanche: function () {
            return {
                'tab-button': this.tab === 3,
                'tab-button-in-active': this.tab !== 3,
                'tab-btn-disabled': this.tab !== 3,
            }
        },

        activeTabOptimism: function () {
            return {
                'tab-button': this.tab === 4,
                'tab-button-in-active': this.tab !== 4,
                'tab-btn-disabled': this.tab !== 4,
            }
        },

        activeRateApy: function () {
            return {
                'rate-tab-button': this.rateTab === 1,
                'rate-tab-button-in-active': this.rateTab !== 1,
            }
        },

        activeRateDist: function () {
            return {
                'rate-tab-button': this.rateTab === 2,
                'rate-tab-button-in-active': this.rateTab !== 2,
            }
        },

        activeRateTvl: function () {
            return {
                'rate-tab-button': this.rateTab === 3,
                'rate-tab-button-in-active': this.rateTab !== 3,
            }
        },

        lastPayoutDate: function () {
            return this.payouts[0].payableDate;
        },
    },

    created() {
        if (this.networkId === 137) {
            this.tab = 1;
        }

        if (this.networkId === 56) {
            this.tab = 2;
        }
    },

    methods: {
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),

        openLink(url) {
            window.open(url, '_blank').focus();
        },

        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },

        clickPolygon() {
            if (this.networkId === 137) {
                this.tab = 1;
            } else {
                this.openLink('https://market.overnight.fi/stats');
            }
        },

        clickBsc() {
            if (this.networkId === 56) {
                this.tab = 2;
            } else {
                this.openLink('https://bsc.overnight.fi/stats');
            }
        }
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

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .rate-tab-btn {
        height: 32px !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
        letter-spacing: 0.03em !important;
    }

    .ready-label {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 32px;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-filled {
        width: 100%;
        height: 36px !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 32px;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .rate-tab-btn {
        height: 40px !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .ready-label {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 32px;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-filled {
        width: 20%;
        height: 40px !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 32px;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .rate-tab-btn {
        height: 40px !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .ready-label {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 32px;
    }

    .header-btn {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .btn-filled {
        width: 20%;
        height: 40px !important;
    }
}

.page-container {
    margin-bottom: 5% !important;
}

.tab-btn {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--secondary-gray-text);
    margin-bottom: -2px;
}

.tab-button {
    border-bottom: 2px solid #1C95E7 !important;
    color: #1C95E7 !important;
    cursor: pointer !important;
}

.tab-button-in-active {
    color: var(--secondary-gray-text) !important;
    cursor: pointer !important;
}

.toggle-row {
    border-bottom: 2px solid #DCE3E8;
}

.title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.info-card-container {
    background: #FFFFFF;
    border-radius: 4px;
}

.info-card-body-bottom {
    margin: 2% 2% !important;
}

.section-title-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    text-transform: capitalize;
    color: var(--secondary-gray-text);
}

.scroll-container {
    height: 24px !important;
    background: var(--main-background);
}

.table-scroll-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-lightgray-text);
}

.rate-tab-btn {
    width: 100% !important;

    font-family: 'Roboto', sans-serif !important;
    text-align: center !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.rate-tab-button {
    background: rgba(28, 149, 231, 0.1);
    border-radius: 4px;
    border: none !important;
    color: #1C95E7 !important;
}

.rate-tab-button-in-active {
    border-radius: 4px;
    color: #707A8B !important;
    border: 1px solid #DEE1E5 !important;
}

.tab-btn-disabled {
    color: var(--fourth-lightgray-text) !important;
}

.ready-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--main-gray-text);
}

.header-btn {
    border-radius: 4px !important;
    box-shadow: none !important;

    font-family: 'Roboto', sans-serif !important;
    text-align: center !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.btn-filled {
    background: var(--blue-gradient);
    color: #FFFFFF !important;
}
</style>
