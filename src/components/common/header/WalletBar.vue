<template>
    <div class="wallet-bar-main-container mt-1">
        <v-row align="center" class="wallet-bar-container" @click="walletClickAction()">
            <v-col cols="1" class="wallet-col mr-4">
                <div v-if="walletName" class="wallet-icon">
                    <v-img :src="require('@/assets/wallet/' + walletName.toLowerCase() + '.svg')"/>
                </div>
            </v-col>
            <v-col cols="5" class="wallet-col" v-if="!$wu.isMobile()">
                <label class="balance-label" :class="dataHidden ? 'hidden-label' : ''">
                    {{ dataHidden ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' : ($utils.formatMoney(account ? balance.usdPlus : 0, 2)) }}
                </label>
                <label class="balance-label">
                    &nbsp;USD+
                </label>
            </v-col>
            <v-col :cols="$wu.isMobile() ? 0 : 4" class="wallet-col" :class="$wu.isMobile() ? 'mr-4' : ''">
                <v-row class="account-display-container" align="center" justify="center" @click.stop="pendingTx? showTxHistory() : walletClickAction()">
                    <template v-if="pendingTx">
                        <v-progress-circular
                            width="2"
                            :size="14"
                            color="var(--third-gray-text)"
                            indeterminate
                        ></v-progress-circular>
                        <label class="account-label pending-label ml-2">
                            Pending...
                        </label>
                    </template>

                    <label v-else class="account-label" :class="dataHidden ? 'hidden-label' : ''">
                        {{ account ? (dataHidden ? '' : accountDisplay) : 'XXXXX...XXXX' }}
                    </label>
                </v-row>
            </v-col>
            <v-col cols="1" class="wallet-col" v-if="!$wu.isMobile()" @click.stop="switchEye">
                <v-icon class="eye-icon">
                    {{ dataHidden ? 'mdi-eye-off-outline' : 'mdi-eye-outline'}}
                </v-icon>
            </v-col>
        </v-row>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "WalletBar",

    components: {
    },

    data: () => ({
        walletName: 'undefined',
    }),

    computed: {
        ...mapGetters('accountData', ['balance', 'account', 'uns']),
        ...mapGetters('network', ['networkId']),
        ...mapGetters('walletAction', ['walletConnected']),
        ...mapGetters('transaction', ['transactions']),
        ...mapGetters('magicEye', ['dataHidden']),

        accountDisplay() {
            if (this.uns) {
                return this.uns;
            } else if (this.account) {
                return this.account.substring(0, 5) + '...' + this.account.substring(this.account.length - 4);
            } else {
                return null;
            }
        },

        pendingTx: function () {
            return (this.transactions.filter(tx => (tx.pending && (tx.chain === this.networkId))).length > 0);
        },
    },

    created() {
        window.setInterval(() => {
            this.refreshBalance();
        }, 5000)
    },

    mounted() {
        this.walletName = localStorage.getItem('walletName');
    },

    methods: {

        ...mapActions('walletAction', ['connectWallet']),
        ...mapActions('accountUI', ['showAccountProfile', 'showTxHistory']),
        ...mapActions('accountData', ['refreshBalance']),
        ...mapActions('track', ['trackClick']),
        ...mapActions('magicEye', ['switchEye']),

        goToAction(id) {
            this.$router.push(id);
        },

        walletClickAction() {
            if (this.account) {
                this.showAccountProfile();
                this.trackClick({action: 'show-wallet-action-click', event_category: 'Account', event_label: 'Show account', value: 1 });
            } else {
                this.connectWallet();
                this.trackClick({action: 'connect-wallet-action-click', event_category: 'Account', event_label: 'Connect wallet', value: 1 });
            }
        },
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .wallet-bar-main-container {
        width: 150px !important;
    }

    .wallet-bar-container {
        height: 28px !important;
    }

    .wallet-col {
        margin-top: -8px;
    }

    .account-display-container {
        height: 24px !important;
    }

    .wallet-icon {
        width: 20px;
        height: 20px;
    }

    .balance-label, .account-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.02em;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .wallet-bar-main-container {
        width: 365px !important;
    }

    .wallet-bar-container {
        height: 48px !important;
    }

    .wallet-col {
        margin-top: -2px;
    }

    .account-display-container {
        height: 28px !important;
    }

    .wallet-icon {
        width: 28px;
        height: 28px;
    }

    .balance-label, .account-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .hidden-label {
        width: 130px;
        height: 28px;
        background: var(--hide-account);
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .wallet-bar-main-container {
        width: 365px !important;
    }

    .wallet-bar-container {
        height: 48px !important;
    }

    .wallet-col {
        margin-top: -2px;
    }

    .account-display-container {
        height: 28px !important;
    }

    .wallet-icon {
        width: 28px;
        height: 28px;
    }

    .balance-label, .account-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .hidden-label {
        width: 130px;
        height: 28px;
        background: var(--hide-account);
    }
}

.wallet-bar-container {
    background-color: var(--secondary) !important;
    border-radius: 2px;
    cursor: pointer !important;
}

.balance-label, .account-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.pending-label {
    text-transform: capitalize;
    color: var(--third-gray-text);
}

.eye-icon {
    color: var(--disabled-value) !important;
}

.wallet-bar-container:hover > .wallet-col > .eye-icon {
    color: var(--hover);
}

.account-display-container {
    background: var(--card-coin-background);
    border-radius: 4px;
}

.account-display-container, .account-display-container > * {
    cursor: pointer !important;
}
</style>
