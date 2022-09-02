<template>
    <div>
        <div class="mt-10">
            <label class="title-label">Earn</label>
        </div>

        <div class="mt-10">
            <v-row justify="start" class="tab-row ma-0">
                <v-btn flat class="group-left-btn" @click="tab=1" v-bind:class="activeTabFeatured">Featured&nbsp;<v-icon size="16">mdi-star-circle</v-icon></v-btn>
                <v-btn style="background-color: transparent !important;" @click="tab=2" v-bind:class="activeTabHold" disabled>USD+</v-btn>
                <v-btn style="background-color: transparent !important;" @click="tab=3" v-bind:class="activeTabPools" disabled>USD+ Pools</v-btn>
                <v-btn class="group-right-btn" @click="tab=4" v-bind:class="activeTabHedged">ETS</v-btn>
            </v-row>
        </div>

        <div class="mt-7 cards-list-container">
            <v-row class="d-flex" justify="start">
                <WmaticUsdPlus class="ma-3"/>
                <WbnbUsdPlus class="ma-3"/>
            </v-row>
        </div>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import WmaticUsdPlus from "@/components/market/cards/wmatic/WmaticUsdPlus";
import {mapGetters} from "vuex";
import WbnbUsdPlus from "@/components/market/cards/wbnb/WbnbUsdPlus";
import OvercapBanner from "@/components/market/cards/wbnb/banner/OvercapBanner";

export default {
    name: "MarketView",

    components: {
        OvercapBanner,
        WbnbUsdPlus,
        WmaticUsdPlus,
    },

    data: () => ({
        tab: 1,
    }),

    computed: {
        ...mapGetters('marketUI', ['showUsdPlusWmatic', 'showUsdPlusWbnb']),

        activeTabFeatured: function () {
            return {
                'tab-button': this.tab === 1,
                'tab-button-in-active': this.tab !== 1,
            }
        },

        activeTabHold: function () {
            return {
                'tab-button': this.tab === 2,
                'tab-button-in-active': this.tab !== 2,
            }
        },

        activeTabPools: function () {
            return {
                'tab-button': this.tab === 3,
                'tab-button-in-active': this.tab !== 3,
            }
        },

        activeTabHedged: function () {
            return {
                'tab-button': this.tab === 4,
                'tab-button-in-active': this.tab !== 4,
            }
        },
    },

    methods: {
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .tab-button {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
    }

    .tab-button-in-active {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
    }

    .tab-button, .tab-button-in-active {
        width: 50% !important;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 32px;
        line-height: 40px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .tab-button {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
    }

    .tab-button-in-active {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .tab-button {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
    }

    .tab-button-in-active {
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }
}

.tab-button {
    background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    border-radius: 0;
    box-shadow: none !important;
    font-family: 'Roboto', sans-serif !important;
    text-transform: none !important;
    font-feature-settings: 'liga' off !important;
    color: #FFFFFF !important;
}

.tab-button-in-active {
    background: none !important;
    border: 1px solid #CED2D8;
    border-radius: 0;
    box-shadow: none !important;
    font-family: 'Roboto', sans-serif !important;
    text-transform: none !important;
    font-feature-settings: 'liga' off !important;
    color: #333333 !important;
}

.group-left-btn {
    border-radius: 2px 0px 0px 2px;
}

.group-right-btn {
    border-radius: 0px 2px 2px 0px;
}

.cards-list-container {
    margin-bottom: 15% !important;
}

.title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #29323E;
}
</style>
