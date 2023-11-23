<template>
    <v-app-bar
            class="app-bar mr-n3"
            app>
        <v-row class="ma-0 header-container fill-height" align="center">
<!--            <div class="">
                <img v-if="!$wu.isFull()" class="ml-n3 logo-img" :src="require('@/assets/logo.svg')"  @click="openLinkToLanding('https://overnight.fi/')">
            </div>-->

            <div :class="$wu.isMobile() ? 'mr-2' : ''">
                <v-btn :class="$wu.isMobile() ? 'mx-n6' : 'mr-2'" class="header-btn-presale btn-filled" @click="goToPresale">
                    PRESALE
                </v-btn>
            </div>

            <v-spacer></v-spacer>
            <div class="theme-toggle-group" :class="$wu.isMobile() ? 'mr-5' : ' mt-1 mr-10'">
                <v-btn outlined :class="light ? 'theme-toggle-btn-selected' : 'theme-toggle-btn'" icon @click="toggleTheme">
                    <v-icon class="theme-icon">
                        {{ light ? 'mdi-white-balance-sunny' : 'mdi-moon-waxing-crescent' }}
                    </v-icon>
                </v-btn>
            </div>

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
                    <v-btn :class="$wu.isMobile() ? 'mt-1 mr-1' : 'mr-2 mt-1'" class="header-btn-connect btn-filled" @click="connectWallet">
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

            <div class="" :class="$wu.isMobile() ? 'mr-auto' : 'ml-10'">
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
        <SwapEthModal/>
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
import SwapEthModal from "@/components/swap/eth/SwapEthModal";
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
        SwapEthModal,
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
        ...mapGetters('theme', ['light']),
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
        ...mapActions('track', ['trackClick']),
        ...mapActions('theme', ['switchTheme']),

        switchToNetwork() {
            this.setWalletNetwork(this.networkId.toString());
            // this.trackClick({action: 'switch_network', event_category: 'Chain Switch', event_label: 'Switch network', value: 1 });
        },

        openLink(url) {
            window.open(url, '_blank').focus();
        },

        openLinkToLanding(url) {
            window.open(url, '_self').focus();
        },

        goToPresale() {
            try {
                this.trackClick({action: 'presale_header_button', event_category: 'Button click', event_label: 'Click presale header button' });
            } catch (e) {
                console.error("Track error:", e);
            }

            this.$router.push('/presale');
        },

        toggleTheme() {
            this.switchTheme();
            this.light = !this.light;
        }
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

    .header-btn-presale {
        min-width: 55px!important;
        width: 55px !important;
        height: 25px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 12px !important;
        line-height: 25px !important;
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

    .header-btn-presale {
        width: 170px !important;
        height: 39px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 25px !important;
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

    .header-btn-presale {
        width: 178px !important;
        height: 42px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 18px !important;
        line-height: 25px !important;
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


    .header-btn-presale {
        width: 160px !important;
        height: 42px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 25px !important;
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

.theme-toggle-group {
    background-color: var(--theme-switch-background-light) !important;
    border-radius: 5px !important;
    border: 1px solid transparent;

    display: flex;
    align-items: center;
    justify-content: center;
}

.theme-toggle-btn, .theme-toggle-btn-selected {
    border: none !important;
}

.theme-toggle-btn {
    background-color: transparent !important;
}

.theme-toggle-btn-selected {
    background-color: var(--theme-switch-background-light) !important;
}

.theme-icon {
    color: var(--theme-icon-color) !important;
}

.theme-icon-selected {
    color: var(--theme-icon-color-selected) !important;
}
</style>
