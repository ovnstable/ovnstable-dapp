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

        <OvercapBanner class="overcap-banner" v-if="isOvercapAvailable && showOvercapBanner"/>

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

    created() {
        console.log('Dapp.created()')
        this.initWeb3();
        this.connectWallet();
    },

    computed: {
        ...mapGetters('overcapData', ['isOvercapAvailable', 'totalOvercap', 'walletOvercapLimit', 'showOvercapBanner']),
    },

    methods:{
        ...mapActions('web3', ['initWeb3', 'connectWallet']),
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

    .overcap-banner {
        right: 0;
        bottom: 0;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .main-container {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }

    .overcap-banner {
        right: 8px;
        bottom: 8px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .main-container {
        margin-left: 5% !important;
        margin-right: 5% !important;
    }

    .overcap-banner {
        right: 12px;
        bottom: 12px;
    }
}

.overcap-banner {
    z-index: 999999 !important;
    position: fixed !important;
}

</style>
