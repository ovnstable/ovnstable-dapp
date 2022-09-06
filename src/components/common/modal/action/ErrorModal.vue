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
                <v-row justify="center" class="mb-5">
                    <div class="loading-img">
                        <v-img :src="require('@/assets/icon/error-cross.svg')"/>
                    </div>
                </v-row>
                <v-row justify="center">
                    <label class="error-label">Transaction execution error</label>
                </v-row>
                <v-row justify="center" class="mt-8 mb-5">
                    <label class="discord-label">Please, contact our&nbsp;</label>
                    <label class="discord-link" @click="openDiscord">Discord Support</label>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "ErrorModal",

    props: {
    },

    computed: {
        ...mapGetters('errorModal', ['show', 'errorType',]),
    },

    data: () => ({
    }),

    methods: {
        ...mapActions('errorModal', ['showErrorModal', 'closeErrorModal']),

        openDiscord() {
            window.open(`https://discord.gg/overnight-fi`, '_blank').focus();
        },

        close() {
            this.closeErrorModal();

            this.$emit('input', false);
            this.$emit('m-close');
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

.error-label {
    color: #CF3F92;
    font-family: 'Raleway', sans-serif;
    font-style: normal;
    font-weight: 800;
    font-size: 24px;
    line-height: 36px;
}

.discord-label {
    color: #333333;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
}

.discord-link {
    cursor: pointer;
    color: var(--link);
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
}

.discord-link:hover {
    text-decoration: underline;
}
</style>
