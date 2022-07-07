<template>
    <div v-if="show">
        <v-card class="container_body airdrop-body">
            <v-toolbar class="container_header" flat>
                <label class="title-modal">
                    {{ isMintView ? 'Invest' : 'Withdraw' }}
                </label>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text class="pt-4 content-container">
                <v-row class="invest-body-row" align="center">
                    <v-spacer></v-spacer>
                    <label class="modal-link-label" @click="openLink('https://app.overnight.fi/')">Mint USD+</label>
                </v-row>

                <v-row class="invest-body-row mt-5" align="center">
                    <Invest v-if="isMintView"/>
                    <Withdraw v-else/>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import Invest from "@/components/market/modal/invest/action/Invest";
import Withdraw from "@/components/market/modal/invest/action/Withdraw";

export default {
    name: "InvestModal",
    components: {Withdraw, Invest},
    props: {},

    computed: {
        ...mapGetters('investModal', ['show']),
        ...mapGetters('investModal', ['usdPlusApproved', 'usdPlusWmaticApproved', 'isMintView']),
    },

    data: () => ({}),

    methods: {
        ...mapActions('investModal', ['showInvestModal', 'closeInvestModal']),
        ...mapActions('web3', ['connectWallet']),

        openLink(link) {
            window.open(link, '_blank').focus();
        },

        close() {
            this.closeInvestModal();
        },
    },
}
</script>

<style scoped>

@media only screen and (max-width: 500px) {
}

/* mobile version */
@media only screen and (max-width: 1400px) {
    .airdrop-body {
        z-index: 100;
        width: 100% !important;
    }
}

@media only screen and (min-width: 1400px) {
    .airdrop-body {
        z-index: 100;
        position: fixed !important;
        top: 10vh !important;
        right: 50px !important;
        width: 30vw !important;
    }
}

.container_body {
    background-color: var(--secondary) !important;
    box-shadow: 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12), 0px 7px 8px -4px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
}

.container_header {
    background-color: var(--secondary) !important;
    margin-left: 5% !important;
    margin-right: 5% !important;
    margin-top: 5% !important;
}

.content-container {
    margin-bottom: 5% !important;
}

.invest-body-row {
    margin-left: 5% !important;
    margin-right: 5% !important;
}

.modal-link-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    font-feature-settings: 'liga' off;
    color: #1C95E7;
    cursor: pointer;
}
</style>
