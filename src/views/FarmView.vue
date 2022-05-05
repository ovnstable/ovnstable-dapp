<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col class="main-col">
                <v-row class="justify-start">
                    <label class="title-header">
                        Farm
                    </label>
                </v-row>

                <v-row class="main-row">
                    <v-col class="pa-0 ma-0" cols="12">
                        <v-row class="ml-4 mr-4">
                            <v-col class="header-title-row" cols="3">
                                <v-row>
                                    <label class="header-title-label">Name</label>
                                </v-row>
                            </v-col>
                            <v-col class="header-title-row" cols="2">
                                <v-row justify="end" class="mr-2">
                                    <label class="header-title-label">TVL</label>
                                </v-row>
                            </v-col>
                            <v-col class="header-title-row" cols="2">
                                <v-row justify="end" class="mr-2">
                                    <label class="header-title-label">APY</label>
                                </v-row>
                            </v-col>
                            <v-col class="header-title-row" cols="2">
                                <v-row justify="end" class="mr-2">
                                    <label class="header-title-label">Balance</label>
                                </v-row>
                            </v-col>
                            <v-col class="header-title-row" cols="2">
                                <v-row justify="end" class="mr-2">
                                    <label class="header-title-label">Rewards</label>
                                </v-row>
                            </v-col>
                            <v-col class="header-title-row" cols="1">
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-expansion-panels multiple v-model="openedPanels">
                                <v-expansion-panel
                                        class="pool-panel"
                                        v-for="(pool, i) in pools"
                                        :key="i"
                                        @click="openPanel(i)">

                                    <v-expansion-panel-header class="pool-panel-header">
                                        <v-col cols="1">
                                            <v-row>
                                                <div style="display: flex">
                                                    <div class="currency-icon">
                                                        <v-img :src="require('@/assets/currencies/undefined.svg')"/>
                                                    </div>
                                                    <div class="currency-icon">
                                                        <v-img :src="require('@/assets/currencies/undefined.svg')"/>
                                                    </div>
                                                </div>
                                            </v-row>
                                        </v-col>

                                        <v-col cols="2">
                                            <v-row>
                                                <label class="panel-header-title-label">
                                                    {{ pool.title }}
                                                </label>
                                            </v-row>
                                        </v-col>

                                        <v-col cols="2">
                                            <v-row justify="end">
                                                <label class="panel-header-stats-label">
                                                    {{ pool.tvl ? pool.tvl + ' TVL' : '—' }}
                                                </label>
                                            </v-row>
                                        </v-col>

                                        <v-col cols="2">
                                            <v-row justify="end">
                                                <label class="panel-header-stats-label mr-1">
                                                    {{ pool.apy ? $utils.formatMoney(pool.apy, 2) + '% APR' : '—' }}
                                                </label>
                                                <v-tooltip
                                                        color="#0C0D12"
                                                        right
                                                >
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <div class="help-icon-medium"
                                                             v-bind="attrs"
                                                             v-on="on">
                                                            <v-img :src="require('@/assets/icon/question-help.svg')"/>
                                                        </div>
                                                    </template>
                                                    <!-- TODO: add APR tooltip -->
                                                </v-tooltip>
                                            </v-row>
                                        </v-col>

                                        <v-col cols="2">
                                            <v-row justify="end">
                                                <label class="panel-header-stats-label">
                                                    325 LP
                                                </label>
                                            </v-row>
                                        </v-col>

                                        <v-col cols="2">
                                            <v-row justify="end">
                                                <label class="panel-header-stats-label">
                                                    12 preOVN
                                                </label>
                                            </v-row>
                                        </v-col>

                                        <v-col class="pa-0 ma-0" cols="1">
                                        </v-col>

                                        <template v-slot:actions>
                                            <label class="pool-panel-action-label">
                                                <v-icon class="action-label-icon">
                                                    mdi-chevron-down
                                                </v-icon>
                                            </label>
                                        </template>
                                    </v-expansion-panel-header>

                                    <v-expansion-panel-content class="mb-4">
                                        <v-col>
                                            <v-row class="content-row">
                                                <v-col cols="4">
                                                    <v-card class="content-card">
                                                        <v-card-title>
                                                            <v-row class="mb-3 mt-0">
                                                                <v-col cols="4">
                                                                    <v-row align="center" justify="start" class="ml-1">
                                                                        <label class="card-title-label">
                                                                            LP tokens
                                                                        </label>
                                                                    </v-row>
                                                                </v-col>
                                                                <v-col cols="8">
                                                                    <v-row align="center" justify="end" class="mr-1">
                                                                        <a class="card-link-title-label" @click="openGetLpTokenLink">
                                                                            <label class="mr-1">Get LP tokens</label>
                                                                            <v-img class="help-icon out-icon" :src="require('@/assets/icon/out.svg')"/>
                                                                        </a>
                                                                    </v-row>
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-title>
                                                        <v-card-text>
                                                            <v-row>
                                                                <v-col cols="4">
                                                                    <v-row align="center" justify="end">
                                                                        <label class="card-content-label-name">
                                                                            Total
                                                                        </label>
                                                                    </v-row>
                                                                    <v-row align="center" justify="end">
                                                                        <label class="card-content-label-name">
                                                                            Staked
                                                                        </label>
                                                                    </v-row>
                                                                </v-col>
                                                                <v-col cols="8">
                                                                    <v-row align="center" justify="start">
                                                                        <label class="ml-4 card-content-label-value">
                                                                            0.0000000004302
                                                                        </label>
                                                                    </v-row>
                                                                    <v-row align="center" justify="start">
                                                                        <label class="ml-4 card-content-label-value">
                                                                            <label class="mr-1">0.000000000000</label>
                                                                            <v-img class="help-icon-medium" :src="require('@/assets/currencies/undefined.svg')"/>
                                                                        </label>
                                                                    </v-row>
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                                <v-col cols="4">
                                                    <v-card class="content-card">
                                                        <v-card-title>
                                                            <v-spacer></v-spacer>
                                                            <label class="card-title-label mr-1">
                                                                PreOVN available to claim
                                                            </label>
                                                            <v-spacer></v-spacer>
                                                        </v-card-title>
                                                        <v-card-text style="height: 50%">
                                                            <v-row justify="center" align="center" class="mt-0" style="height: 100%">
                                                                <label class="ml-4 card-content-label-value">
                                                                    <label class="mr-1">0.000000000000</label>
                                                                    <v-img class="help-icon-medium" :src="require('@/assets/currencies/undefined.svg')"/>
                                                                </label>
                                                            </v-row>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                                <v-col cols="2">
                                                    <v-card class="content-card">
                                                        <v-card-title>
                                                            <v-spacer></v-spacer>
                                                            <label class="card-title-label">
                                                                Your pool share
                                                            </label>
                                                            <v-spacer></v-spacer>
                                                        </v-card-title>
                                                        <v-card-text style="height: 50%">
                                                            <v-row justify="center" align="center" class="mt-0" style="height: 100%">
                                                                <label class="ml-4 card-content-label-value">
                                                                    0.00%
                                                                </label>
                                                            </v-row>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                                <v-col cols="2">
                                                    <v-card class="content-card">
                                                        <v-card-title>
                                                            <v-spacer></v-spacer>
                                                            <label class="card-title-label mr-1">
                                                                Fee
                                                            </label>
                                                            <v-tooltip
                                                                    color="#0C0D12"
                                                                    right
                                                            >
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <div class="help-icon-medium"
                                                                         v-bind="attrs"
                                                                         v-on="on">
                                                                        <v-img :src="require('@/assets/icon/question-help.svg')"/>
                                                                    </div>
                                                                </template>
                                                                <!-- TODO: add fee tooltip -->
                                                            </v-tooltip>
                                                            <v-spacer></v-spacer>
                                                        </v-card-title>
                                                        <v-card-text style="height: 50%">
                                                            <v-row justify="center" align="center" class="mt-0" style="height: 100%">
                                                                <label class="ml-4 card-content-label-value">
                                                                    0.00%
                                                                </label>
                                                            </v-row>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                            </v-row>

                                            <v-row class="mt-5">
                                                <v-col cols="2"></v-col>
                                                <v-col cols="4">
                                                    <button class="btn-deposit" v-on:click="depositAction(pool)">
                                                        Deposit LP tokens
                                                    </button>
                                                </v-col>
                                                <v-col cols="4">
                                                    <button class="btn-withdraw" v-on:click="withdrawAction(pool)">
                                                        Withdraw LP tokens & Claim Rewards
                                                    </button>
                                                </v-col>
                                                <v-col cols="2"></v-col>
                                            </v-row>
                                        </v-col>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <DepositModal persistent/>
        <WithdrawModal persistent/>
    </v-container>
</template>

<script>

import {mapActions, mapGetters, mapMutations} from "vuex";
import DepositModal from "@/components/farm/DepositModal";
import WithdrawModal from "@/components/farm/WithdrawModal";

export default {
    name: "FarmView",

    components: {WithdrawModal, DepositModal},

    data: () => ({
        openedPanels: [0],
    }),


    computed: {
        ...mapGetters('farm', ['pools']),
    },

    methods: {
        ...mapActions('farm', ['showDepositModal', 'showWithdrawModal']),
        ...mapMutations('farm', ['setSelectedPool']),

        openPanel(i) {
            if (this.openedPanels[0] !== i) {
                this.openedPanels = [].push(i);
            }
        },

        openGetLpTokenLink() {
            /* TODO: add link */
            let url = '';
            window.open(url, '_blank');
        },

        openPreOvnPage() {
            /* TODO: add link */
            let url = '';
            window.open(url, '_blank');
        },

        depositAction(pool) {
            this.setSelectedPool(pool);
            this.showDepositModal();
        },

        withdrawAction(pool) {
            this.setSelectedPool(pool);
            this.showWithdrawModal();
        }
    }
}
</script>

<style scoped>

/* TODO: add mobile version */

.main-col {
    max-width: 70vw !important;
}

.pool-panel {
    margin-bottom: 10px !important;
    border-radius: 20px !important;
    background-color: var(--secondary) !important;
}

.v-expansion-panel--active {
    margin: 0 !important;
    border: none !important;
}

.main-row {
    padding-top: 30px !important;
}

.pool-panel-header {
    cursor: default !important;
}


.panel-header-title-label, .panel-header-stats-label, .card-title-label, .pool-panel-action-label {
    font-family: 'Lato', sans-serif !important;
    font-style: normal;
    font-weight: 600;
    font-size: 16px !important;
    line-height: 24px !important;
}

.panel-header-title-label, .panel-header-stats-label, .card-title-label {
    color: white;
}

.pool-panel-action-label, .action-label-icon {
    color: var(--link) !important;
}


.card-content-label-value, .header-title-label, .card-content-label-name, .card-link-title-label, .learn-more-link {
    font-family: 'Lato', sans-serif !important;
    font-style: normal;
    font-weight: 400;
    font-size: 14px !important;
    line-height: 24px !important;
}

.card-content-label-value {
    color: white;
    display: flex;
}

.header-title-label, .card-content-label-name {
    color: #4C586D !important;
}

.card-link-title-label {
    color: var(--link);
    display: flex;
    cursor: pointer !important;
}


.tooltip-sub-label, .tooltip-label {
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 12px !important;
    line-height: 16px !important;
}

.tooltip-sub-label {
    color: #4C586D !important;
}

.tooltip-label, .learn-more-link {
    color: white !important;
}

.learn-more-link {
    text-decoration: underline !important;
}


.currency-icon {
    width: 40px;
    height: 40px;
}

.view-explorer-btn > label {
    cursor: pointer !important;
}

.content-row {
    border-top: 1px solid #13151C !important;
}

.btn-deposit:hover {
    filter: brightness(110%);
}

.btn-deposit {
    color: white;
    background: var(--orange-gradient);
}

.btn-withdraw {
    color: var(--link);
    background: #13151C !important;
}

.btn-deposit, .btn-withdraw {
    height: 40px !important;
    width: 100%;
    border-radius: 40px;
}

.content-card {
    height: 100% !important;
    margin-top: 10px !important;
    background: #13151C !important;
    border-radius: 12px !important;
}

.header-title-row {
    margin-bottom: 4px !important;
}

.help-icon {
    width: 20px;
    height: 20px;
}

.help-icon-medium {
    width: 24px;
    height: 24px;
}

.out-icon {
    margin-top: 2px;
}

</style>
