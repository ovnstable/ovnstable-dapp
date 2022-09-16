<template>
    <v-navigation-drawer
            app
            permanent
            width="228"
            color="var(--secondary)"
    >
        <v-list class="mt-1 mb-8">
            <v-list-item>
                <v-list-item-title>
                    <img class="logo-img" :src="require('@/assets/logo.svg')" @click="openLink('https://overnight.fi/')">
                </v-list-item-title>
            </v-list-item>
        </v-list>
        <template>
            <v-container>
                <v-btn @click="switchTheme">
                    Switch theme
                </v-btn>
            </v-container>
        </template>

        <v-list nav class="page-list">
            <v-list-item class="list-item-hover" link @click="dashBoardClick">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/' + (selectedTab === 'dashboard' ? 'avatarSelected.svg' : 'avatar.svg'))">
                </v-list-item-icon>
                <v-list-item-title>
                    <label class="navbar-page-label" :class="selectedTab === 'dashboard' ? 'selected-page' : ''">My Dashboard</label>
                </v-list-item-title>
            </v-list-item>

            <v-list-item class="list-item-hover" link @click="marketClick">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/' + (selectedTab === 'market' ? 'earnSelected.svg' : 'earn.svg'))">
                </v-list-item-icon>
                <v-list-item-title>
                    <label class="navbar-page-label" :class="selectedTab === 'market' ? 'selected-page' : ''">Earn</label>
                </v-list-item-title>
            </v-list-item>

            <v-list-item class="list-item-hover" link @click="statsClick">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/' + (selectedTab === 'stats' ? 'chartSelected.svg' : 'chart.svg'))">
                </v-list-item-icon>
                <v-list-item-title>
                    <label class="navbar-page-label" :class="selectedTab === 'stats' ? 'selected-page' : ''">Performance</label>
                    <!-- TODO: add last payout time -->
                </v-list-item-title>
            </v-list-item>

            <v-list-item class="list-item-hover" link @click="collateralClick">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/' + (selectedTab === 'collateral' ? 'addchartSelected.svg' : 'addchart.svg'))">
                </v-list-item-icon>
                <v-list-item-title>
                    <label class="navbar-page-label" :class="selectedTab === 'collateral' ? 'selected-page' : ''">Collateral</label>
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <div>
            <v-row class="ma-2 nav-card-container">
                <v-col class="nav-card-body-bottom">
                    <v-row align="start" justify="start" class="ma-0 mr-n3">
                        <v-col cols="10">
                            <v-row align="start" justify="start">
                                <label class="nav-card-title">Welcome to our open beta dapp</label>
                            </v-row>
                        </v-col>

                        <v-col>
                            <v-row align="start" justify="start">
                                <img class="navbar-card-icon" :src="require('@/assets/icon/emoticon.svg')">
                            </v-row>
                        </v-col>
                    </v-row>

                    <v-row align="start" justify="start" class="ma-0 mt-4">
                        <label class="nav-card-text">Many things are still in the making. Please be patient. The house is yours and please let us know how we can do better, fix any bugs and improve the app over time.</label>
                    </v-row>

                    <v-row align="start" justify="start" class="ma-0 mt-4">
                        <label class="nav-card-text-link" @click="openLink('https://overnight.canny.io')">Leave feedback</label>
                    </v-row>
                </v-col>
            </v-row>
        </div>

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
        ...mapGetters('theme', ['light']),
    },

    methods: {
        ...mapActions('menuUI', ['selectTab']),
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
    height: 45%;
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
    color: var(--third-gray-text);
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
    color: var(--secondary-gray-text);
}


.selected-page {
    color: var(--links-blue) !important;
}

.nav-card-container {
    background: linear-gradient(0deg, rgba(28, 149, 231, 0.12), rgba(28, 149, 231, 0.12)), var(--secondary) !important;
    border-radius: 4px !important;
}

.nav-card-body-bottom {
    margin: 2% 2% !important;
}

.nav-card-title {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.navbar-card-icon {
    width: 20px !important;
    height: 20px !important;
}

.nav-card-text {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #707A8B;
}

.nav-card-text-link {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--links-blue);
    cursor: pointer;
}

.nav-card-text-link:hover {
    text-decoration: underline !important;
}

.list-item-hover:hover {
    background: var(--hover) !important;
}

.list-item-hover:active {
    background: var(--active) !important;
}

</style>
