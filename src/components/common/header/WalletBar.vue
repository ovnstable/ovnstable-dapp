<template>
    <div class="wallet-bar-main-container mt-1">
        <v-row align="center" class="wallet-bar-container" @click="walletClickAction">
            <v-col cols="1" class="wallet-col">
                <div class="wallet-icon">
                    <v-img :src="require('@/assets/icon/undefined.svg')"/>
                </div>
            </v-col>
            <v-col cols="5" class="wallet-col ml-4">
                <label class="balance-label">
                    {{ $utils.formatMoney(account ? balance.usdPlus : 0, 2) }}&nbsp;USD+
                </label>
            </v-col>
            <v-col cols="4" class="wallet-col">
                <v-row class="account-display-container" align="center" justify="center">
                    <label class="account-label">
                        {{ account ? accountDisplay : 'XXXXX...XXXX' }}
                    </label>
                </v-row>
            </v-col>
            <v-col cols="1" class="wallet-col">
                <v-icon class="eye-icon">mdi-eye-outline</v-icon>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "WalletBar",

    components: {
    },

    computed: {
        ...mapGetters('accountData', ['balance', 'account', 'uns']),
        ...mapGetters('web3', ['web3',  'networkId', 'walletConnected']),
        ...mapGetters('farmUI', ['showFarm']),

        accountDisplay: function () {
            if (this.uns) {
                return this.uns;
            } else if (this.account) {
                return this.account.substring(0, 5) + '...' + this.account.substring(this.account.length - 4);
            } else {
                return null;
            }
        },

        isMobile() {
            return window.innerWidth <= 1400;
        }
    },

    created() {
        window.setInterval(() => {
            this.refreshBalance();
        }, 5000)
    },

    methods: {

        ...mapActions('web3', ['connectWallet', 'disconnectWallet', 'switchAccount', 'addUsdPlusToken', 'addwUsdPlusToken']),
        ...mapActions('accountUI', ['showAccountProfile']),
        ...mapActions('accountData', ['refreshBalance']),

        disconnectWalletAction() {
            this.disconnectWallet();
        },

        switchAccountAction() {
            this.switchAccount();
        },

        connectWalletAction() {
            this.connectWallet();
        },

        goToAction(id) {
            this.$router.push(id);
        },

        walletClickAction() {
            if (this.account) {
                this.showAccountProfile();
            } else {
                this.connectWallet();
            }
        }
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {

}

@media only screen and (min-width: 1400px) {

}

.wallet-bar-main-container {
    width: 365px !important;
}

.wallet-bar-container {
    background-color: white !important;
    border-radius: 2px;
    height: 48px !important;
    cursor: pointer;
}

.wallet-icon {
    width: 28px;
    height: 28px;
}

.wallet-col {
    margin-top: -2px;
}

.balance-label, .account-label {
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

.wallet-bar-container:hover > .wallet-col > .eye-icon {
    color: #1C95E7;
}

.account-display-container {
    background: #F5F5F5;
    border-radius: 4px;
    height: 28px !important;
}
</style>
