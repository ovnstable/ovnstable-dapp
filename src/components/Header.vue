<template>
    <v-app-bar
            class="app-bar pa-4 pt-4"
            dense
            app>
        <v-col cols="3" class="ml-0 pl-0">
            <Logo/>
        </v-col>

        <v-col cols="1" class="ml-0 pl-0">
            <NetworkSelect/>
        </v-col>

        <v-col cols="4" class="ma-0 pa-0">
            <Menu/>
        </v-col>

        <template v-if="!loadingWeb3">
            <v-col cols="4">
                <AccountBar v-if="!switchToPolygon"/>
                <SwitchToPolygon v-else/>
            </v-col>
        </template>
        <template v-else>
            <v-col cols="4">
                <v-container>
                    <v-row justify="end">
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
import NetworkSelect from "./common/NetworkSelect";
import Menu from "./common/Menu";

export default {
    name: 'Header',

    components: {
        Menu,
        Logo,
        NetworkSelect,
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

.progress {
    width: 300px;
    background: var(--orange-gradient);
}

.app-bar {
    height: 72px !important;
    box-shadow: none !important;
    background-color: var(--main-background) !important;
}

</style>
