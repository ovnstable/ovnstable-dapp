<template>
    <div>
        <div class="mt-10">
            <label class="title-label">Earn</label>
        </div>

        <v-row align="start" justify="start" class="ma-0">
          <v-col :cols="$wu.isFull() ? 9 : 12" class="ma-n3">
            <v-row align="center" justify="start" class="ma-0 toggle-row mt-10">
              <label  @click="tab=1" class="tab-btn mr-4" v-bind:class="activeTabFeatured" disabled>Featured<v-icon size="16">mdi-star-circle</v-icon></label>
              <label style="color: #C5C9D1 !important"  class="tab-btn tab-btn-disabled mx-4" v-bind:class="activeTabHold">USD+</label>
              <label style="color: #C5C9D1 !important"  class="tab-btn tab-btn-disabled mx-4" v-bind:class="activeTabPools" disabled>USD+ pools</label>
              <label  @click="tab=4"   class="tab-btn ml-4" v-bind:class="activeTabHedged" disabled>ETS</label>

              <v-spacer></v-spacer>

              <v-menu offset-y v-if="$wu.isFull()"> </v-menu>
            </v-row>
          </v-col>
        </v-row>

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
  border-bottom: 2px solid var(--links-blue) !important;
  color: var(--links-blue) !important;
  cursor: pointer;
}


.tab-button-in-active {
  color: #C5C9D1 !important;
  cursor: pointer;
}

.mdi-star-circle {
  color: var(--links-blue) !important;
  cursor: pointer !important;
}

.tab-btn {
  font-family: 'Roboto', sans-serif;
  font-feature-settings: 'liga' off;
  color: var(--secondary-gray-text);
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
    color: var(--main-gray-text);
}
</style>
