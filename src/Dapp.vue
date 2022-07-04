<template>
    <div>
        <Navbar/>
        <Header/>

        <v-main>
            <v-container fluid class="main-container">
                <router-view></router-view>
            </v-container>
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
@media only screen and (max-width: 1400px) {
}

@media only screen and (min-width: 1400px) {
}

</style>
