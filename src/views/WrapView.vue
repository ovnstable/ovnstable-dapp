<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col class="main-col">
                <v-row align="center">
                    <label class="title-header">
                        <v-icon class="return-btn" @click='goToAction("/")'>
                            mdi-reply
                        </v-icon>
                        {{ isWrapView ? 'Wrap' : 'Unwrap' }}
                    </label>
                </v-row>

                <v-row class="desc justify-start mt-5">
                    <p>WUSD+ is an index-adjusted wrapper for USD+. Some people may find this useful for cross-blockchain purposes. Unlike your USD+ balance, your wUSD+ balance will not increase over time. When wUSD+ is unwrapped, you receive USD+ based on the latest (ever-increasing) index, so the total yield is the same.</p>
                </v-row>

                <v-row class="mint-redeem-row">
                    <v-col class="pa-0 ma-0">
                        <Wrap v-if="isWrapView"/>
                        <Unwrap v-else/>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>


import {mapActions, mapGetters} from "vuex";
import Wrap from "@/components/wrap/Wrap";
import Unwrap from "@/components/wrap/Unwrap";

export default {
    name: "WrapView",

    components: {Unwrap, Wrap},

    data: () => ({
    }),

    computed: {
        ...mapGetters("wrapUI", ['isWrapView']),
    },

    methods: {
        ...mapActions('web3', ['addWUsdPlusToken']),

        goToAction(id) {
            this.$router.push(id);
        },
    }

}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {

    .main-col {
        max-width: 80vw !important;
    }

    .mint-redeem-row {
        margin-top: 28px;
    }
}

@media only screen and (min-width: 1400px) {

    .main-col {
        max-width: 30vw !important;
    }

    .mint-redeem-row {
        margin-top: 40px;
    }

    .return-btn {
        display: none !important;
    }
}

.return-btn {
    color: #FE7F2D !important;
    cursor: pointer;
    margin-top: -6px;
}

.desc {
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: white !important;
}

</style>
