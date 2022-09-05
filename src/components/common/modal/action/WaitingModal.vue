<template>
    <v-dialog
            v-model="show"
            width="450"
            persistent>
        <v-card class="container_body">
            <v-card-text class="px-5 pt-5">
                <v-row justify="center" class="mt-10 mb-10">
                    <v-progress-circular
                            width="1.5"
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
                <v-row justify="center" class="mb-15" v-if="modalText">
                    <label class="loading-sub2-label">Confirm this transaction in your wallet</label>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";

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

.container_body {
    border-radius: 24px !important;
    background-color: var(--secondary) !important;
}

.loading-label {
    color: #FCCA46;
    font-family: 'Raleway', sans-serif;
    font-style: normal;
    font-weight: 800;
    font-size: 24px;
    line-height: 36px;
}

.loading-sub-label {
    color: #333333;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
}

.loading-sub2-label {
    color: #333333;
    font-style: normal;
    font-weight: normal;
    line-height: 16px;
}
</style>
