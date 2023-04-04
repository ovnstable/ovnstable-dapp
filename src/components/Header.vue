<template>
    <v-app-bar
            class="app-bar mr-n3"
            app>
        <v-row class="ma-0 header-container fill-height" align="center">
            <div class="">
                <img v-if="!$wu.isFull()" class="ml-n3 logo-img" :src="require('@/assets/logo.svg')" @click="openLink('https://market.overnight.fi/')">
            </div>

            <v-spacer></v-spacer>

            <template v-if="!loadingWeb3">
                <template v-if="walletConnected">
                    <v-btn v-if="switchToOtherNetwork" :class="$wu.isMobile() ? 'mr-2' : ''" class="header-btn btn-filled mt-1" v-on:click="switchToNetwork">
                        Switch to {{ networkName }}
                    </v-btn>

                    <template v-else>
                        <WalletBar v-if="($wu.isMobile() && walletConnected && !switchToOtherNetwork) || !$wu.isMobile()"/>
                    </template>
                </template>

                <template v-else>
                    <v-btn class="header-btn-connect btn-filled mr-2 mt-1" @click="connectWallet">
                        Connect wallet
                    </v-btn>
                </template>
            </template>
            <template v-else>
                <v-progress-linear
                    dark
                    class="progress mt-1 mr-2"
                    background-opacity="0"
                    color="#F5F5F5"
                    indeterminate
                ></v-progress-linear>
            </template>

            <div class="ml-10">
                <NetworkSelect/>
            </div>

            <div v-if="!$wu.isFull()">
                <MenuSelect/>
            </div>
        </v-row>

        <InvestModal/>
        <InsuranceInvestModal/>
        <SwapModal/>
        <SwapDaiModal/>
        <SwapUsdtModal/>
        <WrapModal/>
        <RedemptionRequestModal/>
        <RedemptionRequestSuccessModal/>

        <resize-observer @notify="$forceUpdate()"/>
    </v-app-bar>
</template>
<script>

import {mapActions, mapGetters} from "vuex";
import WalletBar from "@/components/common/header/WalletBar";
import NetworkSelect from "@/components/common/header/NetworkSelect";
import MenuSelect from "@/components/common/header/MenuSelect";
import SwapModal from "@/components/swap/SwapModal";
import SwapDaiModal from "@/components/swap/dai/SwapDaiModal";
import SwapUsdtModal from "@/components/swap/usdt/SwapUsdtModal";
import InvestModal from "@/components/market/modal/ets/invest/InvestModal";
import WrapModal from "@/components/wrap/WrapModal";
import RedemptionRequestModal from "@/components/insurance/modal/action/redemption-request/RedemptionRequestModal";
import RedemptionRequestSuccessModal
    from "@/components/insurance/modal/action/redemption-request/RedemptionRequestSuccessModal";
import InsuranceInvestModal from "@/components/insurance/modal/action/invest/InsuranceInvestModal";

export default {
    name: 'Header',

    components: {
        InsuranceInvestModal,
        RedemptionRequestSuccessModal,
        RedemptionRequestModal,
        WrapModal,
        InvestModal,
        SwapModal,
        SwapDaiModal,
        SwapUsdtModal,
        MenuSelect,
        NetworkSelect,
        WalletBar,
    },

    data: () => ({
    }),

    computed: {
        ...mapGetters('network', ['networkName', 'networkId', 'switchToOtherNetwork']),
        ...mapGetters('web3', ['loadingWeb3']),
        ...mapGetters('walletAction', ['walletConnected']),
        ...mapGetters('accountData', ['account']),
        ...mapActions('track', ['trackClick']),
    },

    watch: {
        networkId: function (newValue, oldValue) {
            if (newValue) {
                this.loadTransaction();
            }
        },
    },

    methods: {
        ...mapActions('walletAction', ['connectWallet']),
        ...mapActions('network', ['setWalletNetwork']),
        ...mapActions('transaction', ['loadTransaction']),

        switchToNetwork() {
            this.setWalletNetwork(this.networkId.toString());
            this.trackClick({action: 'switch_network', event_category: 'Chain Switch', event_label: 'Switch network', value: 1 });
        },

        openLink(url) {
            window.open(url, '_blank').focus();
        },
    }
}
</script>

<style scoped>
/* mobile */
@media only screen and (max-width: 960px) {
    .progress {
        width: 150px;
    }

    .header-container {
        margin-left: 5% !important;
        margin-right: 5% !important;
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

        margin-top: 10px !important;
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

        margin-top: 8px !important;
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
        width: 210px !important;
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

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .progress {
        width: 300px;
    }

    .header-container {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .header-btn, .header-btn-connect {
        width: 210px !important;
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 15px !important;
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
    color: var(--secondary) !important;
}

.logo-img {
    cursor: pointer;
}
</style>
