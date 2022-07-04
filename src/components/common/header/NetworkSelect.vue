<template>
    <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
            <div class="select-bar-main-container mt-1"
                 v-click-outside="clickMenuOutside"
                 @click="openedList = !openedList"
                 v-bind="attrs"
                 v-on="on">
                <v-row align="center" class="select-bar-container">
                    <v-col cols="12" class="select-col">
                        <div class="btn-icon"
                             style="display: flex">
                            <v-img :src="icon"/>
                            <v-icon color="#333333" class="ml-2">
                                {{ openedList ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                            </v-icon>
                        </div>
                    </v-col>
                </v-row>
            </div>
        </template>
        <v-list class="network-select-list">
            <v-list-item style="cursor: pointer" target="_blank" href="https://app.overnight.fi">
                <v-list-item-avatar>
                    <div class="list-item-icon">
                        <v-img :src="require('@/assets/network/polygon.svg')"/>
                    </div>
                </v-list-item-avatar>
                <v-list-item-title class="network-select-list-item">
                    Polygon
                </v-list-item-title>
            </v-list-item>
            <v-list-item style="cursor: pointer"  target="_blank" href="https://avax.overnight.fi">
                <v-list-item-avatar>
                    <div class="list-item-icon">
                        <v-img :src="require('@/assets/network/avalanche.svg')"/>
                    </div>
                </v-list-item-avatar>
                <v-list-item-title class="network-select-list-item">
                    Avalanche
                </v-list-item-title>
            </v-list-item>
            <v-list-item disabled>
                <v-list-item-avatar>
                    <div class="list-item-icon">
                        <v-img style="filter: grayscale(100%);" :src="require('@/assets/network/arbitrum.svg')"/>
                    </div>
                </v-list-item-avatar>
                <v-list-item-title class="list-item-disabled">
                    Arbitrum (Soon)
                </v-list-item-title>
            </v-list-item>
            <v-list-item disabled>
                <v-list-item-avatar>
                    <div class="list-item-icon">
                        <v-img style="filter: grayscale(100%);" :src="require('@/assets/network/ftm.png')"/>
                    </div>
                </v-list-item-avatar>
                <v-list-item-title class="list-item-disabled">
                    Fantom (Soon)
                </v-list-item-title>
            </v-list-item>
            <v-list-item disabled>
                <v-list-item-avatar>
                    <div class="list-item-icon">
                        <v-img style="filter: grayscale(100%);" :src="require('@/assets/currencies/eth.svg')"/>
                    </div>
                </v-list-item-avatar>
                <v-list-item-title class="list-item-disabled">
                    Ethereum (Soon)
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
import {mapGetters} from "vuex";

let polygonIcon = require('@/assets/network/polygon.svg');
let avaxIcon = require('@/assets/network/avalanche.svg');

export default {
    name: "NetworkSelect",

    components: {},

    data: () => ({
        openedList: false,
    }),

    computed: {
        ...mapGetters('web3', ['networkId']),


        icon: function (){

            if (this.networkId === 137){
                return polygonIcon;
            }else if (this.networkId === 43114) {
                return avaxIcon;
            }

        }
    },

    methods: {
        clickMenuOutside() {
            this.openedList = false;
        }
    }
}
</script>

<style scoped>

.network-select-list {
    background-color: var(--secondary) !important;
    border-radius: 10px;
}

.network-select-list-item {
    color: #333333;
    font-size: 17px;
    margin-left: -5px;
}

.list-item-icon {
    width: 28px;
    height: 28px;
}

.list-item-disabled {
    color: #C5C9D1;
    font-size: 17px;
    margin-left: -5px;
}

.btn-icon {
    width: 28px;
    height: 28px;
}

.select-bar-main-container {
    width: 56px !important;
}

.select-bar-container {
    background-color: white !important;
    border-radius: 2px;
    height: 48px !important;
    cursor: pointer;
}

.select-col {
    margin-top: -2px;
}

</style>
