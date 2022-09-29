<template>
    <v-row class="card-container" @click="openStrategyCard">
        <v-col cols="12">
            <v-row class="d-flex flex-row align-center header-row pr-5" justify="center"
                   :style="{'--card-background': etsData.cardBgColor}">
                <v-img class="currency" :src="require('@/assets/currencies/market/ets_' + etsData.name + '.svg')" />
                <v-spacer></v-spacer>
                <v-row class="d-flex flex-column align-start mr-3">
                    <v-row class="d-flex mb-1">
                        <label class="card-title">ETS {{ etsData.nameUp }}</label>
                    </v-row>
                    <v-row class="d-flex">
                        <label class="percentage">20%</label>
                        <label class="apy">APY</label>
                        <div class="tooltip">
                            <Tooltip />
                        </div>
                    </v-row>
                </v-row>
            </v-row>

            <v-row class="d-flex flex-row body-row align-start pt-5 pr-11 pb-11 pl-11">
                <v-row class="d-flex justify-space-between mt-4 mb-4">
                    <label class="capacity-status-sub-text">CURRENT TVL</label>
                    <label class="capacity-status-sub-text mb-5">$296,000.00</label>
                    <v-progress-linear
                        rounded
                        height="4"
                        class="progress-info"
                        background-opacity="0"
                        :value="100"
                        :color="'#29323E'"
                    ></v-progress-linear>
                </v-row>

                <v-row class="mt-4">
                    <label class="card-info">{{ etsData.cardTitle }}</label>
                </v-row>

                <v-row class="d-flex mt-10 justify-space-between">
                    <div class="box box-one">
                        <label class="box-name">Chain</label>
                        <div class="icon">
                            <v-img :src="require('@/assets/network/' + etsData.chainName + '.svg')"
                                   alt="chain icon" />
                        </div>
                        <label class="chain-name">{{ etsData.chainName }}</label>
                    </div>
                    <div class="box box-two">
                        <label class="box-name">Platform</label>
                        <div class="icon">
                            <v-img :src="require('@/assets/cards/platform/' + etsData.dex + '.svg')"
                                   alt="platform icon" />
                        </div>
                        <label class="platform-name">{{ etsData.dex }}</label>
                    </div>
                    <div class="box box-three">
                        <label class="box-name">Token Pair</label>
                        <div class="icon">
                            <v-img :src="require('@/assets/cards/token_pair/' + etsData.tokenPair + '.svg')"
                                   alt="token pair icons" />
                        </div>
                        <label class="token-pair-name">{{ etsData.poolName }}</label>
                    </div>
                </v-row>

                <v-row class="d-flex justify-space-between mt-10">
                    <label class="your-deposit">Your deposit in ETS</label>
                    <label class="sum-of-money">{{ etsBalance[etsData.name] ? ($utils.formatMoneyComma(etsBalance[etsData.name], 2) + ' USD+') : '—' }}</label>
                </v-row>

                <v-row class="d-flex justify-space-between ma-0 mt-10">
                    <v-btn class="button btn-filled" @click.stop="mintAction">Mint ETS</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn class="button btn-outlined" @click.stop="redeemAction" outlined>Redeem ETS</v-btn>
                </v-row>
            </v-row>
            <v-row class="footer-row d-flex align-center justify-center">
                <label class="footer-link">Learn more about ETS {{ etsData.nameUp }}</label>
                <img class="open-icon ml-1" src="@/assets/icon/open-in-new.svg">
            </v-row>
        </v-col>
        <resize-observer @notify="$forceUpdate()"/>
    </v-row>
</template>

<script>
import Tooltip from "@/components/common/element/Tooltip";
import { mapActions, mapGetters } from "vuex";

export default {
    name: "Ets",

    components: {
        Tooltip
    },

    props: {

        etsData: {
            type: Object
        }
    },

    computed: {
        ...mapGetters("marketData", ["etsStrategyData"]),
        ...mapGetters("supplyData", ["totalSupply"]),
        ...mapGetters('accountData', ['etsBalance']),
    },

    data: () => ({}),

    watch: {},

    created() {
    },

    methods: {
        ...mapActions("swapModal", ["showSwapModal", "showMintView"]),
        ...mapActions("swapModal", ["showSwapModal", "showRedeemView"]),


        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },

        redeemAction() {
            this.showRedeemView();
            this.showSwapModal();
        },

        openStrategyCard() {
            this.$router.push("/ets/" + this.etsData.name);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }
};
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .card-title {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 28px;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .button {
        width: 300px !important;
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
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
        line-height: 24px;
    }

    .button {
        width: 300px !important;
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
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
        line-height: 24px;
    }

    .button {
        width: 300px !important;
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }
}

.card-container {
    background: var(--secondary) !important;
    border-radius: 15px !important;
    max-width: 484px;
    min-height: 664px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

.header-row {
    max-width: 484px;
    height: 170px !important;
    border-radius: 15px 15px 0 0;
}

.currency {
    width: 130px;
    height: 100%;
}

.card-title {
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.4px;
    color: #FFFFFF;
}

.percentage {
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 60px;
    line-height: 48px;
    color: #FFFFFF;
}

.apy {
    font-family: "Roboto", sans-serif;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: #FFFFFF;
}

.capacity-status-sub-text {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    letter-spacing: 0.4px;
}

.card-info {
    font-family: "Roboto", sans-serif;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
}

.box {
    background-color: #F5F5F5;
    padding: 8px;
    min-height: 100px;
    border-radius: 4px;
    gap: 10px;
    text-align: center;
}

.box-name {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.3px;
    color: #707A8B;
    text-transform: uppercase;
}

.icon {
    height: 36px !important;
    width: auto !important;
}

.box-one {
    width: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-transform: capitalize;
}

.box-two {
    width: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.box-three {
    width: 148px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.chain-name, .platform-name, .token-pair-name {
    font-family: "Roboto", sans-serif;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    color: #29323E;
}

.your-deposit, .sum-of-money {
    font-family: "Roboto", sans-serif;
    font-weight: 900;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.5px;
}

.button {
    border-radius: 2px;
    box-shadow: none !important;

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
    background-color: #F5F5F5;
    padding: 5px;
    border-radius: 0 0 15px 15px;
}

.footer-link {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #707A8B;
}

.open-icon {
    color: #707A8B;
    height: 18px;
    width: 18px;
}

.progress-info {
    background: #D7DADF;
    color: var(--progress-filled);
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

</style>
