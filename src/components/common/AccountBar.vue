<template>
    <v-col>
        <v-row justify="end" align="center" v-if="account">
            <v-col>
                <v-row justify="end" align="center">

                    <a id="bridge-button" class="bridge-link rubic-show" @click="openBridge">Bridge</a>

                    <v-chip outlined dark class="balance-chip" @click="showAccountProfile">
                        {{ $utils.formatMoney(balance.usdPlus, 2) }}&nbsp;USD+
                    </v-chip>

                    <v-menu offset-y min-width="180px">
                        <template v-slot:activator="{ attrs, on }">
                            <v-chip class="account-chip"
                                    @click="hideRubic"
                                    v-bind="attrs"
                                    v-on="on">
                                {{ accountShort }}
                            </v-chip>
                        </template>

                        <v-list class="wallet-actions-list">
                            <v-list-item @click="showAccountProfile" class="account-profile-mobile">
                                <label class="list-label-switch">
                                    Account Profile
                                </label>
                            </v-list-item>
                            <v-list-item @click="goToAction('/farm')" class="farm-mobile">
                                <label class="list-label-switch">
                                    Farm
                                </label>
                            </v-list-item>
                            <v-list-item @click="goToAction('/dashboard')" class="dashboard-mobile">
                                <label class="list-label-switch">
                                    Dashboard
                                </label>
                            </v-list-item>
                            <v-list-item @click="goToAction('/fund')" class="fund-mobile">
                                <label class="list-label-switch">
                                    Stats
                                </label>
                            </v-list-item>
                            <v-list-item @click="openBridge" class="bridge-link-mobile">
                                <label class="list-label-switch">
                                    Bridge
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

        openBridge() {
            if (document.getElementById("rubic-widget-root").classList.contains("rubic-show")) {

                document.getElementById("rubic-widget-root").classList.remove("rubic-show");
                document.getElementById("rubic-widget-root").classList.add("rubic-not-show");

                document.getElementById("rubic-widget-close").classList.remove("rubic-show");
                document.getElementById("rubic-widget-close").classList.add("rubic-not-show");

                document.getElementById("bridge-button").classList.remove("rubic-not-show");
                document.getElementById("bridge-button").classList.add("rubic-show");
            } else {
                document.getElementById("rubic-widget-root").classList.remove("rubic-not-show");
                document.getElementById("rubic-widget-root").classList.add("rubic-show");

                document.getElementById("rubic-widget-close").classList.remove("rubic-not-show");
                document.getElementById("rubic-widget-close").classList.add("rubic-show");

                document.getElementById("bridge-button").classList.remove("rubic-show");
                document.getElementById("bridge-button").classList.add("rubic-not-show");
            }
        },

        hideRubic() {
            if (document.getElementById("rubic-widget-root").classList.contains("rubic-show")) {

                document.getElementById("rubic-widget-root").classList.remove("rubic-show");
                document.getElementById("rubic-widget-root").classList.add("rubic-not-show");

                document.getElementById("rubic-widget-close").classList.remove("rubic-show");
                document.getElementById("rubic-widget-close").classList.add("rubic-not-show");
            }
        },

        goToAction(id) {
            this.$router.push(id);
        },
    }
}
</script>

<style scoped>

/* mobile */
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
    .bridge-link-mobile, .account-profile-mobile, .dashboard-mobile, .fund-mobile, .farm-mobile {
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
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px !important;
    line-height: 24px !important;
    border-radius: 40px;
    background: var(--orange-gradient);
}

.bridge-link {
    color: var(--link);
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px !important;
    line-height: 24px !important;
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
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px !important;
    line-height: 24px !important;
    min-width: 112px;
}

.account-chip {
    margin-left: 10px;
    background: var(--secondary) !important;
    border-width: 0px !important;
    justify-content: center;
    color: var(--link) !important;
    border-radius: 40px !important;
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px !important;
    line-height: 24px !important;
    min-width: 130px;
}
</style>
