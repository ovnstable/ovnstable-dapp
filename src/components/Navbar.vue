<template>
    <v-navigation-drawer
            app
            permanent
            width="228"
            color="var(--secondary)"
    >
        <v-list class="mt-2">
            <v-list-item>
                <v-list-item-title>
                    <img :src="require('@/assets/logo.svg')" @click="openLink('https://overnight.fi/')"
                         class="logo-img">
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <v-list nav subheader class="mx-3" dense>
            <v-subheader class="mx-n2 mb-n2 mt-2">
                <label class="navbar-list-header">EARN</label>
            </v-subheader>

            <v-divider class="navbar-list-divider mt-2"></v-divider>

            <v-list-item :class="selectedTab === 'featured' ? 'selected-page-item' : ''"
                         @click="featuredClick"
                         class="list-item-hover mx-n2 mt-5">
                <v-list-item-icon>
                    <img :src="require('@/assets/icon/menu/featured.svg')"
                         class="navbar-page-link">
                </v-list-item-icon>
                <v-list-item-title class="mx-n1">
                    <label :class="selectedTab === 'featured' ? 'selected-page' : ''"
                           class="navbar-page-label">
                        FEATURED
                    </label>
                </v-list-item-title>
            </v-list-item>

            <v-list-group :append-icon="null"
                          @click="toggleUsdPlus(!isShowUsd)">
                <template v-slot:activator>
                    <v-list-item-icon class="mx-n2">
                        <div class="navbar-page-link">
                            <svg width="24" height="24" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path v-bind:fill="usdPlusIconColor" d="M15.4709 13.0182C13.5291 12.3745 12.5909 11.9709 12.5909 10.9455C12.5909 9.83273 13.8018 9.42909 14.5655 9.42909C15.9945 9.42909 16.5182 10.5091 16.6382 10.8909L18.3618 10.16C18.1982 9.66909 17.4673 8.06545 15.5909 7.71636V6.36364H13.4091V7.73818C10.7036 8.34909 10.6927 10.8582 10.6927 10.9673C10.6927 13.4436 13.1473 14.1418 14.3473 14.5782C16.0709 15.1891 16.8345 15.7455 16.8345 16.7927C16.8345 18.0255 15.6891 18.5491 14.6745 18.5491C12.6891 18.5491 12.1218 16.5091 12.0564 16.2691L10.2455 17C10.9327 19.3891 12.7327 20.0327 13.4091 20.2291V21.6364H15.5909V20.2836C16.0273 20.1855 18.7545 19.64 18.7545 16.7709C18.7545 15.2545 18.0891 13.9236 15.4709 13.0182ZM4.68182 23.8182H2.5V17.2727H9.04545V19.4545H6.34C8.09636 22.0836 11.0964 23.8182 14.5 23.8182C17.1039 23.8182 19.6012 22.7838 21.4425 20.9425C23.2838 19.1012 24.3182 16.6039 24.3182 14H26.5C26.5 20.6327 21.1327 26 14.5 26C10.4418 26 6.85273 23.9818 4.68182 20.9055V23.8182ZM2.5 14C2.5 7.36727 7.86727 2 14.5 2C18.5582 2 22.1473 4.01818 24.3182 7.09455V4.18182H26.5V10.7273H19.9545V8.54545H22.66C20.9036 5.91636 17.9036 4.18182 14.5 4.18182C11.8961 4.18182 9.39876 5.21623 7.5575 7.0575C5.71623 8.89876 4.68182 11.3961 4.68182 14H2.5Z" />
                            </svg>
                        </div>
                    </v-list-item-icon>
                    <v-list-item-title>
                        <label :class="selectedTab.startsWith('usdplus_') ? 'selected-page' : ''"
                               class="navbar-page-label" >
                            USD+
                        </label>
                    </v-list-item-title>
                    <div class="select-bar-main-container mr-15" >
                        <v-row>
                            <v-icon color="var(--secondary-gray-text)" >
                                {{ isShowUsd ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                            </v-icon>
                        </v-row>
                    </div>
                </template>

                <v-list-item @click="statsClick" :class="selectedTab === 'usdplus_performance' ? 'selected-page-item' : ''"
                             class="list-item-hover">
                    <v-list-item-title>
                        <label :class="selectedTab === 'usdplus_performance' ? 'selected-page' : ''"
                               class="navbar-list-label mx-5">
                            Performance
                        </label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item :class="selectedTab === 'usdplus_collateral' ? 'selected-page-item' : ''"
                             @click="collateralClick"
                             class="list-item-hover ">
                    <v-list-item-title>
                        <label :class="selectedTab === 'usdplus_collateral' ? 'selected-page' : ''"
                               class="navbar-list-label mx-5">
                            Collateral
                        </label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item :class="selectedTab === 'usdplus_pools' ? 'selected-page-item' : ''"
                             @click="usdPlusPoolsClick"
                             class="list-item-hover">
                    <v-list-item-title>
                        <label :class="selectedTab === 'usdplus_pools' ? 'selected-page' : ''"
                               class="navbar-list-label mx-5">
                            USD+ pools
                        </label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item link @click="swapClick"
                             class="list-item-hover">
                    <v-list-item-title>
                        <label class="navbar-page-label-modal mx-5">Mint/redeem</label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item v-if="(networkId !== 56)"
                             @click="wrapClick"
                             class="list-item-hover">
                    <v-list-item-title>
                        <label class="navbar-page-label-modal mx-5">Wrap/Unwrap</label>
                    </v-list-item-title>
                </v-list-item>
            </v-list-group>

            <v-list-item @click="etsClick()"
                         :class="selectedTab === 'ets' ? 'selected-page-item' : ''"
                         class="list-item-hover mx-n2 ma-1">
                <v-list-item-icon>
                    <div class="navbar-page-link">
                        <svg width="24" height="24" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path v-bind:fill="etsColored" d="M3.44252 12.7102L5.29426 10.7867L7.3117 10.8827L9.09836 12.6027L10.4854 11.1618L6.16288 7.00063L2.00168 11.3232L3.44252 12.7102Z"/>
                            <path fill="#ADB3BD" d="M27.1123 17.6467L24.6781 18.7438L22.841 17.9045L21.822 15.6436L19.9986 16.4653L22.464 21.9355L27.9341 19.4701L27.1123 17.6467Z"/>
                            <path fill="#ADB3BD" fill-rule="evenodd" clip-rule="evenodd" d="M20.7003 24.1574C19.1877 25.4263 17.4224 26.3633 15.5 26.8327C9.48 25.3627 5 19.3077 5 12.8327V8.57115L7.33333 10.8428V13.0893C7.33333 18.1294 11.125 23.3327 15.5 24.4994C17.0161 24.0951 18.4622 23.206 19.7046 22.007L20.7003 24.1574ZM24.0965 20.0304C25.3057 17.8657 26 15.3817 26 12.8327V5.83268L15.5 1.16602L7.76615 4.60328L9.56506 6.35464L15.5 3.70935L23.6667 7.34935V13.0893C23.6667 14.8208 23.2192 16.5715 22.4543 18.1712L23.0977 17.8733L24.0965 20.0304Z"/>
                        </svg>
                    </div>
                </v-list-item-icon>
                <v-list-item-title>
                    <label :class="selectedTab === 'ets' ? 'selected-page' : ''"
                           class="navbar-page-label">
                        ETS
                    </label>
                </v-list-item-title>
            </v-list-item>

            <v-list-group :append-icon="null"
                          @click="toggleInsurance(!isShowInsurance)">
                <template v-slot:activator>
                    <v-list-item-icon class="mx-n2">
                        <div class="navbar-page-link">
                            <svg width="24" height="24" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path v-bind:fill="insuranceIconColor" d="M24.1364 12.9091C24.1364 18.9636 19.9473 24.6255 14.3182 26C8.68909 24.6255 4.5 18.9636 4.5 12.9091V6.36364L14.3182 2L24.1364 6.36364V12.9091ZM14.3182 23.8182C18.4091 22.7273 21.9545 17.8618 21.9545 13.1491V7.78182L14.3182 4.37818V23.8182Z"/>
                            </svg>
                        </div>
                    </v-list-item-icon>
                    <v-list-item-title >
                        <label :class="selectedTab.startsWith('insurance_') ? 'selected-page' : ''"
                               class="navbar-page-label">
                            INSURANCE
                        </label>
                    </v-list-item-title>
                    <div class="select-bar-main-container mr-5" >
                        <v-row>
                            <v-icon color="var(--secondary-gray-text)" >
                                {{ isShowInsurance ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                            </v-icon>
                        </v-row>
                    </div>
                </template>
                <div>
                    <v-list-item @click="insuranceClick"
                                 :class="selectedTab === 'insurance_about' ? 'selected-page-item' : ''"
                                 class="list-item-hover">
                        <label :class="selectedTab === 'insurance_about' ? 'selected-page' : ''"
                               class="navbar-list-label mx-7">
                            About
                        </label>
                    </v-list-item>

                    <v-list-item @click="insurancePerformanceClick"
                                 :class="selectedTab === 'insurance_performance' ? 'selected-page-item' : ''"
                                 class="list-item-hover">
                        <label :class="selectedTab === 'insurance_performance' ? 'selected-page' : ''"
                               class="navbar-list-label mx-7">
                            Performance
                        </label>
                    </v-list-item>

                    <v-list-item @click="insuranceReservesClick"
                                 :class="selectedTab === 'insurance_reserves' ? 'selected-page-item' : ''"
                                 class="list-item-hover">
                        <label :class="selectedTab === 'insurance_reserves' ? 'selected-page' : ''"
                               class="navbar-list-label mx-7">
                            Reserves
                        </label>
                    </v-list-item>

                    <v-list-item @click="mintAction"
                                 class="list-item-hover">
                        <v-list-item-title>
                            <label class="navbar-page-label-modal mx-7">Mint/redeem</label>
                        </v-list-item-title>
                    </v-list-item>
                </div>
            </v-list-group>
        </v-list>

        <v-list nav subheader class="mx-3" dense>
            <v-divider class="navbar-list-divider"></v-divider>
            <v-list-item  :class="selectedTab === 'dashboard' ? 'selected-page-item' : ''"
                          @click="dashBoardClick"
                          class="list-item-hover mx-n2 mt-2">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/avatar.svg')">
                </v-list-item-icon>
                <v-list-item-title>
                    <label :class="selectedTab === 'dashboard' ? 'selected-page' : ''"
                           class="navbar-page-label" >
                        My Dashboard
                    </label>
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <template v-slot:append>
            <v-list nav dense class="footer-list">
                <div class="ma-2">
                    <v-list-item-title>
                        <v-btn-toggle class="theme-toggle-group" v-model="light">
                            <v-btn outlined :class="light ? 'theme-toggle-btn-selected' : 'theme-toggle-btn'" icon @click="toggleTheme('light')" :value="true">
                                <v-icon :class="light ? 'theme-icon-selected' : 'theme-icon'">mdi-white-balance-sunny</v-icon>
                            </v-btn>
                            <v-btn outlined :class="!light ? 'theme-toggle-btn-selected' : 'theme-toggle-btn'" icon @click="toggleTheme('dark')" :value="false">
                                <v-icon :class="!light ? 'theme-icon-selected' : 'theme-icon'">mdi-moon-waxing-crescent</v-icon>
                            </v-btn>
                        </v-btn-toggle>
                    </v-list-item-title>
                </div>

                <v-list-item link class="mb-0">
                    <v-list-item-title @click="openLink('https://docs.overnight.fi/')">
                        <label class="footer-item-label">Docs</label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item link class="mb-0">
                    <v-list-item-title @click="openLink('https://overnight.canny.io/')">
                        <label class="footer-item-label">Vote for new features</label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item>
                    <img class="footer-social-link ml-n3" :src="require('@/assets/social/twitterSocial.svg')" @click="openLink('https://twitter.com/overnight_fi')">
                    <img class="footer-social-link" :src="require('@/assets/social/discordSocial.svg')" @click="openLink('https://discord.gg/overnight-fi')">
                    <img class="footer-social-link" :src="require('@/assets/social/telegramSocial.svg')" @click="openLink('https://t.me/overnight_fi')">
                </v-list-item>
            </v-list>
        </template>
    </v-navigation-drawer>
</template>
<script>

import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
    name: 'Navbar',

    components: {
    },

    data: () => ({
        isShowUsd: false,
        isShowInsurance: false,
        isColoredEts: false,
    }),

    computed: {
        ...mapGetters('network', ['networkId']),
        ...mapGetters('menuUI', ['selectedTab']),
        ...mapGetters('theme', ['light']),

        insuranceIconColor: function() {
            if (this.light) {
                return this.isShowInsurance ? '#000000' : '#ADB3BD';
            }

            return this.isShowInsurance ? '#FFFFFF' : '#ADB3BD';
        },

        usdPlusIconColor: function() {
            if (this.light) {
                return this.isShowUsd ? '#000000' : '#ADB3BD';
            }

            return this.isShowUsd ? '#FFFFFF' : '#ADB3BD';
        },

        etsColored: function() {
            if (this.light) {
                return this.isColoredEts ? '#000000' : '#ADB3BD';
            }

            return this.isColoredEts ? '#FFFFFF' : '#ADB3BD';
        },
    },

    methods: {
        ...mapActions('menuUI', ['selectTab']),
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
        ...mapActions('wrapModal', ['showWrapModal', 'showWrapView']),
        ...mapActions('theme', ['switchTheme']),
        ...mapActions('track', ['trackClick']),
        ...mapActions('insuranceInvestModal', ['showInvestModal', 'showMintView', 'showRedeemView', 'showRedemptionRequestModal']),

        openLink(url, isNotBlank) {
            window.open(url, isNotBlank ? '_self' : '_blank').focus();
        },

        goToActionByPath(path, queryParams) {
              this.$router.push({
                  path: path,
                  query: queryParams ? queryParams : {}
              });
        },

        featuredClick() {
            this.selectTab('featured');
            this.goToActionByPath('/featured', {tabName: 'featured'});
        },

        dashBoardClick() {
            this.selectTab('dashboard');
            this.goToActionByPath('/', {tabName: 'dashboard'});
            this.trackClick({action: 'dashboard-click', event_category: 'View Page', event_label: 'Open dashboard page', value: 1 });
        },

        collateralClick() {
            this.selectTab('usdplus_collateral');
            this.goToActionByPath('/collateral', {tabName: 'collateral'});
            this.trackClick({action: 'collateral-click', event_category: 'View Page', event_label: 'Open collateral page', value: 1 });
        },

        usdPlusPoolsClick() {
            this.selectTab('usdplus_pools');
            this.goToActionByPath('/pools', {tabName: 'usdPlusPools'});
        },

        statsClick() {
            this.selectTab('usdplus_performance');
            this.goToActionByPath('/stats', {tabName: 'performance'});
            this.trackClick({action: 'stats-click', event_category: 'View Page', event_label: 'Open stats page', value: 1 });
        },

        etsClick() {
            this.selectTab('market');
            this.goToActionByPath('/market', {tabName: 'ets'});
        },

        insuranceClick() {
            this.selectTab('insurance_about');
            this.goToActionByPath('/insurance', {tabName: 'about'});
            this.trackClick({action: 'insurance-click', event_category: 'View Page', event_label: 'Open insurance page', value: 1 });
        },

        insurancePerformanceClick() {
            this.selectTab('insurance_performance');
            this.goToActionByPath('/insurance/polygon', {tabName: 'performance'});
        },

        insuranceReservesClick() {
            this.selectTab('insurance_reserves');
            this.goToActionByPath('/insurance/polygon', {tabName: 'reserves'});
        },

        swapClick() {
            this.showMintView();
            this.showSwapModal();
            this.trackClick({action: 'swap-click', event_category: 'Mint', event_label: 'Open mint modal', value: 1 });
        },

        wrapClick() {
            this.showWrapView();
            this.showWrapModal();
            this.trackClick({action: 'wrap-click', event_category: 'Wrap', event_label: 'Open wrap modal', value: 1 });
        },

        toggleTheme(mode) {
            if ((mode === 'light' && !this.light) || (mode === 'dark' && this.light)) {
                this.switchTheme();
                this.trackClick({action: 'toggle-theme', event_category: 'Theme', event_label: 'Switch theme', value: 1 });
            }
        },

        mintAction() {
            this.showMintView();
            this.showInvestModal();
        },

        redeemAction() {
            this.showRedeemView();
            this.showInvestModal();
        },

        redemptionRequestAction() {
            this.showRedemptionRequestModal();
        },

        toggleUsdPlus(isShow) {
            if (isShow) {
                this.toggleInsurance(false);
            }

            this.isShowUsd = isShow;
        },

        toggleInsurance(isShow) {
            if (isShow) {
                this.toggleUsdPlus(false);
            }

            this.isShowInsurance = isShow;
        },
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
}

/* full */
@media only screen and (min-width: 1400px) {
}


.logo-img {
    cursor: pointer;
    height: 48px !important;
    width: 48px !important;
}

.footer-social-link {
    cursor: pointer;
    height: 48px !important ;
}

.navbar-page-link {
    height: 24px !important;
    width: 24px !important;
}

.v-list-item__icon {
    margin-right: 11px !important;
}

.footer-item-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'liga' off;
    color: var(--third-gray-text);
}

.navbar-page-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em !important;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.list-item-hover:hover {
    background: var(--hover) !important;
}

.list-item-hover:active {
    background: var(--active) !important;
}

.navbar-list-header {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em !important;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-gray-text);
    cursor: pointer;
}

.navbar-list-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.05em;
    color: var(--main-gray-text);
    cursor: pointer;
}

.navbar-page-label-modal {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--links-blue);
    cursor: pointer;
}

.navbar-list-divider {
    border-color: var(--fourth-gray-text) !important;
}

.selected-page {
    color: var(--main-gray-text);
    font-weight: 700;
}

.selected-page-item {
    background-color: var(--card-banner-status-container) !important;
}

.theme-toggle-group {
    background-color: transparent !important;
    border-radius: 4px !important;
    border: 1px solid var(--theme-toggle-border) !important;
}

.theme-toggle-btn, .theme-toggle-btn-selected {
    border: none !important;
}

.theme-toggle-btn {
    background-color: transparent !important;
}

.theme-toggle-btn-selected {
    background-color: var(--theme-switch-background) !important;
}

.theme-icon {
    color: var(--theme-icon-color) !important;
}

.theme-icon-selected {
    color: var(--theme-icon-color-selected) !important;
}

</style>
