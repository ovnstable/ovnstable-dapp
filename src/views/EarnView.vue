<template>
    <v-container
            class="fill-height"
            fluid>
        <v-row
                align="center"
                justify="center">
            <v-col></v-col>
            <v-col>

                <!-- TODO: move StatsWidget -->
                <!-- <StatsWidget/>-->

                <v-row align="center">
                    <label class="swap-label">Swap</label>
                    <v-spacer></v-spacer>

                    <!-- TODO: add gas price selector -->
                    <!-- <GasPriceSelector/> -->
                    <v-btn icon>
                        <img width="28px" height="28px" :src="require('@/assets/icon/cog.svg')">
                    </v-btn>
                </v-row>

                <v-row>
                    <v-col class="pa-0 ma-0 fixed">
                        <Mint v-if="mintTab"/>
                        <Redeem v-else/>
                    </v-col>
                </v-row>

                <v-row>
                    <button @click="mintTab = !mintTab">
                        <v-icon>mdi-swap-vertical</v-icon>
                    </button>
                </v-row>
            </v-col>
            <v-col></v-col>
        </v-row>

        <!-- TODO: redesign this modal -->
        <!-- <ShowTransaction/>-->
    </v-container>
</template>

<script>


import Redeem from "../components/earn/Redeem";
import Mint from "../components/earn/Mint";
import StatsWidget from "../components/common/StatsWidget";
import ShowTransaction from "../components/common/ShowTransaction";
import {mapActions} from "vuex";
import AddTokenBtn from "../components/common/AddTokenBtn";

export default {
    name: "EarnView",
    components: {AddTokenBtn, ShowTransaction, StatsWidget, Mint, Redeem},
    data: () => ({
        tab: 1,
        mintTab: true,

        total: {
            minted: 113332344,
            circulation: 79886800,
            burnt: 33445544,
        },
    }),


    computed: {
        activeTabMint: function () {
            return {
                'tab-button': this.tab === 1,
                'tab-button-in-active': this.tab !== 1,
            }
        },

        activeTabRedeem: function () {
            return {
                'tab-button': this.tab === 2,
                'tab-button-in-active': this.tab !== 2,
            }
        }
    },

    methods: {
        ...mapActions('web3', ['addUsdPlusToken'])

    }

}
</script>

<style scoped>
.swap-title {
    color: #788C9F;
    font-weight: bold;
    font-size: 30px;
}

.desc {
    font-size: 15px;
    color: #171717;

}

.tab-button-in-active {
    color: #0A0952;
    cursor: pointer; /* Mouse pointer on hover */
    width: 50%;
    height: 40px;
    font-weight: 600;
    font-size: 18px;
    opacity: 0.8;

}

.tab-button-in-active:hover {
    opacity: 1;
    background-color: #FFFFFF;
    border: 1px solid #ECECEC;
    border-radius: 5px;
}

.tab-button {
    color: #0A0952;
    cursor: pointer; /* Mouse pointer on hover */
    width: 50%;
    height: 40px;
    font-weight: 600;
    font-size: 18px;
    border-radius: 5px;
    background-color: #FFFFFF;
    border: 1px solid #ECECEC;
    opacity: 0.8;
}

.card {
    border-radius: 15px;
    border: 1px solid #BBBBBB;
}

.tabs {
    background-color: #F4F5F9;
    border-radius: 8px;
}

.fixed {
    flex: 0 0 600px;
}

.swap-label {
    color: white;
    font-weight: 300;
    font-size: 56px;
}
</style>
