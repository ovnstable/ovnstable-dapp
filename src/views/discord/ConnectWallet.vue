<template>
    <v-container class="pt-4">
        <v-row justify="center">
            <h1>Verify your Discord account</h1>
        </v-row>
        <v-row justify="center">
            <h5>Simply connect your wallet and sign the transaction</h5>
        </v-row>
        <v-row justify="center" class="pt-5">
            <v-col cols="5">
                <v-card rounded shaped color="#F3F5F7">
                    <v-card-title>
                        <v-container>
                            <v-row justify="center" v-if="success">Verification complete!</v-row>
                            <v-row justify="center" v-else-if="fail">Verification failed!</v-row>

                            <v-row justify="center" class="pt-7">
                                <div style="width: 60px; height: 60px">
                                    <v-img :src="centerIcon"/>
                                </div>
                            </v-row>
                        </v-container>
                    </v-card-title>
                    <v-card-subtitle>
                        <v-row justify="center" class="pt-7">
                            <v-row justify="center" v-if="!success && !fail">Click the button below to connect your
                                wallet
                            </v-row>
                            <v-row justify="center" v-if="success">Your wallet has been verified</v-row>
                            <v-row justify="center" v-else-if="fail">There has an error with your wallet verification
                            </v-row>
                        </v-row>
                    </v-card-subtitle>
                    <v-card-text>
                        <v-row justify="center" class="pt-10 pb-16">
                            <v-btn v-if="!success && !fail" :disabled="!isMounted" @click="connectBtnClick"
                                   min-height="50px"
                                   class="connect_button" rounded>Connect your wallet
                            </v-btn>
                            <span v-else-if="success">Close this window and check your DMs in Discord!</span>
                            <span
                                v-else-if="fail">Please try again if the problem persists please go to #support-general on Discord</span>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import UsdPlusImage from "@/assets/usdPlus.json";
// import Onboard from 'bnc-onboard';
import Web3 from "web3";
import {mapGetters} from 'vuex'
import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";

const connectIcon = require('@/assets/discord/connect.png');
const loadingIcon = require('@/assets/discord/loading.png');
const successIcon = require('@/assets/discord/success.png');
const failIcon = require('@/assets/discord/fail.png');

const {axios} = require('@/plugins/http-axios');

const {wallets} = require('@/store/modules/common/web3/web3');


export default {
    name: "ConnectWallet",
    data() {
        return {
            loading: false,
            fail: false,
            success: false,
            onboard: null,
            web3: null,
            account: null,
            isMounted: false
        }
    },

    async mounted() {
        const parsedParams = {};
        this.$route.hash.split('&')
            .map(part => part.replace(/^#/, ''))
            .forEach(param => {
                const parts = param.split('=');
                parsedParams[parts[0]] = parts[1];
            });
        console.log(parsedParams);

        const resp = await axios.post(this.appApiUrl + '/discord/get_user', parsedParams);
        localStorage.setItem('discord_backend_token', resp.data.token);
        localStorage.setItem('discord_user', JSON.stringify(resp.data.user));

        const injected = injectedModule();
        let rpcUrl = this.rpcUrl;

        let onboard =   Onboard({
            // ... other Onboard options
            wallets: [
                injected,
                // argent,
                // ... other wallets
            ],
            chains: [
                {
                    id: '0x1',
                    token: 'ETH',
                    label: 'Ethereum Mainnet',
                    rpcUrl: rpcUrl
                }
                // {
                //     id: "0x144",  // = 280
                //     token: "ETH",
                //     label: "zkSync Mainnet",
                //     rpcUrl: "https://mainnet.era.zksync.io",
                // },
                // ... other chains
            ]
        });
        // this.onboard = Onboard({
        //     dappId: 'e7473c8b-6d55-418d-8fd7-e26e75446065',
        //     networkId: this.networkId,
        //     darkMode: true,
        //     walletSelect: {
        //         wallets: wallets,
        //     },
        //
        //     subscriptions: {
        //         wallet: async wallet => {
        //             this.web3 = new Web3(wallet.provider);
        //
        //             this.account = wallet;
        //         }
        //     }
        // });

        this.isMounted = true;
    },

    computed: {
        ...mapGetters('network', ['networkId', 'appApiUrl', 'rpcUrl']),

        centerIcon() {
            if (this.fail) return failIcon;
            if (this.success) return successIcon;
            if (!this.loading && !this.fail) return connectIcon;
            if (this.loading && !this.fail) return loadingIcon;
            return loadingIcon;
        },
    },
    methods: {
        async connectBtnClick() {
            this.loading = true;

            await this.onboard.walletSelect();

            const user = JSON.parse(localStorage.getItem("discord_user"));
            const selectedWallet = (await this.web3.eth.getAccounts())[0];

            const message = this.web3.utils.utf8ToHex(`I am ${user.username}#${user.discriminator} owner of ${selectedWallet}`);

            try {
                const sig = await this.web3.eth.personal.sign(message, selectedWallet, "pass");

                const axiosConfig = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('discord_backend_token')}`
                    }
                }

                //FIXME solve somehow (its coz after close first metamask window we are trying to open new window immediately)
                await new Promise(resolve => setTimeout(resolve, 2000));

                await this.addUsdPlus();
                await axios.post(this.appApiUrl + '/discord/connect_wallet', {sig: sig, address: selectedWallet}, axiosConfig);
                this.success = true;
            } catch (e) {
                this.fail = true
            } finally {
                this.loading = false;
            }
        },

        async addUsdPlus() {
            try {
                await this.account.provider.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20',
                        options: {
                            address: "0x236eeC6359fb44CCe8f97E99387aa7F8cd5cdE1f",
                            symbol: "USD+",
                            decimals: 6,
                            image: UsdPlusImage.image,
                        },
                    },
                })
            } catch (e) {
                console.log(e)
            }
        }
    }
}
</script>

<style scoped>
.connect_button {
    background: linear-gradient(91.26deg, #FE7F2D 0%, #FCCA46 100%);
    border-radius: 40px;
    color: #FFFFFF;
}
</style>
