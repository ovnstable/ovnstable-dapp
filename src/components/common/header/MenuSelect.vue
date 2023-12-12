<template>
    <v-menu transition="slide-x-reverse-transition" :close-on-content-click="closeOnContentClick">
        <template v-slot:activator="{ on, attrs }">
            <div class="select-bar-main-container"
                 v-bind="attrs"
                 v-on="on">
                 <img
                    :src="light ? require('@/assets/icon/burger_black.svg') : require('@/assets/icon/burger_white.svg')"
                    alt="Burger Icon"
                    class="burger"
                />
            </div>
        </template>
        <div class="main-container">
            <div
                id="click_menu_swap_mobile"
                @click="swapOdosClick" :class="selectedTab === 'swap-odos' ? 'selected-page-item' : ''"
                class="stroke-item pa-2"
            >
                <div class="navbar-page-link mr-2">
                   <img 
                        :src="require('@/assets/icon/menu/swap_menu.svg')"     
                   >
                </div>
                <div
                    :class="selectedTab === 'swap-odos' ? 'selected-page' : ''"
                    class="navbar-page-label"
                >
                    SWAP
                </div>
            </div>

            <div
                id="click_menu_bridge_mobile"
                @click="bridgeClick()" :class="selectedTab === 'bridge' ? 'selected-page-item' : ''"
                class="stroke-item pa-2"
            >
                <div class="navbar-page-link mr-2">
                    <img
                        :src="require('@/assets/icon/menu/shuffle-variant.svg')"
                         class="navbar-page-link"
                    >
                </div>
                <div
                    :class="selectedTab === 'bridge' ? 'selected-page' : ''"
                    class="navbar-page-label"
                >
                    BRIDGE
                </div>
            </div>
            <div>
                <div class="navbar-list-divider"></div>
                <label class="navbar-list-header mx-2">
                    Money Markets
                </label>

                <div @click="toggleUsdPlus(!isShowUsd)">
                    <div class="stroke-item pa-2">
                        <div class="navbar-page-link mr-2">
                            <img
                            :src="light ? (isShowUsd ? require('@/assets/icon/menu/usdPlusWhite.svg') : require('@/assets/icon/menu/usdPlusWhiteOff.svg')) : (isShowUsd ? require('@/assets/icon/menu/usdPlusBlack.svg') : require('@/assets/icon/menu/usdPlusWhiteOff.svg'))"
                            >
                        </div>
                        <div
                            class="navbar-page-label"
                            :class="selectedTab.startsWith('usdplus_') ? 'selected-page' : ''"
                        >
                            USD+
                        </div>
                        <div class="ml-3">
                            <img
                            class="arrow"
                            :src="light ? (isShowUsd ? require('@/assets/icon/down_black.svg') : require('@/assets/icon/right_black.svg')) : (isShowUsd ? require('@/assets/icon/down_w.svg') : require('@/assets/icon/right_w.svg'))"
                            alt="right icon"
                        />
                        </div>
                    </div>
                    <div
                        @click="statsClick"
                        :class="selectedTab === 'usdplus_performance' ? 'selected-page-item' : ''"
                        v-if="isShowUsd"
                    >
                        <div
                            class="navbar-list-label pa-2 pl-11"
                            :class="selectedTab === 'usdplus_performance' ? 'selected-page' : ''"
                        >
                            Performance
                        </div>
                    </div>

                    <div
                        @click="collateralClick"
                        :class="selectedTab === 'usdplus_collateral' ? 'selected-page-item' : ''"
                        v-if="isShowUsd"
                    >
                        <div
                            class="navbar-list-label pa-2 pl-11"
                            :class="selectedTab === 'usdplus_collateral' ? 'selected-page' : ''"
                        >
                            Collateral
                        </div>
                    </div>
                </div>

                <div @click="toggleDaiPlus(!isShowDai)">
                    <div class="stroke-item pa-2">
                        <div class="navbar-page-link mr-2">
                            <img
                            :src="light ? (isShowDai ? require('@/assets/icon/menu/daiPlusWhite.svg') : require('@/assets/icon/menu/daiPlusWhiteOff.svg')) : (isShowDai ? require('@/assets/icon/menu/daiPlusBlack.svg') : require('@/assets/icon/menu/daiPlusWhiteOff.svg'))"
                            >   
                        </div>
                        <div
                            class="navbar-page-label"
                            :class="selectedTab.startsWith('daiplus_') ? 'selected-page' : ''"
                        >
                            DAI+
                        </div>
                        <div class="ml-4">
                            <img
                            class="arrow"
                            :src="light ? (isShowDai ? require('@/assets/icon/down_black.svg') : require('@/assets/icon/right_black.svg')) : (isShowDai ? require('@/assets/icon/down_w.svg') : require('@/assets/icon/right_w.svg'))"
                            alt="right icon"
                        />
                        </div>

                    </div>

                    <div
                        @click="daiStatsClick"
                        :class="selectedTab === 'daiplus_performance' ? 'selected-page-item' : ''"
                        v-if="isShowDai"
                    >
                        <div
                            class="navbar-list-label pa-2 pl-11"
                            :class="selectedTab === 'daiplus_performance' ? 'selected-page' : ''"
                        >
                            Performance
                        </div>
                    </div>

                    <div
                        @click="daiCollateralClick"
                        :class="selectedTab === 'daiplus_collateral' ? 'selected-page-item' : ''"
                        v-if="isShowDai"
                    >
                        <div
                            class="navbar-list-label pa-2 pl-11"
                            :class="selectedTab === 'daiplus_collateral' ? 'selected-page' : ''"
                        >
                            Collateral
                        </div>
                    </div>
                </div>

                <div @click="toggleUsdtPlus(!isShowUsdt)">
                    <div class="stroke-item pa-2">
                        <div class="navbar-page-link mr-2">
                            <img
                            :src="light ? (isShowUsdt ? require('@/assets/icon/menu/usdtPlusWhite.svg') : require('@/assets/icon/menu/usdtPlusWhiteOff.svg')) : (isShowUsdt ? require('@/assets/icon/menu/usdtPlusBlack.svg') : require('@/assets/icon/menu/usdtPlusWhiteOff.svg'))"
                            >  
                        </div>
                        <div
                            class="navbar-page-label"
                            :class="selectedTab.startsWith('usdtplus_') ? 'selected-page' : ''"
                        >
                            USDT+
                        </div>
                        <div class="ml-1">
                            <img
                            class="arrow"
                            :src="light ? (isShowUsdt ? require('@/assets/icon/down_black.svg') : require('@/assets/icon/right_black.svg')) : (isShowUsdt ? require('@/assets/icon/down_w.svg') : require('@/assets/icon/right_w.svg'))"
                            alt="right icon"
                        />
                        </div>
                    </div>

                    <div
                        @click="usdtStatsClick"
                        :class="selectedTab === 'usdtplus_performance' ? 'selected-page-item' : ''"
                        v-if="isShowUsdt"
                    >
                        <div
                            class="navbar-list-label pa-2 pl-11"
                            :class="selectedTab === 'usdtplus_performance' ? 'selected-page' : ''"
                        >
                            Performance
                        </div>
                    </div>

                    <div
                        @click="usdtCollateralClick"
                        :class="selectedTab === 'usdtplus_collateral' ? 'selected-page-item' : ''"
                        v-if="isShowUsdt"
                    >
                        <div
                            class="navbar-list-label pa-2 pl-11"
                            :class="selectedTab === 'usdtplus_collateral' ? 'selected-page' : ''"
                        >
                            Collateral
                        </div>
                    </div>
                </div>

                <div @click="toggleEthPlus(!isShowEth)">
                    <div class="stroke-item pa-2">
                        <div class="navbar-page-link mr-2">
                            <img
                            :src="light ? (isShowEth ? require('@/assets/icon/menu/ethPlusWhite.svg') : require('@/assets/icon/menu/ethPlusWhiteOff.svg')) : (isShowEth ? require('@/assets/icon/menu/ethPlusBlack.svg') : require('@/assets/icon/menu/ethPlusWhiteOff.svg'))"
                            >                  
                        </div>
                        <div
                            class="navbar-page-label"
                            :class="selectedTab.startsWith('ethplus_') ? 'selected-page' : ''"
                        >
                            ETH+
                        </div>
                        <div class="ml-3">
                            <img
                            class="arrow"
                            :src="light ? (isShowEth ? require('@/assets/icon/down_black.svg') : require('@/assets/icon/right_black.svg')) : (isShowEth ? require('@/assets/icon/down_w.svg') : require('@/assets/icon/right_w.svg'))"
                            alt="right icon"
                        />
                        </div>
                    </div>

                    <div
                        @click="ethStatsClick"
                        :class="selectedTab === 'ethplus_performance' ? 'selected-page-item' : ''"
                        v-if="isShowEth"
                    >
                        <div
                            class="navbar-list-label pa-2 pl-11"
                            :class="selectedTab === 'ethplus_performance' ? 'selected-page' : ''"
                        >
                            Performance
                        </div>
                    </div>

                    <div
                        @click="ethCollateralClick"
                        :class="selectedTab === 'ethplus_collateral' ? 'selected-page-item' : ''"
                        v-if="isShowEth"
                    >
                        <div
                            class="navbar-list-label pa-2 pl-11"
                            :class="selectedTab === 'ethplus_collateral' ? 'selected-page' : ''"
                        >
                            Collateral
                        </div>
                    </div>
                </div>

                <div class="navbar-list-divider "></div>
                <label class="navbar-list-header mx-2">
                    Yield Farming
                </label>

                <div
                    @click="featuredClick"
                    :class="selectedTab === 'featured' ? 'selected-page-item' : ''"
                    class="stroke-item pa-2"
                >
                    <div class="navbar-page-link mr-2">
                        <img
                            :src="require('@/assets/icon/menu/featuresMenu.svg')"
                        >
                    </div>
                    <div
                        class="navbar-page-label"
                        :class="selectedTab === 'featured' ? 'selected-page' : ''"
                    >
                        FEATURED
                    </div>
                </div>
                <div
                    @click="usdPlusPoolsClick"
                    :class="selectedTab === 'pools' ? 'selected-page-item' : ''"
                    class="stroke-item pa-2"
                >
                    <div class="navbar-page-link mr-2">
                        <img
                            :src="require('@/assets/icon/menu/allPoolsMenu.svg')"
                        >
                    </div>
                    <div
                        :class="selectedTab === 'pools' ? 'selected-page' : ''"
                        class="navbar-page-label"
                    >
                        ALL POOLS
                    </div>
                </div>

                <div class="navbar-list-divider "></div>
                <label class="navbar-list-header mx-2">
                    OVN TOKEN
                </label>

                <div
                    @click="provideLpClick"
                    :class="selectedTab === 'provide-lp' ? 'selected-page-item' : ''"
                    class="stroke-item pa-2"
                >
                    <div class="navbar-page-link mr-2">
                        <img :src="require('@/assets/icon/menu/provide-lp.svg')"
                             class="navbar-page-link">
                    </div>
                    <div
                        :class="selectedTab === 'provide-lp' ? 'selected-page' : ''"
                        class="navbar-page-label"
                    >
                            PROVIDE LP
                    </div>
                </div>

                <div @click="toggleInsurance(!isShowInsurance)">
                    <div class="stroke-item pa-2">
                        <div class="navbar-page-link mr-2">
                            <img
                            :src="light ? (isShowInsurance ? require('@/assets/icon/menu/insPlusWhite.svg') : require('@/assets/icon/menu/insPlusWhiteOff.svg')) : (isShowInsurance ? require('@/assets/icon/menu/insPlusBlack.svg') : require('@/assets/icon/menu/insPlusWhiteOff.svg'))"
                            >
                        </div>
                        <div
                            class="navbar-page-label"
                            :class="selectedTab.startsWith('insurance_') ? 'selected-page' : ''"
                        >
                            Insurance
                        </div>
                        <div class="ml-2">
                            <img
                            class="arrow"
                            :src="light ? (isShowInsurance ? require('@/assets/icon/down_black.svg') : require('@/assets/icon/right_black.svg')) : (isShowInsurance ? require('@/assets/icon/down_w.svg') : require('@/assets/icon/right_w.svg'))"
                            alt="right icon"
                        />
                        </div>
                    </div>

                    <div
                        @click="insuranceAboutClick"
                        :class="selectedTab === 'insurance_about' ? 'selected-page-item' : ''"
                        v-if="isShowInsurance"
                    >
                        <div
                            class="navbar-list-label pa-2 pl-11"
                            :class="selectedTab === 'insurance_about' ? 'selected-page' : ''"
                        >
                            About
                        </div>
                    </div>

                    <div
                        @click="insuranceStatsClick"
                        :class="selectedTab === 'insurance_performance' ? 'selected-page-item' : ''"
                        v-if="isShowInsurance"
                    >
                        <div
                            class="navbar-list-label pa-2 pl-11"
                            :class="selectedTab === 'insurance_performance' ? 'selected-page' : ''"
                        >
                            Performance
                        </div>
                    </div>

                    <div
                        @click="insuranceCollateralClick"
                        :class="selectedTab === 'insurance_collateral' ? 'selected-page-item' : ''"
                        v-if="isShowInsurance"
                    >
                        <div
                            class="navbar-list-label pa-2 pl-11"
                            :class="selectedTab === 'insurance_collateral' ? 'selected-page' : ''"
                        >
                            Premiums
                        </div>
                    </div>
                </div>


                <div class="navbar-list-divider"></div>

                <div
                    @click="dashBoardClick"
                    :class="selectedTab === 'dashboard' ? 'selected-page-item' : ''"
                    class="stroke-item pa-2"
                >
                    <div class="navbar-page-link">
                        <img
                            :src="require('@/assets/icon/menu/myDashboardMenu.svg')"
                        >
                    </div>
                    <div
                        class="navbar-page-label ml-2"
                        :class="selectedTab === 'dashboard' ? 'selected-page' : ''"
                    >
                        My Dashboard
                    </div>
                </div>

                <div class="pa-2 ml-2">
                    <div class="network-select-list-item" @click="openLink('https://docs.overnight.fi/')">
                        Docs
                    </div>
                </div>
                <div class="pa-2 ml-2">
                    <div @click="openLink('https://docs.overnight.fi/advanced/terms-of-service')">
                        <label class="network-select-list-item">Terms of Service</label>
                    </div>
                </div>
                <div class="pa-2 ml-2">
                    <div @click="openLink('https://discord.com/channels/933003627444969552/967813123149033542/967813482684760135/')">
                        <label class="network-select-list-item">Help center in Discord</label>
                    </div>
                </div>
                <div class="pa-2 ml-2">
                    <div @click="aboutEtsClick()">
                        <label class="network-select-list-item">ETS</label>
                    </div>
                </div>

                <div class="footer-social-link-container ml-4">
                    <img class="footer-social-link ml-n3" :src="require('@/assets/social/twitterSocial.svg')" @click="openLink('https://twitter.com/overnight_fi')">
                    <img class="footer-social-link" :src="require('@/assets/social/discordSocial.svg')" @click="openLink('https://discord.gg/overnight-fi')">
                    <img class="footer-social-link zealy ml-3" :src="require('@/assets/social/zealySocial.svg')" @click="openLink('https://zealy.io/c/overnight-fi/questboard')">
                </div>
            </div>
        </div>


    </v-menu>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import {menu} from "@/components/mixins/menu";

export default {
    name: "MenuSelect",
    mixins: [menu],

    components: {},

    data: () => ({
        closeOnContentClick: false,
        isShowSwipeNotification: false
    }),

    mounted() {
      this.checkIsNotified();
    },
    computed: {
        ...mapGetters('wrapUI', ['showWrap']),
        ...mapGetters('theme', ['light']),
        ...mapGetters('wrapUI', ['showWrap']),
        ...mapGetters('menuUI', ['selectedTab']),
        ...mapGetters('network', ['networkId', "networkName"]),
    },

    methods: {
        ...mapActions('menuUI', ['selectTab']),
        ...mapActions('theme', ['switchTheme']),
        ...mapActions('track', ['trackClick']),

      checkIsNotified(subscribe) {
          let a = true;
          if (a) {
              return;
          }

        let lastNotify = localStorage.getItem('lastNotify');
        console.log('lastNotify 1:', lastNotify)

        if (!lastNotify || lastNotify === 'null' || lastNotify === 'undefined') {
          localStorage.setItem('lastNotify', '2');
          this.isShowSwipeNotification = true;
          return;
        }

        lastNotify = lastNotify * 1;
        console.log('lastNotify 2: ', lastNotify)
        if (lastNotify <= 0) {
          console.log('lastNotify 3: ', lastNotify)
          localStorage.setItem('lastNotify', '0');
          this.isShowSwipeNotification = false;
          return;
        }

        if (subscribe) {
          this.subNotifyCount();
          return;
        }

        this.isShowSwipeNotification = true;
        //
      },
      subNotifyCount() {
        let lastNotify = localStorage.getItem('lastNotify');
        if (!lastNotify || lastNotify === 'null' || lastNotify === 'undefined') {
          localStorage.setItem('lastNotify', '2');
          this.isShowSwipeNotification = true;
          return;
        }

        lastNotify = lastNotify - 1;
        localStorage.setItem('lastNotify', (lastNotify + ""));
        this.isShowSwipeNotification = true;
      },

        openLink(url, isNotBlank) {
            window.open(url, isNotBlank ? '_self' : '_blank').focus();
        },

        redemptionRequestAction() {
            this.showRedemptionRequestModal();
        },
    }
}
</script>

<style lang="scss" scoped>
.select-bar-main-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 21px;
    width: 32px;
    height: 100%;
    border-radius: 2px;
    transition: opacity .2s ease, background-color .2s ease;
}

.select-bar-main-container:hover {
    background-color: rgba(6, 120, 196, 0.9);
    opacity: .9;

    .menu-icon {
        color: #fff;
    }
}

@media only screen and (max-width: 960px) {
    .network-select-list-item {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
    }

    .select-bar-main-container {
        width: 20px;
        margin-left: 20px;
    }

    .network-select-list {
        width: 50vw;
    }

    .switch-theme-icon {
        width: 26px;
        height: 26px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .network-select-list-item {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 24px;
    }

    .network-select-list {
        width: 30vw;
    }

    .switch-theme-icon {
        width: 32px;
        height: 32px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .network-select-list-item {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 24px;
    }
    .network-select-list {
        width: 20vw;
    }

    .switch-theme-icon {
        width: 32px;
        height: 32px;
    }
}

.network-select-list {
    background-color: var(--secondary);
    border-radius: 10px;
}

.network-select-list-item {
    color: var(--secondary-gray-text);
    cursor: pointer;
}

.text-blue {
    color: var(--links-blue);
}

.select-bar-container {
    background-color: transparent;
    cursor: pointer;
    position: relative;
}

.menu-item {
    cursor: pointer;
}

.menu-icon {
    color: var(--main-gray-text);
}

.switch-theme-icon {
    color: var(--theme-icon-color);
}

.theme-switch-btn {
    background-color: var(--theme-switch-background);
}

.navbar-list-header {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.01em;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-gray-text);
    text-transform: uppercase;
}

.navbar-list-label {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.05em;
    color: var(--main-gray-text);
    cursor: pointer;
}

.navbar-page-label-modal {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--links-blue);
}

.selected-page {
    color: var(--main-gray-text);
    font-weight: 700;
}

.selected-page-item {
    background-color: var(--card-banner-status-container);
}

.navbar-page-label {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
    cursor: pointer;
}

.navbar-page-link {
    width: 22px;
    height: 22px;
}

.main-container {
    background-color: var(--secondary);
}

.list-item-hover:hover {
    color: var(--main-gray-text);
    background: linear-gradient(#28A0F0 100%, #0678C4 99.17%, #FFFFFF 16%);
}

.footer-social-link-container {
    display: flex;
    align-items: center;
}

.footer-social-link {
    cursor: pointer;
    height: 48px ;
}

.zealy {
    height: 24px;
}

.toggleUpDown {
    transition: transform .3s ease-in-out;
    color: var(--main-gray-text);
}

.toggleUpDown.rotate {
    transform: rotate(90deg);
}

.navbar-list-divider {
    border-top: 1px solid var(--input-placeholder);
}

@keyframes ping {
    0% {
        transform: scale(1);
        opacity: 0.5;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

.ping {
    position: relative;
    padding-left: 1em;
    color: rgba(28, 149, 231);
}

.ping::before,
.ping::after {
    content: '';
    position: absolute;
    top: 0.25em;
    left: 0;
    width: 0.75em;
    height: 0.75em;
    border-radius: 50%;
    background-color: currentColor;
}

.ping::before {
    animation: ping 1.7s ease infinite;
    opacity: 0.25;
}

.ping-notify {
    position: absolute;
    top: -7px;
    right: -7px;
}

.stroke-item {
    display: flex;
    align-items: center;
}

.arrow {
    width: 12px;
    height: 12px;
}

.burger {
    height: 20px;
    widows: 20px;
}


</style>
