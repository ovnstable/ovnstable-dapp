<template>
    <v-menu transition="slide-y-reverse-transition" offset-y>
        <template v-slot:activator="{ on, attrs }">
            <div class="select-bar-main-container"
                 v-click-outside="clickMenuOutside"
                 @click="openedList = !openedList"
                 v-bind="attrs"
                 v-on="on">
                <div class="btn-icon">
                    <v-img class="selected-network-icon" :src="icon"/>
                    <img
                        :src="alphaNetwork ? (light ? require('@/assets/icon/alpha_black.svg') : require('@/assets/icon/alpha_white.svg')) : ''"
                        alt="Alpha Icon"
                        class="alpha"
                        :class="$wu.isMobile() ? 'mb-4' : 'mb-5'"
                        />
                        <img
                        :src="betaNetwork ? (light ? require('@/assets/icon/beta_black.svg') : require('@/assets/icon/beta_white.svg')) : ''"
                        alt="Beta Icon"
                        class="beta"
                        :class="$wu.isMobile() ? 'mb-4' : 'mb-5'"
                    />
                    <img
                        :src="light
                            ? (openedList ? require('@/assets/icon/up_w.svg') : require('@/assets/icon/down_w.svg'))  
                            : (openedList ? require('@/assets/icon/up_black.svg') : require('@/assets/icon/down_black.svg'))"
                        alt="Chevron Icon"
                        class="arrow"
                        :class="(alphaNetwork || betaNetwork) ? 'ml-n1' : 'ml-2'"
                />
                </div>
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
                default:
                    return ""
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

<style lang="scss" scoped>
.btn-icon {
    display: flex;
}
.select-bar-main-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 10px;
    border-radius: 2px;
    transition: opacity .2s ease, background-color .2s ease;
}

.select-bar-main-container:hover {
    background-color: rgba(6, 120, 196, 0.9);
    opacity: .9;
}
.list-item-icon, .btn-icon, .selected-network-icon .v-image__image {
    width: 28px;
    height: 28px;
    margin-right: 10px;
}

.network-select-list {
    background-color: var(--secondary);
    border-radius: 10px;
    width: 200px;
}

.network-select-list-item {
    color: var(--secondary-gray-text);
    font-weight: 600;
    font-size: 17px;
    margin-left: -5px;
}

.list-item-disabled {
    color: var(--third-gray-text);
    font-weight: 600;
    font-size: 17px;
    margin-left: -5px;
}

.navbar-list-divider {
    border-top: 1px solid var(--input-placeholder);
}

.divider-container {
    padding-left: 15px;
    padding-right: 15px;
}

.name-deprecated {
    color:  rgba(112, 122, 139, 1);
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

.arrow {
    margin-top: 8px;
    width: 12px;
    height: 12px;
}

.alpha,
.beta {
    width: 12px;
    height: 12px;
}
</style>
