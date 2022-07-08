<template>
    <v-navigation-drawer
            app
            permanent
            width="228"
    >
        <v-list class="ml-4 mb-8">
            <v-list-item>
                <v-list-item-title>
                    <img class="logo-img" :src="require('@/assets/logo.svg')" @click="openLink('https://market.overnight.fi/')">
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <v-list nav class="page-list ml-4">
            <v-list-item link @click="goToAction('/')">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/cart.svg')">
                </v-list-item-icon>
                <v-list-item-title>
                    <label class="navbar-page-label selected-page-label">Market</label><v-icon class="alpha mb-5" small>mdi-alpha</v-icon>
                </v-list-item-title>
            </v-list-item>

            <v-list-item link @click="openLink('https://app.overnight.fi/fund')">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/addchart.svg')">
                </v-list-item-icon>
                <v-list-item-title>
                    <label class="navbar-page-label">Collateral</label>
                </v-list-item-title>
            </v-list-item>

            <v-list-item link @click="openLink('https://app.overnight.fi/fund')">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/chart.svg')">
                </v-list-item-icon>
                <v-list-item-title>
                    <label class="navbar-page-label">Performance</label>
                </v-list-item-title>
            </v-list-item>

            <v-list-item link @click="openLink('https://app.overnight.fi/dashboard')">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/avatar.svg')">
                </v-list-item-icon>
                <v-list-item-title>
                    <label class="navbar-page-label">Overview</label>
                </v-list-item-title>
            </v-list-item>
        </v-list>

        <template v-slot:append>
            <v-list nav dense class="footer-list ml-4">
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

export default {
    name: 'Navbar',

    components: {
    },

    data: () => ({
    }),


    computed: {
    },

    methods: {
        openLink(url) {
            window.open(url, '_blank').focus();
        },

        goToAction(id) {
            this.$router.push(id);
        },
    }
}
</script>

<style>

/* mobile */
@media only screen and (max-width: 1400px) {

}

@media only screen and (min-width: 1400px) {

}

.page-list {
    height: 60%;
}

.logo-img {
    cursor: pointer;
    height: 48px !important ;
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

.selected-page-label, .alpha {
    color: #1C95E7 !important;
}
</style>
