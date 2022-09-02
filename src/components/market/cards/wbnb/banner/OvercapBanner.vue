<template>
    <v-dialog
            :value="isOvercapAvailable && showOvercapBanner && showOvercapModal"
            :width="430"
            @input="close"
            :persistent="true"
            scrollable>
        <v-card class="card-container ma-0">
            <v-col>
                <v-row class="toolbar-row mb-n8">
                    <v-spacer></v-spacer>
                    <v-btn class="close-btn" icon @click="closeOvercapBanner">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-row>
                <v-row class="banner-image-row">
                    <v-img :src="require('@/assets/bg/overcap_banner_bg.png')"/>
                </v-row>

                <v-row class="card-row mt-5" justify="center" align="center">
                    <label class="card-info">You're eligible to mint ETS: USD+/WBNB over cap for</label>
                </v-row>

                <v-row class="card-row mt-5" justify="center" align="center">
                    <label class="card-info card-info-sum">$5,000.00</label>
                </v-row>

                <v-row class="card-row mt-5 mb-5" justify="center" align="center">
                    <label class="card-info link-label" @click="openStrategyAction">Enjoy opportunity</label>
                </v-row>
            </v-col>
        </v-card>
        <resize-observer @notify="$forceUpdate()"/>
    </v-dialog>
</template>

<script>
import Tooltip from "@/components/common/element/Tooltip";
import {mapActions, mapGetters} from "vuex";

export default {
    name: "OvercapBanner",

    components: {
        Tooltip
    },

    props: {
    },

    computed: {
        ...mapGetters('supplyData', ['totalSupply', 'maxUsdPlusWbnbSupply']),
        ...mapGetters('overcapData', ['isOvercapAvailable', 'showOvercapBanner']),
        ...mapGetters('accountData', ['balance']),
    },

    data: () => ({
        get showOvercapModal() {

            let showOvercapModal = localStorage.getItem('showOvercapModal');

            if (showOvercapModal == null) {
                localStorage.setItem('showOvercapModal', "true");
                showOvercapModal = localStorage.getItem('showOvercapModal');
            }

            return showOvercapModal === "true";
        },
    }),

    watch: {
    },

    created() {
    },

    methods: {
        ...mapActions('overcapData', ['useOvercap', 'returnOvercap', 'closeOvercapBanner']),

        openStrategyAction() {
            this.$router.push('/ets/usd-plus-wbnb');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.closeOvercapBanner();
        },
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .card-row {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }

    .card-info {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
    }

    .card-info-sum {
        font-weight: 300 !important;
        font-size: 34px !important;
        line-height: 40px !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .card-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .card-info {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 26px;
    }

    .card-info-sum {
        font-weight: 300 !important;
        font-size: 38px !important;
        line-height: 42px !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .card-row {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .card-info {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 26px;
    }

    .card-info-sum {
        font-weight: 300 !important;
        font-size: 42px !important;
        line-height: 46px !important;
    }
}

.card-container {
    background: #FFFFFF !important;
    border-radius: 4px !important;
    max-width: 430px !important;
}

.card-info {
    font-family: 'Roboto', sans-serif;
    color: #333333;
    text-align: center !important;
}

.link-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: #1C95E7 !important;
    cursor: pointer !important;
}

.link-label:hover {
    text-decoration: underline !important;
}

.banner-image-row {
    display: inline-grid !important;
}

.toolbar-row {
    height: 20px !important;
}

.close-btn {
    z-index: 1000 !important;
}
</style>
