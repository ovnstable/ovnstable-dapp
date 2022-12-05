<template>
    <div v-if="showRedemptionRequest">
        <v-dialog
                v-model="showRedemptionRequest"
                width="650"
                persistent>
            <v-card class="container_body airdrop-body">
                <v-toolbar class="container_header" flat>
                    <label class="title-modal mt-4">
                        Redeem Insurance
                    </label>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="close" class="mt-4">
                        <v-icon class="close-icon">mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text class="pt-8 content-container">
                    <v-row class="invest-body-row mx-n2" align="center">
                        <label class="request-info-text">
                            By design redemptions take 72 hours from the time of your request. You will have 96 hours to withdraw redemption. After this time in order to withdraw your deposit you would need to submit another request.
                            <br/><br/>After sending redemption request your funds continue to generate profits and are subject to risk.
                        </label>
                    </v-row>

                    <v-row class="invest-body-row mx-n2 mt-10 mb-2" align="center">
                        <v-btn class="redemption-btn" @click="sendRedemptionRequest">
                            send redemption request
                        </v-btn>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "RedemptionRequestModal",

    components: {
    },

    props: {},

    computed: {
        ...mapGetters('insuranceInvestModal', ['showRedemptionRequest']),
    },

    data: () => ({}),

    methods: {
        ...mapActions('insuranceInvestModal', ['closeRedemptionRequestModal']),

        openLink(link) {
            window.open(link, '_blank').focus();
        },

        close() {
            this.closeRedemptionRequestModal();
        },

        sendRedemptionRequest() {
            // TODO: add sending redemption request
        },
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .airdrop-body {
        width: 100% !important;
    }

    .request-info-text {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 22px;
    }

    .redemption-btn {
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
    .airdrop-body {
        width: 100% !important;
    }

    .container_header {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .invest-body-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .request-info-text {
        font-style: normal;
        font-weight: 300;
        font-size: 18px;
        line-height: 28px;
    }

    .redemption-btn {
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
    .airdrop-body {
        width: 100% !important;
    }

    .container_header {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .invest-body-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .request-info-text {
        font-style: normal;
        font-weight: 300;
        font-size: 18px;
        line-height: 28px;
    }

    .redemption-btn {
        width: 100%;
        height: 40px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 20px !important;
        line-height: 24px !important;
        letter-spacing: 0.04em !important;
    }
}

.airdrop-body {
    z-index: 100;
}

.container_body {
    background-color: var(--secondary) !important;
    box-shadow: 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12), 0px 7px 8px -4px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
}

.container_header {
    background-color: var(--secondary) !important;
}

.request-info-text {
    font-family: 'Roboto', sans-serif;
    color: var(--secondary-gray-text) !important;
}

.redemption-btn {
    border-radius: 2px !important;

    font-family: 'Roboto', sans-serif !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    background: var(--blue-gradient);
    color: var(--secondary) !important;
}

</style>
