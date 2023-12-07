<template>
    <div>
        <div class="mt-10">
            <label class="title-label">About Insurance</label>
        </div>

        <v-row align="start" justify="start" class="ma-0 mt-5 toggle-row">
            <label @click="setTab('about')" class="tab-btn mr-4" v-bind:class="activeTabAbout">
                About Insurance
            </label>
            <label style="color: #C5C9D1 !important" class="tab-btn tab-btn-disabled mx-4" v-bind:class="activeTabAll" disabled>
                All Insurance
            </label>
<!--            <label @click="setTab('all')" class="tab-btn mx-4" v-bind:class="activeTabAll">-->
<!--                All Insurance-->
<!--            </label>-->

            <v-spacer></v-spacer>
        </v-row>

        <div class="mt-7 cards-list-container">
            <v-row class="d-flex" justify="start" v-if="tab === 'about'">
                <v-col :cols="$wu.isMobile() ? 12 : ($wu.isTablet() ? 6 : 4)">
                    <v-row class="fill-height">
                        <InsuranceCard class="ma-3"/>
                    </v-row>
                </v-col>
                <v-col :cols="$wu.isMobile() ? 12 : ($wu.isTablet() ? 6 : 8)">
                    <v-row class="fill-height">
                        <InsuranceInfoCard class="ma-3"/>
                    </v-row>
                </v-col>
            </v-row>

            <template v-if="tab === 'all'">
<!--                <InsuranceList></InsuranceList>-->
            </template>
        </div>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapGetters} from "vuex";
import InsuranceCard from "@/components/insurance/cards/insurance/InsuranceCard";
import InsuranceInfoCard from "@/components/insurance/cards/insurance/InsuranceInfoCard";


export default {
    name: "InsuranceView",

    components: {
        InsuranceInfoCard,
        InsuranceCard,
        // InsuranceList
    },

    data: () => ({
        tab: 'about',
        sortedCardList: [],
    }),

    computed: {
        ...mapGetters('network', ['appApiUrl', 'networkId', 'polygonConfig', 'bscConfig', 'opConfig', 'arConfig', 'zkConfig']),

        activeTabAbout: function () {
            return {
                'tab-button': this.tab === 'about',
                'tab-button-in-active': this.tab !== 'about',
            }
        },

        activeTabAll: function () {
            return {
                'tab-button': this.tab === 'all',
                'tab-button-in-active': this.tab !== 'all',
            }
        },
    },

    watch: {
        appApiUrl: function (newVal, oldVal) {
        },
    },

    created() {
    },

    methods: {
        setTab(newTab) {
            this.tab = newTab;
        }

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

    .prototypes-label {
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.04em;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
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
        font-size: 18px;
        line-height: 28px;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }
}


@media only screen and (min-width: 1300px) {
    .tab-btn {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 28px;
    }

    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 48px;
        line-height: 60px;
    }
}

.tab-button {
    border-bottom: 2px solid var(--links-blue) !important;
    color: var(--links-blue) !important;
    cursor: pointer;
}

.tab-button-in-active {
    cursor: pointer;
}

.tab-btn {
    font-feature-settings: 'liga' off;
    color: var(--secondary-gray-text);
    margin-bottom: -2px;
    cursor: pointer;
}

.tab-btn-disabled {
    cursor: default;
}

.toggle-row {
    border-bottom: 2px solid var(--main-border);
}


.cards-list-container {
    margin-bottom: 15% !important;
    width: 100% !important;
}

.toggle-row {
    width: 100% !important;
}

.title-label {
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}
</style>
