<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col class="main-col">
                <v-row align="center">
                    <label class="title-header">{{ isMintView ? 'Mint' : 'Redeem' }}</label>
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


import Redeem from "../components/swap/Redeem";
import Mint from "../components/swap/Mint";
import ShowTransaction from "../components/common/ShowTransaction";
import {mapActions, mapGetters} from "vuex";

export default {
    name: "SwapView",
    components: {ShowTransaction, Mint, Redeem},
    data: () => ({
        tab: 1,

        total: {
            minted: 113332344,
            circulation: 79886800,
            burnt: 33445544,
        },
    }),


    computed: {
        ...mapGetters("swapUI", ['isMintView']),
    },

    methods: {
        ...mapActions('web3', ['addUsdPlusToken']),
        ...mapActions('gasPrice', ['showGasSettings', 'hideGasSettings']),
    }

}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {

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

    .main-col {
        max-width: 30vw !important;
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
