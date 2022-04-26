<template>
    <div class="pb-10" v-if="show">
        <v-card class="container_body airdrop-body">
            <v-toolbar class="container_header" flat>
                <label class="title-label pt-10 pl-3 pb-5">
                    Welcome to Overnight.fi
                    <br/>
                    EXCLUSIVE AIRDROP on&nbsp;<a class="bridge-link-air" @click="openBridgeLink">Polygon</a>&nbsp;for Savvy Investors
                </label>
                <v-btn icon class="ml-auto" @click="close" dark>
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text class="pl-5 pt-10">
                <v-row dense>
                    <label class="pl-3 airdrop-info-bold">Win up to $1000-value rewards in pre-OVN&nbsp;&nbsp;</label>
                    <v-tooltip
                            color="#202832"
                            right
                            close-delay="4000"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <div class="info-icon"
                                 v-bind="attrs"
                                 v-on="on">
                                <v-img :src="require('@/assets/icon/question-help.svg')"/>
                            </div>
                        </template>
                        <p class="my-0 mb-2">Requirements</p>
                        <p class="my-0 mb-1">To be eligible for prices, participants will have to:</p>
                        <p class="my-0"><a class="join-link" @click="openLink('https://t.me/overnight_fi')">Join on TG group</a></p>
                        <p class="my-0"><a class="join-link" @click="openLink('https://t.me/overnight_fi_announcements')">Join on TG channel</a></p>
                        <p class="my-0"><a class="join-link" @click="openLink('https://discord.gg/7dEceNJqPq')">Join on Discord</a></p>
                        <p class="my-0 mt-1 mb-1"><a class="join-link" @click="openLink('https://twitter.com/overnight_fi')">Follow on Twitter</a>, retweet Airdrop promotional post and tag 3 persons</p>
                        <p class="my-0"><a class="join-link" @click="openLink('https://app.overnight.fi/')">Buy</a><b>&nbsp;100 USD+</b></p>
                    </v-tooltip>
                </v-row>
                <v-row dense>
                    <label class="pl-3 pt-2 airdrop-info-label">
                        We believe that the stablecoin users make up the core group of people who care about Overnight.fi and its long-term development.
                        <br/>
                        So we are rewarding and will reward again the early adopters.
                    </label>
                </v-row>

                <v-row v-if="account" dense align="center" class="mt-6 pl-3">
                    <v-btn dark
                           outlined
                           height="40"
                           @click="openLink('https://blog.overnight.fi/how-to-buy-usd-coin-if-you-already-own-crypto-currency-49da489a8652')"
                           class="move-btn">
                        HOW TO BUY USD+
                    </v-btn>
                </v-row>
                <v-row v-else dense align="center" class="mt-6 pl-3">
                    <v-btn dark
                           outlined
                           height="40"
                           @click="connectWalletAction"
                           class="move-btn">
                        CONNECT TO A WALLET
                    </v-btn>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
    name: "AirdropDialog",

    props: {},

    computed: {
        ...mapGetters('airDrop', ['show']),
        ...mapGetters('web3', ['account']),
    },

    data: () => ({}),

    methods: {
        ...mapActions('airDrop', ['showAirdropDialog', 'hideAirdropDialog']),
        ...mapActions('web3', ['connectWallet']),

        openLink(link) {
            window.open(link, '_blank').focus();
        },

        connectWalletAction() {
            this.connectWallet();
        },

        openBridgeLink() {
            window.open('https://wallet.polygon.technology', '_blank');
        },

        close() {
            this.hideAirdropDialog();
        },
    },
}
</script>

<style scoped>

@media only screen and (max-width: 500px) {
    .info-icon {
        display: none;
    }
}

/* mobile version */
@media only screen and (max-width: 1400px) {
    .airdrop-body {
        z-index: 1;
        /*position: fixed !important;*/
        /*top: 10vh !important;*/
        width: 100% !important;
    }
}

@media only screen and (min-width: 1400px) {
    .airdrop-body {
        z-index: 1;
        position: fixed !important;
        top: 20vh !important;
        left: 50px !important;
        width: 26vw !important;
    }
}

.title-label {
    color: white;
    font-weight: 300;
    font-size: 20px;
    line-height: 28px;
    margin-top: 15px;
}

.airdrop-info-bold {
    color: white;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
}

.airdrop-info-label, .airdrop-more-info-label {
    color: white;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
}

.container_body {
    border-radius: 24px !important;
    background-color: #101419 !important;
}

.container_header {
    background-color: #101419 !important;
}

.join-link {
    cursor: pointer;
}

.v-tooltip__content {
    pointer-events: initial;
}

.info-icon {
    width: 24px;
    height: 24px;
}

.move-btn {
    cursor: pointer;
    background: none !important;
    border-radius: 40px;
    border: none !important;
    color: white !important;
    background: var(--orange-gradient) !important;
}

.bridge-link-air {
    color: white;
    text-decoration: underline;
}
</style>
