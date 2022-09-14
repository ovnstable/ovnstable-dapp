<template>
    <v-dialog
            style="z-index: 1000"
            v-model="show"
            :width="promo ? 600 : 450"
            persistent>
        <v-card class="container_body">
            <v-toolbar class="container_header" flat>
                <v-btn icon class="ml-auto" @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="px-5 pt-5">
                <template v-if="!promo">
                    <v-row justify="center" class="mb-10">
                        <div class="loading-img">
                            <v-img :src="require('@/assets/icon/transation-send.svg')"/>
                        </div>
                    </v-row>
                    <v-row justify="center">
                        <label class="success-label">Transaction Submitted</label>
                    </v-row>
                    <v-row justify="center" class="mt-8 mb-5">
                        <label class="success-link" @click="openOnExplorer(successTxHash)">View transaction</label>
                    </v-row>
                </template>

                <template v-else>
                    <v-row align="center" justify="center">
                        <div class="loading-img-promo">
                            <v-img :src="require('@/assets/icon/transation-send.svg')"/>
                        </div>

                        <label class="ml-2 success-label">Transaction Submitted</label>
                    </v-row>

                    <v-row class="promo-container mx-0" :class="$wu.isMobile() ? 'mt-8' : 'mt-12'">
                        <v-col>
                            <v-row align="center" justify="center" class="promo-row mt-2">
                                <label class="promo-label-title">Invite a friend!</label>
                            </v-row>
                            <v-row align="center" justify="center" class="promo-row mt-8">
                                <label class="promo-label-text">
                                    You have <b>three extra credentials to share</b> among your DeFi buddies that are just as enthusiastic about our exchange-traded strategy as you are - use them wisely!
                                </label>
                            </v-row>

                            <PromoCredentialsSection class="mt-8 mb-7"/>

                            <v-row align="center" justify="center" class="promo-row mt-8 mb-2">
                                <label class="promo-label-text">
                                    Your invite credentials will be available <b>on your account screen</b>; click on your wallet address to access it and share among those who you think should use it.
                                </label>
                            </v-row>
                        </v-col>
                    </v-row>

                    <v-row justify="center" :class="$wu.isMobile() ? 'mt-8' : 'mt-15'">
                        <label class="success-link" @click="openOnExplorer(successTxHash)">View transaction</label>
                    </v-row>
                </template>

                <v-row>
                    <v-col>
                        <v-btn dark
                               height="56"
                               class="dismiss-btn mb-3"
                               @click="dismiss">
                            Dismiss
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <resize-observer @notify="$forceUpdate()"/>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import PromoCredentialsSection from "@/components/common/modal/promo/PromoCredentialsSection";

export default {
    name: "SuccessModal",
    components: {PromoCredentialsSection},
    props: {
    },

    computed: {
        ...mapGetters('network', ['explorerUrl']),
        ...mapGetters('successModal', ['show', 'successTxHash', 'promo']),
        ...mapGetters('web3', ['walletName']),
    },

    data: () => ({
    }),

    methods: {
        ...mapActions('successModal', ['showSuccessModal', 'closeSuccessModal']),

        openOnExplorer(hash) {
            if (hash) {
                window.open(this.explorerUrl + `tx/${hash}`, '_blank').focus();
            }
        },

        close() {
            this.closeSuccessModal();

            this.$emit('input', false);
            this.$emit('m-close');
        },

        dismiss() {
            this.close();
        },
    },
}
</script>

<style scoped>


/* mobile */
@media only screen and (max-width: 960px) {
    .promo-row {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }

    .promo-label-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .promo-label-text {
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 22px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .promo-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .promo-label-title {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .promo-label-text {
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 22px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .promo-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .promo-label-title {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .promo-label-text {
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 22px;
    }
}

.container_body {
    border-radius: 24px !important;
    background-color: var(--secondary) !important;
}

.container_header {
    background-color: var(--secondary) !important;
}

.loading-img {
    width: 80px;
    height: 80px;
}

.loading-img-promo {
    width: 46px;
    height: 46px;
}

.success-label {
    color: #22ABAC;
    font-family: 'Raleway', sans-serif;
    font-style: normal;
    font-weight: 800;
    font-size: 24px;
    line-height: 36px;
}

.success-link {
    cursor: pointer;
    color: var(--links-blue);
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
}

.success-link:hover {
    text-decoration: underline;
}

.dismiss-btn {
    background: var(--blue-gradient) !important;
    width: 100%;
    height: 48px;
    border-radius: 2px;

    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FFFFFF;
}

.promo-container {
    background: rgba(252, 202, 70, 0.05);
    border-radius: 4px;
}

.promo-label-title {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.promo-label-text {
    font-family: 'Roboto', sans-serif;
    color: var(--secondary-gray-text);
}
</style>
