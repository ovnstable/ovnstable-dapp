<template>
    <v-col>
        <v-row justify="end" align="center" v-if="account">
            <v-col>
                <v-row justify="end" align="center">

                    <a class="bridge-link" @click="openBridgeLink">Bridge</a>

                    <v-chip outlined dark class="balance-chip" @click="showAccountProfile">
                        <strong>{{ $utils.formatMoney(balance.usdPlus, 2) }}</strong>&nbsp;USD+
                    </v-chip>

                    <v-menu offset-y min-width="180px">
                        <template v-slot:activator="{ attrs, on }">
                            <v-chip class="account-chip"
                                    dark
                                    v-bind="attrs"
                                    v-on="on">
                                {{ accountShort }}
                            </v-chip>
                        </template>

                        <v-list class="wallet-actions-list">
                            <v-list-item @click="openBridgeLink" class="bridge-link-mobile">
                                <label class="list-label-switch">
                                    Bridge
                                </label>
                            </v-list-item>
                            <v-list-item @click="showAccountProfile" class="account-profile-mobile">
                                <label class="list-label-switch">
                                    Account Profile
                                </label>
                            </v-list-item>
                            <v-list-item @click="addUsdPlusToken">
                                <label class="list-label-switch">
                                    Add&nbsp;&nbsp;<strong>USD+</strong>&nbsp;&nbsp;to wallet
                                </label>
                            </v-list-item>
                            <v-list-item @click="switchAccountAction">
                                <label class="list-label-switch">
                                    Switch wallet
                                </label>
                            </v-list-item>
                            <v-list-item @click="disconnectWalletAction">
                                <label class="list-label-disconnect">
                                    Disconnect wallet
                                </label>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-row>
            </v-col>
        </v-row>

        <v-row justify="end" v-else>
            <button class="btn-connect-wallet" v-on:click="connectWalletAction">
                Connect to a wallet
            </button>
        </v-row>
    </v-col>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "AccountBar",

    components: {
    },

    computed: {
        ...mapGetters('profile', ['balance']),
        ...mapGetters('web3', ['account', 'web3', 'contractNames', 'networkId', 'walletConnected']),

        isWalletConnected: function () {
            return this.walletConnected;
        },

        accountShort: function () {
            if (this.account) {
                return this.account.substring(0, 5) + '...' + this.account.substring(this.account.length - 4);
            } else {
                return null;
            }
        },
    },

    created() {
        window.setInterval(() => {
            this.refreshBalance();
        }, 5000)
    },

    methods: {

        ...mapActions('web3', ['connectWallet', 'disconnectWallet', 'switchAccount', 'addUsdPlusToken']),
        ...mapActions('accountProfile', ['showAccountProfile']),
        ...mapActions('profile', ['refreshBalance']),

        disconnectWalletAction() {
            this.disconnectWallet();
        },

        switchAccountAction() {
            this.switchAccount();
        },

        connectWalletAction() {
            this.connectWallet();
        },

        openBridgeLink() {
            window.open('https://wallet.polygon.technology', '_blank');
        }
    }
}
</script>

<style scoped>

/* mobile version */
@media only screen and (max-width: 1400px) {
    .bridge-link, .balance-chip {
        display: none !important;
    }

    .btn-connect-wallet, .account-chip {
        width: 165px !important;
        height: 40px !important;
    }
}

@media only screen and (min-width: 1400px) {
    .bridge-link-mobile, .account-profile-mobile {
        display: none !important;
    }

    .btn-connect-wallet {
        width: 185px !important;
        height: 56px !important;
    }

    .account-chip {
        height: 56px !important;
    }
}

.list-label-switch {
    cursor: pointer;
    color: white;
}

.list-label-disconnect {
    cursor: pointer;
    color: red;
}

.wallet-actions-list {
    background-color: var(--secondary) !important;
    border-radius: 10px !important;
    margin-top: 10px !important;
}

.btn-connect-wallet:hover {
    filter: brightness(110%);
}

.btn-connect-wallet {
    color: white;
    border-radius: 40px;
    background: var(--orange-gradient);
}

.bridge-link {
    color: var(--link);
    font-size: 16px;
    text-decoration: none;
    margin-right: 20px;
}

.balance-chip {
    justify-content: center;
    background: var(--orange-gradient) !important;
    border-width: 0px !important;
    color: white;
    height: 56px !important;
    border-radius: 40px !important;
    font-size: 16px;
    min-width: 112px;
}

.account-chip {
    margin-left: 10px;
    background: var(--secondary) !important;
    border-width: 0px !important;
    justify-content: center;
    color: white;
    border-radius: 40px !important;
    font-size: 16px;
    min-width: 150px;
}

</style>
