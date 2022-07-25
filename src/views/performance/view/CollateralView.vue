<template>
    <div class="page-container">
        <div class="mt-10">
            <label class="title-label">Collateral</label>
        </div>

        <div class="mt-7">
            <label class="title-info-label">USD+ stablecoin can be instantly minted and redeemed to USDC 1:1. Simply replace USDC with USD+ stablecoin and start getting passive yield where it didn’t exist before. Here you can see automated Overnight DeFi total asset portfolio management dashboards. Your assets are there.&nbsp;</label>
            <label class="title-info-label info-link" @click="openLink('https://docs.overnight.fi/core-concept/usd+-token')">How USD+ works</label>
        </div>

        <div class="mt-7">
            <v-row align="center" justify="start" class="ma-0 toggle-row mt-10">
                <label class="tab-btn mr-4" @click="tab=1" v-bind:class="activeTabPolygon">Polygon</label>
                <label style="color: #C5C9D1 !important" class="tab-btn ml-4" v-bind:class="activeTabAvalanche" disabled>Avalanche</label>
            </v-row>
        </div>

        <v-row class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-5' : 'mt-4'" justify="start" align="center">
            <v-col class="info-card-body-bottom">
                <v-row align="center" justify="start" class="ma-0">
                    <label class="section-title-label">Collateral assets</label>
                </v-row>

                <v-row align="center" justify="center">
                    <v-col :cols="!$wu.isFull() ? 12 : 8">
                        <TableStablecoins
                                v-if="!$wu.isMobile()"
                                :data="stablecoinData"/>

                        <TableStablecoins
                                v-else
                                minimized
                                :data="stablecoinData"/>
                    </v-col>

                    <v-col :cols="!$wu.isFull() ? 12 : 4">
                        <PieStablecoins :data="stablecoinData" :size="!$wu.isFull() ? 200 : 300"/>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- TODO: add collateral time rate -->

        <v-row class="ma-0 info-card-container" :class="$wu.isMobile() ? 'mt-5' : 'mt-4'" justify="start" align="center">
            <v-col class="info-card-body-bottom">
                <v-row align="center" justify="start" class="ma-0">
                    <label class="section-title-label">USD+ portfolio</label>
                </v-row>

                <v-row align="center" justify="center">
                    <v-col :cols="!$wu.isFull() ? 12 : 8">
                        <TableStrategies
                                v-if="!$wu.isMobile()"
                                :data="currentTotalData"/>

                        <TableStrategies
                                v-else
                                minimized
                                :data="currentTotalData"/>
                    </v-col>

                    <v-col :cols="!$wu.isFull() ? 12 : 4">
                        <DoughnutStrategies :data="currentTotalData" :size="!$wu.isFull() ? 200 : 300"/>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- TODO: add strategies time rate -->

        <div class="mt-12">
            <v-row align="center" justify="center" class="ma-0 mt-10">
                <label class="ready-label">Ready to use?</label>
            </v-row>
        </div>

        <v-row align="center" justify="center" class="ma-0" :class="$wu.isMobile() ? 'mt-7 mb-10' : 'mt-7'">
            <v-btn class="header-btn btn-filled" @click="openLink('https://app.overnight.fi/')">
                Mint USD+
            </v-btn>
        </v-row>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapGetters} from "vuex";
import TableStablecoins from "@/components/stats/pie/TableStablecoins";
import PieStablecoins from "@/components/stats/pie/PieStablecoins";
import TableStrategies from "@/components/stats/doughnut/TableStrategies";
import DoughnutStrategies from "@/components/stats/doughnut/DoughnutStrategies";

export default {
    name: "CollateralView",

    components: {
        DoughnutStrategies,
        TableStrategies,
        PieStablecoins,
        TableStablecoins
    },

    data: () => ({
        tab: 1,
    }),

    computed: {
        ...mapGetters("statsData", ['currentTotalData', 'stablecoinData']),

        activeTabPolygon: function () {
            return {
                'tab-button': this.tab === 1,
                'tab-button-in-active': this.tab !== 1,
            }
        },

        activeTabAvalanche: function () {
            return {
                'tab-button': this.tab === 2,
                'tab-button-in-active': this.tab !== 2,
            }
        },
    },

    methods: {
        openLink(url) {
            window.open(url, '_blank').focus();
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

    .title-info-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .ready-label {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
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

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
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

    .title-info-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
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

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
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

    .title-info-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
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

    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }
}

.page-container {
    margin-bottom: 5% !important;
}

.tab-btn {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: #333333;
    margin-bottom: -2px;
}

.tab-button {
    border-bottom: 2px solid #1C95E7 !important;
    color: #1C95E7 !important;
    cursor: pointer !important;
}

.tab-button-in-active {
    color: #333333 !important;
    cursor: pointer !important;
}

.toggle-row {
    border-bottom: 2px solid #DCE3E8;
}

.title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #29323E;
}

.title-info-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #29323E;
}

.info-link {
    font-weight: 400;
    color: #1C95E7 !important;
    cursor: pointer;
}

.ready-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: #29323E;
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
    text-transform: uppercase;
    color: #333333;
}
</style>
