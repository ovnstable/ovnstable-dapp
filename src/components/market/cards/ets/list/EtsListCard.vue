<template>
    <v-row v-bind:class="archived ? 'list-card-container-archived ' : ''"
           @click="$wu.isMobile() ? switchCard() : openStrategyCard()"
           class="list-card-container ma-0">
        <v-col v-if="!$wu.isMobile()" class="my-1">
            <v-row class="ma-0" justify="start" align="center">
                <div class="icon mr-2">
                    <v-img :src="'/assets/network/' + cardData.data.chainName + '.svg'"
                           :title="cardData.data.chainName.toUpperCase()"/>
                </div>
                <div class="icon mr-2">
                    <v-img :src="'/assets/cards/platform/' + dexLogo + '.svg'"
                           :title="dexLogo"/>
                </div>
            </v-row>
        </v-col>
        <v-col :cols="$wu.isFull() ? 3 : ($wu.isMobile() ? 7 : 3)" class="my-1">
            <v-row class="ma-0 ml-5" justify="start" align="center">
<!--                <div class="icon mr-2">
                    <v-img :src="'/assets/currencies/market/ets_' + cardData.data.name + '.svg'"/>
                </div>-->
                <label class="card-label ml-2">
                    {{ cardData.data.nameUp }}
                </label>
            </v-row>
        </v-col>
        <v-col :cols="$wu.isFull() ? 1 : ($wu.isMobile() ? 3 : 1)" class="my-1">
            <v-row class="ma-0" justify="start" align="center">
                <label v-if="!archived" class="card-label">{{ (cardData.lastApy && !isNaN(cardData.lastApy)) ? ($utils.formatMoneyComma(cardData.lastApy, 0) + '%') : '0%' }}</label>
            </v-row>
        </v-col>
        <v-col :cols="$wu.isFull() ? 1 : ($wu.isMobile() ? 3 : 1)" class="my-1">
            <v-row class="ma-0" justify="start" align="center">
                <label v-if="!archived" class="card-label">{{ (cardData.monthApy && !isNaN(cardData.monthApy)) ? ($utils.formatMoneyComma(cardData.monthApy, 0) + '%') : '0%' }}</label>
            </v-row>
        </v-col>
        <v-col v-if="!$wu.isMobile()" cols="3" class="my-1" style="max-width: 269px">
            <v-row class="ma-0 mr-10" justify="center" align="center">
<!--                <label class="card-label"-->
                <label class="card-label list-header-label-gray">
<!--                       :class="(cardData.overcapEnabled && cardData.data.maxSupply && cardData.tvl >= cardData.data.maxSupply) ? 'list-header-label-gray' : ''">-->
                    ${{ $utils.formatMoneyComma(cardData.tvl, 2) }}
                </label>
<!--                <label class="card-label list-header-label-gray" v-if="$wu.isFull() && cardData.overcapEnabled">&nbsp;/&nbsp;${{ $utils.formatMoneyComma(cardData.data.maxSupply, 2) }}</label>-->
            </v-row>
        </v-col>
        <v-col v-if="!$wu.isMobile()" class="my-1">
            <v-row class="ma-0" justify="center" align="center">
                <div class="icon-token-pair">
                    <v-img :src="'/assets/cards/token_pair/' + cardData.data.tokenPair + '.svg'"
                           :title="cardData.data.tokenPair"/>
                </div>
            </v-row>
        </v-col>
        <v-col v-if="$wu.isFull()" class="my-1" cols="1" style="max-width: 100px">
            <v-row class="ma-0 mr-5" justify="start" align="center">
                <label class="card-label">{{ accountEtsBalance ? ('$' + $utils.formatMoneyComma(accountEtsBalance, 2)) : '' }}</label>
            </v-row>
        </v-col>
        <v-col v-if="!$wu.isMobile()" class="my-1 button-width" style="max-width: 90px">
            <template v-if="!networkSupport">
                <div v-if="!archived">
                    <v-row class="ma-0" justify="end" align="center">
                        <v-btn x-small
                               width="120px"
                               class="button btn-outlined"
                               max-width="100px"
                               @click.stop="openStrategyCard" outlined>
                            ABOUT
                        </v-btn>
                    </v-row>
                </div>
            </template>

            <template v-else>
                <v-row class="ma-0" justify="end" align="center">
                    <v-btn x-small
                           width="105px"
                           max-width="105px"
                           v-if="false"
                           class="button btn-outlined"
                           @click.stop="mintAction" outlined>
                        MINT/REDEEM
                    </v-btn>
                    <v-btn x-small
                           width="105px"
                           max-width="100px"
                           v-else
                           class="button btn-outlined"
                           @click.stop="redeemAction" outlined>
                        REDEEM
                    </v-btn>
                </v-row>
            </template>
        </v-col>
        <v-col v-if="$wu.isMobile()" class="my-1">
            <v-row class="ma-0" justify="end" align="center">
                <v-icon color="var(--secondary-gray-text)">
                    {{ cardOpened ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                </v-icon>
            </v-row>
        </v-col>

        <v-col v-if="$wu.isMobile() && cardOpened" cols="12">
            <v-divider class="card-divider mt-n3"></v-divider>

            <v-row class="ma-0 mt-3" align="center">
                <v-col>
                    <v-row justify="start" align="center">
                        <label class="list-header-label">Chain</label>
                    </v-row>
                </v-col>
                <v-col>
                    <v-row justify="center" align="center">
                        <label class="list-header-label">Platform</label>
                    </v-row>
                </v-col>
                <v-col>
                    <v-row justify="end" align="center">
                        <label class="list-header-label">Token pair</label>
                    </v-row>
                </v-col>
            </v-row>
            <v-row class="ma-0 mt-1" align="center">
                <v-col>
                    <v-row justify="start" align="center">
                        <div class="icon mr-3">
                            <v-img :src="'/assets/network/' + cardData.data.chainName + '.svg'"
                                   :title="cardData.data.chainName.toUpperCase()"/>
                        </div>
                    </v-row>
                </v-col>
                <v-col>
                    <v-row justify="center" align="center">
                        <div class="icon mr-2">
                            <v-img :src="'/assets/cards/platform/' + dexLogo + '.svg'"
                                   :title="dexLogo"/>
                        </div>
                    </v-row>
                </v-col>
                <v-col>
                    <v-row justify="end" align="center">
                        <div class="icon-token-pair">
                            <v-img :src="'/assets/cards/token_pair/' + cardData.data.tokenPair + '.svg'"
                                   :title="cardData.data.tokenPair"/>
                        </div>
                    </v-row>
                </v-col>
            </v-row>

            <v-divider class="card-divider mt-3"></v-divider>

            <v-row class="ma-0 mt-3" align="center">
                <v-col>
                    <v-row justify="start" align="center">
                        <label class="list-header-label">Capacity</label>
                    </v-row>
                </v-col>
                <v-col>
                    <v-row justify="end" align="center">
                        <label class="list-header-label">My investment</label>
                    </v-row>
                </v-col>
            </v-row>

            <v-row class="ma-0 mt-1" align="center">
                <v-col>
                    <v-row justify="start" align="center">
<!--                        <label class="card-label"-->
                        <label class="card-label list-header-label-gray">
<!--                               :class="(cardData.overcapEnabled && cardData.data.maxSupply && cardData.tvl >= cardData.data.maxSupply) ? 'list-header-label-gray' : ''">-->
                            ${{ $utils.formatMoneyComma(cardData.tvl, 2) }}
                        </label>
                        <label class="card-label list-header-label-gray" v-if="cardData.overcapEnabled">&nbsp;/&nbsp;${{ $utils.formatMoneyComma(cardData.data.maxSupply, 2) }}</label>
                        <v-spacer></v-spacer>
                        <label class="card-label" :class="accountEtsBalance ? '' : 'list-header-label-gray'">{{ accountEtsBalance ? ('$' + $utils.formatMoneyComma(accountEtsBalance, 2)) : '—' }}</label>
                    </v-row>
                </v-col>
            </v-row>

            <v-row class="ma-0 mt-3" align="center">
                <v-col v-if="networkSupport">
                    <v-row justify="start" align="center">
                        <v-btn x-small
                               v-if="false"
                               class="button btn-filled"
                               @click.stop="mintAction" outlined>
                            MINT/REDEEM
                        </v-btn>
                        <v-btn x-small
                               v-else
                               class="button btn-filled"
                               @click.stop="redeemAction" outlined>
                            REDEEM
                        </v-btn>
                    </v-row>
                </v-col>
                <v-col>
                    <v-row :justify="networkSupport ? 'end' : 'center'" align="center">
                        <v-btn
                                v-if="!archived"
                                x-small
                               class="button btn-outlined"
                               @click.stop="openStrategyCard" outlined>
                            ABOUT
                        </v-btn>
                    </v-row>
                </v-col>
            </v-row>
        </v-col>

        <resize-observer @notify="$forceUpdate()"/>
    </v-row>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import loadJSON from "@/utils/http-utils";

export default {
    name: "EtsListCard",

    components: {
    },

    props: {

        cardData: {
            type: Object
        },
        archived: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        ...mapGetters('network', ['networkId', 'networkName']),
        ...mapGetters("marketData", ["etsStrategyData"]),
        ...mapGetters('accountData', ['etsBalance', 'account']),
        ...mapGetters('web3', ['contracts', "web3"]),
        ...mapGetters('overcapData', ['isOvercapAvailable']),

        dexLogo: function () {
            let dexName = this.cardData.data.dex;
            if (dexName === 'Ramsess' || dexName === 'Ramses/Ennead') {
                return 'Ramses';
            }

            if (dexName === 'Gamma XYZ') {
                return 'GammaXYZ'
            }

            if (dexName === 'Thena/Gamma') {
                return 'Thena'
            }

            if (dexName === 'SushiSwap') {
                return 'Sushiswap'
            }

            if (dexName === 'SolidLizard') {
                return 'Solidlizard'
            }

            return dexName;
        },

        accountEtsBalance: function () {
            if (this.archived && this.componentTokenBalance) {
                return this.componentTokenBalance;
            }

            return this.etsBalance[this.cardData.data.name];
        },

        networkSupport: function () {
            return this.networkName.toLowerCase() === this.cardData.chain.toLowerCase();
        },
    },

    data: () => ({
        cardOpened: false,
        componentTokenContract: null,
        componentTokenBalance: null,
        componentTokenOriginalBalance: null,
    }),

    watch: {
        networkId: function (val, oldVal) {
            if (val) {
                this.loadContract();
            }
        },
        account: function (val, oldVal) {
            if (val) {
                this.loadContract();
            }
        },

    },

    created() {
        this.cardOpened = this.cardData.cardOpened;
        this.loadContract();
    },

    methods: {
        ...mapActions('network', ['setWalletNetwork']),
        ...mapActions('investModal', ['showInvestModal', 'showMintView', 'showRedeemView']),


        async loadContract() {
            if (!this.archived || this.contracts[this.cardData.data.exchangeContract] || this.cardData.data.chain !== this.networkId || !this.account) {
                return
            }

            this.componentTokenContract = this._load(await loadJSON('/contracts/abi/ets/token.json'), this.web3, this.cardData.data.tokenAddress);
            this.componentTokenBalance = await this.componentTokenContract.methods.balanceOf(this.account).call();
            this.componentTokenOriginalBalance = this.componentTokenBalance;
            this.componentTokenBalance = this.web3.utils.fromWei(this.componentTokenBalance, this.cardData.data.etsTokenDecimals === 18 ? 'ether' : 'mwei');
        },

        _load(file, web3, address) {
            if (!address) {
                address = file.address;
            }

            return new web3.eth.Contract(file.abi, address);
        },

        mintAction() {
            this.showMintView();
            this.showInvestModal(this.cardData.data);
        },

        redeemAction() {
            this.showRedeemView();
            this.showInvestModal(this.cardData.data);
        },

        openStrategyCard() {
            if (this.archived) {
                return;
            }

            this.$router.push("/ets/" + this.cardData.data.name);
            window.scrollTo({top: 0, behavior: "smooth"});
        },

        switchCard() {
            this.cardOpened = !this.cardOpened;
        },
    }
};
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {

    .icon {
        height: 20px !important;
        width: 20px !important;
    }

    .icon-token-pair {
        width: 38px !important;
    }

    .button {
        width: 95% !important;
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 14px !important;
        line-height: 18px !important;
        letter-spacing: 0.03em;
    }

    .card-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .list-header-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .icon {
        height: 24px !important;
        width: 24px !important;
    }

    .icon-token-pair {
        width: 46px !important;
    }

    .button {
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 14px !important;
        line-height: 18px !important;
        letter-spacing: 0.03em;
    }

    .card-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 24px;
    }

    .list-header-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .icon {
        height: 28px !important;
        width: 28px !important;
    }

    .icon-token-pair {
        width: 54px !important;
    }

    .button {
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 14px !important;
        line-height: 18px !important;
        letter-spacing: 0.03em;
    }

    .card-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 28px;
    }

    .list-header-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {

    .icon {
        height: 28px !important;
        width: 28px !important;
    }

    .icon-token-pair {
        width: 54px !important;
    }

    .button {
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 13px !important;
        line-height: 18px !important;
        letter-spacing: 0.03em;
    }

    .card-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
    }

    .list-header-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }
}

.list-card-container {
    width: 100% !important;
    background: var(--secondary);
    border-radius: 8px;
}

* {
}

.list-card-container:hover {
    filter: none !important;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.05), 0 4px 4px 0 rgba(0, 0, 0, 0.05);
    cursor: pointer;
}

.list-card-container-archived {
    box-shadow: none !important;
    cursor: default !important;
}

.button {
    height: 28px !important;
    border-radius: 2px;
    box-shadow: none !important;

    font-family: 'Roboto', sans-serif !important;
    text-align: center !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.btn-filled {
    background: var(--blue-gradient);
    color: #FFFFFF !important;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
}

.btn-outlined {
    color: var(--links-blue) !important;
}

.open-icon {
    color: #707A8B;
    height: 18px;
    width: 18px;
}

.card-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--main-gray-text);
}

.list-header-label-gray {
    color: var(--third-gray-text);
}

.featured-badge >>> i {
    color: #FE7F2D !important;
}

.card-divider {
    border-color: var(--fourth-gray-text) !important;
}

.list-header-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-gray-text);
}
</style>
