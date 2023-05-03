<template>
    <v-app id="app">
        <router-view></router-view>
    </v-app>
</template>

<script>

export default {
    name: 'App',

    data: () => ({
    }),

    computed: {
    },

    created() {
      console.log('App created');
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
        font-size: 18px;
        line-height: 22px;
        font-feature-settings: 'liga' off;
        color: var(--secondary-gray-text);
    }

    .v-slider__tick-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 12px !important;
        line-height: 20px !important;
    }

    .bn-onboard-icon-button > div {
        width: 24px !important;
        height: 24px !important;
        min-width: 24px !important;
        min-height: 24px !important;
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
        font-size: 22px;
        line-height: 26px;
        font-feature-settings: 'liga' off;
        color: var(--secondary-gray-text);
    }

    .v-slider__tick-label {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 12px !important;
        line-height: 20px !important;
    }

    .bn-onboard-icon-button > div {
        width: 32px !important;
        height: 32px !important;
        min-width: 32px !important;
        min-height: 32px !important;
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

    .bn-onboard-icon-button > div {
        width: 40px !important;
        height: 40px !important;
        min-width: 40px !important;
        min-height: 40px !important;
    }
}

/* main variables */
/*:root {*/

/*}*/

:root {
    /*--w3o-background-color: "unset";*/
    /*--w3o-foreground-color: "unset";*/
    /*--w3o-text-color: "unset";*/
    --w3o-border-color: transparent;
    /*--w3o-action-color: "unset";*/
    --w3o-font-family: 'Roboto', sans-serif;
    --orange-gradient: linear-gradient(91.26deg, #FE7F2D 0%, #FCCA46 100%);
    --blue-gradient: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);

    --onboard-checkbox-background: var(--links-blue);
    /*--account-center-z-index: 999 !important;*/
    --onboard-modal-z-index: 999 !important;

    /* CUSTOMIZE SECTIONS OF THE CONNECT MODAL */
    --onboard-connect-content-width: 500px;
    --onboard-wallet-columns: 2;
    --onboard-connect-sidebar-background: var(--main-background);
    --onboard-connect-sidebar-color: var(--main-gray-text);
    --onboard-connect-sidebar-progress-background: var(--links-blue);
    --onboard-connect-sidebar-progress-color: #FFFFFF;
    --onboard-connect-header-background: var(--main-background);
    --onboard-connect-header-color: var(--main-gray-text);
    --onboard-main-scroll-container-background: var(--secondary);
    --onboard-link-color: var(--links-blue);
    --onboard-close-button-background: #FFFFFF;
    --onboard-close-button-color:  var(--main-gray-text);
    --onboard-wallet-button-background: var(--card-info-background);
    --onboard-wallet-button-background-hover: var(--hover);
    --onboard-wallet-button-color: var(--main-gray-text);
    --onboard-wallet-button-color-hover: var(--main-gray-text);
    --onboard-wallet-button-border-color: transparent;
    --onboard-wallet-button-border-radius: 8px;

    /* CUSTOMIZE THE SHARED MODAL */
    --onboard-modal-color: var(--main-gray-text);

    /* CUSTOMIZE THE CONNECT MODAL */
    --onboard-modal-border-radius: 18px;

    /* FONTS */
    --onboard-font-family-normal: 'Roboto', sans-serif;

    --onboard-font-size-5: 18px;
    --onboard-font-size-6: 16px;
    --onboard-font-size-7: 14px;
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
    background-color: var(--scrollbar-track-color);
}

::-webkit-scrollbar {
    width: 14px;
    background-color: var(--scrollbar-track-color);
}

::-webkit-scrollbar-thumb {
    border-radius: 10px !important;
    background-color: var(--scrollbar-slider-color);
}

.bn-onboard-modal {
    z-index: 999 !important;
}

.bn-onboard-modal-content {
    background-color: var(--secondary) !important;
    width: 460px !important;
    border-radius: 24px !important;
}

.bn-onboard-custom .bn-onboard-modal-content-header-icon,
.bn-onboard-custom .bn-onboard-select-description,
.bn-onboard-selected-wallet > span > i {
    display: none;
}

.bn-onboard-selected-wallet {
    background: none !important;
    border: 1px solid var(--links-blue) !important;
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
    color: var(--links-blue) !important;
    font-style: normal !important;
    font-weight: normal !important;
    font-size: 14px !important;
    line-height: 24px !important;
}

.bn-onboard-modal-content-close, .bn-onboard-prepare-button-left {
    display: none !important;
}

.progress-col > .v-progress-linear > .v-progress-linear__buffer {
    background-color: var(--progress-card-info) !important;
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
    background-color: var(--secondary) !important;
    border-radius: 5px !important;
    border: 1px solid var(--main-border);
}

.step-slider .v-slider__tick:nth-child(n) {
    background-color: var(--secondary) !important;
    border-radius: 5px !important;
    border: 1px solid var(--main-border);
}

.v-slider__tick--filled {
    border: 2px solid var(--links-blue) !important;
}

.close-icon {
    color: var(--main-gray-text) !important;
}
</style>
