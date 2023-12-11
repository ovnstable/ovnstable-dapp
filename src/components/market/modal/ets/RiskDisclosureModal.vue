<template>
    <v-dialog
            v-model="show"
            width="630"
            persistent
            scrollable
            @click:outside="close">
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
                    <img :src="light ? require('@/assets/icon/swap/search-close.svg') : require('@/assets/icon/light-close.svg')" alt="close icon">
                </v-btn>
            </v-toolbar>

            <v-card-text class="pt-8 content-container">
                <v-row class="modal-info-row" align="center">
                    <label class="modal-info-text" v-html="fullRiskText"></label>
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

        etsData: {
            type: Object,
        },
    },

    computed: {
        ...mapGetters('riskModal', ['show']),
        ...mapGetters("theme", ["light"]),

        fullRiskText: function () {
            return"By depositing stablecoin into ETS, you are automatically borrowing an equal value of volatile asset from lending protocol at a rate roughly equal to the current price of volatile asset denoted above. " +
                '<br/><br/>' +
                "The strategy's smart contract is designed to automatically invest these equal values of volatile asset & stablecoin into DEX Liquidity Pool, after which these LP Tokens are staked into the Gauge Pool." +
                '<br/><br/>' +
                '<b>Impermanent loss risk</b>' +
                '<br/>' +
                "While the pools of DEX will accrue transaction fees that generate yields, the pool may become imbalanced; when the user withdraws their investment, the strategy's smart contract may need to use the user's funds to buy additional volatile asset to repay the lent amount (plus interest), which can result in a net loss from the initial deposit." +
                '<br/><br/>' +
                '<b>AMM contract hack risk</b>' +
                '<br/>'+
                "The strategy's smart contract automatically moves your deposit into the said Automated Market Maker (AMM) and, in doing so, may incur an AMM’s smart contract risk. By depositing funds into ETS, a user understands and agrees to the strategies to which it will invest underlying assets." +
                '<br/><br/>' +
                '<b style="color: #CF3F92">IMPORTANT: </b>' +
                "Yield/APY is not guaranteed and can be highly variable depending on the volume and rewards from the underlying AMM as well as the price of a volatile asset. Farmers may incur net losses if the impermanent loss is more significant than the yield earned. ";
        },
    },

    data: () => ({
    }),

    methods: {
        ...mapActions('riskModal', ['showRiskModal', 'closeRiskModal']),
        ...mapActions('track', ['trackClick']),

        close() {
            this.closeRiskModal();
            // this.trackClick({action: 'close-risk-modal-click', event_category: 'ETS Risk', event_label: 'Close Risks Modal', value: 1 });

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
        font-size: 18px;
        line-height: 28px;
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
        font-size: 18px;
        line-height: 28px;
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

@media only screen and (min-width: 1300px) {
    .container_header {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .modal-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .title-modal-icon {
        width: 28px;
        height: 28px;
    }

    .title-modal {
        font-size: 28px;
        line-height: 32px;
    }

    .modal-info-text {
        font-style: normal;
        font-weight: 300;
        font-size: 18px;
        line-height: 32px;
    }

    .understand-btn {
        width: 50%;
        height: 40px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 18px !important;
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
    color: var(--secondary-gray-text) !important;
}

.understand-btn {
    border-radius: 2px !important;

    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: #CF3F92 !important;
}
</style>
