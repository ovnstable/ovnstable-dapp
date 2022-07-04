<template>
    <v-app-bar
            class="app-bar"
            app>
        <v-row class="header-container fill-height" align="center">
            <v-col cols="5" class="fill-height">
                <v-row justify="start" align="center" class="mt-0 fill-height">
                    <WalletBar/>
                </v-row>
            </v-col>

            <v-col cols="6" class="fill-height">
                <v-row justify="end" align="center" class="mt-0 fill-height">
                    <template v-if="!loadingWeb3">
                            <template v-if="walletConnected">
                                <v-btn v-if="switchToPolygon" class="header-btn btn-filled" v-on:click="goToPolygon">
                                    Switch to {{ networkName }}
                                </v-btn>

                                <template v-else>
                                    <v-btn class="header-btn btn-outlined mr-5" outlined @click="openLink('https://app.overnight.fi/wrap')">
                                        Wrap / unwrap
                                    </v-btn>
                                    <v-btn class="header-btn btn-filled" @click="openLink('https://app.overnight.fi/')">
                                        Mint / redeem
                                    </v-btn>
                                </template>
                            </template>

                            <template v-else>
                                <v-btn class="header-btn btn-filled" @click="connectWallet">
                                    Connect wallet
                                </v-btn>
                            </template>
                    </template>
                    <template v-else>
                        <v-progress-linear
                                dark
                                class="progress mt-1"
                                background-opacity="0"
                                color="var(--main-background)"
                                indeterminate
                        ></v-progress-linear>
                    </template>
                </v-row>
            </v-col>

            <v-col cols="1" class="fill-height">
                <v-row justify="end" align="center" class="mt-0 fill-height">
                    <NetworkSelect />
                </v-row>
            </v-col>
        </v-row>
    </v-app-bar>
</template>
<script>

import {mapActions, mapGetters, mapMutations} from "vuex";
import SwitchToPolygon from "./common/header/SwitchToPolygon";
import AccountBar from "./common/header/AccountBar";
import Logo from "./common/header/Logo";
import Menu from "./common/header/Menu";
import WalletBar from "@/components/common/header/WalletBar";
import NetworkSelect from "@/components/common/header/NetworkSelect";

export default {
    name: 'Header',

    components: {
        NetworkSelect,
        WalletBar,
        Menu,
        Logo,
        AccountBar,
        SwitchToPolygon
    },

    data: () => ({
    }),


    computed: {
        ...mapGetters('web3', [ 'web3',  'networkId', 'switchToPolygon', 'loadingWeb3', 'walletConnected']),
        ...mapGetters('accountData', ['account']),

        networkName() {
            return this.capitalize(process.env.VUE_APP_POLYGON);
        },
    },

    methods: {
        ...mapActions('web3', ['connectWallet', 'disconnectWallet', 'setNetwork']),

        capitalize(s) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        },

        goToPolygon() {
            this.setNetwork(process.env.VUE_APP_NETWORK_ID);
        },

        openLink(url) {
            window.open(url, '_blank').focus();
        },
    }
}
</script>

<style>

/* mobile */
@media only screen and (max-width: 1400px) {
}

@media only screen and (min-width: 1400px) {
    .progress {
        width: 300px;
    }
}

.progress {
    background: var(--blue-gradient);
}

.app-bar {
    height: 72px !important;
    box-shadow: none !important;
    background-color: var(--main-background) !important;
    border-bottom: 1px solid #CED2D8 !important;
}

.header-container {
    margin-left: 5%;
    margin-right: 5%;
}

.header-btn {
    width: 200px;
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

.btn-filled {
    background: var(--blue-gradient);
    color: #FFFFFF !important;
}

.btn-outlined {
    color: #1C95E7 !important;
}
</style>
