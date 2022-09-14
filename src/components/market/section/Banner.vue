<template>
    <v-row align="center" justify="start" class="banner-container ma-0">
        <v-col class="text-col">
            <label class="banner-label">Choose your</label>
            <label class="banner-label-accent">&nbsp;IDEAL</label>
            <br/>
            <label class="banner-label">strategy</label>
        </v-col>

        <v-col class="info-col">
            <v-row align="center" justify="end" class="info-container ma-0" @click="openLink('https://app.overnight.fi/fund')">
                <v-col>
                    <v-row justify="center" align="center" class="ma-0">
                        <label class="info-title">Total value locked</label>
                    </v-row>
                    <v-row justify="center" align="center" class="mt-2">
                        <label class="info-value">{{ totalTvl ? ('$' + $utils.formatMoneyComma(totalTvl, 2)) : '—' }}</label>
                    </v-row>
                </v-col>
                <v-col class="bordered-col" cols="3">
                    <v-row justify="center" align="center" class="ma-0">
                        <label class="info-title">Profit USD+</label>
                    </v-row>
                    <v-row justify="center" align="center" class="mt-2">
                        <label class="info-value">{{ totalUsdPlusProfit ? ('$' + $utils.formatMoneyComma(totalUsdPlusProfit, 2)) : '—' }}</label>
                    </v-row>
                </v-col>
                <v-col>
                    <v-row justify="center" align="center" class="ma-0">
                        <label class="info-title">USD+ APY based on 7-day average</label>
                    </v-row>
                    <v-row justify="center" align="center" class="mt-2">
                        <label class="info-value">{{ (avgApy && avgApy.value) ? ($utils.formatMoneyComma(avgApy.value, 1)) + '%' : '—' }}</label>
                    </v-row>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
import {mapGetters} from "vuex";
import moment from "moment";

export default {
    name: "Banner",

    components: {
    },

    props: {
    },

    computed: {
        ...mapGetters("statsData", ['totalUsdPlusValue', 'totalUsdPlusProfit', 'currentTotalData']),
    },

    data: () => ({
        totalTvl: null,
        avgApy: null,
    }),

    watch: {
        currentTotalData: function (newVal, oldVal) {
            this.totalTvl = this.getTotalTvl();
        },
    },

    created() {
        this.totalTvl = this.getTotalTvl();
        this.getAvgWeekApy();
    },

    methods: {
        getTotalTvl() {
            if (this.currentTotalData) {
                let sum = 0;

                this.currentTotalData.forEach(dataItem => {
                    sum += dataItem.value
                });

                return sum;
            } else {
                return null;
            }
        },

        async getAvgWeekApy() {
            let fetchOptions = {
                headers: {
                    "Access-Control-Allow-Origin": process.env.VUE_APP_API
                }
            };

            await fetch(process.env.VUE_APP_API + '/widget/avg-apy-info/week', fetchOptions)
                .then(value => value.json())
                .then(value => {
                    this.avgApy = value;
                    this.avgApy.date = moment(this.avgApy.date).format("DD MMM. ‘YY");
                }).catch(reason => {
                    console.log('Error get data: ' + reason);
                })
        },

        openLink(url) {
            window.open(url, '_blank').focus();
        },
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
}

/* full */
@media only screen and (min-width: 1400px) {
}

.banner-container {
    width: 100% !important;
    height: 200px !important;
    background-image: url("~@/assets/bg/banner_bg.svg");
    background-color: var(--main-banner-background) !important;
}

.banner-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 40px;
    line-height: 50px;
    color: var(--secondary-gray-text);
}

.banner-label-accent {
    font-family: 'Cormorant', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 50px;
    line-height: 50px;
    background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
}

.text-col {
    margin-left: 3%;
}

.info-col {
    margin-right: 3%;
}

.info-container {
    width: 100% !important;
    height: 110px !important;
    background-color: var(--main-banner-background) !important;
    border: 1px solid var(--secondary-border);
    border-radius: 6px;
    cursor: pointer;
}

.info-title {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.info-value {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 30px;
    line-height: 36px;
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--links-blue);
}

.bordered-col {
    border-left: 1px solid var(--secondary-border) !important;
    border-right: 1px solid var(--secondary-border) !important;
}
</style>
