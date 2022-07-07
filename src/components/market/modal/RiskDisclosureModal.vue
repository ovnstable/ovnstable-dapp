<template>
    <v-dialog
            v-model="show"
            width="630"
            persistent
            scrollable>
        <v-card class="container_body">
            <v-toolbar class="container_header" flat>
                <div class="title-modal-icon">
                    <v-img :src="require('@/assets/icon/bellRed.svg')"/>
                </div>
                <label class="title-modal ml-2">
                    Risk disclosure
                </label>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text class="pt-8 content-container">
                <v-row class="modal-info-row" align="center">
                    <label class="modal-info-text">
                        By depositing USD+ into this strategy, you are automatically borrowing an equal value of WMATIC from AAVE v2 at a rate roughly equal to the current price of WMATIC denoted above.
                        <br/><br/>
                        The strategy's smart contract is designed to automatically invest these equal values of WMATIC and USD+ into Dystopia's WMATIC-USD+ Liquidity Pool, after which these LP Tokens are staked into the Gauge Pool on Penrose.
                        <br/><br/>
                        While the Dystopia pools will accrue transaction fees that provide yield to the farmers, the pool may become imbalanced; when the user withdraws their investment, the strategy's smart contract may need to use the user's funds to buy additional WMATIC to repay the lent amount (plus interest), which can result in a net loss from the initial deposit.
                        <br/><br/>
                        <b>By depositing into this strategy, the user understands that they are fully responsible for any loss of value. Furthermore, all APY and yield numbers are speculative, and no profit is guaranteed by the protocol.</b>
                        <br/><br/>
                        The strategy's smart contracts automatically move your deposit into the said Automated Market Maker (in this case, Dystopia) and in doing so, may incur a smart contract risk and/or flash crash during which the price of the token fluctuates rapidly causing extreme volatility - this may cause the strategy's smart contracts to misbehave.
                        <br/><br/>
                        By depositing into these smart contracts, the user understands and agrees to the strategies it will invest their underlying assets into.
                    </label>
                </v-row>

                <v-row class="modal-info-row mt-10" align="center">
                    <v-btn class="understand-btn" @click="close" outlined>
                        I understand
                    </v-btn>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
    name: "RiskDisclosureModal",

    props: {
    },

    computed: {
        ...mapGetters('riskModal', ['show']),
    },

    data: () => ({
    }),

    methods: {
        ...mapActions('riskModal', ['showRiskModal', 'closeRiskModal']),

        close() {
            this.closeRiskModal();

            this.$emit('input', false);
            this.$emit('m-close');
        },
    },
}
</script>

<style scoped>
.container_body {
    border-radius: 8px !important;
    box-shadow: 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12), 0px 7px 8px -4px rgba(0, 0, 0, 0.2);
    background-color: var(--secondary) !important;
}

.container_header {
    background-color: var(--secondary) !important;
    margin-left: 5% !important;
    margin-right: 5% !important;
    margin-top: 5% !important;
}

.title-modal {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 30px;
    line-height: 36px;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.content-container {
    margin-bottom: 5% !important;
}

.modal-info-row {
    margin-left: 5% !important;
    margin-right: 5% !important;
}

.modal-info-text {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 32px;
    color: #333333;
}

.title-modal-icon {
    width: 32px;
    height: 32px;
}

.understand-btn {
    width: 50%;
    height: 40px !important;
    border-radius: 2px !important;

    font-family: 'Roboto', sans-serif !important;
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 20px !important;
    line-height: 24px !important;
    letter-spacing: 0.04em !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: #CF3F92 !important;
}
</style>
