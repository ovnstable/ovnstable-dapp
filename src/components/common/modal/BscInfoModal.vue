<template>
    <v-dialog
            v-model="show"
            width="700"
            persistent
            scrollable>
        <v-card class="container_body">
            <v-toolbar class="container_header" flat>
                <div class="title-modal-icon">
                    <v-img :src="require('@/assets/icon/bellWarning.svg')"/>
                </div>
                <label class="title-modal ml-2">
                    Urgent info for BSC users
                </label>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon class="close-icon">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text class="pt-8 content-container">
                <v-row class="modal-info-row" align="center">
                    <label class="modal-info-text">
                        As you know, Aequinox Dex on BNB chain accidentally locked in funds held by USD+ to 404k USD.
                        As stated involved, multiple counterparties, including the Balancer/Beethoven experts, evaluated the situation and jointly concluded that funds couldn't be recovered for at least 500 weeks.
                        <br/><br/>
                        Read more here:
                        <label class="discord-link" @click.stop="openDiscord()">
                            open our Discord
                        </label>
                        <br/><br/>
                        <b>How will I be affected?</b>
                        <br/><br/>
                        1.  For continuing USD+ operations on BSC, Aequinox LP will be valued at 0. This will result in a negative rebase to the amount of the Aequinox exposure.
                        On the block of the rebase, we will take the snapshot of USD+ holders to record the wallets affected and entitled to compensation.
                        <br/><br/>
                        2. We will put to the vote locked LP distribution: to receive the locked LP or prefer to keep it in the Overnight protocol until recovery
                        <br/><br/>
                        3. The remainder loss will be compensated through the airdrop of OVN tokens at OVN token sale. The airdrop will come from team allocation on the team and early investor terms: linear 30 months vest with a 6-month cliff.
                        <br/><br/>
                        <b>This situation is only limited to USD+ mints/redeems on BNB Chain - other chains remain unaffected.</b>
                    </label>
                </v-row>

                <v-row class="modal-info-row mt-12" align="center">
                    <v-btn class="understand-btn" @click="close" outlined>
                        I understand
                    </v-btn>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "BscInfoModal",

    props: {
    },

    computed: {
        ...mapGetters('bscInfoModal', ['show']),
    },

    data: () => ({
    }),

    methods: {
        ...mapActions('bscInfoModal', ['showBscInfoModal', 'closeBscInfoModal']),

        openDiscord() {
            window.open(`https://discord.gg/overnight-fi`, '_blank').focus();
        },

        close() {
            this.closeBscInfoModal();

            this.$emit('input', false);
            this.$emit('m-close');
        },
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {

    .container_header {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }

    .modal-info-row {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }

    .title-modal-icon {
        width: 24px;
        height: 24px;
    }

    .modal-info-text {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .understand-btn {
        width: 100%;
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.04em !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .container_header {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .modal-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .title-modal-icon {
        width: 32px;
        height: 32px;
    }

    .modal-info-text {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .understand-btn {
        width: 100%;
        height: 40px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 20px !important;
        line-height: 24px !important;
        letter-spacing: 0.04em !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .container_header {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .modal-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .title-modal-icon {
        width: 32px;
        height: 32px;
    }

    .modal-info-text {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .understand-btn {
        width: 50%;
        height: 40px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 20px !important;
        line-height: 24px !important;
        letter-spacing: 0.04em !important;
    }
}

.container_body {
    border-radius: 8px !important;
    box-shadow: 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12), 0px 7px 8px -4px rgba(0, 0, 0, 0.2);
    background-color: var(--secondary) !important;
}

.container_header {
    background-color: var(--secondary) !important;
    margin-top: 5% !important;
}

.content-container {
    margin-bottom: 5% !important;
}

.modal-info-text {
    font-family: 'Roboto', sans-serif;
    color: var(--secondary-gray-text) !important;
}

.understand-btn {
    border-radius: 2px !important;

    font-family: 'Roboto', sans-serif !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: #FCCA46 !important;
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

.action-icons {
    width: 18px;
    height: 18px;
}
</style>
