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
                            <v-icon color="var(--secondary-gray-text)" :class="(alphaNetwork || betaNetwork) ? 'ml-n1' : 'ml-0'">
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
            <v-list-item style="cursor: pointer" @click="setWalletNetwork('8453')">
                <v-list-item-avatar>
                    <div class="list-item-icon">
                        <v-img :src="require('@/assets/network/base.svg')"/>
                    </div>
                </v-list-item-avatar>
                <v-list-item-title class="network-select-list-item">
                    Base
                </v-list-item-title>
            </v-list-item>
            <v-list-item style="cursor: pointer" @click="setWalletNetwork('59144')">
                <v-list-item-avatar>
                    <div class="list-item-icon">
                        <v-img :src="require('@/assets/network/linea.svg')"/>
                    </div>
                </v-list-item-avatar>
                <v-list-item-title class="network-select-list-item">
                    <div style="display: inline-block">
                        Linea
                    </div>
                    <div style="position: relative">
                        <div class="tooltip-info">
                            <Tooltip
                                text="In the process of launch"
                                top
                            />
                        </div>
                    </div>
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

            <div class="divider-container">
                <div class="navbar-list-divider mt-3 mb-1"></div>
            </div>

            <v-list-item>
                <div @click="openDeprecatedDocsLink()" class="title-deprecated pl-4">
                    DEPRECATED
                    <img :src="require('@/assets/icon/deprecated-link.svg')" width="13px" style="display: inline-block" alt="->"/>
                </div>
            </v-list-item>

            <v-list-item @click.stop="toggleDeprecatedType()"
                         class="switch-container">
                <img v-if="isDeprecatedShow"
                     :src="require('@/assets/icon/deprecated-on.svg')"
                     width="50px"
                     class="switch-text" alt="on"/>
                <img v-if="!isDeprecatedShow"
                     :src="require('@/assets/icon/deprecated-off.svg')"
                     width="50px"
                     class="switch-button-image" alt="off"/>
                <div class="switch-text">
                    Deprecated
                    <span v-if="isDeprecatedShow">on</span>
                    <span v-if="!isDeprecatedShow">off</span>
                </div>
            </v-list-item>

            <v-list-item v-if="isDeprecatedShow">
                <v-list-item style="cursor: pointer" @click="setWalletNetwork('137')">
                    <v-list-item-avatar>
                        <div class="list-item-icon">
                            <v-img :src="require('@/assets/network/polygon-deprecated.svg')"/>
                        </div>
                    </v-list-item-avatar>
                    <v-list-item-title class="network-select-list-item name-deprecated">
                        Polygon
                        <v-icon class="mb-5" small color="var(--secondary-gray-text)"></v-icon>
                    </v-list-item-title>
                </v-list-item>
            </v-list-item>

        </v-list>
    </v-menu>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import Tooltip from "@/components/common/element/Tooltip.vue";

let polygonIcon = require('@/assets/network/polygon.svg');
let bscIcon = require('@/assets/network/bsc.svg');
let optimismIcon = require('@/assets/network/op.svg');
let arbitrumIcon = require('@/assets/network/ar.svg');
let baseIcon = require('@/assets/network/base.svg');
let lineaIcon = require('@/assets/network/linea.svg');
let zksyncIcon = require('@/assets/network/zk.svg');

export default {
    name: "NetworkSelect",

    components: {Tooltip},

    data: () => ({
        openedList: false,
        alphaNetworks: [],
        betaNetworks: [],
    }),

    computed: {
        ...mapGetters('network', ['networkId']),
        ...mapGetters('deprecated', ['isDeprecatedShow']),

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
                case 8453:
                    return baseIcon;
                case 59144:
                    return lineaIcon;
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
        ...mapActions('deprecated', ['loadDeprecatedShow', 'updateDeprecatedShow']),
        ...mapActions('network', ['setWalletNetwork']),

        clickMenuOutside() {
            this.openedList = false;
        },
        toggleDeprecatedType() {
            console.log('toggleDeprecatedType', this.isDeprecatedShow)
           this.updateDeprecatedShow(!this.isDeprecatedShow)
        },
        openDeprecatedDocsLink() {
            window.open('https://docs.overnight.fi/advanced/deprecation', '_blank');
        }
    }
}
</script>

<style scoped>
/* mobile */
@media only screen and (max-width: 960px) {

    .list-item-icon, .btn-icon, .selected-network-icon {
        width: 24px !important;
        height: 24px !important;
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

.navbar-list-divider {
    border-top: 1px solid var(--input-placeholder) !important;
}

.divider-container {
    padding-left: 15px;
    padding-right: 15px;
}

.name-deprecated {
    color:  rgba(112, 122, 139, 1) !important;
}

.title-deprecated {
    color: rgba(173, 179, 189, 1);
    cursor: pointer;
}

.switch-text {
    display: inline-block;
    padding-left: 8px;
    color: var(--main-gray-text);
}

.switch-button-image {
    display: inline-block;
}

.switch-container {
    cursor: pointer;
}

.tooltip-info {
    position: absolute;
    right: 52px;
    top: -19px;
}
</style>
