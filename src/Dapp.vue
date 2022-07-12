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
    </div>
</template>

<script>

import Header from "./components/Header";
import AccountProfile from "./components/common/modal/AccountProfile";
import GasSettings from "@/components/common/modal/GasSettings";
import {mapActions} from "vuex";
import Navbar from "@/components/Navbar";

export default {
    name: "Dapp",
    components: {
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


    methods:{

        ...mapActions('web3', ['initWeb3', 'connectWallet'])
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
