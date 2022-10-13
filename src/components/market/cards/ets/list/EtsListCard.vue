<template>
    <v-row class="list-card-container ma-0" @click="openStrategyCard">
        <v-col v-if="!$wu.isMobile()" class="my-1">
            <v-row class="ma-0" justify="start" align="center">
                <div class="icon mr-3">
                    <v-img :src="require('@/assets/network/' + cardData.data.chainName + '.svg')"
                           :title="cardData.data.chainName.toUpperCase()"/>
                </div>
                <div class="icon mr-2">
                    <v-img :src="require('@/assets/cards/platform/' + cardData.data.dex + '.svg')"
                           :title="cardData.data.dex"/>
                </div>
            </v-row>
        </v-col>
        <v-col :cols="$wu.isFull() ? 2 : ($wu.isMobile() ? 8 : 3)" class="my-1">
            <v-row class="ma-0" justify="start" align="center">
                <v-badge icon="mdi-star-circle"
                         v-if="featured"
                         :color="featured ? 'var(--secondary)' : ''"
                         class="featured-badge"
                         offset-x="14"
                         offset-y="4">
                    <div class="icon mr-2">
                        <v-img :src="require('@/assets/currencies/market/ets_' + cardData.data.name + '.svg')"/>
                    </div>
                </v-badge>
                <div class="icon mr-2" v-else>
                    <v-img :src="require('@/assets/currencies/market/ets_' + cardData.data.name + '.svg')"/>
                </div>
                <label class="card-label">
                    {{ cardData.data.nameUp }}
                </label>
            </v-row>
        </v-col>
        <v-col :cols="$wu.isFull() ? 1 : ($wu.isMobile() ? 4 : 1)" class="my-1">
            <v-row class="ma-0" justify="end" align="center">
                <label class="card-label">{{ cardData.weekApy === 0 ? '' : ($utils.formatMoneyComma(cardData.weekApy, 0) + '%') }}</label>
            </v-row>
        </v-col>
        <v-col v-if="!$wu.isMobile()" cols="3" class="my-1">
            <v-row class="ma-0" justify="end" align="center">
                <label class="card-label"
                       :class="(cardData.overcapEnabled && cardData.data.maxSupply && totalSupply[cardData.data.name] >= cardData.data.maxSupply) ? 'list-header-label-gray' : ''">
                    ${{ $utils.formatMoneyComma(cardData.tvl, 2) }}
                </label>
                <label class="card-label list-header-label-gray" v-if="$wu.isFull() && cardData.overcapEnabled">&nbsp;/&nbsp;${{ $utils.formatMoneyComma(cardData.data.maxSupply, 2) }}</label>
            </v-row>
        </v-col>
        <v-col v-if="!$wu.isMobile()" class="my-1">
            <v-row class="ma-0" justify="center" align="center">
                <div class="icon-token-pair">
                    <v-img :src="require('@/assets/cards/token_pair/' + cardData.data.tokenPair + '.svg')" />
                </div>
            </v-row>
        </v-col>
        <v-col v-if="$wu.isFull()" class="my-1" cols="1">
            <v-row class="ma-0" justify="end" align="center">
                <label class="card-label">{{ accountEtsBalance ? ('$' + $utils.formatMoneyComma(accountEtsBalance, 2)) : '' }}</label>
            </v-row>
        </v-col>
        <v-col v-if="!$wu.isMobile()" class="my-1">
            <v-row class="ma-0" justify="end" align="center">
                <v-btn x-small
                       v-if="!cardData.isPrototype && !(cardData.overcapEnabled && cardData.data.maxSupply && totalSupply[cardData.data.name] >= cardData.data.maxSupply)"
                       class="button btn-outlined"
                       @click.stop="mintAction" outlined>
                    MINT/REDEEM
                </v-btn>
                <v-btn x-small
                       v-else
                       class="button btn-outlined"
                       @click.stop="redeemAction" outlined>
                    REDEEM
                </v-btn>
            </v-row>
        </v-col>

        <resize-observer @notify="$forceUpdate()"/>
    </v-row>
</template>

<script>
import Tooltip from "@/components/common/element/Tooltip";
import {mapActions, mapGetters} from "vuex";

export default {
    name: "EtsListCard",

    components: {
        Tooltip
    },

    props: {

        cardData: {
            type: Object
        },

        featured: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        ...mapGetters("marketData", ["etsStrategyData"]),
        ...mapGetters("supplyData", ["totalSupply"]),
        ...mapGetters('accountData', ['etsBalance']),

        accountEtsBalance: function () {
            return this.etsBalance[this.cardData.data.name];
        },
    },

    data: () => ({}),

    watch: {},

    created() {
    },

    methods: {
        ...mapActions('investModal', ['showInvestModal', 'showMintView', 'showRedeemView']),


        mintAction() {
            this.showMintView();
            this.showInvestModal(this.cardData.data);
        },

        redeemAction() {
            this.showRedeemView();
            this.showInvestModal(this.cardData.data);
        },

        openStrategyCard() {
            this.$router.push("/ets/" + this.cardData.data.name);
            window.scrollTo({top: 0, behavior: "smooth"});
        }
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
        font-size: 16px;
        line-height: 24px;
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
        font-size: 16px;
        line-height: 24px;
    }
}

.list-card-container {
    width: 100% !important;
    background: var(--secondary);
    border-radius: 8px;
}

* {
    cursor: pointer;
}

.list-card-container:hover {
    filter: none !important;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.05), 0 4px 4px 0 rgba(0, 0, 0, 0.05);
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
</style>
