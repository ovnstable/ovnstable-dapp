<template>
    <v-app id="app">
        <router-view></router-view>
    </v-app>
</template>

<script>

import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
    name: 'App',

    data: () => ({}),

    computed: {},

    created() {
    }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');

/* main variables */
:root {
    --main-background: #000000;
    --logo-color: #ffffff;
    --orange-gradient: linear-gradient(91.26deg, #FE7F2D 0%, #FCCA46 100%);
}

html {
    overflow-y: auto !important;
}

.v-application {
    font-family: 'Lato', sans-serif !important;
}

::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
}

::-webkit-scrollbar {
    width: 12px;
    background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb {
    border-radius: 10px;
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

.bn-onboard-modal-content-close, .bn-onboard-prepare-button-left {
    display: none !important;
}

</style>
