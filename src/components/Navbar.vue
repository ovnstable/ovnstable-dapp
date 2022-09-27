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
                <label class="navbar-list-header">About USD+</label>
            </v-subheader>

            <v-divider class="navbar-list-divider"></v-divider>

            <v-list-item class="list-item-hover mx-n2 mt-2" link @click="statsClick">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/' + (selectedTab === 'stats' ? 'chartSelected.svg' : 'chart.svg'))">
                </v-list-item-icon>
                <v-list-item-title>
                    <label class="navbar-page-label" :class="selectedTab === 'stats' ? 'selected-page' : ''">Performance</label>
                </v-list-item-title>
            </v-list-item>

            <v-list-item class="list-item-hover mx-n2 mt-2" link @click="collateralClick">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/' + (selectedTab === 'collateral' ? 'addchartSelected.svg' : 'addchart.svg'))">
                </v-list-item-icon>
                <v-list-item-title>
                    <label class="navbar-page-label" :class="selectedTab === 'collateral' ? 'selected-page' : ''">Collateral</label>
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <v-list nav subheader class="mx-3" dense>
            <v-divider class="navbar-list-divider"></v-divider>

            <v-list-item class="list-item-hover mx-n2 mt-2" link @click="swapClick">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/swap_horizontal.svg')">
                </v-list-item-icon>
                <v-list-item-title>
                    <label class="navbar-page-label">Mint/redeem USD+</label>
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <v-list nav subheader class="mx-3" dense>
            <v-divider class="navbar-list-divider"></v-divider>

            <v-list-item class="list-item-hover mx-n2 mt-2" link @click="marketClick">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/' + (selectedTab === 'market' ? 'earnSelected.svg' : 'earn.svg'))">
                </v-list-item-icon>
                <v-list-item-title>
                    <label class="navbar-page-label" :class="selectedTab === 'market' ? 'selected-page' : ''">Earn with USD+</label>
                </v-list-item-title>
            </v-list-item>
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
        ...mapGetters('menuUI', ['selectedTab']),
        ...mapGetters('theme', ['light']),
    },

    methods: {
        ...mapActions('menuUI', ['selectTab']),
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
        ...mapActions('theme', ['switchTheme']),

        openLink(url) {
            window.open(url, '_blank').focus();
        },

        goToAction(id) {
            this.$router.push(id);
        },

        dashBoardClick() {
            this.selectTab('dashboard');
            this.goToAction('/');
        },

        collateralClick() {
            this.selectTab('collateral');
            this.goToAction('/collateral');
        },

        statsClick() {
            this.selectTab('stats');
            this.goToAction('/stats');
        },

        marketClick() {
            this.selectTab('market');
            this.goToAction('/market')
        },

        swapClick() {
            this.showMintView();
            this.showSwapModal();
        },

        toggleTheme(mode) {
            if ((mode === 'light' && !this.light) || (mode === 'dark' && this.light)) {
                this.switchTheme();
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
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.03em !important;
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
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.03em !important;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-gray-text);
}

.navbar-list-divider {
    border-color: var(--fourth-gray-text) !important;
}

.selected-page {
    color: #1C95E7 !important;
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
