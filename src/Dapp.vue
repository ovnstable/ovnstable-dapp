<template>
    <div>
        <Navbar v-if="$wu.isFull()"/>
        <Header/>

        <v-main>
            <div class="main-container mt-5">
                <router-view></router-view>
            </div>
        </v-main>

        <AccountProfile width="630"/>
        <GasSettings width="510"/>

        <OvercapBanner v-if="isOvercapAvailable && showOvercapBanner && showOvercapModal"/>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import Header from "./components/Header";
import AccountProfile from "./components/common/modal/AccountProfile";
import GasSettings from "@/components/common/modal/GasSettings";
import {mapActions, mapGetters} from "vuex";
import Navbar from "@/components/Navbar";
import OvercapBanner from "@/components/market/cards/wbnb/banner/OvercapBanner";

export default {
    name: "Dapp",
    components: {
        OvercapBanner,
        Navbar,
        GasSettings,
        AccountProfile,
        Header
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

    async created() {
        console.debug('Dapp created')

        await this.initWeb3();
        await this.connectWallet();
        this.initReferralCode();
    },

    watch: {
        account: function (newVal, oldVal) {
            if (newVal && localStorage.getItem('overcapRemaining') === '-1') {
                localStorage.setItem('overcapRemaining', this.walletOvercapLimit.toString());
            }
        },
    },

    computed: {
        ...mapGetters('overcapData', ['isOvercapAvailable', 'showOvercapBanner', 'walletOvercapLimit']),
        ...mapGetters('accountData', ['account']),
    },

    methods:{
        ...mapActions('web3', ['initWeb3']),
        ...mapActions('walletAction', ['connectWallet']),
        ...mapActions('referral', ['initReferralCode']),
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .main-container {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .main-container {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .main-container {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }
}
</style>
