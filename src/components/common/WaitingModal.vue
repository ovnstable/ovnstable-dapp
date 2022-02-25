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
                            color="#FFD505 "
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
.container_body {
    border-radius: 24px;
    background-color: var(--secondary) !important;
}

.loading-label {
    color: #FFD505;
    font-style: normal;
    font-weight: 300;
    font-size: 24px;
    line-height: 36px;
}

.loading-sub-label {
    color: white;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
}

.loading-sub2-label {
    color: white;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
}
</style>
