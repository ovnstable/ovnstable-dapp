<template>
    <v-row class="card-container" @click="openPoolCard">
        <v-col cols="12" align-self="start">
            <v-row class="d-flex flex-row align-center header-row" justify="center"
                   :style="{'--card-background': cardData.data.cardBgColor}">
                <span class="currency ml-5">
                    <!-- Make coins svg -->
                    <v-img :src="require('@/assets/currencies/' + cardData.data.tokenName.toLowerCase() + '.png')"/>
                </span>
                <v-spacer></v-spacer>
                <v-row class="d-flex flex-column align-start mr-3">
                    <v-row class="d-flex mb-1" align="center">
                        <label class="card-title">{{ cardData.data.poolName }} pool</label>
                    </v-row>
                    <v-row class="d-flex">
                        <label class="percentage">
                            {{ cardData.monthApy === 0 ? '—' : ($utils.formatMoneyComma(cardData.monthApy, 0) + '%') }}
                        </label>
                        <label class="apy">APY</label>
                        <div class="tooltip">
                            <Tooltip icon-color="#FFFFFF"
                                     text="Strategy net APY based on 30-day average, includes fees taken (fee-adjusted)"/>
                        </div>
                    </v-row>
                </v-row>
            </v-row>

            <v-container class="mt-4">
                <v-row align="center" justify="center" class="ma-0">
                    <label class="full-status-error-label">&nbsp;</label>
                </v-row>

                <v-row class="d-flex justify-space-between ma-0 mt-3">
                    <label class="progress-label-value">CURRENT TVL</label>
                    <label class="progress-label-value mb-5">${{
                            $utils.formatMoneyComma(cardData.tvl, 2)
                        }}</label>
                </v-row>
                <v-divider class="card-divider"></v-divider>
            </v-container>

            <v-container>
                <v-row class="ma-0 mt-2">
                    <label class="card-info">{{ cardData.data.title }}</label>
                </v-row>

                <v-row class="mt-5">
                    <v-col cols="6">
                        <div class="box">
                            <label class="box-name mt-2">Chain</label>
                            <div class="icon">
                                <v-img :src="require('@/assets/network/' + cardData.data.chainName + '.svg')"
                                       class="mt-1"
                                       alt="chain icon"/>
                            </div>
                            <label class="chain-name mb-2 mt-1">{{ cardData.data.chainName }}</label>
                        </div>
                    </v-col>
                    <v-col cols="6">
                        <div class="box">
                            <label class="box-name mt-2">Platform</label>
                            <div class="icon">
                                <v-img :src="require('@/assets/cards/platform/' + cardData.data.dex + '.svg')"
                                       class="mt-1"
                                       alt="platform icon"/>
                            </div>
                            <label class="platform-name mb-2 mt-1">{{ cardData.data.dex }}</label>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </v-col>

        <v-col cols="12" align-self="end">
            <v-row class="footer-row align-center justify-center">
                <label class="footer-link">View pool on {{ cardData.data.dex }}</label>
                <img class="open-icon ml-1" src="@/assets/icon/open-in-new.svg">
            </v-row>
        </v-col>
        <resize-observer @notify="$forceUpdate()"/>
    </v-row>
</template>

<script>
import Tooltip from "@/components/common/element/Tooltip";

export default {
    name: "Ets",

    components: {
        Tooltip
    },

    props: {

        cardData: {
            type: Object
        }
    },

    computed: {
        // ...mapGetters("marketData", ["etsStrategyData"]),
    },

    data: () => ({}),

    watch: {},

    created() {
    },

    methods: {
        // ...mapActions('investModal', ['showInvestModal']),

        openPoolCard() {
            // window.open(url, '_blank').focus();
        }
    }
};
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 22px;
    }

    .button {
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .currency {
        height: 60px !important;
        width: 60px !important;
    }

    .your-deposit, .your-deposit-disabled {
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        line-height: 22px;
    }

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
    }

    .progress-label-header {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.03em;
    }

    .progress-label-value {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .footer-link {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
    }

    .header-row {
        height: 120px !important;
    }

    .card-container {
    }

    .card-title {
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        letter-spacing: 0.04em;
    }

    .percentage {
        font-style: normal;
        font-weight: 600;
        font-size: 40px;
        line-height: 40px;
    }

    .apy {
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .card-title {
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 40px;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 22px;
    }

    .button {
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .currency {
        height: 60px !important;
        width: 60px !important;
    }

    .your-deposit, .your-deposit-disabled {
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        line-height: 22px;
    }

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .progress-label-header {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.03em;
    }

    .progress-label-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.03em;
    }

    .footer-link {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .header-row {
        max-width: 440px;
        height: 130px !important;
    }

    .card-container {
        max-width: 440px;
    }

    .card-title {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.04em;
    }

    .percentage {
        font-style: normal;
        font-weight: 600;
        font-size: 50px;
        line-height: 56px;
    }

    .apy {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .button {
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .currency {
        height: 100px !important;
        width: 100px !important;
    }

    .your-deposit, .your-deposit-disabled {
        font-style: normal;
        font-weight: 800;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.05em;
    }

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .progress-label-header {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.03em;
    }

    .progress-label-value {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 22px;
        letter-spacing: 0.04em;
    }

    .footer-link {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
    }

    .header-row {
        max-width: 460px;
        height: 150px !important;
    }

    .card-container {
        max-width: 460px;
    }

    .card-title {
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .percentage {
        font-style: normal;
        font-weight: 600;
        font-size: 60px;
        line-height: 48px;
    }

    .apy {
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        line-height: 24px;
    }
}

.card-container {
    background: var(--secondary) !important;
    border-radius: 15px !important;
    height: 100% !important;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

.header-row {
    border-radius: 15px 15px 0 0;
}

.card-title {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FFFFFF;
}

.percentage {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FFFFFF;
}

.apy {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FFFFFF;
}

.card-info {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.box {
    background-color: var(--scroll-color);
    border-radius: 4px;
    text-align: center;

    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-transform: capitalize;
}

.box-name {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.03em;
    color: #707A8B;
    text-transform: uppercase;
}

.icon {
    height: 36px !important;
    width: auto !important;
}

.chain-name, .platform-name, .token-pair-name {
    font-family: "Roboto", sans-serif;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    color: var(--main-gray-text);
}

.your-deposit, .your-deposit-disabled {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-feature-settings: 'liga' off;
}

.your-deposit {
    color: var(--main-gray-text);
}

.your-deposit-disabled {
    color: var(--third-gray-text);
}

.button {
    border-radius: 2px;
    box-shadow: none !important;
    width: 100% !important;

    font-family: 'Roboto', sans-serif !important;
    text-align: center !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.btn-filled {
    background: var(--blue-gradient);
    color: #FFFFFF !important;
}

.btn-outlined {
    color: var(--links-blue) !important;
}

.footer-row {
    background-color: var(--scroll-color) !important;
    padding: 5px;
    border-radius: 0 0 15px 15px;
}

.footer-link {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: #707A8B;
}

.open-icon {
    color: #707A8B;
    height: 18px;
    width: 18px;
}

.progress-info {
    background: var(--progress-info);
}

.header-row {
    background: var(--card-background);
}

.tooltip {
    width: 13px;
    height: 13px;
    margin-top: 2px;
}

.card-container:hover {
    filter: none !important;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.05), 0 4px 4px 0 rgba(0, 0, 0, 0.05);
}

* {
    cursor: pointer;
}

.full-status-error-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
}

.progress-label-header {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-gray-text);
}

.progress-label-value {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.card-divider {
    border-color: var(--fourth-gray-text) !important;
}
</style>
