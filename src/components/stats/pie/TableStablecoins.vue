<template>
    <v-simple-table class="current-table">
        <thead>
        <tr class="current-table-row-header">
            <th class="table-header-don text-left" :colspan="2">
                Stablecoin
            </th>
            <th class="table-header-don text-left" v-if="!minimized">
                {{ onlyPercents ? '' : 'Safety score' }}
                <!-- TODO: add info -->
            </th>
            <th class="table-header-don text-left" :colspan="1">
                {{ onlyPercents ? '' : 'Net Asset Value' }}
                <!-- TODO: add info -->
            </th>
            <th class="table-header-don text-left" width="180px" >
                Percent in portfolio
            </th>
            <th class="table-header-don" v-if="!minimized"></th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="item in data" :key="item.label" class="current-table-row" @click="openTokenOnScan(item.link)">
            <td class="table-label-don text-right" width="1%">
                <v-img class="currency-icon" :src="item.logo"/>
            </td>
            <td class="table-label-don text-left">
                <v-row>
                    <label class="link-label">
                        {{ item.label }}
                    </label>
                    <template v-if="!onlyPercents">
                        <v-spacer></v-spacer>
                        <label class="link-label align-center mr-6">
                            <v-img class="icon-img-link" v-if="!minimized" :src="require('@/assets/icon/open-in-new.svg')"/>
                        </label>
                    </template>
                </v-row>
            </td>
            <td class="table-label-don text-left high-label" v-if="!minimized">
                <template v-if="!onlyPercents">
                    VERY HIGH
                </template>
            </td>
            <td class="table-label-don text-left">
                <template v-if="!onlyPercents">
                    ${{ $utils.formatMoney(item.value, 2)}}
                </template>
            </td>
            <td class="table-label-don text-left progress-col" v-if="!minimized">
                <v-progress-linear :value="getPercent(item)"
                                   :color="item.color"
                                   rounded
                                   height="14">
                </v-progress-linear>
            </td>
            <td class="table-label-don text-left" width="1%">
                {{ getPercent(item) }}%
            </td>
        </tr>
        </tbody>
    </v-simple-table>
</template>

<script>

/* eslint-disable no-unused-vars,no-undef */

import {mapGetters} from "vuex";

export default {
    name: "TableStablecoins",

    props: {
        data: {
            type: Array,
            default: null,
        },

        minimized: {
            type: Boolean,
            default: false,
        },

        onlyPercents: {
            type: Boolean,
            default: false,
        },

        networkName: {
            type: String,
            default: 'optimism',
        }
    },

    components: {},

    data: () => ({
    }),

    computed: {
        ...mapGetters('network', ['getParams']),

        networkParams: function() {
            return this.getParams(this.networkName);
        },
    },

    mounted() {
    },

    created() {
    },

    methods: {
        getPercent(item) {
            let sum = this.data.map(dataItem => dataItem.value).reduce((prev, next) => prev + next);

            return (item.value * 100 / sum).toFixed(1) - 0;
        },

        getTotal() {
            let sum = 0;
            this.data.forEach(dataItem => {
                sum += dataItem.value
            });

            return sum;
        },

        getLiquidationTotal() {
            let sum = 0;
            this.data.forEach(dataItem => {
                sum += dataItem.liquidationValue
            });

            return sum;
        },

        openTokenOnScan(hash) {
            if (hash && hash !== '') {
                window.open(this.networkParams.explorerUrl + "token/" + hash, '_blank').focus();
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

    .currency-icon {
        width: 26px !important;
        height: 26px !important;
    }

    .icon-img-link {
        width: 20px !important;
        height: 20px !important;
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

    .currency-icon {
        width: 32px !important;
        height: 32px !important;
    }

    .icon-img-link {
        width: 20px !important;
        height: 20px !important;
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

    .currency-icon {
        width: 32px !important;
        height: 32px !important;
    }

    .icon-img-link {
        width: 20px !important;
        height: 20px !important;
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .table-header-don {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
    }

    .table-label-don {
        font-style: normal !important;
        font-weight: 300 !important;
        font-size: 14px !important;
        line-height: 20px !important;
    }

    .current-table-row {
        height: 54px !important;
    }

    .currency-icon {
        width: 30px !important;
        height: 30px !important;
    }

    .icon-img-link {
        width: 18px !important;
        height: 18px !important;
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
     color: var(--third-gray-text) !important;
 }

.table-label-don {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: var(--secondary-gray-text) !important;
}

.table-label-don {
    border-top: 1px solid var(--main-border) !important;
}

.current-strategy-table-row-total > td, .current-strategy-table-row-total-usd-plus > td {
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

.current-table-row:hover {
    background: var(--current-table-hover) !important;
}

.high-label {
    color: #22ABAC !important;
}

.icon-img-link {
    cursor: pointer;
}

.link-label {
    display: inline-flex !important;
}
</style>
