<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col class="main-col">
                <v-row class="justify-start">
                    <label class="title-header">
                        Farm
                    </label>
                </v-row>

                <v-row class="mt-10 mb-2">
                    <GetRewardsSection class="rewards-section-full"/>
                    <GetRewardsSectionMobile class="rewards-section-mobile"/>
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
                                                        <v-img :src="pool.poolData.token0Icon"/>
                                                    </div>
                                                    <div class="currency-icon ml-1">
                                                        <v-img :src="pool.poolData.token1Icon"/>
                                                    </div>
                                                </div>
                                            </v-row>
                                        </v-col>

                                        <v-col cols="2">
                                            <v-row>
                                                <label class="panel-header-title-label">
                                                    {{ pool.poolData.title }}
                                                </label>
                                            </v-row>
                                        </v-col>

                                        <v-col cols="2">
                                            <v-row justify="end">
                                                <label class="panel-header-stats-label">
                                                    {{ pool.poolData.tvl ? "$" + $utils.formatMoney(pool.poolData.tvl, 0) + ' TVL' : '—' }}
                                                </label>
                                            </v-row>
                                        </v-col>

                                        <v-col cols="2">
                                            <v-row justify="end">
                                                <label class="panel-header-stats-label mr-1">
                                                    {{ pool.poolData.apy ? $utils.formatMoney(pool.poolData.apy, 2) + '%' : '—' }}
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
                                                   {{pool.userData.lpTokensStaked}}
                                                </label>
                                            </v-row>
                                        </v-col>

                                        <v-col cols="2">
                                            <v-row justify="end">
                                                <label class="panel-header-stats-label">
                                                    {{pool.userData.availableToClaim}}
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
                                                                        <a class="card-link-title-label" @click="openGetLpTokenLink(pool.poolData.link)">
                                                                            <label class="mr-1">Get LP tokens</label>
                                                                            <v-img class="help-icon out-icon" :src="require('@/assets/icon/out.svg')"/>
                                                                        </a>
                                                                    </v-row>
                                                                </v-col>
                                                            </v-row>
                                                        </v-card-title>
                                                        <v-card-text>
                                                            <v-row class="ml-1 mr-1">
                                                                <v-col cols="4">
                                                                    <v-row align="center" justify="start">
                                                                        <label class="card-content-label-name">
                                                                            Total
                                                                        </label>
                                                                    </v-row>
                                                                    <v-row align="center" justify="start" class="mt-5">
                                                                        <label class="card-content-label-name">
                                                                            Staked
                                                                        </label>
                                                                    </v-row>
                                                                </v-col>
                                                                <v-col cols="8">
                                                                    <v-row align="center" justify="end">
                                                                        <label class="card-content-label-value">
                                                                            {{pool.poolData.lpTokensTotal}}
                                                                        </label>
                                                                    </v-row>
                                                                    <v-row align="center" justify="end" class="mt-5">
                                                                        <label class="card-content-label-value">
                                                                            <v-img class="help-icon-medium" :src="require('@/assets/currencies/undefined.svg')"/>
                                                                            <label class="ml-1">{{pool.userData.lpTokensStaked}}</label>
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
                                                            <label class="card-title-label mr-1 mb-3 mt-0">
                                                                You earned, preOVN
                                                            </label>
                                                            <v-spacer></v-spacer>
                                                        </v-card-title>
                                                        <v-card-text>
                                                            <v-row class="ml-1 mr-1">
                                                                <v-col cols="4">
                                                                    <v-row align="center" justify="start">
                                                                        <label class="card-content-label-name">
                                                                            Claimable
                                                                        </label>
                                                                    </v-row>
                                                                    <v-row align="center" justify="start" class="mt-5">
                                                                        <label class="card-content-label-name">
                                                                            Accrued Rewards
                                                                        </label>
                                                                    </v-row>
                                                                </v-col>
                                                                <v-col cols="8">
                                                                    <v-row align="center" justify="end">
                                                                        <label class="card-content-label-value" v-if="pool.userData.availableToClaim && pool.userData.availableToClaim > 0">
                                                                            <label>{{ pool.userData.availableToClaim }}</label>
                                                                            <label :id="'paid-label-' + i"></label>
                                                                        </label>
                                                                        <label class="card-content-label-value" v-else>
                                                                            {{ pool.userData.availableToClaim }}
                                                                        </label>
                                                                    </v-row>
                                                                    <v-row align="center" justify="end" class="mt-5">
                                                                        <label class="card-content-label-value">
                                                                            <label>{{ pool.userData.paid }}</label>
                                                                        </label>
                                                                    </v-row>
                                                                </v-col>
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
                                                                    {{ poolShareValue(pool.userData.lpTokensStaked, pool.poolData.lpTokensTotal) }}
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
                                                                <p class="my-0">A portion of each trade</p>
                                                                <p class="my-0">goes to Overnight as a protocol incentive</p>
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
                                                <v-col style="display: flex">
                                                    <button class="btn-deposit" v-on:click="depositAction(pool)">
                                                        Deposit LP tokens
                                                    </button>
                                                    <button class="btn-withdraw ml-2 mr-2" v-on:click="withdrawAction(pool)">
                                                        Withdraw LP tokens
                                                    </button>
                                                    <button class="btn-withdraw" v-on:click="claimAction(pool)">
                                                        Claim Rewards
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
        <ClaimModal persistent/>
    </v-container>
</template>

<script>

import {mapActions, mapGetters, mapMutations} from "vuex";
import DepositModal from "@/components/farm/modal/DepositModal";
import WithdrawModal from "@/components/farm/modal/WithdrawModal";
import ClaimModal from "@/components/farm/modal/ClaimModal";
import GetRewardsSection from "@/components/farm/section/GetRewardsSection";
import GetRewardsSectionMobile from "@/components/farm/section/GetRewardsSectionMobile";

export default {
    name: "FarmView",

    components: {GetRewardsSectionMobile, GetRewardsSection, ClaimModal, WithdrawModal, DepositModal},

    data: () => ({
        openedPanels: [0],
    }),

    computed: {
        ...mapGetters('farmData', ['pools']),
    },



    methods: {
        ...mapActions('farmUI', ['showDepositModal', 'showWithdrawModal', 'showClaimModal']),
        ...mapActions('farmData', ['loadPools']),
        ...mapMutations('farmData', ['setSelectedPool']),


        getStringNonZero(s) {
            return Number.parseFloat(s).toFixed(5);
        },

        animateValue(id, numLength, duration, periodMs) {

            let obj = document.getElementById(id);

            let ticksMax = Math.floor(duration / periodMs);
            let ticks = 0;

            let timer = setInterval(function() {
                obj.innerHTML = Math.random().toString().slice(2, numLength + 2);

                if (ticks === ticksMax ) {
                    clearInterval(timer);
                }

                ticks++;
            }, periodMs);
        },

        openPanel(i) {
            if (this.openedPanels[0] !== i) {
                this.openedPanels = [].push(i);
            }
        },

        poolShareValue(staked, total) {
            if (staked && total && total > 0) {
                return this.$utils.formatMoney((100 * staked / total), 6) + "%";
            } else {
                return "0.00%";
            }
        },

        openGetLpTokenLink(url) {
            window.open(url, '_blank');
        },

        depositAction(pool) {
            this.setSelectedPool(pool);
            this.showDepositModal();
        },

        withdrawAction(pool) {
            this.setSelectedPool(pool);
            this.showWithdrawModal();
        },

        claimAction(pool) {
            this.setSelectedPool(pool);
            this.showClaimModal();
        }
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {
    .main-col {
        max-width: 90vw !important;
    }

    .main-row {
        width: 1050px !important;
        overflow-x: scroll;
        overflow-y: hidden;
    }

    .rewards-section-full {
        display: none !important;
    }
}

@media only screen and (min-width: 1400px) {
    .main-col {
        max-width: 70vw !important;
    }

    .rewards-section-mobile {
        display: none !important;
    }
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

.btn-deposit, .btn-withdraw {
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    font-feature-settings: 'pnum' on, 'lnum' on;
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
