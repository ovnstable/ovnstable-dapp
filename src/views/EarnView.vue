<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col class="main-col">
                <v-row align="center">
                    <label class="swap-title">Swap</label>
                    <v-spacer></v-spacer>
                    <v-btn icon>
                        <img class="cog-img"
                             :src="require('@/assets/icon/cog.svg')"
                             @click="showGasSettings">
                    </v-btn>
                </v-row>

                <v-row class="mint-redeem-row">
                    <v-col class="pa-0 ma-0">
                        <Mint v-if="isMintView"/>
                        <Redeem v-else/>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <ShowTransaction/>
    </v-container>
</template>

<script>


import Redeem from "../components/earn/Redeem";
import Mint from "../components/earn/Mint";
import StatsWidget from "../components/common/StatsWidget";
import ShowTransaction from "../components/common/ShowTransaction";
import {mapActions, mapGetters} from "vuex";

export default {
    name: "EarnView",
    components: {ShowTransaction, StatsWidget, Mint, Redeem},
    data: () => ({
        tab: 1,

        total: {
            minted: 113332344,
            circulation: 79886800,
            burnt: 33445544,
        },
    }),


    computed: {
        ...mapGetters("mintRedeemView", ['isMintView']),
    },

    methods: {
        ...mapActions('web3', ['addUsdPlusToken']),
        ...mapActions('gasPrice', ['showGasSettings', 'hideGasSettings']),
    }

}
</script>

<style scoped>

/* mobile version */
@media only screen and (max-width: 1400px) {
    .swap-title {
        color: white;
        font-weight: 300;
        font-size: 34px;
    }

    .main-col {
        max-width: 80vw !important;
    }

    .cog-img {
        width: 22px;
        height: 22px;
    }

    .mint-redeem-row {
        margin-top: 28px;
    }
}

@media only screen and (min-width: 1400px) {
    .swap-title {
        color: white;
        font-weight: 300;
        font-size: 56px;
    }

    .main-col {
        max-width: 33vw !important;
    }

    .cog-img {
        width: 28px;
        height: 28px;
    }

    .mint-redeem-row {
        margin-top: 60px;
    }
}
</style>
