<template>
    <v-app-bar
            class="app-bar"
            app>
        <v-row class="ma-0 header-container fill-height" align="center">
            <v-col cols="1" class="fill-height" v-if="!$wu.isFull()">
                <v-row justify="start" align="center" class="ml-n7 mt-0 fill-height">
                    <img class="logo-img" :src="require('@/assets/logo.svg')" @click="openLink('https://market.overnight.fi/')">
                </v-row>
            </v-col>

            <v-col cols="5" class="fill-height">
                <v-row justify="start" align="center" class="mt-0 fill-height">
                    <WalletBar v-if="($wu.isMobile() && walletConnected && !switchToOtherNetwork) || !$wu.isMobile()"/>
                </v-row>
            </v-col>

            <v-col :cols="$wu.isFull() ? 6 : ($wu.isMobile() ? 3 : 4)" class="fill-height">
                <v-row justify="end" align="center" class="mt-0 fill-height">
                    <template v-if="!loadingWeb3">
                        <template v-if="walletConnected">
                            <v-btn v-if="switchToOtherNetwork" :class="$wu.isMobile() ? 'mr-2' : ''" class="header-btn btn-filled" v-on:click="switchToNetwork">
                                Switch to {{ networkName }}
                            </v-btn>

                            <template v-else>
                                <v-btn class="header-btn btn-filled" :class="showWrap ? 'mr-5' : 'mr-2'" @click="mintAction" v-if="$wu.isFull()">
                                    Mint USD+
                                </v-btn>
                                <v-btn class="header-btn btn-outlined mr-2" outlined @click="wrapAction" v-if="showWrap && $wu.isFull()">
                                    Wrap USD+
                                </v-btn>
                            </template>
                        </template>

                        <template v-else>
                            <v-btn class="header-btn-connect btn-filled mr-2" @click="connectWallet">
                                Connect wallet
                            </v-btn>
                        </template>
                    </template>
                    <template v-else>
                        <v-progress-linear
                                dark
                                class="progress mt-1 mr-2"
                                background-opacity="0"
                                color="var(--main-background)"
                                indeterminate
                        ></v-progress-linear>
                    </template>
                </v-row>
            </v-col>

            <v-col :cols="$wu.isMobile() ? 2 : 1" class="fill-height">
                <v-row justify="end" align="center" class="mt-0 fill-height">
                    <NetworkSelect/>
                </v-row>
            </v-col>

            <v-col v-if="!$wu.isFull()" cols="1" class="fill-height">
                <v-row justify="end" align="center" class="mt-0 fill-height">
                    <MenuSelect/>
                </v-row>
            </v-col>
        </v-row>

        <InvestModalWmatic v-if="showUsdPlusWmatic"/>
        <InvestModalWbnb v-if="showUsdPlusWbnb"/>
        <InvestModalBusdWbnb v-if="showBusdWbnb"/>

        <SwapModal/>
        <WrapModal/>

        <resize-observer @notify="$forceUpdate()"/>
    </v-app-bar>
</template>
<script>

import {mapActions, mapGetters, mapMutations} from "vuex";
import Logo from "./common/header/Logo";
import WalletBar from "@/components/common/header/WalletBar";
import NetworkSelect from "@/components/common/header/NetworkSelect";
import MenuSelect from "@/components/common/header/MenuSelect";
import SwapModal from "@/components/swap/SwapModal";
import InvestModalWmatic from "@/components/market/modal/wmatic/invest/InvestModal";
import InvestModalWbnb from "@/components/market/modal/wbnb/invest/InvestModal";
import InvestModalBusdWbnb from "@/components/market/modal/busdWbnb/invest/InvestModal";
import WrapModal from "@/components/wrap/WrapModal";

export default {
    name: 'Header',

    components: {
        WrapModal,
        InvestModalWmatic,
        InvestModalWbnb,
        InvestModalBusdWbnb,
        SwapModal,
        MenuSelect,
        NetworkSelect,
        WalletBar,
        Logo,
    },

    data: () => ({
    }),


    computed: {
        ...mapGetters('network', ['networkName', 'networkId']),
        ...mapGetters('web3', [ 'web3', 'switchToOtherNetwork', 'loadingWeb3', 'walletConnected']),
        ...mapGetters('accountData', ['account']),
        ...mapGetters('wrapUI', ['showWrap']),
        ...mapGetters('marketUI', ['showUsdPlusWbnb', 'showUsdPlusWmatic', 'showBusdWbnb']),
    },

    methods: {
        ...mapActions('web3', ['connectWallet', 'setNetwork']),
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
        ...mapActions('wrapModal', ['showWrapModal', 'showWrapView']),

        switchToNetwork() {
            this.setNetwork(this.networkId.toString());
        },

        openLink(url) {
            window.open(url, '_blank').focus();
        },

        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },

        wrapAction() {
            this.showWrapView();
            this.showWrapModal();
        },
    }
}
</script>

<style scoped>
/* mobile */
@media only screen and (max-width: 960px) {
    .header-container {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }

    .header-btn, .header-btn-connect {
        width: 148px !important;
        height: 28px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .app-bar {
        height: 60px !important;
    }

    .logo-img {
        width: 28px !important;
        height: 28px !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .progress {
        width: 300px;
    }

    .header-container {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }

    .header-btn, .header-btn-connect {
        width: 200px !important;
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .app-bar {
        height: 72px !important;
    }

    .logo-img {
        width: 48px !important;
        height: 48px !important;

        margin-top: -6px !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .progress {
        width: 300px;
    }

    .header-container {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .header-btn, .header-btn-connect {
        width: 200px !important;
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .app-bar {
        height: 72px !important;
    }
}

.progress {
    background: var(--blue-gradient);
}

.app-bar {
    box-shadow: none !important;
    background-color: var(--main-background) !important;
    border-bottom: 1px solid #CED2D8 !important;
}

.header-btn, .header-btn-connect {
    border-radius: 2px;
    box-shadow: none !important;

    font-family: 'Roboto', sans-serif !important;
    text-align: center !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.btn-filled {
    background: var(--blue-gradient);
    color: #FFFFFF !important;
}

.btn-outlined {
    color: #1C95E7 !important;
}

.logo-img {
    cursor: pointer;
}
</style>
