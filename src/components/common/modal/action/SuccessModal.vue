<template>
    <v-dialog
            v-model="show"
            width="450"
            persistent>
        <v-card class="container_body">
            <v-toolbar class="container_header" flat>
                <v-btn icon class="ml-auto" @click="close">
                    <v-icon>mdi-close</v-icon>
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
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
    name: "SuccessModal",

    props: {
    },

    computed: {
        ...mapGetters('successModal', ['show', 'successTxHash',]),
        ...mapGetters('web3', ['walletName']),
    },

    data: () => ({
    }),

    methods: {
        ...mapActions('successModal', ['showSuccessModal', 'closeSuccessModal']),

        openOnExplorer(hash) {
            if (hash) {
                window.open(process.env.VUE_APP_NETWORK_EXPLORER + `tx/${hash}`, '_blank').focus();
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
    color: var(--link);
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
</style>
