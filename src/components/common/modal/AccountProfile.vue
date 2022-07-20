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
                        <div class="icon-img ml-2" v-if="!$wu.isMobile()">
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
                    <label class="add-coins-label" :class="$wu.isMobile() ? 'ml-1' : ''">Add tokens to your wallet</label>
                </v-row>

                <v-row class="account-info-row" justify="start" align="center">
                    <v-btn class="coin-btn" :class="$wu.isMobile() ? 'ml-1' : ''" @click="addUsdPlusToken">
                        <div class="coin-img">
                            <v-img :src="require('@/assets/currencies/usdPlus.svg')"/>
                        </div>
                        <label class="ml-2 coin-btn-label">USD+</label>
                    </v-btn>
                    <v-btn class="coin-btn" :class="$wu.isMobile() ? 'ml-1' : 'ml-5'" @click="addwUsdPlusToken">
                        <div class="coin-img">
                            <v-img :src="require('@/assets/wUsdPlus.svg')"/>
                        </div>
                        <label class="ml-2 coin-btn-label">wUSD+</label>
                    </v-btn>
                    <v-btn class="coin-btn coin-btn-wide" :class="$wu.isMobile() ? 'ml-1' : 'ml-5'" @click="addUsdPlusWmaticToken">
                        <div class="coin-img">
                            <v-img :src="require('@/assets/currencies/market/WmaticUsdPlus.svg')"/>
                        </div>
                        <label class="ml-2 coin-btn-label">USD+/WMATIC</label>
                    </v-btn>
                </v-row>

                <v-row class="account-info-row" :class="$wu.isMobile() ? 'mt-15' : 'mt-8'" align="center" v-if="promoLogins">
                    <label class="add-coins-label" :class="$wu.isMobile() ? 'ml-1' : ''">Invite a friend</label>
                    <Tooltip text="Share these credentials among who you think should use it"/>
                </v-row>

                <PromoCredentialsSection/>
            </v-card-text>
        </v-card>

        <resize-observer @notify="$forceUpdate()"/>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import Tooltip from "@/components/common/element/Tooltip";
import PromoCredentialsSection from "@/components/common/modal/promo/PromoCredentialsSection";

export default {
    name: "AccountProfile",

    components: {PromoCredentialsSection, Tooltip},

    data: () => ({
        showCopyTooltip: false,

        get promoLogins() {
            return localStorage.getItem('promoLogins');
        },

        set promoLogins(value) {
            localStorage.setItem('promoLogins', value);
        },
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
        ...mapActions('web3', ['disconnectWallet', 'addUsdPlusToken', 'addwUsdPlusToken', 'addUsdPlusWmaticToken']),
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
@media only screen and (max-width: 960px) {
    .disconnect-wallet-btn {
        display: none !important;
    }

    .wallet-img {
        width: 28px !important;
        height: 28px !important;
    }

    .coin-img {
        width: 20px;
        height: 20px;
    }

    .account-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.02em;
    }

    .add-coins-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .coin-btn {
        width: 75px !important;
        height: 46px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 12px !important;
        line-height: 14px !important;
        letter-spacing: 0.02em !important;
    }

    .coin-btn-wide {
        width: 125px !important;
    }

    .account-info-row {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }

    .container_header {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .disconnect-wallet-btn {
        display: none !important;
    }

    .wallet-img {
        width: 36px !important;
        height: 36px !important;
    }

    .coin-img {
        width: 32px;
        height: 32px;
    }

    .account-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .add-coins-label {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .coin-btn {
        width: 120px !important;
        height: 56px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .coin-btn-wide {
        width: 180px !important;
    }

    .account-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .container_header {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .disconnect-wallet-btn-mobile {
        display: none !important;
    }

    .wallet-img {
        width: 36px !important;
        height: 36px !important;
    }

    .coin-img {
        width: 32px;
        height: 32px;
    }

    .account-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .add-coins-label {
        font-style: normal;
        font-weight: 300;
        font-size: 20px;
        line-height: 32px;
    }

    .coin-btn {
        width: 120px !important;
        height: 56px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .coin-btn-wide {
        width: 180px !important;
    }

    .account-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .container_header {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }
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

.account-info-row {
    height: 56px;
}

.container_header {
    background-color: var(--secondary) !important;
    margin-top: 5% !important;
}

.content-container {
    margin-bottom: 5% !important;
}

.container_body {
    background-color: var(--secondary) !important;
    box-shadow: 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12), 0px 7px 8px -4px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
}

.account-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.account-display-container {
    max-width: 160px !important;
    background: #F5F5F5;
    border-radius: 4px;
    height: 36px !important;
    cursor: pointer !important;
}

.add-coins-label {
    font-family: 'Roboto', sans-serif;
    color: #333333;
}

.coin-btn {
    background: #F5F5F5 !important;
    border-radius: 4px !important;
    box-shadow: none !important;

    font-family: 'Roboto', sans-serif !important;
    font-style: normal !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: #333333 !important;
}
</style>
