<template>
    <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
            <div class="select-bar-main-container mt-1"
                 v-bind="attrs"
                 v-on="on">
                <v-row justify="end" align="center" class="select-bar-container">
                    <v-icon>mdi-view-headline</v-icon>
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
                    Swap USD+
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
    },

    methods: {
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),

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
}

.network-select-list {
    background-color: var(--secondary) !important;
    border-radius: 10px;
}

.network-select-list-item {
    font-family: 'Roboto', sans-serif !important;
    color: #333333 !important;
}

.text-blue {
    color: #1C95E7 !important;
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

</style>
