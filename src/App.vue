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
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,400;0,500;0,600;0,700;0,800;0,900;1,300&display=swap');

/* main variables */
:root {
    --main-background: #080a0c;
    --secondary: #181E25;
    --logo-color: #ffffff;
    --orange-gradient: linear-gradient(91.26deg, #FE7F2D 0%, #FCCA46 100%);
    --link: #3d8dff;
}

html {
    overflow-y: auto !important;
}

#app {
    background-color: var(--main-background);
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

.Vue-Toastification__toast--success.toast {
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 25px;
    padding-right: 20px;
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

.bn-onboard-modal-select-wallets > li, .bn-onboard-icon-button {
    width: 100% !important;
}

.bn-onboard-custom .bn-onboard-modal-content-header-heading {
    font-family: 'Lato', sans-serif !important;
    color: white !important;
    font-weight: 300 !important;
    font-size: 20px !important;
    margin-bottom: 15px !important;
}

.bn-onboard-icon-button > span {
    font-family: 'Lato', sans-serif !important;
    color: white !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    line-height: 24px !important;
    font-style: normal !important;
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

</style>
