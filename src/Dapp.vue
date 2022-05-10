<template>
    <div>
        <Header/>

        <v-main>
            <v-container fluid class="main-container">
                <router-view></router-view>
            </v-container>
        </v-main>

        <AccountProfile width="550"/>
        <GasSettings width="510"/>

        <Footer/>
    </div>
</template>

<script>

import Header from "./components/Header";
import Footer from "./components/Footer";
import AccountProfile from "./components/common/AccountProfile";
import GasSettings from "@/components/common/GasSettings";
import {mapActions} from "vuex";

export default {
    name: "Dapp",
    components: {
        GasSettings,
        AccountProfile,
        Footer,
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
@media only screen and (max-width: 1400px) {
    .main-container {
        height: max(calc(100vh - 72px - 34px - 34px), 100%);
        padding-top: 16px !important;
        padding-bottom: 16px !important;

        overflow-y: scroll;
        -ms-overflow-style: none; /* for Internet Explorer, Edge */
        scrollbar-width: none; /* for Firefox */
    }

    .main-container::-webkit-scrollbar {
        display: none !important;
    }
}

@media only screen and (min-width: 1400px) {
    .main-container {
        height: max(calc(100vh - 72px - 44px - 54px), 100%);
    }
}

</style>
