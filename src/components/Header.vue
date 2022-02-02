<template>
    <v-app-bar
            dense
            app
            class="app-bar pa-4 pt-4"
    >
        <v-col cols="4" class="ml-0 pl-0">
            <Logo/>
        </v-col>

        <!-- TODO: add polygon dropdown -->

        <v-col cols="4" class="ma-0 pa-0">
            <Menu/>
        </v-col>

        <template v-if="loadingWeb3">
            <v-col cols="4">
                <v-container>
                    <v-row justify="end">
                        <v-skeleton-loader
                                type="actions"
                        ></v-skeleton-loader>
                    </v-row>
                </v-container>
            </v-col>
        </template>
        <template v-else>
            <v-col cols="3">
                <AccountBar v-if="!switchToPolygon"/>
                <SwitchToPolygon v-if="switchToPolygon"/>
            </v-col>
            <v-col cols="1">
                <v-row justify="start">
                    <Settings/>
                </v-row>
            </v-col>
        </template>

    </v-app-bar>
</template>
<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import SwitchToPolygon from "./common/SwitchToPolygon";
import AccountBar from "./common/AccountBar";
import Settings from "./common/Settings";
import Logo from "./common/Logo";
import Menu from "./common/Menu";


export default {
    name: 'Header',
    components: {Menu, Logo, Settings, AccountBar, SwitchToPolygon},
    data: () => ({}),


    computed: {
        ...mapGetters('web3', ['account', 'web3', 'contractNames', 'networkId', 'switchToPolygon', 'loadingWeb3']),
    },

    methods: {}
}
</script>

<style>
.app-bar {
    height: 72px !important;
    box-shadow: none !important;
    background-color: var(--main-background) !important;
}
</style>
