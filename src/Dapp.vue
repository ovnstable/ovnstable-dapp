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

export default {
    name: "Dapp",
    components: {GasSettings, AccountProfile, Footer, Header}
}
</script>

<style scoped>

.main-container {
    height: calc(100vh - 72px - 44px);
}

</style>
