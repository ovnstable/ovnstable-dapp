<template>
    <v-dialog
            :value="showAccountProfile"
            :width="width"
            @input="close"
            :persistent="persistent"
            scrollable>
        <v-card class="container_body">
            <v-toolbar class="container_header" flat>
                <label class="title-modal">
                    Account
                </label>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text class="pt-8 content-container">
                <v-row class="account-info-row" align="center">

                    <div class="wallet-img">
                        <v-img :src="require('@/assets/icon/undefined.svg')"/>
                    </div>

                    <v-row class="account-display-container ml-4" align="center" justify="center" @click="viewInExplorer">
                        <label class="account-label">
                            {{ account ? accountDisplay : 'XXXXX...XXXX' }}
                        </label>
                        <div class="icon-img ml-2">
                            <v-img :src="require('@/assets/icon/open.svg')"/>
                        </div>
                    </v-row>

                    <v-tooltip
                            v-model="showCopyTooltip"
                            color="#202832"
                            bottom
                    >
                        <template v-slot:activator="{on}">
                            <div class="icon-img ml-8" @click="copyAddressToClipboard">
                                <v-img :src="require('@/assets/icon/copy.svg')"/>
                            </div>
                        </template>
                        <p class="my-0">Copied!</p>
                    </v-tooltip>

                    <v-spacer></v-spacer>

                    <v-btn class="disconnect-wallet-btn btn-outlined" outlined @click="disconnectWalletAction">
                        Disconnect
                    </v-btn>
                    <v-btn class="disconnect-wallet-btn-mobile" icon color="red" dark @click="disconnectWalletAction">
                        <v-icon>
                            mdi-logout
                        </v-icon>
                    </v-btn>
                </v-row>

                <v-row class="account-info-row mt-8" align="center">
                    <label class="add-coins-label">Add tokens to your wallet</label>
                </v-row>

                <v-row class="account-info-row" align="center">
                    <v-btn class="coin-btn" @click="addUsdPlusToken">
                        <div class="coin-img">
                            <v-img :src="require('@/assets/currencies/usdPlus.svg')"/>
                        </div>
                        <label class="ml-2">USD+</label>
                    </v-btn>
                    <v-btn class="coin-btn ml-5" @click="addwUsdPlusToken">
                        <div class="coin-img">
                            <v-img :src="require('@/assets/wUsdPlus.svg')"/>
                        </div>
                        <label class="ml-2">wUSD+</label>
                    </v-btn>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "AccountProfile",

    data: () => ({
        showCopyTooltip: false,
    }),

    props: {
        persistent: {
            type: Boolean,
            default: false,
        },

        value: {
            type: Boolean,
            default: false,
        },

        width: {
            type: String,
            default: '500',
        }
    },

    computed: {
        ...mapGetters('web3', ['walletName']),
        ...mapGetters('accountUI', ['showAccountProfile']),
        ...mapGetters('transaction', ['transactions']),
        ...mapGetters('accountData', ['balance', 'account', 'uns']),

        accountDisplay: function () {
            if (this.uns) {
                return this.uns;
            } else if (this.account) {
                return this.account.substring(0, 5) + '...' + this.account.substring(this.account.length - 4);
            } else {
                return null;
            }
        },

        networkName() {
            return process.env.VUE_APP_POLYGON;
        },
    },


    watch: {

        showAccountProfile: function (newValue, oldValue){

            console.log('Watch: show ' + newValue);
            if (newValue){
                this.loadTransaction();
            }

        },
    },

    methods: {
        ...mapActions('accountUI', ['hideAccountProfile']),
        ...mapActions('web3', ['disconnectWallet', 'addUsdPlusToken', 'addwUsdPlusToken']),
        ...mapActions('transaction', ['clearTransaction', 'loadTransaction']),

        openOnExplorer(hash) {
            window.open(process.env.VUE_APP_NETWORK_EXPLORER + `tx/${hash}`, '_blank').focus();
        },

        disconnectWalletAction() {
            this.disconnectWallet();
            this.close();
        },

        close() {
            this.hideAccountProfile();

            this.$emit('input', false);
            this.$emit('m-close');
        },

        viewInExplorer() {
            let url = process.env.VUE_APP_NETWORK_EXPLORER + 'address/' + this.account;
            window.open(url, '_blank');
        },

        async copyAddressToClipboard() {
            this.showCopyTooltip = true;

            await navigator.clipboard.writeText(this.account);

            await new Promise(resolve => setTimeout(resolve, 1000));
            this.showCopyTooltip = false;
        },
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {

    .disconnect-wallet-btn {
        display: none !important;
    }

    .account-info-row {
        justify-content: center !important;
    }
}

@media only screen and (min-width: 1400px) {
    .disconnect-wallet-btn-mobile {
        display: none !important;
    }
}

.account-label {
    color: #333333 !important;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
}

.view-explorer-btn > label, .copy-address-btn > label, .add-usd-btn > label {
    cursor: pointer !important;
}

.disconnect-wallet-btn {
    height: 36px;
    border-radius: 2px;
    box-shadow: none !important;

    font-family: 'Roboto', sans-serif !important;
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    text-align: center !important;
    letter-spacing: 0.02em !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.btn-outlined {
    color: #1C95E7 !important;
}

.icon-img {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.wallet-img {
    width: 36px !important;
    height: 36px !important;
}

.coin-img {
    width: 32px;
    height: 32px;
}

.account-info-row {
    height: 56px;
    margin-left: 5% !important;
    margin-right: 5% !important;
}

.content-container {
    margin-bottom: 5% !important;
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

.account-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.account-display-container {
    max-width: 160px !important;
    background: #F5F5F5;
    border-radius: 4px;
    height: 36px !important;
    cursor: pointer;
}

.add-coins-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 32px;
    color: #333333;
}

.coin-btn {
    width: 120px !important;
    height: 56px !important;
    background: #F5F5F5 !important;
    border-radius: 4px !important;
    box-shadow: none !important;

    font-family: 'Roboto', sans-serif !important;
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: #333333 !important;
}
</style>
