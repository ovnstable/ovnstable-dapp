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
                    Should you be an investor?
                </label>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text class="pt-8 content-container">
                <v-row class="modal-info-row" align="center">
                    <label class="modal-info-text">
                        Users should supply USD+ if they believe the volatility (price fluctuation) of WMATIC is less than the current average APY you would recieve by farming, which means that the Impermanent Losses are low relative to the profits from the Yield-Farm. It is important to note that impermanent losses increase based on higher price changes, which makes the hedged strategy.
                        <br/><br/>
                        <label class="important-label">IMPORTANT:</label>&nbsp;Yield/APY is not guaranteed, and can be highly variable depending on the volume and rewards from the underlying AMM. Farmers may incur net losses if impermanent loss is greater than yield earned.
                    </label>
                </v-row>

                <v-row class="modal-info-row mt-10" align="center">
                    <v-checkbox
                            color="#CF3F92"
                            v-model="readConfirmed"
                    >
                        <template v-slot:label>
                            <label class="checkbox-label">I have read and agree to this information</label>
                        </template>
                    </v-checkbox>
                </v-row>

                <v-row class="modal-info-row mt-6" align="center">
                    <v-btn class="confirm-btn" @click="close" outlined :disabled="!readConfirmed">
                        confirm
                    </v-btn>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
    name: "InvestorModal",

    props: {
    },

    computed: {
        ...mapGetters('investorModal', ['show']),
    },

    data: () => ({
        readConfirmed: false,
    }),

    methods: {
        ...mapActions('investorModal', ['showInvestorModal', 'closeInvestorModal']),

        close() {
            this.closeInvestorModal();

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

.confirm-btn {
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

.important-label {
    color: #CF3F92 !important;
}

.checkbox-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    font-feature-settings: 'liga' off;
    color: #707A8B;
}
</style>
