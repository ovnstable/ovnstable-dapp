<template>
    <v-app id="app">
        <div id="rubic-widget-root" class="rubic-not-show"></div>
        <v-btn id="rubic-widget-close" class="rubic-not-show" icon @click="closeRubicWidget"><v-icon>mdi-close</v-icon></v-btn>

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
        closeRubicWidget() {
            if (document.getElementById("rubic-widget-root").classList.contains("rubic-show")) {

                document.getElementById("rubic-widget-root").classList.remove("rubic-show");
                document.getElementById("rubic-widget-root").classList.add("rubic-not-show");

                document.getElementById("rubic-widget-close").classList.remove("rubic-show");
                document.getElementById("rubic-widget-close").classList.add("rubic-not-show");

                document.getElementById("bridge-button").classList.remove("rubic-not-show");
                document.getElementById("bridge-button").classList.add("rubic-show");
            } else {
                document.getElementById("rubic-widget-root").classList.remove("rubic-not-show");
                document.getElementById("rubic-widget-root").classList.add("rubic-show");

                document.getElementById("rubic-widget-close").classList.remove("rubic-not-show");
                document.getElementById("rubic-widget-close").classList.add("rubic-show");

                document.getElementById("bridge-button").classList.remove("rubic-show");
                document.getElementById("bridge-button").classList.add("rubic-not-show");
            }
        },
    }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,600;0,700;0,800;0,900;1,100;1,300;1,400;1,600;1,700;1,800;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,300;0,400;0,600;0,700;0,800;0,900;1,100;1,300;1,400;1,600;1,700;1,800;1,900&display=swap');

/* mobile */
@media all and (min-width:0px) and (max-width: 650px) {

    #rubic-widget-close {
        right: 64px !important;
    }

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
        color: #333333;
    }
}

/* tablet */
@media only screen and (min-width:650px) and (max-width: 1400px) {

    #rubic-widget-close {
        right: 82px !important;
    }

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
        color: #333333;
    }
}

@media only screen and (min-width: 1400px) {

    #rubic-widget-close {
        right: 90px !important;
    }

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
        color: #333333;
    }
}

/* main variables */
:root {
    --main-background: #F5F5F5;
    --secondary: #FFFFFF;
    --logo-color: #ffffff;
    --orange-gradient: linear-gradient(91.26deg, #FE7F2D 0%, #FCCA46 100%);
    --blue-gradient: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    --link: #1C95E7;
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
    color: #333333;
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
    color: #333333;
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

.rubic-show {
}

.rubic-not-show {
    display: none !important;
}

#rubic-widget-iframe {
    position: absolute !important;
    z-index: 100 !important;
    right: 2% !important;
    top: 100px !important;
}

#rubic-widget-close {
    color: white;
    position: absolute !important;
    z-index: 110 !important;
    top: 118px !important;
}

.progress-col > .v-progress-linear > .v-progress-linear__buffer {
    background-color: #E5E7EA !important;
}

.progress-col > .v-progress-linear > .v-progress-linear__determinate {
    left: 0 !important;
    right: auto !important;
}
</style>
