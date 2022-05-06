<template>
    <v-row class="get-rewards-card">
        <v-container fluid>
            <v-row class="mt-1 mb-4 ml-4 mr-4">
                <label class="get-rewards-label">Get your rewards $</label>
                <v-spacer></v-spacer>
                <label class="get-rewards-sub-label" @click="openPreOvnPage">About preOVN</label>
            </v-row>

            <v-row class="mt-8">
                <v-spacer></v-spacer>
                <div>
                    <v-row class="date-header-row">
                        <label class="date-header-label ml-3 my-1">Start date</label>
                        <label class="date-header-value ml-3 my-1">{{ startDate }}</label>
                        <label class="date-header-label ml-3 my-1">Estimated end date</label>
                        <label class="date-header-value ml-3 my-1 mr-3">{{ estimatedDate }}</label>
                    </v-row>
                </div>
                <v-spacer></v-spacer>
            </v-row>

            <v-row class="mt-10 mb-2">
                <v-col>
                    <v-row justify="center">
                        <label class="get-rewards-section-header">TVL</label>
                    </v-row>
                    <v-row justify="center">
                        <label class="get-rewards-section-label">${{ $utils.formatMoney(farmTvl, 0) }}</label>
                    </v-row>
                </v-col>

                <v-col class="border-col">
                    <v-row justify="center">
                        <label class="get-rewards-section-header">Total rewards pool</label>
                    </v-row>
                    <v-row justify="center">
                        <label class="get-rewards-section-label">{{ $utils.formatMoney(totalRewards, 0) }}</label>
                    </v-row>
                </v-col>

                <v-col>
                    <v-row justify="center">
                        <label class="get-rewards-section-header">Total rewards left</label>
                    </v-row>
                    <v-row justify="center">
                        <label class="get-rewards-section-label">{{ $utils.formatMoney(totalRewardsLeft, 0) }}</label>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-row>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "GetRewardsSectionMobile",

    components: {
    },

    props: {
    },

    computed: {
        ...mapGetters('farm', ['farmTvl', 'totalRewards', 'totalRewardsLeft', 'startDate', 'estimatedDate']),
    },

    data: () => ({
    }),

    created() {
    },

    methods: {

        openPreOvnPage() {
            this.goToAction('/preovn');
        },

        goToAction(id) {
            this.$router.push(id);
        },
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {
}

@media only screen and (min-width: 1400px) {
}

.get-rewards-card {
    border-radius: 20px !important;
    background-color: var(--secondary) !important;
}

.get-rewards-label {
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 28px;
    font-feature-settings: 'pnum' on, 'lnum' on;
    background: linear-gradient(91.26deg, #FE7F2D 0%, #FCCA46 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    opacity: 0.9;
}

.get-rewards-sub-label {
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #3D8DFF;
    cursor: pointer;
}

.get-rewards-section-header {
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 16px;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #707A8B;
}

.get-rewards-section-label {
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 28px;
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FFFFFF;
}

.border-col {
    border-left: 1px solid #4C586D !important;
    border-right: 1px solid #4C586D !important;
}

.date-header-row {
    background: #000000;
    border-radius: 6px;
}

.date-header-label {
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 12px !important;
    line-height: 24px !important;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #707A8B;
}

.date-header-value {
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 12px !important;
    line-height: 24px !important;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FFFFFF;
}
</style>
