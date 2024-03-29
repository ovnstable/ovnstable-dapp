<template>
    <div>
        <Navbar v-if="$wu.isFull()"/>
        <Header/>

        <v-main>
            <div class="main-container mt-5">
                <router-view />
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
      await this.initTheme();

      try {
        if (!window?.ethereum.chainId) return
        const chainId = parseInt(window.ethereum?.chainId)?.toString()
        this.saveNetworkToLocalStore(chainId);

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
@media only screen and (min-width: 1300px) {
    .main-container {
        margin-left: 3% !important;
        margin-right: 3% !important;
    }
}

.v-main {
    min-height: 100vh;
    padding-bottom: 30px!important;
}
</style>
