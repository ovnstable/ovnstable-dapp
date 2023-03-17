<template>
    <div>
        <Navbar v-if="$wu.isFull()"/>
        <Header/>

        <v-main>
            <div class="main-container mt-5">
                <router-view></router-view>
            </div>
        </v-main>

        <AccountProfile width="760"/>
        <GasSettings width="510"/>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import Header from "./components/Header";
import AccountProfile from "./components/common/modal/account/AccountProfile";
import GasSettings from "@/components/common/modal/gas/GasSettings";
import {mapActions, mapGetters} from "vuex";
import Navbar from "@/components/Navbar";
import Web3 from "web3";

export default {
    name: "Dapp",
    components: {
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
      console.log('Dapp created')

      try {
        let web3 = await new Web3(Web3.givenProvider);
        console.log('InitWeb3: Provider custom');
        let networkID = await web3.eth.net.getId();
        networkID = networkID + '';
        console.log("Load wallet from init dapp ", networkID);
        this.saveNetworkToLocalStore(networkID);

      } catch (e) {
        console.error("Load wallet error from init dapp ", e);
      } finally {
        let dbNetworkName = localStorage.getItem('selectedNetwork');
        if (dbNetworkName && dbNetworkName !== '') {
          try {
            this.changeDappNetwork(dbNetworkName);
          } catch (e) {
            // ignore
          }
        }
      }

        await this.initTheme();

        await this.initEtsList();

        await this.initWeb3();
        await this.dappInitWalletConnect();
        this.initReferralCode();

        this.$gtm.enable(true);
    },

    watch: {
        account: function (newVal, oldVal) {
            if (newVal && localStorage.getItem('overcapRemainingValue') === '-1') {
                localStorage.setItem('overcapRemainingValue', this.walletOvercapLimit.toString());
            }
        },
    },

    computed: {
        ...mapGetters('overcapData', ['isOvercapAvailable', 'showOvercapBanner', 'walletOvercapLimit']),
        ...mapGetters('accountData', ['account']),
        ...mapGetters('network', ['networkId']),
    },

    methods:{
        ...mapActions('web3', ['initWeb3']),
        ...mapActions('walletAction', ['dappInitWalletConnect']),
        ...mapActions('network', ['changeDappNetwork', 'saveNetworkToLocalStore']),
        ...mapActions('referral', ['initReferralCode']),
        ...mapActions('etsAction', ['initEtsList']),
        ...mapActions('theme', ['initTheme']),
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

/* mac */
@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .main-container {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }
}
</style>
