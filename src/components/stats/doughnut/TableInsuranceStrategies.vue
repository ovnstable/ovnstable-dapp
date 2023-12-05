<template>
    <v-simple-table class="current-table">
        <thead>
        <tr class="current-table-row-header">
            <th class="table-header-don text-left">
                Strategy
            </th>
            <th class="table-header-don text-left">
                %  in Collateral
            </th>
            <th class="table-header-don text-left" >
                NAV USDC
            </th>
            <th class="table-header-don text-left" :class="minimized ? 'text-right' : 'text-left'"
                :width="minimized ? '' : '180px'" :colspan="minimized ? 2 : 1">
                <div class="with-tooltip">
                    <div class="table-header-don text-left">
                        Premiums, %
                    </div>
                    <div>
                        <Tooltip
                            text="Share of yield retained as premiums"
                        />
                    </div>
                </div>
            </th>
        </tr>
        </thead>

        <tbody>
        <tr
            v-for="item in data"
            :key="item.label + (item.value + '')"
            class="current-table-row"
            @click="(item.type === 'CORE' || item.type === 'SMM') ? openInNewTab(item.link) : openInDapp(item.link)">
            <td class="table-label-don text-left">
                <v-row>
                    <label class="link-label link-name align-center" :title="item.fullName">
                        {{ networkName === 'arbitrum' ? item.label.replace('USDC', 'USDC.e') : item.label }}
                    </label>
                    <v-spacer></v-spacer>
                    <label class="link-label mr-6" v-if="!$wu.isFull()">
                        <v-img class="icon-img-link" v-if="!minimized" :src="require('@/assets/icon/open-in-new.svg')"/>
                    </label>
                </v-row>
            </td>
            <td class="table-label-don text-left">
                {{ getPercent(item) }}%
            </td>
            <td class="table-label-don text-left">
                ${{ $utils.formatMoney(item.value, 2) }}
            </td>
            <td class="table-label-don text-left green-text">
                {{ item.riskFactor }}%
            </td>
        </tr>

        <tr class="current-table-row-total">

            <td class="table-label-don no-hover text-left">
                <v-row>
                    <b>Total</b>
                </v-row>
            </td>
            <td class="table-label-don text-right" v-if="!minimized">
                <div class="color-rectangle" style="background: transparent"></div>
            </td>
            <td class="table-label-don text-left" :colspan="minimized ? 3 : 1">
                <b>${{ $utils.formatMoney(getTotal(), 2) }}</b>
            </td>
            <td class="table-label-don">
                <b>{{ $utils.formatMoney(avgByPremiums, 2) }}%</b>
            </td>
            <td class="table-label-don" v-if="!minimized"></td>
        </tr>


        </tbody>
    </v-simple-table>
</template>

<script>

import {mapGetters} from "vuex";
import axios from "axios";
import Tooltip from "@/components/common/element/Tooltip.vue";

/* eslint-disable no-unused-vars,no-undef */

export default {
    name: "TableInsuranceStrategies",

    props: {
        data: {
            type: Array,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: [],
        },
        minimized: {
            type: Boolean,
            default: false,
        },
        totalTitle: {
          type: String,
          default: 'Total'
        },
        isInsurance: {
          type: Boolean,
          default: false,
          require: false
        },
        assetType: {
          type: String,
          default: null
        },
        networkName: {
            type: String,
            default: 'optimism',
        }
    },

    components: {Tooltip},

    data: () => ({
        totalSupply: 0,
    }),

    mounted() {
        this.initTotalTvl();
    },

    async created() {
    },

    computed: {
        ...mapGetters("network", ['assetName', 'assetDecimals', 'appApiUrl']),
        ...mapGetters("web3", ['contracts']),

        sumOfRiskFactors() {
            let sum = 0;
            if (this.data)
                this.data.forEach(dataItem => {
                    sum += dataItem.riskFactor
                });
            return sum;
        },
        avgByPremiums() {
            let avgByPremiums = 0;
            for (let i = 0; i <  this.data.length ; i++) {
                let item = this.data[i];
                let percent = this.getPercent(item);
                let avgPremium = percent * (item.riskFactor / 100);
                avgByPremiums += avgPremium;
            }
            // this.getPercent(item)

            return avgByPremiums.toFixed(2);
        }
    },



    watch: {
        // networkName: function (val, oldVal) {
        //     if (val) {
        //         this.totalSupply = null;
        //         this.initTotalTvl();
        //     }
        // }
    },

    methods: {
        async initTotalTvl() {
            try {
                let totalNetAssets;
                let networkName = 'optimism';//this.networkName;
                let appRootApiUrl = "https://api.overnight.fi/" + networkName + '/';

                if (this.assetType === 'USD') {
                    totalNetAssets = (await axios.get(appRootApiUrl + 'usd+/dapp/getTotalUsdPlusValue')).data;
                    // totalNetAssets = await this.contracts.m2m.methods.totalNetAssets().call();
                }

                if (this.assetType === 'DAI') {
                    totalNetAssets = (await axios.get(appRootApiUrl + 'dai+/dapp/getTotalUsdPlusValue')).data;
                    // totalNetAssets = await this.contracts.daiM2m.methods.totalNetAssets().call();
                }

                if (this.assetType === 'USDT') {
                    totalNetAssets = (await axios.get(appRootApiUrl + 'usdt+/dapp/getTotalUsdPlusValue')).data;
                    // totalNetAssets = await this.contracts.usdtM2m.methods.totalNetAssets().call();
                }

                this.totalSupply = totalNetAssets
                console.log("TOTAL NET ASSET: ", this.totalSupply);
            } catch (e) {
                console.error("Fail when load initBlockchainTvl", e);
            }
        },
        getPercent(item) {
            let sum = this.data.map(dataItem => dataItem.value).reduce((prev, next) => prev + next);

            return (item.value * 100 / sum).toFixed(1) - 0;
        },

        getRiskFactorPercent(item) {
            // item.riskFactor
            // sumOfRiskFactors

            return (item.riskFactor * 100 / this.sumOfRiskFactors).toFixed(1) - 0;
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

        openInDapp(url) {
            window.open(url, '_self').focus();
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
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 22px !important;
    }

    .current-table-row {
        height: 48px !important;
    }

    .icon-img-link {
        width: 20px !important;
        height: 20px !important;
    }

    .color-rectangle {
        width: 20px;
        height: 20px;
    }

    .link-name {
        height: 100px;
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
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 24px !important;
    }

    .current-table-row {
        height: 64px !important;
    }

    .icon-img-link {
        width: 20px !important;
        height: 20px !important;
    }

    .color-rectangle {
        width: 20px;
        height: 20px;
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
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 24px !important;
    }

    .current-table-row {
        height: 64px !important;
    }

    .icon-img-link {
        width: 20px !important;
        height: 20px !important;
    }

    .color-rectangle {
        width: 20px;
        height: 20px;
    }
}

@media only screen and (min-width: 1300px) {
    .table-header-don {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
    }

    .table-label-don {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
    }

    .current-table-row {
        height: 60px !important;
    }

    .icon-img-link {
        width: 18px !important;
        height: 18px !important;
    }

    .link-label {
        margin-right: 1px !important;
    }

    .color-rectangle {
        width: 18px;
        height: 18px;
    }

    .table-label-don-total {
        width: 20% !important;
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

.current-table-row:hover {
    background: var(--current-table-hover) !important;
}

.current-table-row-total:hover {
    background: var(--current-table-hover) !important;
}

.current-table-row-total-usd-plus:hover {
    background: var(--current-table-hover) !important;
}

.icon-img-link {
    cursor: pointer;
}

.link-label {
    display: inline-flex !important;
}

.color-rectangle {
    border-radius: 4px;
}

.with-tooltip {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.transaction-info-title {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    color: #707A8B;
}

.green-text {
    color: #43ac96 !important;
}
</style>
