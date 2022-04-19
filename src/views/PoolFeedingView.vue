<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col lg="12" md="8" sm="8">
                <v-row class="justify-center align-center pt-15">
                    <label class="swap-title">
                        <v-icon class="return-btn" @click='goToAction("/")'>
                            mdi-reply
                        </v-icon>
                        Pools feeding
                    </label>
                </v-row>

                <v-row class="mt-15" justify="center">
                    <v-btn-toggle
                            v-model="tabNumber"
                            class="tab-btn-toggle"
                            mandatory>
                        <v-btn class="tab-btn" @click="tab = 1">
                            <label v-bind:class="activeTabLinearPoolFeeding">LP USDC/USD+ [Stake]</label>
                        </v-btn>

                      <v-btn class="tab-btn" @click="tab = 2">
                        <label v-bind:class="activeTabLinearPoolFeedingUnstake">LP USDC/USD+ [Unstake]</label>
                      </v-btn>

                      <v-btn class="tab-btn" @click="tab = 3">
                        <label v-bind:class="activeTabPayouts">LP aDAI [Stake]</label>
                      </v-btn>

                      <v-btn class="tab-btn" @click="tab = 4">
                        <label v-bind:class="activeTabPayouts">LP aDAI [Unstake]</label>
                      </v-btn>

                      <v-btn class="tab-btn" @click="tab = 5">
                        <label v-bind:class="activeTabPayouts">LP aUSDT [Stake]</label>
                      </v-btn>

                      <v-btn class="tab-btn" @click="tab = 6">
                        <label v-bind:class="activeTabPayouts">LP aUSDT [Unstake]</label>
                      </v-btn>

                        <v-btn class="tab-btn" @click="tab = 7">
                            <label v-bind:class="activeTabPortfolio">Stable pool USD+</label>
                        </v-btn>
                    </v-btn-toggle>
                </v-row>

                <v-row class="pt-4" justify="center">
                    <LinearPoolFeeding v-if="tab === 1"/>
                    <LinearPoolFeedingUnstake v-if="tab === 2"/>
                    <LinearPoolFeeding v-if="tab === 3"/>
                    <StablePoolFeeding v-if="tab === 4"/>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import {mapGetters} from "vuex";
import LinearPoolFeeding from "@/components/feeding/LinearPoolFeeding";
import StablePoolFeeding from "@/components/feeding/StablePoolFeeding";
import LinearPoolFeedingUnstake from "@/components/feeding/LinearPoolFeedingUnstake";
export default {
    name: "DashboardView",

    components: {
      LinearPoolFeedingUnstake,
        StablePoolFeeding,
        LinearPoolFeeding
    },

    data: () => ({
        tab: 1,
        tabNumber: undefined,
    }),

    computed: {
        activeTabLinearPoolFeeding: function () {
            return {
                'tab-button': this.tab === 1,
                'tab-button-in-active': this.tab !== 1,
            }
        },

        activeTabLinearPoolFeedingUnstake: function () {
            return {
                'tab-button': this.tab === 2,
                'tab-button-in-active': this.tab !== 2,
            }
        },
    },

    methods: {
        goToAction(id) {
            this.$router.push(id);
        },
    },
}
</script>

<style scoped>

/* mobile */
@media all and (min-width: 0px) and (max-width: 650px) {

    .swap-title {
        color: white !important;
        font-weight: 300;
        font-size: 34px;
    }
}

/* tablet */
@media only screen and (min-width: 650px) and (max-width: 1400px) {

    .swap-title {
        color: white !important;
        font-weight: 300;
        font-size: 34px;
    }
}

@media only screen and (min-width: 1400px) {

    .swap-title {
        color: white !important;
        font-weight: 300;
        font-size: 56px;
    }

    .return-btn {
        display: none !important;
    }
}

.desc {
    font-size: 14px;
    color: white !important;
}

.tab-btn-toggle {
    background: none !important;
    border-radius: 40px !important;
}

.tab-btn {
    background: var(--secondary) !important;
    justify-content: center;
    color: white !important;
    font-size: 16px;
    min-width: 150px;
}

.tab-button {
    color: #FE7F2D !important;
}

.return-btn {
    color: #FE7F2D !important;
    cursor: pointer;
    margin-top: -6px;
}
</style>
