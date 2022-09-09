<template>
    <v-app id="app">
        <router-view></router-view>
    </v-app>
</template>

<script>

import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
    name: 'App',

    data: () => ({
    }),

    computed: {
    },

    created() {
    },

    methods: {
    }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,600;0,700;0,800;0,900;1,100;1,300;1,400;1,600;1,700;1,800;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,300;0,400;0,600;0,700;0,800;0,900;1,100;1,300;1,400;1,600;1,700;1,800;1,900&display=swap');

/* mobile */
@media all and (min-width:0px) and (max-width: 650px) {

    .title-header {
        color: white;
        font-family: 'Raleway', sans-serif;
        font-style: normal;
        font-weight: 800;
        font-size: 36px;
        line-height: 48px;
    }

    .title-modal {
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 28px;
        font-feature-settings: 'liga' off;
        color: var(--secondary-gray-text);
    }

    .v-slider__tick-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 12px !important;
        line-height: 20px !important;
    }
}

/* tablet */
@media only screen and (min-width:650px) and (max-width: 1400px) {

    .title-header {
        color: white;
        font-family: 'Raleway', sans-serif;
        font-style: normal;
        font-weight: 800;
        font-size: 48px;
        line-height: 56px;
    }

    .title-modal {
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 28px;
        font-feature-settings: 'liga' off;
        color: var(--secondary-gray-text);
    }

    .v-slider__tick-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 12px !important;
        line-height: 20px !important;
    }
}

@media only screen and (min-width: 1400px) {

    .title-header {
        color: white;
        font-family: 'Raleway', sans-serif;
        font-style: normal;
        font-weight: 800;
        font-size: 48px;
        line-height: 56px;
    }

    .title-modal {
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 30px;
        line-height: 36px;
        font-feature-settings: 'pnum' on, 'lnum' on;
        color: var(--secondary-gray-text);
    }

    .v-slider__tick-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 22px !important;
    }
}

/* main variables */
:root {
    --main-background: #F5F5F5;
    --dark-background: #13151C;

    --secondary: #FFFFFF;
    --dark-secondary: #1D2029;

    --main-gray-text: #29323E;
    --secondary-gray-text: #333333;
    --third-lightgray-text: #ADB3BD;
    --fourth-lightgray-text: #C5C9D1;
    --dark-white-text: #FFFFFF;

    --dark-blue-values: #1C95E7;

    --main-card-background: #FFFFFF;
    --dark-card-background: #1D2029;

    --main-card-status-background: #F5F5F5;
    --dark-card-status-background: #29323E;

    --main-banner-background: #E5E7EA;
    --dark-banner-background: #1D2029;


    --main-chart-subtitle: #707A8B;
    --dark-chart-subtitle: #4C586D;

    --main-banner-status-text: #29323E;

    --logo-color: #ffffff;

    --orange-gradient: linear-gradient(91.26deg, #FE7F2D 0%, #FCCA46 100%);
    --blue-gradient: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);

    --link: #1C95E7;
    --main-blue: #1C95E7;
}

html {
    overflow-y: auto !important;
}

#app {
    background-color: var(--main-background);
}

.blur-content > * {
    filter: blur(5px);
}

.blur-none {
    filter: blur(0) !important;
}

.disable-content > * {
    pointer-events: none;
}

.enable-content {
    pointer-events: initial !important;
}

.v-application {
    font-family: 'Lato', sans-serif !important;
}

::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px !important;
    background-color: #F5F5F5;
}

::-webkit-scrollbar {
    width: 12px;
    background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb {
    border-radius: 10px !important;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color: #555;
}

.bn-onboard-modal {
    z-index: 999 !important;
}

.bn-onboard-modal-content {
    background-color: var(--secondary) !important;
    width: 500px !important;
    border-radius: 24px !important;
}

.bn-onboard-custom .bn-onboard-modal-content-header-icon,
.bn-onboard-custom .bn-onboard-select-description,
.bn-onboard-selected-wallet > span > i {
    display: none;
}

.bn-onboard-selected-wallet {
    background: none !important;
    border: 1px solid var(--link) !important;
    border-radius: 16px !important;
}

.bn-onboard-modal-select-wallets > div > .bn-onboard-prepare-button {
    background: none !important;
    border: none !important;
}

.bn-onboard-select-info-container > .bn-onboard-prepare-button {
    display: none !important;
}

.bn-onboard-modal-select-wallets > li, .bn-onboard-icon-button {
    width: 100% !important;
}

.bn-onboard-custom .bn-onboard-modal-content-header-heading {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 30px;
    line-height: 36px;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
    margin-bottom: 15px !important;
}

.bn-onboard-icon-button > span {
    font-family: 'Roboto', sans-serif;
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text);
}

.bn-onboard-select-wallet-info {
    margin-left: 10px;
    font-family: 'Lato', sans-serif !important;
    color: var(--link) !important;
    font-style: normal !important;
    font-weight: normal !important;
    font-size: 14px !important;
    line-height: 24px !important;
}

.bn-onboard-modal-content-close, .bn-onboard-prepare-button-left {
    display: none !important;
}

.progress-col > .v-progress-linear > .v-progress-linear__buffer {
    background-color: #E5E7EA !important;
}

.progress-col > .v-progress-linear > .v-progress-linear__determinate {
    left: 0 !important;
    right: auto !important;
}

.v-slider__tick-label {
    font-family: 'Roboto', sans-serif !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: var(--main-gray-text) !important;
}

.percent-slider .v-slider__tick:not(:nth-child(5n + 1)) {
    display: none !important;
}

.percent-slider .v-slider__tick:nth-child(5n + 1) {
    background-color: #FFFFFF !important;
    border-radius: 5px !important;
    border: 1px solid #DEE1E5;
}

.step-slider .v-slider__tick:nth-child(n) {
    background-color: #FFFFFF !important;
    border-radius: 5px !important;
    border: 1px solid #DEE1E5;
}

.v-slider__tick--filled {
    border: 2px solid #1C95E7 !important;
}
</style>
