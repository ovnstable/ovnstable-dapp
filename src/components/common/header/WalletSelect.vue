<template >
    <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }" >
            <div
                class="balance-container"
                 v-click-outside="clickMenuOutside"
                 @click="openedList = !openedList"
                 v-bind="attrs"
                 v-on="on"
            >
                <label
                    class="balance-label mr-auto"
                    :class="dataHidden ? 'hidden-label' : ''"
                >
                    {{ selectedItemText }}
                </label>
                <label class="balance-label mr-2">
                    &nbsp;{{ selectedItemLabel }}
                </label>
                <div v-if="!openedList">
                    <svg width="19" height="11" viewBox="0 0 19 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.853968 0.793159C0.34928 1.2642 0.34928 2.02791 0.853968 2.49896L8.72813 9.84817C8.7295 9.84946 8.73087 9.85074 8.73224 9.85203C9.11076 10.2053 9.66566 10.2936 10.1324 10.117C10.2879 10.0581 10.4337 9.96978 10.5599 9.85203C10.5599 9.85202 10.5599 9.85202 10.5599 9.85202L18.4382 2.49896C18.9428 2.02792 18.9428 1.26421 18.4382 0.793169C17.9335 0.322126 17.1152 0.322126 16.6105 0.793169L9.64607 7.29332L2.68161 0.793159C2.17692 0.322117 1.35866 0.322117 0.853968 0.793159Z" fill="#009AFF" fill-opacity="0.92"/>
                    </svg>
                </div>
                <div v-else>
                    <svg width="19" height="10" viewBox="0 0 19 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.378513 9.41214C-0.126171 8.94107 -0.126171 8.1774 0.378513 7.70633L8.25298 0.356842C8.25425 0.355682 8.25552 0.354462 8.25679 0.353302C8.76136 -0.117645 9.57935 -0.117767 10.0841 0.352936C10.0842 0.353058 10.0843 0.35318 10.0844 0.353302C10.0857 0.354462 10.087 0.355682 10.0882 0.356842L17.9627 7.70633C18.4674 8.1774 18.4674 8.94113 17.9627 9.41214C17.458 9.88321 16.6397 9.88321 16.1351 9.41214L9.17057 2.91196L2.20615 9.41214C1.70147 9.88315 0.883205 9.88315 0.378513 9.41214Z" fill="#ADB3BD"/>
                    </svg>
                </div>
            </div>
        </template>
        <v-list class="token-select-list">
            <v-list-item
                style="cursor: pointer"
                @click="selectToken('ethPlus', 'ETH+')"
            >
                <v-list-item-title class="token-select-list-item">
                    <div class="balance-container">
                        <label class="balance-label" :class="dataHidden ? 'hidden-label' : ''">
                            {{ dataHidden ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' : ($utils.formatMoney(account ? balance.ethPlus : 0, 4)) }}
                        </label>
                        <label class="balance-label token-label">
                            &nbsp;ETH+
                        </label>
                    </div>
                </v-list-item-title>
            </v-list-item>
            <v-list-item
                style="cursor: pointer"
                @click="selectToken('usdPlus', 'USD+')"
            >
                <v-list-item-title class="token-select-list-item">
                    <div class="balance-container">
                        <label class="balance-label" :class="dataHidden ? 'hidden-label' : ''">
                            {{ dataHidden ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' : ($utils.formatMoney(account ? balance.usdPlus : 0, 4)) }}
                        </label>
                        <label class="balance-label token-label">
                            &nbsp;USD+
                        </label>
                    </div>
                </v-list-item-title>
            </v-list-item>
            <v-list-item
                style="cursor: pointer"
                @click="selectToken('daiPlus', 'DAI+')"
            >
                <v-list-item-title class="token-select-list-item">
                    <div class="balance-container">
                        <label class="balance-label" :class="dataHidden ? 'hidden-label' : ''">
                            {{ dataHidden ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' : ($utils.formatMoney(account && networkId !== 59144 && networkId !== 324 && networkId !== 56 ? balance.daiPlus : 0, 4)) }}
                        </label>
                        <label class="balance-label token-label">
                            &nbsp;DAI+
                        </label>
                    </div>
                </v-list-item-title>
            </v-list-item>
            <v-list-item
                style="cursor: pointer"
                @click="selectToken('usdtPlus', 'USDT+')"
            >
                <v-list-item-title class="token-select-list-item">
                    <div class="balance-container">
                        <label class="balance-label" :class="dataHidden ? 'hidden-label' : ''">
                            {{ dataHidden ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' : ($utils.formatMoney(account ? balance.usdtPlus : 0, 4)) }}
                        </label>
                        <label class="balance-label token-label">
                            &nbsp;USDT+
                        </label>
                    </div>
                </v-list-item-title>
            </v-list-item>
            <v-list-item
                style="cursor: pointer"
                @click="selectToken('ovn', 'OVN')"
            >
                <v-list-item-title class="token-select-list-item">
                    <div class="balance-container">
                        <label class="balance-label" :class="dataHidden ? 'hidden-label' : ''">
                            {{ dataHidden ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' : ($utils.formatMoney(account ? balance.ovn : 0, 4)) }}
                        </label>
                        <label class="balance-label token-label">
                            &nbsp;OVN
                        </label>
                    </div>
                </v-list-item-title>
            </v-list-item>
        </v-list>

    </v-menu>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "WalletSelect",

    data: () => ({
        openedList: false,
        selectedTokenParam: 'usdPlus',
        selectedItemLabel: 'USD+',
    }),

    computed: {
        ...mapGetters('network', ['networkId']),
        ...mapGetters('deprecated', ['isDeprecatedShow']),
        ...mapGetters('accountData', ['balance', 'account', 'uns']),
        ...mapGetters('walletAction', ['walletConnected']),
        ...mapGetters('magicEye', ['dataHidden']),

        accountDisplay() {
            if (this.uns) {
                return this.uns;
            } else if (this.account) {
                return this.account.substring(0, 3) + '...' + this.account.substring(this.account.length - 4);
            } else {
                return null;
            }
        },

        selectedItemText() {
            return this.dataHidden
                ? ''
                : this.$utils.formatMoney(
                    this.account ? this.balance[this.selectedTokenParam] : 0,
                    4
                );
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
        ...mapActions('deprecated', ['loadDeprecatedShow', 'updateDeprecatedShow']),
        ...mapActions('network', ['setWalletNetwork']),
        ...mapActions('walletAction', ['connectWallet']),
        ...mapActions('accountUI', ['showAccountProfile', 'showTxHistory']),
        ...mapActions('accountData', ['refreshBalance']),
        ...mapActions('track', ['trackClick']),
        ...mapActions('magicEye', ['switchEye']),

        selectToken(tokenParam, tokenLabel) {
            this.selectedTokenParam = tokenParam;
            this.selectedItemLabel = tokenLabel;
            this.openedList = false;
        },

        clickMenuOutside() {
            this.openedList = false;
        },

        toggleDeprecatedType() {
            console.log('toggleDeprecatedType', this.isDeprecatedShow)
            this.updateDeprecatedShow(!this.isDeprecatedShow)
        },

        walletClickAction() {
            if (this.account) {
                this.showAccountProfile();
                // this.trackClick({action: 'show-wallet-action-click', event_category: 'Account', event_label: 'Show account', value: 1 });
            } else {
                this.connectWallet();
                // this.trackClick({action: 'connect-wallet-action-click', event_category: 'Account', event_label: 'Connect wallet', value: 1 });
            }
        },
    }
}
</script>

<style scoped>
.balance-container {
    padding-right: 5px;
    cursor: pointer;
    transition: opacity .2s ease;
}

.balance-container:hover {
    opacity: .6;
}

@media only screen and (max-width: 960px) {
    .balance-container {
        height: 28px !important;
        width: 198px;
    }
}

@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .balance-container {
        height: 28px !important;
        width: 198px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .balance-container {
        height: 30px !important;
        width: 198px;
    }
}

.token-select-list {
    background-color: var(--secondary) !important;
    border-radius: 4px;
    width: 218px !important;
}

.token-select-list-item {
    color: var(--secondary-gray-text) !important;
    font-weight: 600;
    font-size: 17px;
    margin-left: -5px;
}

.balance-container {
    display: flex;
    background-color: var(--card-coin-background);
    border-radius: 4px;

    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}

.balance-label {
    font-weight: 400;
    letter-spacing: 0.2px;
    line-height: 20px;
    text-align: left;
    color: var(--main-gray-text);
    margin-left: 5px;
}

.balance-label.hidden-label {
    margin-left: 0;
}

.token-label {
    padding-right: 10px;
}

.hidden-label {
    width: 85px;
    height: 28px;
    border-radius: 4px 0 0 4px;
    background: var(--hide-account);
}
</style>
