<template>
    <div v-if="show && etsData">
        <v-dialog
                v-model="show"
                width="600"
                persistent>
            <v-card class="container_body airdrop-body">
                <v-toolbar class="container_header" flat>
                    <label class="title-modal mt-4">
                        {{ isMintView ? 'Mint ETS' : 'Redeem ETS' }}
                    </label>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="close" class="mt-4">
                        <v-icon class="close-icon">mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text class="pt-8 content-container">
                    <v-row class="invest-body-row mt-5 mx-n2" align="center">
                        <Invest v-if="isMintView"/>
                        <Withdraw v-else/>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import Invest from "@/components/market/modal/ets/invest/action/Invest";
import Withdraw from "@/components/market/modal/ets/invest/action/Withdraw";

export default {
    name: "InvestModal",

    components: {
        Withdraw,
        Invest
    },

    props: {},

    computed: {
        ...mapGetters('investModal', ['show', 'etsData']),
        ...mapGetters('investModal', ['isMintView']),
    },

    data: () => ({}),

    methods: {
        ...mapActions('investModal', ['closeInvestModal']),
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
        ...mapActions('track', ['trackClick']),

        openLink(link) {
            window.open(link, '_blank').focus();
        },

        close() {
            this.closeInvestModal();
        },

        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .airdrop-body {
        width: 100% !important;
    }

    .modal-link-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .airdrop-body {
        width: 100% !important;
    }

    .container_header {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .invest-body-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .modal-link-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .airdrop-body {
        width: 100% !important;
    }

    .container_header {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .invest-body-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .modal-link-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .invest-body-row {
        margin-bottom: 5% !important;
    }
}

.airdrop-body {
    z-index: 100;
}

.container_body {
    background-color: var(--secondary) !important;
    box-shadow: 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12), 0px 7px 8px -4px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
}

.container_header {
    background-color: var(--secondary) !important;
}

.modal-link-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--links-blue);
    cursor: pointer;
}

</style>
