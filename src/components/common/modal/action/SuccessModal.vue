<template>
    <v-dialog
            style="z-index: 1000"
            v-model="show"
            :width="650"
            persistent>
        <v-card class="container_body align-center">
            <v-toolbar class="container_header" flat>
                <v-btn icon class="ml-auto" @click="close">
                    <v-icon class="close-icon mr-10 mt-10">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="px-5 pt-5">
                <v-row justify="center" align="center" class="mb-5">
                    <div class="loading-img">
                        <v-img :src="require('@/assets/icon/minted.svg')"/>
                    </div>
                </v-row>
                <v-row justify="center mb-10">
                    <label class="success-label">You successfully minted USD+</label>
                </v-row>
                <v-row justify="center" class="mb-5">
                    <v-btn dark
                           height="40"
                           width="240"
                           class="dismiss-btn mb-3"
                           @click="dismiss">
                        Go to my performance
                    </v-btn>
                </v-row>
                <v-row justify="center" class="mt-8 mb-5">
                    <label class="success-link" @click.stop="mintAction">Add USD+ to your wallet</label>
                    <div class="action-icons mr-15">
                        <v-img class="ml-1" :src="require('@/assets/icon/wallet_plus.svg')"/>
                    </div>
                    <label class="success-link ml-15" @click="openOnExplorer(successTxHash)">View on Polygonscan</label>
                    <div class="action-icons">
                        <v-img :src="require('@/assets/icon/open_in_new_blue.svg')"/>
                    </div>
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
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),

        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },

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
    width: 120px;
    height: 120px;
}

.success-label {
    color: var(--secondary-gray-text);
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 30px;
    line-height: 40px;
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
    height: 40px;
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

.action-icons {
    width: 20px;
    height: 20px;
}
</style>
