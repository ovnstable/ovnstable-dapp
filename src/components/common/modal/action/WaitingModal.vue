<template>
    <v-dialog
            v-model="show"
            width="450"
            persistent>
        <v-card class="container_body">
            <v-card-text class="px-5 pt-5">
                <v-row justify="center" class="mt-10 mb-10">
                    <v-progress-circular
                            width="6"
                            :size="70"
                            color="#FCCA46"
                            indeterminate
                    ></v-progress-circular>
                </v-row>
                <v-row justify="center">
                    <label class="loading-label">Waiting for confirmation</label>
                </v-row>
                <v-row justify="center" class="mt-8 mb-3">
                    <label class="loading-sub-label">{{ modalText }}</label>
                </v-row>
                <v-row justify="center" class="mb-5" v-if="modalText">
                    <label class="loading-sub2-label">Confirm this transaction in your wallet</label>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "WaitingModal",

    props: {
    },

    computed: {
        ...mapGetters('waitingModal', ['show', 'modalText',]),
    },

    data: () => ({
    }),

    methods: {
        ...mapActions('waitingModal', ['showWaitingModal', 'closeWaitingModal']),

        close() {
            this.closeWaitingModal();

            this.$emit('input', false);
            this.$emit('m-close');
        },
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {
    .loading-sub2-label {
        font-size: 14px;
    }
}

@media only screen and (min-width: 1400px) {
    .loading-sub2-label {
        font-size: 12px;
    }
}

/* mobile */
@media only screen and (max-width: 960px) {

    .loading-label {
        font-style: normal;
        font-weight: 400;
        font-size: 22px;
        line-height: 30px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .loading-label {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 34px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .loading-label {
        font-style: normal;
        font-weight: 400;
        font-size: 26px;
        line-height: 36px;
    }
}

.container_body {
    border-radius: 24px !important;
    background-color: var(--secondary) !important;
}

.loading-label {
    color: #FCCA46;
    font-family: 'Roboto', sans-serif;
}

.loading-sub-label {
    color: var(--secondary-gray-text);
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
}

.loading-sub2-label {
    color: var(--secondary-gray-text);
    font-style: normal;
    font-weight: normal;
    line-height: 16px;
    line-height: 24px;
}
</style>
