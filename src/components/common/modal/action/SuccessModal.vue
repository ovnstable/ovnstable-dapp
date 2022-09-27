<template>
    <v-dialog
            style="z-index: 1000"
            v-model="show"
            :width="450"
            persistent>
        <v-card class="container_body">
            <v-toolbar class="container_header" flat>
                <v-btn icon class="ml-auto" @click="close">
                    <v-icon class="close-icon">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="px-5 pt-5">
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
import {mapActions, mapGetters} from "vuex";

export default {
    name: "SuccessModal",

    components: {
    },

    props: {
    },

    computed: {
        ...mapGetters('network', ['explorerUrl']),
        ...mapGetters('successModal', ['show', 'successTxHash']),
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
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
}

/* full */
@media only screen and (min-width: 1400px) {
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
