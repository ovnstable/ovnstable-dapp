<template>
        <v-app>
            <NavMenu/>

            <v-app-bar app>
                <v-btn icon @click="updateBlockNumber"><v-icon>mdi-refresh</v-icon></v-btn>
                Current block: {{currentBlock}}
                <v-btn icon @click="mineBlock"><v-icon>mdi-data-matrix-plus</v-icon></v-btn>

                <v-btn @click="addOvnTokenAction">Add ovn</v-btn>

                <v-spacer></v-spacer>

                <template v-if="!loadingWeb3">
                    <template v-if="walletConnected">
                        <v-btn v-if="switchToOtherNetwork" v-on:click="switchToNetwork">
                            Switch to {{ networkName }}
                        </v-btn>
                    </template>

                    <template v-else>
                        <v-btn @click="connectWallet">
                            Connect wallet
                        </v-btn>
                    </template>
                </template>

                <div class="mx-6">
                    <NetworkSelect/>
                </div>
            </v-app-bar>

            <!-- Sizes your content based upon application components -->
            <v-main>
                <!-- If using vue-router -->
                <router-view></router-view>
            </v-main>

            <v-footer app>
                <!-- -->
            </v-footer>
        </v-app>
</template>

<script>
import NavMenu from "./components/governance/NavMenu";
import {mapActions, mapGetters} from "vuex";
import NetworkSelect from "@/components/common/header/NetworkSelect";

export default {
    name: "Governance",
    components: {NetworkSelect, NavMenu},

    data:()=>({
        currentBlock: null,
    }),

    async created() {
        await this.initTheme();
        await this.initWeb3();
        await this.connectWallet();
    },

    watch: {
        account: function (newVal, oldVal) {
            this.checkAccount();
        },
    },

    computed:{
        ...mapGetters('web3', ['web3', 'loadingWeb3']),
        ...mapGetters('walletAction', ['walletConnected']),
        ...mapGetters('network', ['networkName', 'switchToOtherNetwork', 'networkId']),
        ...mapGetters('accountData', ['account']),
    },

    methods:{
        ...mapActions('web3', ['initWeb3']),
        ...mapActions('walletAction', ['connectWallet']),
        ...mapActions('ethers', ['mineBlocks']),
        ...mapActions('tokenAction', ['addOvnToken']),
        ...mapActions('governance', ['checkAccount']),
        ...mapActions('theme', ['initTheme']),

        async addOvnTokenAction(){
            this.addOvnToken();
        },

        async mineBlock(){
            await this.mineBlocks(5);
            await this.updateBlockNumber();
        },

        async updateBlockNumber() {
            this.currentBlock = await this.web3.eth.getBlockNumber();
        },

        switchToNetwork() {
            this.setWalletNetwork(this.networkId.toString());
        },
    }
}
</script>

<style scoped>

</style>
