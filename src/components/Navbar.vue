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
                    <img class="logo-img" :src="require('@/assets/logo.svg')" @click="openLink('https://overnight.fi/')">
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <v-list nav subheader class="mx-3" dense>
            <v-subheader class="mx-n2 mb-n2 mt-2">
                <label class="navbar-list-header">EARN</label>
            </v-subheader>

            <v-divider class="navbar-list-divider mt-2"></v-divider>

            <v-list-item class="list-item-hover mx-n2 mt-5" link @click="featuredClick">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/' + (selectedTab === 'stats' ? 'featuredSelected.svg' : 'featured.svg'))">
                </v-list-item-icon>
                <v-list-item-title class="mx-n1">
                    <label class="navbar-page-label" :class="selectedTab === 'market' ? 'selected-page' : ''">FEATURED</label>
                </v-list-item-title>
            </v-list-item>

            <v-list-group :append-icon="null">
                <template v-slot:activator>
                    <v-list-item-icon class="mx-n2">
                        <img class="navbar-page-link" :src="require('@/assets/icon/menu/' + (selectedTab === 'stats' ? 'usdplusSelected.svg' : 'usdplus.svg'))">
                    </v-list-item-icon>
                    <v-list-item-title>
                        <label class="navbar-page-label">USD+</label>
                    </v-list-item-title>
                    <v-icon>
                        mdi-chevron-right
                    </v-icon>
                </template>
                <v-list-item class="list-item-hover" link @click="statsClick">
                    <v-list-item-title>
                        <label class="navbar-list-label mx-8" :class="selectedTab === 'stats' ? 'selected-page' : ''">Performance</label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item class="list-item-hover " link @click="collateralClick">
                    <v-list-item-title>
                        <label class="navbar-list-label mx-8" :class="selectedTab === 'collateral' ? 'selected-page' : ''">Collateral</label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item link @click="usdPlusPoolsClick">
                    <v-list-item-title>
                        <label class="navbar-list-label mx-8" :class="selectedTab === 'market' ? 'selected-page' : ''">USD+ pools</label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item link @click="swapClick">
                    <v-list-item-title>
                        <label class="navbar-page-label mx-8">Mint/redeem</label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item link @click="wrapClick" v-if="(networkId !== 56)">
                    <v-list-item-title>
                        <label class="navbar-page-label mx-8">Wrap/Unwrap</label>
                    </v-list-item-title>
                </v-list-item>
            </v-list-group>

            <v-list-item class="list-item-hover mx-n2" link @click="etsClick">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/etsicon.svg')">
                </v-list-item-icon>
                <v-list-item-title>
                    <label class="navbar-page-label" :class="selectedTab === 'market' ? 'selected-page' : ''">ETS</label>
                </v-list-item-title>
            </v-list-item>

            <v-list-group :append-icon="null">
                <template v-slot:activator>
                    <v-list-item-icon class="mx-n2">
                        <img class="navbar-page-link" :src="require('@/assets/icon/menu/' + (selectedTab === 'insurance' ? 'insuranceSelected.svg' : 'insurance.svg'))">
                    </v-list-item-icon>
                    <v-list-item-title >
                        <label class="navbar-page-label">INSURANCE</label>
                    </v-list-item-title>
                    <v-icon>
                        mdi-chevron-right
                    </v-icon>
                </template>

                <div style="position: relative;">
                    <div  style="background-color: #4C586D; width: 1px; min-height: 110%; position: absolute; left: 20px"></div>
                    <v-list-item class="list-item-hover" link @click="insuranceClick">
                        <label class="navbar-list-label mx-8">About</label>
                    </v-list-item>
                </div>

                <div style="position: relative;">
                    <div  style="background-color: #4C586D; width: 1px; min-height: 110%; position: absolute; left: 20px"></div>
                    <v-list-item class="list-item-hover" @click="insurancePerformanceClick">
                        <label class="navbar-list-label mx-8">Performance</label>
                    </v-list-item>
                </div>

                <div style="position: relative;">
                    <div  style="background-color: #4C586D; width: 1px; min-height: 110%; position: absolute; left: 20px"></div>
                    <v-list-item class="list-item-hover" @click="insuranceReservesClick">
                            <label class="navbar-list-label mx-8">Reserves</label>
                    </v-list-item>
                </div>

                <div style="position: relative;">
                    <div  style="background-color: #4C586D; width: 1px; min-height: 110%; position: absolute; left: 20px"></div>
                    <v-list-item link @click="swapClick">
                        <v-list-item-title>
                                <label class="navbar-page-label mx-8">Mint/redeem</label>
                        </v-list-item-title>
                    </v-list-item>
                </div>

            </v-list-group>

        </v-list>

        <v-list nav subheader class="mx-3" dense>

        </v-list>

        <v-list nav subheader class="mx-3" dense>
            <v-divider class="navbar-list-divider"></v-divider>

            <v-list-item class="list-item-hover mx-n2 mt-2" link @click="dashBoardClick">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/' + (selectedTab === 'dashboard' ? 'avatarSelected.svg' : 'avatar.svg'))">
                </v-list-item-icon>
                <v-list-item-title>
                    <label class="navbar-page-label" :class="selectedTab === 'dashboard' ? 'selected-page' : ''">My Dashboard</label>
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

import {mapActions, mapGetters} from "vuex";

export default {
    name: 'Navbar',

    components: {
    },

    data: () => ({
    }),


    computed: {
        ...mapGetters('network', ['networkId']),
        ...mapGetters('menuUI', ['selectedTab']),
        ...mapGetters('theme', ['light']),
    },

    methods: {
        ...mapActions('menuUI', ['selectTab']),
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
        ...mapActions('wrapModal', ['showWrapModal', 'showWrapView']),
        ...mapActions('theme', ['switchTheme']),
        ...mapActions('track', ['trackClick']),

        openLink(url, isNotBlank) {
            window.open(url, isNotBlank ? '_self' : '_blank').focus();
        },

        goToAction(id) {
            this.$router.push(id);
        },

        goToActionByPath(path, queryParams) {
              this.$router.push({
                  path: path,
                  query: queryParams ? queryParams : {}
              });
        },

        featuredClick() {
            this.selectTab('featured');
            this.goToActionByPath('/market', {tabName: 'featured'});
        },

        dashBoardClick() {
            this.selectTab('dashboard');
            this.goToActionByPath('/', {tabName: 'dashboard'});
            this.trackClick({action: 'dashboard-click', event_category: 'View Page', event_label: 'Open dashboard page', value: 1 });
        },

        collateralClick() {
            this.selectTab('collateral');
            this.goToActionByPath('/collateral', {tabName: 'collateral'});
            this.trackClick({action: 'collateral-click', event_category: 'View Page', event_label: 'Open collateral page', value: 1 });
        },

        usdPlusPoolsClick() {
            this.selectTab('usd-pools');
            this.goToActionByPath('/market', {tabName: 'usdPlusPools'});
        },

        statsClick() {
            this.selectTab('stats');
            this.goToActionByPath('/stats', {tabName: 'performance'});
            this.trackClick({action: 'stats-click', event_category: 'View Page', event_label: 'Open stats page', value: 1 });
        },

        etsClick() {
            this.selectTab('market');
            this.goToActionByPath('/market', {tabName: 'ets'});
        },

        insuranceClick() {
            this.selectTab('insurance');
            this.goToActionByPath('/insurance', {tabName: 'about'});
            this.trackClick({action: 'insurance-click', event_category: 'View Page', event_label: 'Open insurance page', value: 1 });
        },

        insurancePerformanceClick() {
            this.selectTab('insurance-performance');
            this.goToActionByPath('/insurance/polygon', {tabName: 'performance'});
        },

        insuranceReservesClick() {
            this.selectTab('insurance-reserves');
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
}

.navbar-list-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.05em;
}

.navbar-list-divider {
    border-color: var(--fourth-gray-text) !important;
}

.selected-page {
    color: #29323E;
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
