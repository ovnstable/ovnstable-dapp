<template>
    <v-menu offset-y :close-on-content-click="closeOnContentClick">
        <template v-slot:activator="{ on, attrs }">
            <div class="select-bar-main-container mt-1"
                 v-bind="attrs"
                 v-on="on">
                <v-row justify="end" align="center" class="select-bar-container">
                    <v-icon class="menu-icon">mdi-view-headline</v-icon>
                </v-row>
            </div>
        </template>
        <v-list class="main-container">
            <v-list-item class="mx-n2 mt-0" @click="featuredClick" :class="selectedTab === 'featured' ? 'selected-page-item' : ''">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/featured.svg')">
                </v-list-item-icon>
                <v-list-item-title class="mx-n4">
                    <label class="navbar-page-label" :class="selectedTab === 'featured' ? 'selected-page' : ''">FEATURED</label>
                </v-list-item-title>
            </v-list-item>

            <v-list-group :append-icon="null"  @click="isShowUsd = !isShowUsd">
                <template v-slot:activator>
                    <v-list-item-icon class="mx-n2">
                        <img class="navbar-page-link" :src="require('@/assets/icon/menu/usdplus.svg')">
                    </v-list-item-icon>
                    <v-list-item-title>
                        <label class="navbar-page-label ml-6" :class="selectedTab.startsWith('usdplus_') ? 'selected-page' : ''">USD+</label>
                    </v-list-item-title>
                    <div class="select-bar-main-container" >
                        <v-row>
                            <v-icon color="var(--secondary-gray-text)" >
                                {{ isShowUsd ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                            </v-icon>
                        </v-row>
                    </div>
                </template>
                <v-list-item @click="statsClick" :class="selectedTab === 'usdplus_performance' ? 'selected-page-item' : ''">
                    <v-list-item-title>
                        <label class="navbar-list-label mx-5" :class="selectedTab === 'usdplus_performance' ? 'selected-page' : ''">Performance</label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item @click="collateralClick" :class="selectedTab === 'usdplus_collateral' ? 'selected-page-item' : ''">
                    <v-list-item-title>
                        <label class="navbar-list-label mx-5" :class="selectedTab === 'usdplus_collateral' ? 'selected-page' : ''">Collateral</label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item @click="usdPlusPoolsClick" :class="selectedTab === 'usdplus_pools' ? 'selected-page-item' : ''">
                    <v-list-item-title>
                        <label class="navbar-list-label mx-5" :class="selectedTab === 'usdplus_pools' ? 'selected-page' : ''">USD+ pools</label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item @click="swapClick">
                    <v-list-item-title>
                        <label class="navbar-page-label-modal mx-5">Mint/redeem</label>
                    </v-list-item-title>
                </v-list-item>

                <v-list-item @click="wrapClick" v-if="(networkId !== 56)">
                    <v-list-item-title>
                        <label class="navbar-page-label-modal mx-5">Wrap/Unwrap</label>
                    </v-list-item-title>
                </v-list-item>
            </v-list-group>


            <v-list-item class="mx-n2" @click="etsClick"  :class="selectedTab === 'ets' ? 'selected-page-item' : ''">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/etsIcon.svg')">
                </v-list-item-icon>
                <v-list-item-title class="mx-n4">
                    <label class="navbar-page-label" :class="selectedTab === 'ets' ? 'selected-page' : ''" >ETS</label>
                </v-list-item-title>
            </v-list-item>

            <v-list-group :append-icon="null"  @click="isShowInsurance = !isShowInsurance">
                <template v-slot:activator>
                    <v-list-item-icon class="mx-n2" light>
                        <img class="navbar-page-link" :src="require('@/assets/icon/menu/insurance.svg')">
                    </v-list-item-icon>
                    <v-list-item-title >
                        <label class="navbar-page-label ml-6" :class="selectedTab.startsWith('insurance_') ? 'selected-page' : ''">INSURANCE</label>
                    </v-list-item-title>
                    <div class="select-bar-main-container ml-5" >
                        <v-row>
                            <v-icon color="var(--secondary-gray-text)" >
                                {{ isShowInsurance ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                            </v-icon>
                        </v-row>
                    </div>
                </template>
                <v-list-item @click="insuranceClick" :class="selectedTab === 'insurance_about' ? 'selected-page-item' : ''">
                    <label class="navbar-list-label mx-7" :class="selectedTab === 'insurance_about' ? 'selected-page' : ''" >About</label>
                </v-list-item>

                <v-list-item @click="insurancePerformanceClick" :class="selectedTab === 'insurance-performance' ? 'selected-page-item' : ''">
                    <label class="navbar-list-label mx-7" :class="selectedTab === 'insurance-performance' ? 'selected-page' : ''">Performance</label>
                </v-list-item>

                <v-list-item @click="insuranceReservesClick" :class="selectedTab === 'insurance-reserves' ? 'selected-page-item' : ''">
                    <label class="navbar-list-label mx-7" :class="selectedTab === 'insurance-reserves' ? 'selected-page' : ''">Reserves</label>
                </v-list-item>

                <v-list-item @click="mintAction">
                    <v-list-item-title>
                        <label class="navbar-page-label-modal mx-7">Mint/redeem</label>
                    </v-list-item-title>
                </v-list-item>
            </v-list-group>


            <v-divider class="navbar-list-divider"></v-divider>

            <v-list-item class="mx-n2 mt-0" @click="dashBoardClick" :class="selectedTab === 'dashboard' ? 'selected-page-item' : ''">
                <v-list-item-icon>
                    <img class="navbar-page-link" :src="require('@/assets/icon/menu/my-dashboard.svg')">
                </v-list-item-icon>
                <v-list-item-title class="mx-n4">
                    <label class="navbar-page-label" :class="selectedTab === 'dashboard' ? 'selected-page' : ''">My Dashboard</label>
                </v-list-item-title>
            </v-list-item>

            <v-list-item class="menu-item" @click="openLink('https://docs.overnight.fi/')">
                <v-list-item-title class="network-select-list-item text-gray">
                    Docs
                </v-list-item-title>
            </v-list-item>
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
            <v-list-item>
                <img class="footer-social-link ml-n3" :src="require('@/assets/social/twitterSocial.svg')" @click="openLink('https://twitter.com/overnight_fi')">
                <img class="footer-social-link" :src="require('@/assets/social/discordSocial.svg')" @click="openLink('https://discord.gg/overnight-fi')">
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
        isShowUsd: false,
        isShowInsurance: false,
        closeOnContentClick: false,
    }),

    computed: {
        ...mapGetters('wrapUI', ['showWrap']),
        ...mapGetters('theme', ['light']),
        ...mapGetters('wrapUI', ['showWrap']),
        ...mapGetters('menuUI', ['selectedTab']),
        ...mapGetters('network', ['networkId']),
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
            this.goToActionByPath('/featured', { tabName: 'featured' });
        },

        dashBoardClick() {
            this.selectTab('dashboard');
            this.goToActionByPath('/', { tabName: 'dashboard' });
            this.trackClick({
                action: 'dashboard-click',
                event_category: 'View Page',
                event_label: 'Open dashboard page',
                value: 1
            });
        },

        collateralClick() {
            this.selectTab('usdplus_collateral');
            this.goToActionByPath('/collateral', { tabName: 'collateral' });
            this.trackClick({
                action: 'collateral-click',
                event_category: 'View Page',
                event_label: 'Open collateral page',
                value: 1
            });
        },

        usdPlusPoolsClick() {
            this.selectTab('usdplus_pools');
            this.goToActionByPath('/pools', { tabName: 'usdPlusPools' });
        },

        statsClick() {
            this.selectTab('usdplus_performance');
            this.goToActionByPath('/stats', { tabName: 'performance' });
            this.trackClick({
                action: 'stats-click',
                event_category: 'View Page',
                event_label: 'Open stats page',
                value: 1
            });
        },

        etsClick() {
            this.selectTab('market');
            this.goToActionByPath('/market', { tabName: 'ets' });
        },

        insuranceClick() {
            this.selectTab('insurance_about');
            this.goToActionByPath('/insurance', {tabName: 'about'});
            this.trackClick({
                action: 'insurance-click',
                event_category: 'View Page',
                event_label: 'Open insurance page',
                value: 1
            });
        },

        insurancePerformanceClick() {
            this.selectTab('insurance-performance');
            this.goToActionByPath('/insurance/polygon', { tabName: 'performance' });
        },

        insuranceReservesClick() {
            this.selectTab('insurance-reserves');
            this.goToActionByPath('/insurance/polygon', { tabName: 'reserves' });
        },

        swapClick() {
            this.showMintView();
            this.showSwapModal();
            this.trackClick({ action: 'swap-click', event_category: 'Mint', event_label: 'Open mint modal', value: 1 });
        },

        wrapClick() {
            this.showWrapView();
            this.showWrapModal();
            this.trackClick({ action: 'wrap-click', event_category: 'Wrap', event_label: 'Open wrap modal', value: 1 });
        },

        toggleTheme(mode) {
            if ((mode === 'light' && !this.light) || (mode === 'dark' && this.light)) {
                this.switchTheme();
                this.trackClick({
                    action: 'toggle-theme',
                    event_category: 'Theme',
                    event_label: 'Switch theme',
                    value: 1
                });
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

.text-gray:hover {
    color: #FFFFFF !important;
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
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.05em;
    color: var(--main-gray-text);
    cursor: pointer;
}

.navbar-page-label-modal {
    font-family: 'Roboto', sans-serif;
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
    font-weight: 700 !important;
}

.selected-page-item {
    background-color: var(--card-banner-status-container) !important;
}

.navbar-page-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.02em !important;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
    cursor: pointer;
}


.navbar-page-link {
    width: 25px;
    height: 25px;
    margin-right: 0 !important;
}

.main-container {
    background-color: var(--secondary) !important;
}
.list-item-hover:hover, .footer-social-link:hover {
    color: var(--main-gray-text);
    background: linear-gradient(#28A0F0 100%, #0678C4 99.17%, #FFFFFF 16%);
}

.footer-social-link {
    cursor: pointer;
    height: 48px !important ;
}

.toggleUpDown {
    transition: transform .3s ease-in-out !important;
    color: var(--main-gray-text) !important;
}

.toggleUpDown.rotate {
    transform: rotate(90deg);
}
</style>
