<template>
    <div class="ml-n1">
        <v-row class="account-info-row mt-3" align="center">
            <label class="add-coins-label ml-1">Add tokens to your wallet</label>
        </v-row>

        <v-row class="add-tokens-row" justify="start" align="center">
            <v-btn class="coin-btn ma-1" @click="addUsdPlusToken">
                <div class="coin-img">
                    <v-img :src="require('@/assets/currencies/usdPlus.svg')"/>
                </div>
                <label class="ml-2 coin-btn-label">USD+</label>
            </v-btn>

            <v-btn v-if="showDai" class="coin-btn ma-1" @click="addDaiPlusToken">
              <div class="coin-img">
                <v-img :src="require('@/assets/currencies/daiPlus.svg')"/>
              </div>
              <label class="ml-2 coin-btn-label">DAI+</label>
            </v-btn>

            <v-btn v-if="showUsdt" class="coin-btn ma-1" @click="addUsdtPlusToken">
                <div class="coin-img">
                    <v-img :src="require('@/assets/currencies/usdtPlus.svg')"/>
                </div>
                <label class="ml-2 coin-btn-label">USDT+</label>
            </v-btn>

            <v-btn v-if="showWEth" class="coin-btn ma-1" @click="addwEthPlusToken">
                <div class="coin-img">
                    <v-img :src="require('@/assets/currencies/WETH+.svg')"/>
                </div>
                <label class="ml-2 coin-btn-label">wETH+</label>
            </v-btn>

            <v-btn v-if="showEth" class="coin-btn ma-1" @click="addEthPlusToken">
                <div class="coin-img">
                    <v-img :src="require('@/assets/currencies/ETH+.svg')"/>
                </div>
                <label class="ml-2 coin-btn-label">ETH+</label>
            </v-btn>

            <v-btn v-if="showWrap && showWusd"  class="coin-btn ma-1" @click="addwUsdPlusToken">
                <div class="coin-img">
                    <v-img :src="require('@/assets/currencies/wUsdPlus.svg')"/>
                </div>
                <label class="ml-2 coin-btn-label">wUSD+</label>
            </v-btn>

            <v-btn v-if="networkId === 10" class="coin-btn ma-1" @click="addInsuranceToken">
                <div class="coin-img">
                    <v-img :src="require('@/assets/currencies/insurance/round_insurance_optimism.svg')"/>
                </div>
                <label class="ml-2 coin-btn-label">OVN INS</label>
            </v-btn>

            <v-btn v-if="showUSDC" class="coin-btn ma-1" @click="addUsdcPlusToken">
                <div class="coin-img">
                    <v-img :src="require('@/assets/currencies/usdc+.svg')"/>
                </div>
                <label class="ml-2 coin-btn-label">USDC+</label>
            </v-btn>

        </v-row>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "TokensTab",

    components: {},

    data: () => ({
        sortedCardList: [],
    }),

    props: {
    },

    computed: {
        ...mapGetters('network', ['networkId', 'explorerUrl']),
        ...mapGetters('wrapUI', ['showWrap']),
        ...mapGetters('accountData', ['balance', 'account', 'uns']),
        ...mapGetters('etsAction', ['etsList']),

        showDai: function () {
          return this.networkId === 10 || this.networkId === 42161 || this.networkId === 8453;
        },
        showUsdt: function () {
          return this.networkId === 56 || this.networkId === 59144 || this.networkId === 42161;
        },

        showEth: function () {
            return this.networkId === 42161;
        },

        showWEth: function () {
            return this.networkId === 42161;
        },

        showWusd: function () {
            const allowedNetworkIds = [10,42161,8453,137];
            return allowedNetworkIds.includes(this.networkId);
        },

        showUSDC: function () {
            return this.networkId === 8453;
        },

    },

    watch: {
    },

    mounted() {
    },

    methods: {
        ...mapActions('tokenAction', ['addUsdPlusToken', 'addDaiPlusToken', 'addUsdtPlusToken', 'addEthPlusToken','addwEthPlusToken', 'addwUsdPlusToken', 'addEtsToken', 'addInsuranceToken','addUsdcPlusToken']),
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {

    .coin-img {
        width: 20px;
        height: 20px;
    }

    .add-coins-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .coin-btn {
        height: 46px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 12px !important;
        line-height: 14px !important;
        letter-spacing: 0.02em !important;
    }

    .account-info-row, .add-tokens-row {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .coin-img {
        width: 32px;
        height: 32px;
    }

    .add-coins-label {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .coin-btn {
        height: 56px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .account-info-row, .add-tokens-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .coin-img {
        width: 32px;
        height: 32px;
    }

    .add-coins-label {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .coin-btn {
        height: 56px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .account-info-row, .add-tokens-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }
}

.view-explorer-btn > label, .copy-address-btn > label, .add-usd-btn > label {
    cursor: pointer !important;
}

.account-info-row {
    height: 56px;
}

.add-coins-label {
    color: var(--secondary-gray-text);
}

.coin-btn {
    background: var(--card-coin-background) !important;
    border-radius: 4px !important;
    box-shadow: none !important;

    font-style: normal !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: var(--secondary-gray-text) !important;
}
</style>
