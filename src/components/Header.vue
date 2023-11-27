<template>
    <div class="app-header mr-n3">
        <div class="app-header__container">
            <div :class="$wu.isMobile() ? 'mr-2' : ''">
                <v-btn :class="$wu.isMobile() ? 'mx-n6' : 'mr-2'" class="header-btn-presale btn-filled" @click="goToPresale">
                    PRESALE
                </v-btn>
            </div>

            <div class="theme-toggle-group">
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

            <div class="header__network-wrap">
                <NetworkSelect/>
            </div>

            <div v-if="!$wu.isFull()">
                <MenuSelect/>
            </div>
        </div>

        <InvestModal/>
        <InsuranceInvestModal/>
        <SwapModal/>

        <!-- TODO, remove that in swapmodal -->
        <SwapDaiModal/>
        <SwapUsdtModal/>
        <SwapEthModal/>
        <!-- TODO, remove that -->


        <!-- TODO, remove that in swapmodal -->
        <EthWrapModal/>
        <UsdWrapModal/>
        <!-- TODO, remove that -->
        
        <RedemptionRequestModal/>
        <RedemptionRequestSuccessModal/>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
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
import UsdWrapModal from "@/components/swap/wusd/WrapModal";
import EthWrapModal from "@/components/swap/weth/WrapModal";
import InvestModal from "@/components/market/modal/ets/invest/InvestModal";
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
        InvestModal,
        SwapModal,
        SwapDaiModal,
        SwapUsdtModal,
        SwapEthModal,
        UsdWrapModal,
        EthWrapModal,
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
        }
    }
}
</script>

<style scoped>
.theme-toggle-group {
    margin-left: auto;
    margin-right: 20px;
}
.app-header__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
}

.app-header {
    position: relative;
}

.header__network-wrap {
    margin-left: 24px;
    margin-right: 8px;
}

/* mobile */
@media only screen and (max-width: 960px) {
    .progress {
        width: 150px;
    }

    .app-header__container {
        margin: 0 5%;
    }

    .header-btn, .header-btn-connect {
        width: 148px;
        height: 28px;

        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .header-btn-presale {
        min-width: 55p;
        width: 55px;
        height: 25px;

        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 25px;
        letter-spacing: 0.02em;
    }
    .logo-img {
        width: 28px;
        height: 28px;

        margin-top: 10px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .progress {
        width: 300px;
    }

    .app-header__container {
        margin: 0 3%;
    }

    .header-btn, .header-btn-connect {
        width: 200px;
        height: 36px;

        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .header-btn-presale {
        width: 170px;
        height: 39px;

        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 25px;
        letter-spacing: 0.02em;
    }

    .logo-img {
        width: 48px;
        height: 48px;

        margin-top: 8px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .header__network-wrap {
        margin-right: 0;
        margin-left: 24px;
    }

    .app-header {
        left: 242px;
        width: calc(100% - 242px);
    }
    .progress {
        width: 300px;
    }

    .app-header__container {
        margin: 0 5%;
    }

    .header-btn, .header-btn-connect {
        width: 210px;
        height: 36px;

        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .header-btn-presale {
        width: 178px;
        height: 42px;

        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 25px;
        letter-spacing: 0.02em;
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

    .app-header__container {
        margin: 0 20px;
    }

    .header-btn, .header-btn-connect {
        width: 210px;
        height: 36px;

        font-style: normal;
        font-weight: 400;
        font-size: 15px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }


    .header-btn-presale {
        width: 160px;
        height: 42px;

        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 25px;
        letter-spacing: 0.02em;
    }
}

.progress {
    background: var(--blue-gradient);
}

.header-btn, .header-btn-connect {
    border-radius: 2px;
    box-shadow: none;

    font-family: 'Roboto', sans-serif;
    text-align: center;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
}

.btn-filled {
    background: var(--blue-gradient);
    color: var(--secondary);
}

.logo-img {
    cursor: pointer;
}

.theme-toggle-group {
    background-color: var(--theme-switch-background-light);
    border-radius: 5px;
    border: 1px solid transparent;
    height: 42px;
    display: flex;
    overflow: hidden;
    align-items: center;
    justify-content: center;
}

.theme-toggle-btn, .theme-toggle-btn-selected {
    border: none;
}

.theme-toggle-btn {
    height: 42px;
    background-color: transparent;
}

.theme-toggle-btn-selected {
    background-color: var(--theme-switch-background-light);
}

.v-btn__content .theme-icon {
    color: var(--theme-icon-color);
}

.theme-icon-selected {
    color: var(--theme-icon-color-selected);
}
</style>
