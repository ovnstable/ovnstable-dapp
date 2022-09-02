<template>
    <v-simple-table class="current-table">
        <thead>
        <tr class="current-table-row-header">
            <th class="table-header-don" width="1%" v-if="!minimized"></th>
            <th class="table-header-don text-left">
                Strategy
            </th>
            <th class="table-header-don text-left">
                Net Asset Value ({{ assetName }})
                <!-- TODO: add info -->
            </th>
            <th class="table-header-don text-left" v-if="!minimized">
                Liquidation value ({{ assetName }})
                <!-- TODO: add info -->
            </th>
            <th class="table-header-don text-left" :class="minimized ? 'text-right' : 'text-left'"
                :width="minimized ? '' : '180px'" :colspan="minimized ? 2 : 1">
                {{ minimized ? '' : 'Percent in portfolio' }}
            </th>
            <th class="table-header-don" v-if="!minimized"></th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="item in data" :key="item.label" class="current-table-row" @click="openInNewTab(item.link)">
            <td class="table-label-don text-right" v-if="!minimized">
                <div class="color-rectangle" :style="{background: item.color}"></div>
            </td>
            <td class="table-label-don text-left">
                <v-row>
                    <label class="link-label" :title="item.fullName">
                        {{ item.label }}
                    </label>
                    <v-spacer></v-spacer>
                    <label class="link-label mr-6">
                        <v-img class="icon-img-link" v-if="!minimized" :src="require('@/assets/icon/open-in-new.svg')"/>
                    </label>
                </v-row>
            </td>
            <td class="table-label-don text-left">
                ${{ $utils.formatMoney(item.value, 2) }}
            </td>
            <td class="table-label-don text-left" v-if="!minimized">
                ${{ $utils.formatMoney(item.liquidationValue, 2) }}
            </td>
            <td class="table-label-don text-left progress-col">
                <v-progress-linear :value="getPercent(item)"
                                   :color="item.color"
                                   rounded
                                   v-if="!minimized"
                                   height="16">
                </v-progress-linear>
            </td>
            <td class="table-label-don text-left">
                {{ getPercent(item) }}%
            </td>
        </tr>

        <tr class="current-table-row-total">
            <td class="table-label-don text-right" v-if="!minimized">
                <div class="color-rectangle" style="background: transparent"></div>
            </td>
            <td class="table-label-don text-left">
                <v-row>
                    <b>Total</b>
                </v-row>
            </td>
            <td class="table-label-don text-left" :colspan="minimized ? 3 : 1">
                <b>${{ $utils.formatMoney(getTotal(), 2) }}</b>
            </td>
            <td class="table-label-don text-left" v-if="!minimized">
                <b>${{ $utils.formatMoney(getLiquidationTotal(), 2) }}</b>
            </td>
            <td class="table-label-don" v-if="!minimized"></td>
            <td class="table-label-don" v-if="!minimized"></td>
        </tr>

        <tr class="current-table-row-total-usd-plus">
            <td class="table-label-don" v-if="!minimized"></td>
            <td class="table-label-don text-left">
                <v-row>
                    <b>Total USD+ in circulation</b>
                </v-row>
            </td>
            <td class="table-label-don text-left" :colspan="minimized ? 3 : 1">
                <b>${{ $utils.formatMoney(totalUsdPlusValue, 2) }}</b>
            </td>
            <td class="table-empty" v-if="!minimized"></td>
            <td class="table-empty" v-if="!minimized"></td>
            <td class="table-empty" v-if="!minimized"></td>
        </tr>
        </tbody>
    </v-simple-table>
</template>

<script>

import {mapActions, mapGetters, mapMutations} from "vuex";

/* eslint-disable no-unused-vars,no-undef */

export default {
    name: "TableStrategies",

    props: {
        data: {
            type: Array,
            default: [],
        },

        minimized: {
            type: Boolean,
            default: false,
        },
    },

    components: {},

    data: () => ({}),

    computed: {
        ...mapGetters("statsData", ['totalUsdPlusValue', 'currentTotalData',]),
        ...mapGetters("statsUI", ['loadingCurrentTotalData']),
        ...mapGetters("network", ['assetName']),
    },

    mounted() {
    },

    created() {
    },

    methods: {
        ...mapActions([]),

        ...mapMutations([]),

        getPercent(item) {
            let sum = this.data.map(dataItem => dataItem.value).reduce((prev, next) => prev + next);

            return (item.value * 100 / sum).toFixed(1) - 0;
        },

        getTotal() {
            let sum = 0;

            if (this.data)
                this.data.forEach(dataItem => {
                    sum += dataItem.value
                });

            return sum;
        },

        getLiquidationTotal() {
            let sum = 0;

            if (this.data)
                this.data.forEach(dataItem => {
                    sum += dataItem.liquidationValue
                });

            return sum;
        },

        openInNewTab(url) {
            if (url && url !== '') {
                window.open(url, '_blank').focus();
            }
        }
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .table-header-don {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 12px !important;
        line-height: 16px !important;
    }

    .table-label-don {
        font-style: normal !important;
        font-weight: 300 !important;
        font-size: 14px !important;
        line-height: 22px !important;
    }

    .current-table-row {
        height: 48px !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .table-header-don {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
    }

    .table-label-don {
        font-style: normal !important;
        font-weight: 300 !important;
        font-size: 16px !important;
        line-height: 24px !important;
    }

    .current-table-row {
        height: 64px !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .table-header-don {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
    }

    .table-label-don {
        font-style: normal !important;
        font-weight: 300 !important;
        font-size: 16px !important;
        line-height: 24px !important;
    }

    .current-table-row {
        height: 64px !important;
    }
}

.current-table {
    width: 100% !important;
    background: none !important;
}

.current-table > .v-data-table__wrapper {
    overflow-y: scroll !important;
    -ms-overflow-style: none !important; /* for Internet Explorer, Edge */
    scrollbar-width: none !important; /* for Firefox */
}

.v-data-table__wrapper::-webkit-scrollbar {
    display: none !important;
}

.table-header-don {
    font-family: 'Roboto', sans-serif !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: #ADB3BD !important;
}

.table-label-don {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: #333333 !important;
}

.table-label-don {
    border-top: 1px solid #DEE1E5 !important;
}

.current-table-row-total > td {
    border-bottom: none !important;
}
.current-table-row-total-usd-plus > td {
    border-top: none !important;
}

.text-left {
    text-align: left !important;
}

.text-right {
    text-align: right !important;
}

.current-table-row-header {
    height: 50px !important;
}

.icon-img-link {
    width: 20px !important;
    height: 20px !important;
    cursor: pointer;
}

.link-label {
    display: inline-flex !important;
}

.color-rectangle {
    width: 20px;
    height: 20px;
    border-radius: 4px;
}
</style>
