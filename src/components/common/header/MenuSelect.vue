<template>
    <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
            <div class="select-bar-main-container mt-1"
                 v-bind="attrs"
                 v-on="on">
                <v-row justify="end" align="center" class="select-bar-container">
                    <v-icon class="menu-icon">mdi-view-headline</v-icon>
                </v-row>
            </div>
        </template>
        <v-list class="network-select-list">
            <v-list-item class="menu-item" @click="goToAction('/stats')">
                <v-list-item-title class="network-select-list-item">
                    Performance
                </v-list-item-title>
            </v-list-item>
            <v-list-item class="menu-item" @click="goToAction('/collateral')">
                <v-list-item-title class="network-select-list-item">
                    Collateral
                </v-list-item-title>
            </v-list-item>
            <v-list-item class="menu-item" @click="goToAction('/')">
                <v-list-item-title class="network-select-list-item">
                    My Dashboard
                </v-list-item-title>
            </v-list-item>
            <v-list-item class="menu-item" @click="goToAction('/market')">
                <v-list-item-title class="network-select-list-item">
                    Earn with USD+
                </v-list-item-title>
            </v-list-item>
            <v-list-item class="menu-item" @click="mintAction">
                <v-list-item-title class="network-select-list-item text-blue">
                    Mint/redeem USD+
                </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="showWrap" class="menu-item" @click="wrapAction">
                <v-list-item-title class="network-select-list-item text-blue">
                    Wrap/unwrap USD+
                </v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="menu-item" @click="openLink('https://twitter.com/overnight_fi')">
                <v-list-item-title class="network-select-list-item">
                    Twitter
                </v-list-item-title>
            </v-list-item>
            <v-list-item class="menu-item" @click="openLink('https://discord.gg/overnight-fi')">
                <v-list-item-title class="network-select-list-item">
                    Discord
                </v-list-item-title>
            </v-list-item>
            <v-list-item class="menu-item" @click="openLink('https://t.me/overnight_fi')">
                <v-list-item-title class="network-select-list-item">
                    Telegram
                </v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="menu-item" @click="openLink('https://docs.overnight.fi/')">
                <v-list-item-title class="network-select-list-item text-gray">
                    Docs
                </v-list-item-title>
            </v-list-item>
            <v-list-item class="menu-item" @click="openLink('https://overnight.canny.io/')">
                <v-list-item-title class="network-select-list-item text-gray">
                    Vote for new features
                </v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="menu-item theme-switch-btn" @click="switchTheme">
                <v-list-item-title class="network-select-list-item">
                    <v-row class="ma-0 fill-height" align="center" justify="center">
                        Switch to {{ light ? 'dark' : 'light' }} mode
                        <v-spacer></v-spacer>
                        <v-icon class="switch-theme-icon" v-if="light">mdi-moon-waxing-crescent</v-icon>
                        <v-icon class="switch-theme-icon" v-else>mdi-white-balance-sunny</v-icon>
                    </v-row>
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>

import {mapActions, mapGetters} from "vuex";

export default {
    name: "MenuSelect",

    components: {},

    data: () => ({
    }),

    computed: {
        ...mapGetters('wrapUI', ['showWrap']),
        ...mapGetters('theme', ['light']),
        ...mapGetters('wrapUI', ['showWrap']),
    },

    methods: {
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),
        ...mapActions('wrapModal', ['showWrapModal', 'showWrapView']),
        ...mapActions('theme', ['switchTheme']),

        openLink(url) {
            window.open(url, '_blank').focus();
        },

        goToAction(id) {
            this.$router.push(id);
        },

        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },

        wrapAction() {
            this.showWrapView();
            this.showWrapModal();
        },
    }
}
</script>

<style scoped>
/* mobile */
@media only screen and (max-width: 960px) {
    .network-select-list-item {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
    }

    .select-bar-main-container {
        width: 42px !important;
    }

    .network-select-list {
        width: 50vw !important;
    }

    .switch-theme-icon {
        width: 26px !important;
        height: 26px !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .network-select-list-item {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 18px !important;
        line-height: 24px !important;
    }

    .select-bar-main-container {
        width: 56px !important;
    }

    .network-select-list {
        width: 30vw !important;
    }

    .switch-theme-icon {
        width: 32px !important;
        height: 32px !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .network-select-list-item {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 18px !important;
        line-height: 24px !important;
    }

    .select-bar-main-container {
        width: 56px !important;
    }

    .network-select-list {
        width: 20vw !important;
    }

    .switch-theme-icon {
        width: 32px !important;
        height: 32px !important;
    }
}

.network-select-list {
    background-color: var(--secondary) !important;
    border-radius: 10px;
}

.network-select-list-item {
    font-family: 'Roboto', sans-serif !important;
    color: var(--secondary-gray-text) !important;
}

.text-blue {
    color: var(--links-blue) !important;
}


.text-gray {
    color: #707A8B !important;
}

.select-bar-container {
    background-color: transparent;
    cursor: pointer;
}

.menu-item {
    cursor: pointer;
}

.menu-icon {
    color: var(--main-gray-text) !important;
}

.switch-theme-icon {
    color: var(--theme-icon-color) !important;
}

.theme-switch-btn {
    background-color: var(--theme-switch-background) !important;
}
</style>
