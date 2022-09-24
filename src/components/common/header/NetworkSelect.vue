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
                            <v-img :src="icon"/>
                            <v-icon :class="$wu.isMobile() ? 'mb-4' : 'mb-5'" small color="#333333" v-if="alphaNetwork">mdi-alpha</v-icon>
                            <v-icon :class="$wu.isMobile() ? 'mb-4' : 'mb-5'" small color="#333333" v-if="betaNetwork">mdi-beta</v-icon>
                            <v-icon color="#333333" :class="(alphaNetwork || betaNetwork) ? 'ml-n1' : 'ml-2'">
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
            <v-list-item style="cursor: pointer" @click="setWalletNetwork('137')">
                <v-list-item-avatar>
                    <div class="list-item-icon">
                        <v-img :src="require('@/assets/network/polygon.svg')"/>
                    </div>
                </v-list-item-avatar>
                <v-list-item-title class="network-select-list-item">
                    Polygon
                    <v-icon class="mb-5" small color="#333333"></v-icon>
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
                    <v-icon class="mb-5" small color="#333333"></v-icon>
                </v-list-item-title>
            </v-list-item>
            <v-list-item style="cursor: pointer" @click="setWalletNetwork('43114')">
                <v-list-item-avatar>
                    <div class="list-item-icon">
                        <v-img :src="require('@/assets/network/avalanche.svg')"/>
                    </div>
                </v-list-item-avatar>
                <v-list-item-title class="network-select-list-item">
                    Avalanche
                    <v-icon class="ml-n1 mb-5" small color="#333333">mdi-alpha</v-icon>
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
let avaxIcon = require('@/assets/network/avalanche.svg');
let bscIcon = require('@/assets/network/bsc.svg');
let optimismIcon = require('@/assets/network/op.svg');

export default {
    name: "NetworkSelect",

    components: {},

    data: () => ({
        openedList: false,
        alphaNetworks: [43114],
        betaNetworks: [],
    }),

    computed: {
        ...mapGetters('network', ['networkId']),

        icon: function () {
            switch (this.networkId){
                case 137:
                    return polygonIcon;
                case 43114:
                    return avaxIcon;
                case 10:
                    return optimismIcon;
                case 56:
                    return bscIcon;
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

    .btn-icon, .list-item-icon {
        width: 20px;
        height: 20px;
    }

    .network-select-list-item {
        font-size: 14px;
        margin-left: -12px;
    }

    .select-bar-container {
        height: 28px !important;
    }

    .select-col {
        margin-top: -8px;
    }

    .select-bar-main-container {
        width: 42px !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .btn-icon, .list-item-icon {
        width: 28px;
        height: 28px;
    }

    .network-select-list-item {
        font-size: 16px;
        margin-left: -5px;
    }

    .select-bar-container {
        height: 48px !important;
    }

    .select-col {
        margin-top: -2px;
    }

    .select-bar-main-container {
        width: 56px !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .btn-icon, .list-item-icon {
        width: 28px;
        height: 28px;
    }

    .network-select-list-item {
        font-size: 17px;
        margin-left: -5px;
    }

    .select-bar-container {
        height: 48px !important;
    }

    .select-col {
        margin-top: -2px;
    }

    .select-bar-main-container {
        width: 56px !important;
    }
}

.network-select-list {
    background-color: var(--secondary) !important;
    border-radius: 10px;
    width: 200px !important;
}

.network-select-list-item {
    font-family: 'Roboto', sans-serif !important;
    color: #333333;
}

.list-item-disabled {
    color: #C5C9D1 !important;
}

.select-bar-container {
    background-color: white !important;
    border-radius: 2px;
    cursor: pointer;
}

</style>
