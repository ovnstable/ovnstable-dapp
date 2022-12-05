<template>
    <div v-if="showRedemptionRequestSuccess">
        <v-dialog
                v-model="showRedemptionRequestSuccess"
                width="600"
                persistent>
            <v-card class="container_body airdrop-body">
                <v-toolbar class="container_header" flat>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="close" class="mt-4">
                        <v-icon class="close-icon">mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text class="content-container">
                    <v-row justify="center" class="mb-4">
                        <div class="loading-img">
                            <v-img :src="require('@/assets/icon/requestSent.svg')"/>
                        </div>
                    </v-row>
                    <v-row class="invest-body-row mx-n2" align="center" justify="center">
                        <label class="request-info-text">
                            Your request has been sent.
                            <br/>
                            You can withdraw your deposit in 72 hours
                        </label>
                    </v-row>
                    <v-row class="invest-body-row mx-n2 mt-10 mb-4" align="center" justify="center">
                        <label class="discord-label">
                            If you have questions, contact us in our&nbsp;
                            <label class="discord-link" @click="openDiscord">Discord Support</label>
                        </label>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ErrorModal from "@/components/common/modal/action/ErrorModal";

export default {
    name: "RedemptionRequestSuccessModal",

    components: {
        ErrorModal
    },

    props: {},

    computed: {
        ...mapGetters('insuranceInvestModal', ['showRedemptionRequestSuccess']),
    },

    data: () => ({
    }),

    methods: {
        ...mapActions('insuranceInvestModal', ['closeRedemptionRequestSuccessModal']),

        openDiscord() {
            window.open(`https://discord.gg/overnight-fi`, '_blank').focus();
        },

        close() {
            this.closeRedemptionRequestSuccessModal();
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
        font-weight: 400;
        font-size: 20px;
        line-height: 28px;
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
        font-weight: 400;
        font-size: 22px;
        line-height: 32px;
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
        font-weight: 400;
        font-size: 24px;
        line-height: 36px;
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
    text-align: center !important;
    color: var(--secondary-gray-text);
}

.discord-link {
    font-family: 'Roboto', sans-serif !important;
    font-style: normal;

    cursor: pointer;
    color: var(--links-blue);
}

.discord-link:hover {
    text-decoration: underline;
}

.discord-label {
    color: var(--secondary-gray-text);
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
}

.loading-img {
    height: 100px !important;
}

</style>
