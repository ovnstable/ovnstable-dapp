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

                <template v-if="errorMsg">
                    <v-tooltip
                        v-model="showCopyTooltipContainer"
                        color="#202832"
                        bottom
                    >
                        <template v-slot:activator="{on}">
                            <v-container class="error-container" @click="copyErrorToClipboard('container')">
                                <v-row class="mt-8 error-container-row" justify="center">
                                    <label class="error-msg-title">Error message</label>
                                </v-row>
                                <v-row class="mt-4 error-container-row" justify="center">
                                    <v-col class="ma-n3">
                                        <label class="error-msg-value">{{ errorMsg.message }}</label>
                                    </v-col>
                                </v-row>

                                <v-row class="mt-8 error-container-row">
                                    <v-spacer></v-spacer>
                                    <label class="error-msg-title">From</label>
                                    <v-spacer></v-spacer>
                                    <label class="error-msg-title">To</label>
                                    <v-spacer></v-spacer>
                                </v-row>
                                <v-row class="mt-4 mb-8 error-container-row">
                                    <v-spacer></v-spacer>
                                    <label class="error-msg-value">{{ shortAddress(errorMsg.from) }}</label>
                                    <v-spacer></v-spacer>
                                    <label class="error-msg-value">{{ shortAddress(errorMsg.to) }}</label>
                                    <v-spacer></v-spacer>
                                </v-row>
                            </v-container>
                        </template>
                        <p class="my-0">Copied!</p>
                    </v-tooltip>
                </template>

                <v-row justify="center">
                    <label class="discord-label">Error report has been automatically logged.</label>
                </v-row>

                <v-row justify="center" class="mb-5">
                    <label class="discord-label">Please,&nbsp;</label>
                    <v-tooltip
                        v-if="errorMsg"
                        v-model="showCopyTooltip"
                        color="#202832"
                        bottom
                    >
                        <template v-slot:activator="{on}">
                            <label class="discord-link" @click="copyErrorToClipboard('link')">copy the full error</label>
                        </template>
                        <p class="my-0">Copied!</p>
                    </v-tooltip>
                    <label class="discord-label" v-if="errorMsg">&nbsp;and&nbsp;</label>
                    <label class="discord-label">contact our&nbsp;</label>
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
        ...mapGetters('errorModal', ['show', 'errorType', 'errorMsg']),
    },

    data: () => ({
        showCopyTooltip: false,
        showCopyTooltipContainer: false,
    }),

    methods: {
        ...mapActions('errorModal', ['showErrorModal', 'closeErrorModal']),

        openDiscord() {
            window.open(`https://discord.gg/overnight-fi`, '_blank').focus();
        },

        async copyErrorToClipboard(copyTooltip) {
            if (copyTooltip === 'container') {
                this.showCopyTooltipContainer = true;
            }
            if (copyTooltip === 'link') {
                this.showCopyTooltip = true;
            }

            await navigator.clipboard.writeText(JSON.stringify(this.errorMsg));

            await new Promise(resolve => setTimeout(resolve, 1000));

            if (copyTooltip === 'container') {
                this.showCopyTooltipContainer = false;
            }
            if (copyTooltip === 'link') {
                this.showCopyTooltip = false;
            }
        },

        close() {
            this.closeErrorModal();

            this.$emit('input', false);
            this.$emit('m-close');
        },

        shortAddress(address) {
            if (address) {
                return address.substring(0, 5) + '...' + address.substring(address.length - 4);
            } else {
                return null;
            }
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

.error-msg-title {
    color: #333333;
    font-family: 'Raleway', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 13px;
    line-height: 16px;
}

.error-msg-value {
    text-align: center;
    color: #707A8B;
    font-family: 'Raleway', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
}

.error-container, .error-container-row, .error-container-row > label {
    cursor: pointer !important;
}

.error-container:hover label {
    color: #333333 !important;
}
</style>
