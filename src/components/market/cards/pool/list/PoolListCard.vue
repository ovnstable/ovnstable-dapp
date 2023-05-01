<template>
    <v-row class="list-card-container ma-0" @click="$wu.isMobile() ? switchCard() : openPoolLink()">
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
        <v-col :cols="$wu.isFull() ? 3 : ($wu.isMobile() ? 6 : 3)" class="my-1">
            <v-row class="ma-0" justify="start" align="center">
                <div class="icon">
                    <v-img v-if="cardData.data.token0Icon" :src="cardData.data.token0Icon"/>
                </div>
                <div  class="icon ml-n2 mr-2">
                    <v-img v-if="cardData.data.token1Icon" :src="cardData.data.token1Icon"/>
                </div>
                <div class="icon ml-n2 mr-2">
                    <v-img v-if="cardData.data.token2Icon" :src="cardData.data.token2Icon"/>
                </div>
                <div class="icon ml-n2 mr-2">
                    <v-img v-if="cardData.data.token3Icon" :src="cardData.data.token3Icon"/>
                </div>
                <label class="card-label">
                    {{ cardData.data.name }}
                </label>
            </v-row>
        </v-col>
        <v-col cols="3" class="my-1">
            <v-row class="ma-0" justify="end" align="center">
                <label class="card-label">
                    ${{ $utils.formatMoneyComma(cardData.tvl, 2) }}
                </label>
            </v-row>
        </v-col>
        <v-col cols="3" class="my-1">
            <v-row class="ma-0" justify="end" align="center">
            <label v-if="cardData.apr" class="card-label">
                {{ $utils.formatMoneyComma(cardData.apr, 2) + '%' }}
            </label>
            <label v-else class="card-label see-on-dex-label">
                {{ 'see on dex' }}
            </label>
            </v-row>
        </v-col>
        <v-col v-if="!$wu.isMobile()" class="my-1">
            <v-row class="ma-0" justify="end" align="center">
                <v-btn x-small
                       class="button btn-outlined"
                       @click.stop="openPoolLink" outlined>
                    VIEW
                </v-btn>
            </v-row>
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
                            <v-img :src="require('@/assets/network/' + cardData.data.chainName + '.svg')"
                                   :title="cardData.data.chainName.toUpperCase()"/>
                        </div>
                    </v-row>
                </v-col>
                <v-col>
                    <v-row justify="center" align="center">
                        <div class="icon mr-2">
                            <v-img :src="require('@/assets/cards/platform/' + cardData.data.dex + '.svg')"
                                   :title="cardData.data.dex"/>
                        </div>
                    </v-row>
                </v-col>
                <v-col>
                    <v-row justify="end" align="center">
                        <div class="icon">
                            <v-img :src="cardData.data.token0Icon"/>
                        </div>
                        <div class="icon ml-n2 mr-2">
                            <v-img :src="cardData.data.token1Icon"/>
                        </div>
                        <div class="icon ml-n2 mr-2">
                            <v-img :src="cardData.data.token2Icon"/>
                        </div>
                        <div class="icon ml-n2 mr-2">
                            <v-img :src="cardData.data.token3Icon"/>
                        </div>
                    </v-row>
                </v-col>
            </v-row>

            <v-row class="ma-0 mt-3" align="center">
                <v-btn x-small
                       class="button button-full-width btn-outlined"
                       @click.stop="openPoolLink" outlined>
                    VIEW
                </v-btn>
            </v-row>
        </v-col>

        <resize-observer @notify="$forceUpdate()"/>
    </v-row>
</template>

<script>

export default {
    name: "PoolListCard",

    components: {
    },

    props: {

        cardData: {
            type: Object
        },
    },

    computed: {
    },

    data: () => ({
        cardOpened: false,
    }),

    watch: {},

    created() {
        this.cardOpened = this.cardData.cardOpened;
    },

    methods: {

        openPoolLink() {
            let url;

            console.log(this.cardData.data.address);

            switch (this.cardData.data.dex) {
                case 'Dystopia':
                    url = 'https://www.dystopia.exchange/liquidity/';
                    break;
                case 'Cone':
                    url = 'https://www.cone.exchange/liquidity/';
                    break;
                case 'Thena':
                    url = 'https://www.thena.fi/liquidity/';
                    break;
                case 'QuickSwap':
                    url = 'https://info.quickswap.exchange/#/pair/'
                    break;
                case 'Meshswap':
                    url = 'https://meshswap.fi/exchange/pool/detail/';
                    break;
                case 'Velodrome':
                    url = 'https://app.velodrome.finance/liquidity/manage?address=';
                    break;
                case 'Beethoven':
                    url = 'https://op.beets.fi/pool/';
                    break;
                case 'Uniswap':
                    url = 'https://info.uniswap.org/#/polygon/pools/';
                    break;
                case 'Sushiswap':
                    url = 'https://www.sushi.com/earn/matic:';
                    break;
                case 'Solidlizard':
                    url = 'https://info.solidlizard.finance/pair/';
                    break;
                case 'Arbidex':
                    url = 'https://arbidex.fi/add/';
                    break;
                case 'Sterling':
                    url = 'https://www.sterling.finance/liquidity/';
                    break;
                case 'Wombat':
                    url = 'https://app.wombat.exchange/pool';
                    break;
                case 'Solunea':
                    url = 'https://www.solunea.xyz/liquidity/';
                    break;
                case 'Ramses':
                    url = 'https://app.ramses.exchange/liquidity/';
                    break;
                case 'Velocore':
                    url = 'https://app.velocore.xyz/liquidity/';
                    break;
                default:
                    url = this.cardData.data.explorerUrl + '/address/';
                    break;
            }

            if (this.cardData.data.dex === 'Thena') {
              window.open(url, '_blank').focus();
              return;
            }

            if (this.cardData.data.dex === 'Beethoven') {
                url += this.cardData.data.address + '0000000000000000000000ae';
                window.open(url, '_blank').focus();
                return;
            }

            url += this.cardData.data.address;
            window.open(url, '_blank').focus();
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
        font-size: 16px;
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
        font-size: 16px;
        line-height: 24px;
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

.card-divider {
    border-color: var(--fourth-gray-text) !important;
}

.list-header-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--third-gray-text);
}

.button-full-width {
    width: 100% !important;
}

.icon > .v-image {
    border-radius: 9999px !important;

}

.see-on-dex-label {
    color: #b2b2b2
}
</style>
