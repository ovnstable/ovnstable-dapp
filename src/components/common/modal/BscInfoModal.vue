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
                        Dear Users,
                        <br/><br/>
                        It came to our knowledge on 3/11/22 that the Aequinox Dex on BNB chain had accidentally locked in funds held by Overnight - this was $404K in total.
                        The situation has multiple counterparties, including team members from Balancer, Yearn, and Curve evaluated.
                        Upon evaluation, it was concluded that the funds could not be recovered for at least 10 years (500 weeks).
                        <br/><br/>
                        Read more here:
                        <label class="discord-link" @click.stop="openDiscord()">
                            open our Discord
                        </label>
                        <br/><br/>
                        <b>How will this affect USD+ Holders?</b>
                        <br/><br/>
                        1.  We'll continue operations for USD+ on BSC, and hence, the nominal value for Aequinox LP will be 0; this will result in a negative rebase to the amount of the Aequinox exposure.
                        <br/><br/>
                        2. We will take a snapshot of USD+ holders to record the wallets affected - during the block of rebase - and they, in turn, will be entitled to compensation.
                        <br/><br/>
                        3. We will have a governance vote pertaining to the distribution of locked LPs: either distribute the locked LP among users or keep it in Overnight's treasury until recovery.
                        <br/><br/>
                        4. The remainder of the losses shall be compensated through the airdrop of OVN tokens during the token sale. The airdrop will come from team allocation on the team and early investor terms: linear 30 months vest with a 6-month cliff.
                        <br/><br/>
                        <b>How will this affect ETS Holders?</b>
                        <br/><br/>
                        a) WBNB/USDC ETS: The minting/redeeming token will be changed to USDC as the strategy has no direct exposure to USD+; in accordance, it remains unaffected. No action is required on behalf of users.
                        <br/><br/>
                        b) WBNB/USD+ ETS: The strategy will be liquidated. The LP will be withdrawn to repay the BNB loan, and the USDC obtained from this will compensate for 50% of the users funds. The other 50% will be repaid in USD+. Refer to the repayment for USD+ above for more information on this.
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
