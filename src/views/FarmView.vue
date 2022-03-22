<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col class="main-col">
                <v-row align="center">
                    <label class="title-label">
                        Farm
                    </label>
                    <v-spacer></v-spacer>
                </v-row>

                <v-row class="header-row">
                    <v-col class="pa-0 ma-0" cols="2">
                    </v-col>
                    <v-col class="pa-0 ma-0" cols="4">
                        <label class="header-row-label">Instrument</label>
                    </v-col>
                    <v-col class="pa-0 ma-0" cols="4">
                        <v-col cols="8">
                            <v-row justify="end">
                                <label class="header-row-label">Pool Stats</label>
                            </v-row>
                        </v-col>
                    </v-col>
                    <v-col class="pa-0 ma-0" cols="2">
                    </v-col>
                </v-row>

                <v-row class="main-row">
                    <v-col class="pa-0 ma-0" cols="12">
                        <v-row>
                            <v-expansion-panels multiple v-model="openedPanels">
                                <v-expansion-panel
                                        class="pool-panel"
                                        v-for="(pool, i) in pools"
                                        :key="i"
                                        @click="openPanel(i)">

                                    <v-expansion-panel-header class="pool-panel-header">
                                        <v-col class="pa-0 ma-0" cols="2">
                                            <div style="display: flex">
                                                <div class="currency-icon">
                                                    <v-img :src="require('@/assets/currencies/undefined.svg')"/>
                                                </div>
                                                <div class="currency-icon">
                                                    <v-img :src="require('@/assets/currencies/undefined.svg')"/>
                                                </div>
                                            </div>
                                        </v-col>
                                        <v-col class="pa-0 ma-0" cols="4">
                                            <label class="panel-header-title-label">
                                                {{ pool.title }}
                                            </label>
                                        </v-col>
                                        <v-col class="pa-0 ma-0" cols="4">
                                            <v-col cols="8">
                                                <v-row justify="end">
                                                    <label class="panel-header-stats-label">
                                                        {{ pool.apy ? $utils.formatMoney(pool.apy, 2) + '%' : '—' }}
                                                    </label>
                                                </v-row>
                                                <v-row justify="end">
                                                    <label class="panel-header-stats-label">
                                                        {{ pool.tvl ? pool.tvl + ' TVL' : '—' }}
                                                    </label>
                                                </v-row>
                                            </v-col>
                                        </v-col>

                                        <template v-slot:actions>
                                            <label class="pool-panel-action-label">
                                                Manage
                                                <v-icon class="action-label-icon">
                                                    mdi-chevron-down
                                                </v-icon>
                                            </label>
                                        </template>
                                    </v-expansion-panel-header>

                                    <v-expansion-panel-content>
                                        <v-col>
                                            <v-row class="content-row">
                                                <v-col>
                                                    <v-row justify="start">
                                                        <label class="content-label">Your total LP tokens</label>
                                                    </v-row>
                                                </v-col>
                                                <v-col>
                                                    <v-row justify="end">
                                                        <label class="content-label">0.0000000004302</label>
                                                    </v-row>
                                                </v-col>
                                            </v-row>

                                            <v-row class="content-row">
                                                <v-col>
                                                    <v-row justify="start">
                                                        <label class="content-label">LP token staked</label>
                                                    </v-row>
                                                </v-col>
                                                <v-col>
                                                    <v-row justify="end">
                                                        <span style="display: flex">
                                                            <label class="mr-1 content-label">0.000000000000</label>
                                                            <v-img height="24" width="24" :src="require('@/assets/currencies/undefined.svg')"/>
                                                        </span>
                                                    </v-row>
                                                </v-col>
                                            </v-row>

                                            <v-row class="content-row">
                                                <v-col>
                                                    <v-row justify="start">
                                                        <span style="display: flex">
                                                            <label class="mr-1 content-label">preOVN available to claim</label>
                                                            <v-img class="preovn-help-icon" height="24" width="24" :src="require('@/assets/icon/question-help.svg')"/>
                                                        </span>
                                                    </v-row>
                                                </v-col>
                                                <v-col>
                                                    <v-row justify="end">
                                                        <span style="display: flex">
                                                            <label class="mr-1 content-label">0.00000000</label>
                                                            <v-img height="24" width="24" :src="require('@/assets/currencies/undefined.svg')"/>
                                                        </span>
                                                    </v-row>
                                                </v-col>
                                            </v-row>

                                            <v-row class="content-row">
                                                <v-col>
                                                    <v-row justify="start">
                                                        <label class="content-label">Your pool share</label>
                                                    </v-row>
                                                </v-col>
                                                <v-col>
                                                    <v-row justify="end">
                                                        <label class="content-label">0.00%</label>
                                                    </v-row>
                                                </v-col>
                                            </v-row>

                                            <v-row justify="center" align="center">
                                                <a class="view-explorer-btn" @click="openGetLpTokenLink">
                                                    <label class="mr-1 view-explorer-label">Get LP token</label>
                                                    <v-img class="icon-img" :src="require('@/assets/icon/out.svg')"/>
                                                </a>
                                            </v-row>

                                            <v-row>
                                                <v-col cols="6">
                                                    <button class="btn-deposit" v-on:click="depositAction">
                                                        Deposit
                                                    </button>
                                                </v-col>
                                                <v-col cols="6">
                                                    <button class="btn-withdraw" v-on:click="withdrawAction">
                                                        Withdraw & Claim Rewards
                                                    </button>
                                                </v-col>
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
    </v-container>
</template>

<script>


import {mapGetters} from "vuex";

export default {
    name: "FarmView",

    components: {},

    data: () => ({
        openedPanels: [0],
    }),


    computed: {
        ...mapGetters('farm', ['pools']),
    },

    methods: {
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

        depositAction() {

        },

        withdrawAction() {

        }
    }

}
</script>

<style scoped>

/* TODO: add mobile version */

.main-col {
    max-width: 45vw !important;
}

.header-row {
    margin-top: 60px !important;
    margin-bottom: 30px !important;
}

.pool-panel {
    margin-bottom: 10px !important;
    border-radius: 8px !important;
    border: 1px solid rgba(95, 151, 255, 0.15) !important;
    background-color: #101419 !important;
}

.v-expansion-panel--active {
    margin: 0 !important;
    border: 1px solid var(--link) !important;
}

.title-label {
    color: white;
    font-weight: 300;
    font-size: 56px;
}

.header-row-label {
    font-family: 'Lato', sans-serif !important;
    color: white;
    font-weight: 600;
    font-style: normal;
    font-size: 18px;
    line-height: 28px;
}

.pool-panel-header {
    cursor: default !important;
}

.pool-panel-action-label {
    font-family: 'Lato', sans-serif !important;
    cursor: pointer !important;
    font-weight: 600;
    font-style: normal;
    font-size: 16px;
    line-height: 24px;
}

.pool-panel-action-label, .action-label-icon {
    color: var(--link) !important;
}

.panel-header-title-label {
    margin-left: -8px !important;
}

.panel-header-title-label, .panel-header-stats-label {
    font-family: 'Lato', sans-serif !important;
    cursor: pointer !important;
    font-weight: 600;
    font-style: normal;
    font-size: 16px;
    line-height: 24px;
    color: white;
}

.currency-icon {
    width: 32px;
    height: 32px;
    margin-left: 2px;
    margin-right: 2px;
}

.view-explorer-btn > label, .preovn-help-icon {
    cursor: pointer !important;
}

.view-explorer-btn {
    cursor: pointer;
    background: none !important;
    color: var(--link);
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    display: flex;
    margin-top: 5px !important;
    margin-bottom: 20px !important;
}

.view-explorer-label:hover {
    text-decoration: underline;
}

.content-row {
    margin-left: -6px !important;
    margin-right: -6px !important;
    margin-bottom: 5px !important;
}

.content-label {
    font-family: 'Lato', sans-serif !important;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    line-height: 24px;
    color: #8FA2B7 !important;
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
    background: var(--secondary);
}

.btn-deposit, .btn-withdraw {
    height: 40px !important;
    width: 100%;
    border-radius: 40px;
}

</style>
