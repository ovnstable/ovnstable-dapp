<template>
    <v-row align="center" justify="start" class="banner-container ma-0">
        <v-col class="ma-0 main-col">
            <v-row justify="center" align="center" class="ma-0">
                <label class="banner-label">Choose your</label>
                <label class="banner-label-accent">&nbsp;IDEAL&nbsp;</label>
                <label class="banner-label">strategy</label>
            </v-row>

            <v-row justify="center" align="center" class="ma-0 mt-2 info-container" @click="openLink('https://app.overnight.fi/fund')">
                <v-col>
                    <v-row justify="center" align="center" class="ma-0">
                        <label class="info-title">TVL</label>
                    </v-row>
                    <v-row justify="center" align="center" class="mt-2">
                        <label class="info-value">{{ totalTvl ? ('$' + $utils.formatMoneyComma(totalTvl, 2)) : '—' }}</label>
                    </v-row>
                </v-col>
                <v-col class="bordered-col" cols="4">
                    <v-row justify="center" align="center" class="ma-0">
                        <label class="info-title">Profit USD+</label>
                    </v-row>
                    <v-row justify="center" align="center" class="mt-2">
                        <label class="info-value">{{ totalUsdPlusProfit ? ('$' + $utils.formatMoneyComma(totalUsdPlusProfit, 2)) : '—' }}</label>
                    </v-row>
                </v-col>
                <v-col>
                    <v-row justify="center" align="center" class="ma-0">
                        <label class="info-title">APY</label>
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
    name: "BannerMobile",

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
    .banner-label {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 26px;
    }

    .banner-label-accent {
        font-style: normal;
        font-weight: 500;
        font-size: 22px;
        line-height: 26px;
    }

    .banner-container {
        height: 150px !important;
    }

    .info-container {
        height: 80px !important;
    }

    .info-title {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
    }

    .info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .value-disabled {
        font-weight: 300 !important;
        font-size: 16px !important;
        letter-spacing: 0.02em;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .banner-label {
        font-style: normal;
        font-weight: 300;
        font-size: 36px;
        line-height: 46px;
    }

    .banner-label-accent {
        font-style: normal;
        font-weight: 500;
        font-size: 42px;
        line-height: 46px;
    }

    .banner-container {
        height: 200px !important;
    }

    .info-container {
        height: 110px !important;
    }

    .info-title {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
    }

    .info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 36px;
    }

    .value-disabled {
        font-weight: 300 !important;
        font-size: 24px !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .banner-label {
        font-style: normal;
        font-weight: 300;
        font-size: 40px;
        line-height: 50px;
    }

    .banner-label-accent {
        font-style: normal;
        font-weight: 500;
        font-size: 50px;
        line-height: 50px;
    }

    .banner-container {
        height: 200px !important;
    }

    .info-container {
        height: 110px !important;
    }

    .info-title {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
    }

    .info-value {
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 36px;
    }

    .value-disabled {
        font-weight: 300 !important;
        font-size: 24px !important;
    }
}

.banner-container {
    width: 100% !important;
    background-image: url("~@/assets/bg/banner_bg.svg");
    background-color: #E5E7EA !important;
}

.banner-label {
    font-family: 'Roboto', sans-serif;
    color: var(--secondary-gray-text);
}

.banner-label-accent {
    font-family: 'Cormorant', sans-serif;
    background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
}

.main-col {
    margin-left: 3% !important;
    margin-right: 3% !important;
}

.info-container {
    width: 100% !important;
    background-color: #E5E7EA !important;
    border: 1px solid #CED2D8;
    border-radius: 6px;
    cursor: pointer;
}

.info-title {
    font-family: 'Roboto', sans-serif;
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.info-value {
    font-family: 'Roboto', sans-serif;
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #1C95E7;
}

.value-disabled {
    text-transform: uppercase !important;
    color: var(--fourth-lightgray-text) !important;
}

.bordered-col {
    border-left: 1px solid #CED2D8 !important;
    border-right: 1px solid #CED2D8 !important;
}
</style>
