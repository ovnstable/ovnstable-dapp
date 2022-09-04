<template>
    <div>
        <div class="mt-10">
            <label class="title-label">Earn</label>
        </div>

        <v-row align="start" justify="start" class="ma-0">
              <v-col class="ma-n3">
                    <v-row align="center" justify="start" class="ma-0 toggle-row mt-10">
                          <label  @click="tab=1" class="tab-btn mr-4" v-bind:class="activeTabFeatured">Featured&nbsp;<v-icon size="16" class="mb-1">mdi-star-circle</v-icon></label>
                          <label @click="tab=2" class="tab-btn mx-4" v-bind:class="activeTabHold">USD+</label>
                          <label style="color: #C5C9D1 !important"  class="tab-btn tab-btn-disabled mx-4" v-bind:class="activeTabPools" disabled>USD+ pools</label>
                          <label  @click="tab=4" class="tab-btn ml-4" v-bind:class="activeTabHedged">ETS</label>

                          <v-spacer></v-spacer>

                          <v-menu offset-y v-if="$wu.isFull()"> </v-menu>
                    </v-row>
              </v-col>
        </v-row>

        <div class="mt-7 cards-list-container">
            <v-row class="d-flex" justify="start">
                <template v-if="tab === 1">
                    <UsdPlus class="ma-3"/>
                    <WmaticUsdPlus class="ma-3"/>
                    <WbnbUsdPlus class="ma-3"/>
                </template>

                <template v-if="tab === 2">
                    <UsdPlus class="ma-3"/>
                </template>

                <template v-if="tab === 3">
                </template>

                <template v-if="tab === 4">
                    <WmaticUsdPlus class="ma-3"/>
                    <WbnbUsdPlus class="ma-3"/>
                </template>
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
import UsdPlus from "@/components/market/cards/hold/UsdPlus";

export default {
    name: "MarketView",

    components: {
        UsdPlus,
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
    .tab-btn {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
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
    .tab-btn {
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 32px;
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
    .tab-btn {
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 32px;
    }


    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }
}

.tab-button {
  border-bottom: 2px solid #1C95E7 !important;
  color: #1C95E7 !important;
  cursor: pointer;
}

.tab-button-in-active {
  color: #C5C9D1 !important;
  cursor: pointer;
}

.mdi-star-circle {
  color: #1C95E7 !important;
  cursor: pointer !important;
}

.tab-btn {
  font-family: 'Roboto', sans-serif;
  font-feature-settings: 'liga' off;
  color: #333333;
  margin-bottom: -2px;
  cursor: pointer;
}

.tab-btn-disabled {
  cursor: default;
}

.toggle-row {
  border-bottom: 2px solid #DCE3E8;
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
