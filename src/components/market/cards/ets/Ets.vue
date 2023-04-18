<template>
    <v-row class="card-container" @click="openStrategyCard">
        <v-col cols="12" align-self="start">
            <v-row class="d-flex flex-row align-center header-row" justify="center" :style="{'--card-background': cardData.data.cardBgColor}">
                <span class="currency ml-5">
                    <v-img :src="require('@/assets/currencies/market/ets_' + cardData.data.name + '.svg')"/>
                </span>
                <v-row class="d-flex flex-column align-start mr-3 ml-8">
                    <v-row class="d-flex" align="center" style="width: 100% !important;">
                        <label class="card-title">ETS {{ cardData.data.nameUp }}</label>
                        <v-spacer></v-spacer>
                        <v-icon v-if="cardData.data['prototype'] || cardData.data.openPrototype"
                                title="ETS is in prototype"
                                color="#FFFFFF">
                            mdi-test-tube
                        </v-icon>
                    </v-row>
                    <v-row class="d-flex mt-5" v-if="cardData.monthApy">
                        <label class="percentage">
                            {{ $utils.formatMoneyComma(cardData.monthApy, 0) + '%' }}
                        </label>
                        <label class="apy ml-3">APY</label>
                        <div class="tooltip">
                            <Tooltip icon-color="#FFFFFF"
                                     :size="$wu.isFull() ? 18 : ($wu.isTablet() ? 16 : 14)"
                                     text="Strategy net APY based on 30-day average, includes fees taken (fee-adjusted)"/>
                        </div>
                    </v-row>
                </v-row>
            </v-row>

            <v-container class="mt-3">
                <v-row align="center" justify="center" class="ma-0">
                    <label class="full-status-error-label" v-if="cardData.overcapEnabled && cardData.data.maxSupply && cardData.tvl >= cardData.data.maxSupply" :style="{color: cardData.data.mainColor}">
                        ETS capacity is full. Check status later
                    </label>
                    <label class="full-status-error-label" v-else>&nbsp;</label>
                </v-row>

                <template v-if="cardData.overcapEnabled">
                    <v-row class="ma-0 mt-2" align="center">
                        <label class="progress-label-header">Current tvl</label>
                        <v-spacer></v-spacer>
                        <label class="progress-label-header">Max tvl</label>
                    </v-row>
                    <v-row class="ma-0" align="center">
                        <label class="progress-label-value mt-2"
                               v-if="cardData.data"
                               :style="(cardData.data.maxSupply && cardData.tvl >= cardData.data.maxSupply) ? {color: cardData.data.mainColor} : {}">
                            ${{ $utils.formatMoneyComma(cardData.tvl, 2) }}
                        </label>
                        <v-progress-circular
                            v-else
                            class="mt-2"
                            width="1.5"
                            size="16"
                            color="#9DA4B0"
                            indeterminate
                        ></v-progress-circular>

                        <v-spacer></v-spacer>

                        <label class="progress-label-value mt-2">
                            ${{ $utils.formatMoneyComma(cardData.data.maxSupply, 2) }}
                        </label>
                    </v-row>
                    <v-row class="ma-0 mt-2" align="center">
                        <v-progress-linear
                            rounded
                            height="7"
                            class="progress-info"
                            background-opacity="0"
                            :value="(cardData.tvl / cardData.data.maxSupply) * 100"
                            :color="cardData.data.mainColor"
                        ></v-progress-linear>
                    </v-row>
                </template>
                <template v-else>
                    <v-row class="d-flex justify-space-between ma-0 mt-3">
                        <label class="progress-label-value">CURRENT TVL</label>
                        cardData.tvl:
                        {{cardData.tvl}}
                        <label class="progress-label-value mb-5" v-if="cardData.tvl">
                            ${{ $utils.formatMoneyComma(cardData.tvl, 2) }}
                        </label>
                        <v-progress-circular
                            v-else
                            class="mb-5"
                            width="1.5"
                            size="16"
                            color="#9DA4B0"
                            indeterminate
                        ></v-progress-circular>
                    </v-row>
                    <v-divider class="card-divider"></v-divider>
                </template>
            </v-container>
        </v-col>

        <v-col cols="12" align-self="end">
            <v-container>
                <v-row class="ma-0 mt-n6">
                    <label class="card-info">{{ cardData.data.cardTitle }}</label>
                </v-row>

                <v-row class="mt-3">
                    <v-col cols="6">
                        <v-row class="ma-0 mr-n2">
                            <div class="box">
                                <label class="box-name mt-2">Chain</label>
                                <div class="icon">
                                    <v-img :src="require('@/assets/network/' + cardData.data.chainName + '.svg')"
                                           class="mt-1"
                                           alt="chain icon"/>
                                </div>
                                <label class="chain-name mb-2 mt-1">{{ cardData.data.chainName }}</label>
                            </div>
                        </v-row>
                    </v-col>
                    <v-col cols="6">
                        <v-row class="ma-0 ml-n2">
                        <div class="box">
                            <label class="box-name mt-2">Platform</label>
                            <div class="icon platform-logo">
                                <v-img :src="require('@/assets/cards/platform/' + cardData.data.dex + '.svg')"
                                       class="mt-1"
                                       alt="platform icon"/>
                            </div>
                            <label class="platform-name mb-2 mt-1">{{ cardData.data.dex }}</label>
                        </div>
                        </v-row>
                    </v-col>
                    <v-col cols="12">
                        <v-row class="ma-0 mt-n4">
                        <div class="box">
                            <label class="box-name mt-2">Token Pair</label>
                            <div class="icon">
                                <v-img :src="require('@/assets/cards/token_pair/' + cardData.data.tokenPair + '.svg')"
                                       class="mt-1"
                                       alt="token pair icons"/>
                            </div>
                            <label class="token-pair-name mb-2 mt-1">{{ cardData.data.poolName }}</label>
                        </div>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row class="d-flex justify-space-between ma-0 mt-6" v-if="cardData.monthApy" align="center">
                    <template v-if="accountEtsBalance && (accountEtsBalance > 0)">
                        <label class="your-deposit">Your deposit in ETS</label>
                        <label class="your-deposit" :class="dataHidden ? 'hidden-label' : ''">{{
                                dataHidden ? '' : accountEtsBalance ? ($utils.formatMoneyComma(accountEtsBalance, 2) + ' ' + cardData.data.actionTokenName) : '—'
                            }}</label>
                    </template>
                    <template v-else>
                        <v-spacer></v-spacer>
                        <label class="your-deposit-disabled">You don’t have deposit in this ETS</label>
                        <v-spacer></v-spacer>
                    </template>
                </v-row>

                <v-row class="d-flex justify-space-between ma-0 mt-2">
                    <template v-if="!networkSupport">
                        <v-col class="ml-1">
                            <v-row>
                                <v-btn class="button btn-outlined" @click.stop="setWalletNetwork(cardData.chain.toString())" outlined>
                                    SWITCH TO {{ cardData.data.chainName.toUpperCase() }} TO MINT
                                </v-btn>
                            </v-row>
                        </v-col>
                    </template>

                    <template v-else>
                        <v-col v-if="!cardData.data.disabled && (isOvercapAvailable || !(cardData.overcapEnabled && cardData.data.maxSupply && cardData.tvl >= cardData.data.maxSupply))" :class="accountEtsBalance ? 'mr-1' : ''">
                            <v-row>
                                <v-btn class="button btn-filled" @click.stop="mintAction">Mint ETS</v-btn>
                            </v-row>
                        </v-col>
                        <v-col v-if="accountEtsBalance" class="ml-1">
                            <v-row>
                                <v-btn class="button btn-outlined" @click.stop="redeemAction" outlined>Redeem ETS</v-btn>
                            </v-row>
                        </v-col>
                    </template>
                </v-row>
            </v-container>
        </v-col>

        <v-col cols="12" align-self="end">
            <v-row class="footer-row align-center justify-center">
                <label class="footer-link">View ETS {{ cardData.data.nameUp }} performance</label>
                <img class="open-icon ml-1" src="@/assets/icon/open-in-new.svg">
            </v-row>
        </v-col>
        <resize-observer @notify="$forceUpdate()"/>
    </v-row>
</template>

<script>
import Tooltip from "@/components/common/element/Tooltip";
import {mapActions, mapGetters} from "vuex";

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
        ...mapGetters('network', ['networkId']),
        ...mapGetters("marketData", ["etsStrategyData"]),
        ...mapGetters('accountData', ['etsBalance']),
        ...mapGetters('overcapData', ['isOvercapAvailable']),
        ...mapGetters('magicEye', ['dataHidden']),

        accountEtsBalance: function () {
            return this.etsBalance[this.cardData.data.name];
        },

        networkSupport: function () {
            return this.networkId === this.cardData.chain;
        },

    },

    data: () => ({}),

    watch: {},

    mounted() {
    },

    methods: {
        ...mapActions('network', ['setWalletNetwork']),
        ...mapActions('investModal', ['showInvestModal', 'showMintView', 'showRedeemView']),
        ...mapActions('track', ['trackClick']),
        ...mapActions('magicEye', ['switchEye']),

        mintAction() {
            this.showMintView();
            this.showInvestModal(this.cardData.data);
            this.trackClick({action: 'mint-action-click', event_category: 'Mint View', event_label: 'Open mint', value: 1 });
        },

        redeemAction() {
            this.showRedeemView();
            this.showInvestModal(this.cardData.data);
            this.trackClick({action: 'redeem-action-click', event_category: 'Redeem View', event_label: 'Open redeem', value: 1 });
        },

        openStrategyCard() {
            this.$router.push("/ets/" + this.cardData.data.name);
            window.scrollTo({top: 0, behavior: "smooth"});
        },
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
        height: 100px !important;
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

    .tooltip {
        margin-top: -4px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
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
        height: 110px !important;
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

    .tooltip {
        margin-top: 1px;
    }

    .hidden-label {
        width: 130px;
        height: 28px;
        background: var(--hide-account);
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
        height: 78px !important;
        width: 78px !important;
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
        font-size: 14px;
        line-height: 22px;
    }

    .header-row {
        max-width: 460px;
        height: 130px !important;
    }

    .card-container {
        max-width: 460px;
    }

    .card-title {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 18px;
        letter-spacing: 0.04em;
    }

    .percentage {
        font-style: normal;
        font-weight: 600;
        font-size: 50px;
        line-height: 48px;
    }

    .apy {
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        line-height: 24px;
    }

    .tooltip {
        margin-top: 2px;
    }

    .hidden-label {
        width: 130px;
        height: 28px;
        background: var(--hide-account);
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
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
        font-size: 15px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .currency {
        height: 78px !important;
        width: 78px !important;
    }

    .your-deposit, .your-deposit-disabled {
        font-style: normal;
        font-weight: 800;
        font-size: 15px;
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
        font-size: 14px;
        line-height: 20px;
    }

    .header-row {
        max-width: 460px;
        height: 130px !important;
    }

    .card-container {
        max-width: 460px;
    }

    .card-title {
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .percentage {
        font-style: normal;
        font-weight: 600;
        font-size: 38px;
        line-height: 42px;
    }

    .apy {
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
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
    background: var(--card-background);
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

.platform-logo {
    height: 36px !important;
    width: 36px !important;
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
