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
                    <v-icon class="close-icon">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text class="pt-8 content-container">
                <v-row class="account-info-row" align="center">

                    <div class="wallet-img">
                        <v-img v-if="walletName" :src="require('@/assets/wallet/' + walletName.toLowerCase() + '.svg')"/>
                    </div>

                    <v-row class="account-display-container ml-4" align="center" justify="center"
                           @click="viewInExplorer">
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

                <v-row align="start" justify="start" class="account-info-row ma-0 mt-10 toggle-row">
                    <label @click="openTab(1)" class="tab-btn mr-4" v-bind:class="activeTabTx">History</label>
                    <label @click="openTab(2)" class="tab-btn mx-4" v-bind:class="activeTabTokens">Tokens</label>

                    <v-spacer></v-spacer>
                </v-row>

                <TxTab v-if="tab === 1"/>
                <TokensTab v-if="tab === 2"/>
            </v-card-text>
        </v-card>

        <resize-observer @notify="$forceUpdate()"/>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import TokensTab from "@/components/common/modal/account/tabs/TokensTab";
import TxTab from "@/components/common/modal/account/tabs/tx/TxTab";

export default {
    name: "AccountProfile",

    components: {TxTab, TokensTab},

    data: () => ({
        showCopyTooltip: false,
        walletName: 'undefined',
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
        ...mapGetters('network', ['networkId', 'explorerUrl']),
        ...mapGetters('accountUI', ['showAccountProfile', 'tab']),
        ...mapGetters('wrapUI', ['showWrap']),
        ...mapGetters('accountData', ['balance', 'account', 'uns']),
        ...mapGetters('etsAction', ['etsList']),

        accountDisplay: function () {
            if (this.uns) {
                return this.uns;
            } else if (this.account) {
                return this.account.substring(0, 5) + '...' + this.account.substring(this.account.length - 4);
            } else {
                return null;
            }
        },

        activeTabTx: function () {
            return {
                'tab-button': this.tab === 1,
                'tab-button-in-active': this.tab !== 1,
            }
        },

        activeTabTokens: function () {
            return {
                'tab-button': this.tab === 2,
                'tab-button-in-active': this.tab !== 2,
            }
        },
    },

    watch: {
        showAccountProfile: function (newValue, oldValue) {
            if (newValue) {
                this.loadTransaction();
            }
        },
    },

    mounted() {
        let walletName = localStorage.getItem('walletName');
        if (walletName && walletName !== null && walletName !== 'null') {
            this.walletName = walletName;
        }
    },

    methods: {
        ...mapActions('accountUI', ['hideAccountProfile']),
        ...mapActions('walletAction', ['disconnectWallet']),
        ...mapActions('transaction', ['loadTransaction']),
        ...mapActions('track', ['trackClick']),

        ...mapMutations('accountUI', ['setTab']),

        openOnExplorer(hash) {
            window.open(this.explorerUrl + `tx/${hash}`, '_blank').focus();
        },

        disconnectWalletAction() {
            this.disconnectWallet();
            this.close();
        },

        close() {
            this.hideAccountProfile();
            this.trackClick({action: 'hide-account-profile-click', event_category: 'Account', event_label: 'Close account', value: 1 });

            this.$emit('input', false);
            this.$emit('m-close');
        },

        viewInExplorer() {
            let url = this.explorerUrl + 'address/' + this.account;
            window.open(url, '_blank');
        },

        openTab(tabNumber) {
            this.setTab(tabNumber);
        },

        async copyAddressToClipboard() {
            this.showCopyTooltip = true;

            await navigator.clipboard.writeText(this.account);

            await new Promise(resolve => setTimeout(resolve, 1000));
            this.showCopyTooltip = false;
            this.trackClick({action: 'copy-address-click', event_category: 'Account Copy', event_label: 'Copy account address', value: 1 });
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

    .account-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.02em;
    }

    .account-info-row {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }

    .container_header {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
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

    .account-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .account-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .container_header {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
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

    .account-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .account-info-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .container_header {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
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
    color: var(--links-blue) !important;
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
    color: var(--secondary-gray-text);
}

.account-display-container {
    max-width: 160px !important;
    background: var(--card-coin-background);
    border-radius: 4px;
    height: 36px !important;
    cursor: pointer !important;
}

.toggle-row {
    border-bottom: 2px solid var(--main-border);
    height: auto !important;
}

.tab-button {
    border-bottom: 2px solid var(--links-blue) !important;
    color: var(--links-blue) !important;
    cursor: pointer;
}

.tab-button-in-active {
    cursor: pointer;
}

.tab-btn {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--secondary-gray-text);
    margin-bottom: -2px;
    cursor: pointer;
}

.tab-btn-disabled {
    cursor: default;
}
</style>
