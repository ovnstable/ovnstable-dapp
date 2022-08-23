<template>
    <v-navigation-drawer
            app
            permanent
            width="228"
    >
        <v-list class="mt-1 mb-8">
            <v-list-item>
                <v-list-item-title>
                    <img class="logo-img" :src="require('@/assets/logo.svg')" @click="openLink('https://market.overnight.fi/')">
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <v-list nav class="page-list">
            <v-list-item link @click="dashBoardClick">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/' + (selectedTab === 'dashboard' ? 'avatarSelected.svg' : 'avatar.svg'))">
                </v-list-item-icon>
                <v-list-item-title>
                    <label class="navbar-page-label" :class="selectedTab === 'dashboard' ? 'selected-page' : ''">My Performance</label>
                </v-list-item-title>
            </v-list-item>

            <v-list-item link @click="marketClick">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/' + (selectedTab === 'market' ? 'cartSelected.svg' : 'cart.svg'))">
                </v-list-item-icon>
                <v-list-item-title>
                    <label class="navbar-page-label" :class="selectedTab === 'market' ? 'selected-page' : ''">Market</label>
                    <v-icon class="mb-5" small :class="selectedTab === 'market' ? 'selected-page' : ''">mdi-beta</v-icon>
                </v-list-item-title>
            </v-list-item>

            <v-list-item link @click="statsClick">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/' + (selectedTab === 'stats' ? 'chartSelected.svg' : 'chart.svg'))">
                </v-list-item-icon>
                <v-list-item-title>
                    <label class="navbar-page-label" :class="selectedTab === 'stats' ? 'selected-page' : ''">Stats</label>
                    <!-- TODO: add last payout time -->
                </v-list-item-title>
            </v-list-item>

            <v-list-item link @click="collateralClick">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/' + (selectedTab === 'collateral' ? 'addchartSelected.svg' : 'addchart.svg'))">
                </v-list-item-icon>
                <v-list-item-title>
                    <label class="navbar-page-label" :class="selectedTab === 'collateral' ? 'selected-page' : ''">Collateral</label>
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <!-- TODO: add Welcome to open beta section -->

        <template v-slot:append>
            <v-list nav dense class="footer-list">
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
    },

    methods: {
        ...mapActions('menuUI', ['selectTab']),

        openLink(url) {
            window.open(url, '_blank').focus();
        },

        goToAction(id) {
            this.$router.push(id);
        },

        dashBoardClick() {
            this.selectTab('dashboard');
            this.goToAction('/dashboard');
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
            this.goToAction('/')
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

.page-list {
    height: 60%;
}

.logo-img {
    cursor: pointer;
    height: 48px !important;
}

.footer-social-link {
    cursor: pointer;
    height: 48px !important ;
}

.navbar-page-link {
    height: 28px !important ;
}

.v-list-item__icon {
    margin-right: 12px !important;
}

.footer-item-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    font-feature-settings: 'liga' off;
    color: #333333;
}

.navbar-page-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}

.selected-page {
    color: #1C95E7 !important;
}
</style>
