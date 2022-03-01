<template>
    <v-app-bar
            class="app-bar pt-4"
            dense
            app>
        <v-col class="logo-col">
            <Logo/>
        </v-col>

        <v-col class="ma-0 pa-0 menu-col">
            <Menu class="menu-col-content"/>
        </v-col>

        <template v-if="!loadingWeb3">
            <v-col class="settings-col">
                <AccountBar v-if="!switchToPolygon"/>
                <SwitchToPolygon v-else/>
            </v-col>
        </template>
        <template v-else>
            <v-col class="settings-col">
                <v-container>
                    <v-row justify="end" align="center">
                        <v-progress-linear
                                dark
                                class="progress"
                                background-opacity="0"
                                color="var(--main-background)"
                                rounded
                                indeterminate
                        ></v-progress-linear>
                    </v-row>
                </v-container>
            </v-col>
        </template>
    </v-app-bar>
</template>
<script>

import {mapActions, mapGetters, mapMutations} from "vuex";
import SwitchToPolygon from "./common/SwitchToPolygon";
import AccountBar from "./common/AccountBar";
import Logo from "./common/Logo";
import Menu from "./common/Menu";

export default {
    name: 'Header',

    components: {
        Menu,
        Logo,
        AccountBar,
        SwitchToPolygon
    },

    data: () => ({
    }),


    computed: {
        ...mapGetters('web3', ['account', 'web3', 'contractNames', 'networkId', 'switchToPolygon', 'loadingWeb3']),
    },

    methods: {
    }
}
</script>

<style>

/* mobile version */
@media only screen and (max-width: 1400px) {
    .menu-col-content {
        display: none !important;
    }

    .logo-col {
        width: 33%;
    }

    .settings-col {
        width: 67%;
    }
}

@media only screen and (min-width: 1400px) {
    .app-bar {
        padding: 16px;
    }

    .logo-col {
        padding-left: 20px;
    }

    .logo-col, .settings-col {
        width: 33%;
    }

    .menu-col {
        width: 34%;
    }

    .progress {
        width: 300px;
    }
}

.progress {
    background: var(--orange-gradient);
}

.app-bar {
    height: 72px !important;
    box-shadow: none !important;
    background-color: var(--main-background) !important;
}
</style>
