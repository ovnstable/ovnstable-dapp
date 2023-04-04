<template>
    <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
            <div class="select-bar-main-container mt-1"
                 v-click-outside="clickMenuOutside"
                 @click="openedList = !openedList"
                 v-bind="attrs"
                 v-on="on">
                <v-row justify="end" align="center" class="select-bar-container">
                    <v-col cols="12" class="select-col">
                        <div class="btn-icon"
                             style="display: flex">
                            <v-img class="selected-network-icon" :src="icon"/>
                            <v-icon :class="$wu.isMobile() ? 'mb-4' : 'mb-5'" small color="var(--secondary-gray-text)" v-if="alphaNetwork">mdi-alpha</v-icon>
                            <v-icon :class="$wu.isMobile() ? 'mb-4' : 'mb-5'" small color="var(--secondary-gray-text)" v-if="betaNetwork">mdi-beta</v-icon>
                            <v-icon color="var(--secondary-gray-text)" :class="(alphaNetwork || betaNetwork) ? 'ml-n1' : 'ml-2'">
                                {{ openedList ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                            </v-icon>
                        </div>
                    </v-col>
                </v-row>
            </div>
        </template>
        <v-list class="network-select-list">
            <v-list-item style="cursor: pointer" @click="setWalletNetwork('10')">
                <v-list-item-avatar>
                    <div class="list-item-icon">
                        <v-img :src="require('@/assets/network/op.svg')"/>
                    </div>
                </v-list-item-avatar>
                <v-list-item-title class="network-select-list-item">
                    Optimism
                </v-list-item-title>
            </v-list-item>
            <v-list-item style="cursor: pointer" @click="setWalletNetwork('42161')">
                <v-list-item-avatar>
                    <div class="list-item-icon">
                        <v-img :src="require('@/assets/network/ar.svg')"/>
                    </div>
                </v-list-item-avatar>
                <v-list-item-title class="network-select-list-item">
                    Arbitrum
                </v-list-item-title>
            </v-list-item>
            <v-list-item style="cursor: pointer" @click="setWalletNetwork('56')">
                <v-list-item-avatar>
                    <div class="list-item-icon">
                        <v-img :src="require('@/assets/network/bsc.svg')"/>
                    </div>
                </v-list-item-avatar>
                <v-list-item-title class="network-select-list-item">
                    BSC
                    <v-icon class="mb-5" small color="var(--secondary-gray-text)"></v-icon>
                </v-list-item-title>
            </v-list-item>
            <v-list-item style="cursor: pointer" @click="setWalletNetwork('324')">
                <v-list-item-avatar>
                    <div class="list-item-icon">
                        <v-img :src="require('@/assets/network/zk.svg')"/>
                    </div>
                </v-list-item-avatar>
                <v-list-item-title class="network-select-list-item">
                    ZkSync
                </v-list-item-title>
            </v-list-item>
            <v-list-item style="cursor: pointer" @click="setWalletNetwork('137')">
                <v-list-item-avatar>
                    <div class="list-item-icon">
                        <v-img :src="require('@/assets/network/polygon.svg')"/>
                    </div>
                </v-list-item-avatar>
                <v-list-item-title class="network-select-list-item">
                    Polygon
                    <v-icon class="mb-5" small color="var(--secondary-gray-text)"></v-icon>
                </v-list-item-title>
            </v-list-item>
            <v-list-item disabled>
                <v-list-item-avatar>
                    <div class="list-item-icon">
                        <v-img style="filter: grayscale(100%);" :src="require('@/assets/currencies/ETH.svg')"/>
                    </div>
                </v-list-item-avatar>
                <v-list-item-title class="network-select-list-item list-item-disabled">
                    Ethereum
                    <v-icon class="mb-5" small></v-icon>
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

let polygonIcon = require('@/assets/network/polygon.svg');
let bscIcon = require('@/assets/network/bsc.svg');
let optimismIcon = require('@/assets/network/op.svg');
let arbitrumIcon = require('@/assets/network/ar.svg');
let zksyncIcon = require('@/assets/network/zk.svg');

export default {
    name: "NetworkSelect",

    components: {},

    data: () => ({
        openedList: false,
        alphaNetworks: [],
        betaNetworks: [],
    }),

    computed: {
        ...mapGetters('network', ['networkId']),

        icon: function () {
            switch (this.networkId){
                case 137:
                    return polygonIcon;
                case 56:
                    return bscIcon;
                case 10:
                    return optimismIcon;
                case 42161:
                    return arbitrumIcon;
                case 324:
                    return zksyncIcon;
            }
        },

        alphaNetwork: function () {
            return this.alphaNetworks.includes(this.networkId);
        },

        betaNetwork: function () {
            return this.betaNetworks.includes(this.networkId);
        }
    },

    methods: {
        ...mapActions('network', ['setWalletNetwork']),

        clickMenuOutside() {
            this.openedList = false;
        }
    }
}
</script>

<style scoped>
/* mobile */
@media only screen and (max-width: 960px) {

    .list-item-icon, .btn-icon, .selected-network-icon {
        width: 26px !important;
        height: 26px !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .list-item-icon, .btn-icon, .selected-network-icon {
        width: 32px !important;
        height: 32px !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .list-item-icon, .btn-icon, .selected-network-icon {
        width: 32px !important;
        height: 32px !important;
    }
}

.network-select-list {
    background-color: var(--secondary) !important;
    border-radius: 10px;
    width: 200px !important;
}

.network-select-list-item {
    color: var(--secondary-gray-text) !important;
    font-weight: 600;
    font-size: 17px;
    margin-left: -5px;
}

.list-item-disabled {
    color: var(--third-gray-text) !important;
    font-weight: 600;
    font-size: 17px;
    margin-left: -5px;
}
</style>
