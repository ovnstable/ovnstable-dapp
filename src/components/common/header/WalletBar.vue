<template>
    <v-badge dot
             :color="(promoLogins && promoChecked && (promoChecked === '0')) ? '#CF3F92' : '#FFFFFF'"
             offset-x="-1"
             offset-y="2">
        <div class="wallet-bar-main-container mt-1">
            <v-row align="center" class="wallet-bar-container" @click="walletClickAction">
                <v-col cols="1" class="wallet-col mr-4">
                    <div class="wallet-icon">
                        <v-img :src="require('@/assets/icon/undefined.svg')"/>
                    </div>
                </v-col>
                <v-col cols="5" class="wallet-col" v-if="!$wu.isMobile()">
                    <label class="balance-label">
                        {{ $utils.formatMoney(account ? balance.usdPlus : 0, 2) }}&nbsp;USD+
                    </label>
                </v-col>
                <v-col :cols="$wu.isMobile() ? 0 : 4" class="wallet-col" :class="$wu.isMobile() ? 'mr-4' : ''">
                    <v-row class="account-display-container" align="center" justify="center">
                        <label class="account-label">
                            {{ account ? accountDisplay : 'XXXXX...XXXX' }}
                        </label>
                    </v-row>
                </v-col>
                <v-col cols="1" class="wallet-col" v-if="!$wu.isMobile()">
                    <v-icon class="eye-icon">mdi-eye-outline</v-icon>
                </v-col>
            </v-row>
        </div>

        <resize-observer @notify="$forceUpdate()"/>
    </v-badge>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "WalletBar",

    components: {
    },

    data: () => ({
        get promoLogins() {
            return localStorage.getItem('promoLogins');
        },

        set promoLogins(value) {
            localStorage.setItem('promoLogins', value);
        },

        get promoChecked() {
            return localStorage.getItem('promoChecked');
        },

        set promoChecked(value) {
            localStorage.setItem('promoChecked', value);
        }
    }),

    computed: {
        ...mapGetters('accountData', ['balance', 'account', 'uns']),
        ...mapGetters('web3', ['web3',  'networkId', 'walletConnected']),

        accountDisplay: function () {
            if (this.uns) {
                return this.uns;
            } else if (this.account) {
                return this.account.substring(0, 5) + '...' + this.account.substring(this.account.length - 4);
            } else {
                return null;
            }
        },
    },

    created() {
        window.setInterval(() => {
            this.refreshBalance();
            this.refreshSupply();
        }, 5000)
    },

    methods: {

        ...mapActions('web3', ['connectWallet', 'disconnectWallet', 'switchAccount', 'addUsdPlusToken', 'addwUsdPlusToken']),
        ...mapActions('accountUI', ['showAccountProfile']),
        ...mapActions('accountData', ['refreshBalance']),
        ...mapActions('supplyData', ['refreshSupply']),

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
                if (localStorage.getItem('promoLogins')) {
                    localStorage.setItem('promoChecked', "1");
                }
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
}

.wallet-bar-container {
    background-color: white !important;
    border-radius: 2px;
    cursor: pointer;
}

.balance-label, .account-label {
    font-family: 'Roboto', sans-serif;
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
}
</style>
