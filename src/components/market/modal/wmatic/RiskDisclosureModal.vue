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
                        By depositing USD+ into this strategy, you automatically borrow WMATIC from AAVE v3 at a market rate.
                        <br/><br/>
                        The strategy's smart contract is designed to automatically invest these equal values of WMATIC and USD+ into Dystopia's USD+/WMATIC Liquidity Pool, after which these LP Tokens are staked into the Gauge Pool on Penrose.
                        <br/><br/>
                        <b>Impermanent loss risk</b>
                        <br/>
                        Due to trading activities with the USD+/WMATIC pair on Dystopia and/or WMATIC price change, the pool may become imbalanced, which can cause rebalance of a user’s LP position, resulting in increased or decreased number of WMATIC vs. borrowed in a position. When a user withdraws their investment, the strategy's smart contract may need to use a user's funds to buy additional WMATIC to repay the lent amount (plus interest), which can result in a net loss from the initial deposit.
                        <br/><br/>
                        <b>AMM contract hack risk</b>
                        <br/>
                        The strategy's smart contract automatically moves your deposit into the said Automated Market Maker (i.e., Dystopia) and, in doing so, may incur an AMM’s smart contract risk.
                        <br/><br/>
                        By depositing funds into this smart contract, a user understands and agrees to the strategies to which it will invest underlying assets.
                        <br/><br/>
                        <label class="important-label"><b>IMPORTANT:</b></label> Yield/APY is not guaranteed and can be highly variable depending on the volume and rewards from the underlying AMM as well as the price of a volatile asset (WMATIC). Farmers may incur net losses if the impermanent loss is more significant than the yield earned.
                    </label>
                </v-row>

                <v-row class="modal-info-row mt-12" align="center">
                    <v-btn class="understand-btn" @click="close" outlined>
                        I understand
                    </v-btn>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

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

/* mobile */
@media only screen and (max-width: 960px) {

    .container_header {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }

    .modal-info-row {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }

    .title-modal-icon {
        width: 24px;
        height: 24px;
    }

    .modal-info-text {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .understand-btn {
        width: 100%;
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.04em !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .container_header {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .modal-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .title-modal-icon {
        width: 32px;
        height: 32px;
    }

    .modal-info-text {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .understand-btn {
        width: 100%;
        height: 40px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 20px !important;
        line-height: 24px !important;
        letter-spacing: 0.04em !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .container_header {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .modal-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .title-modal-icon {
        width: 32px;
        height: 32px;
    }

    .modal-info-text {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .understand-btn {
        width: 50%;
        height: 40px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 20px !important;
        line-height: 24px !important;
        letter-spacing: 0.04em !important;
    }
}

.container_body {
    border-radius: 8px !important;
    box-shadow: 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12), 0px 7px 8px -4px rgba(0, 0, 0, 0.2);
    background-color: var(--secondary) !important;
}

.container_header {
    background-color: var(--secondary) !important;
    margin-top: 5% !important;
}

.content-container {
    margin-bottom: 5% !important;
}

.modal-info-text {
    font-family: 'Roboto', sans-serif;
    color: var(--secondary-gray-text) !important;
}

.understand-btn {
    border-radius: 2px !important;

    font-family: 'Roboto', sans-serif !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: #CF3F92 !important;
}

.important-label {
    color: #CF3F92 !important;
}
</style>
