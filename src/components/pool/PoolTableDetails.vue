<template>
    <div>
        <div class="row">
            <div @click="openPoolLink" class="col-4 col-xl-4 col-lg-4 col-md-4 col-sm-4" style="cursor: pointer">
                <div class="pool-table-header-item">
                   <div class="pool-table-platform-container">
                       <div class="pool-platform-icon">
                           <div class="icon mr-2">
                               <v-img :src="require('@/assets/cards/platform/' + pool.platform + '.svg')"
                                      :title="pool.platform"/>
                           </div>
                       </div>

                       <div class="pool-platform-name">
                           {{pool.platform}}
                       </div>

                       <div class="pool-platform-link">
                           <img src="/assets/icon/pool/platform-link.svg" alt="link"/>
                       </div>
                   </div>
                </div>
            </div>
            <div class="col-2 col-xl-2 col-lg-2 col-md-2 col-sm-4">
                <div class="pool-table-header-item">
                    <label v-if="pool.apr" class="card-label">
                        {{ $utils.formatMoneyComma(pool.apr, 2) }}%
                    </label>
                    <label v-else class="card-label see-on-dex-label">
                        {{ 'see on dex' }}
                    </label>
                </div>
            </div>
            <div class="col-2 col-xl-2 col-lg-2 col-md-2 col-sm-4">
                <div class="pool-table-header-item">
                    <label v-if="pool.tvl" class="card-label">
                        ${{ $utils.formatNumberToMln(pool.tvl, 0) }}M
                    </label>
                    <label v-else class="card-label see-on-dex-label">
                        -
                    </label>
                </div>
            </div>
            <div class="col-4 col-xl-4 col-lg-4 col-md-4 col-sm-12">
                <div class="pool-table-header-item">
                    <v-btn v-if="pool.zappable"
                           x-small
                           class="button button-full-width btn-outlined mb-3"
                           @click.stop="openZapInFunc(pool)" outlined>
                        ZAP IN
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import {mapGetters} from "vuex";

export default defineComponent({
    name: "PoolTableDetails",
    props: {
        pool: {
            type: Object,
            required: true
        },
        openZapInFunc: {
            type: Function,
            required: true
        },
    },
    computed: {
        ...mapGetters('network', ['networkName']),
    },
    methods: {
        openPoolLink() {
            let url;

            switch (this.pool.platform) {
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
                    url = 'https://app.wombat.exchange/pool/';
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
                case 'Chronos':
                    url = 'https://app.chronos.exchange/liquidity/';
                    break;
                case 'Gnd':
                    url = 'https://farm.gndprotocol.com/farms';
                    break;
                case 'Vesync':
                    url = 'https://app.vesync.finance/liquidity/';
                    break;
                default:
                    url = this.pool.explorerUrl + '/address/';
                    break;
            }

            if (this.pool.platform === 'Thena' || this.pool.platform === 'Wombat') {
                window.open(url, '_blank').focus();
                return;
            }

            if (this.pool.platform === 'Beethoven') {
                url += this.pool.address + '0000000000000000000000ae';
                window.open(url, '_blank').focus();
                return;
            }

            url += this.pool.address;
            window.open(url, '_blank').focus();
        }
    }
})
</script>


<style scoped>
div {
    font-family: 'Roboto', sans-serif;
}

.button-full-width {
    width: 100% !important;
}

.btn-outlined {
    color: var(--links-blue) !important;
}

.card-label {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'liga' off;
    color: var(--main-gray-text);
}

.button {
    padding-top: 5px;
    padding-bottom: 5px;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px ;
    letter-spacing: 0.03em;
    font-family: 'Roboto', sans-serif;
    height: 28px!important;
    border-radius: 2px;
    box-shadow: none ;

    text-align: center;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
}

.see-on-dex-label {
    color: #b2b2b2
}


.icon {
    height: 28px;
    width: 28px;
}

.icon-token-pair {
    width: 54px;
}


.pool-platform-name {
    padding-left: 32px;
    color: var(--main-gray-text)
}

.pool-platform-icon {
    position: absolute;;
    top: -2px;
}

.pool-platform-link {
    position: absolute;
    right: 45px;
    top: 3px
}

.pool-table-platform-container {
    position: relative;
    cursor: pointer;
}

/* mobile */
@media only screen and (max-width: 960px) {

    .button {
        width: 95%;
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .card-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }


    .icon {
        height: 20px;
        width: 20px;
    }

    .icon-token-pair {
        width: 38px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .button {
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .card-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
    }

    .icon {
        height: 24px;
        width: 24px;
    }

    .icon-token-pair {
        width: 46px;
    }
}

</style>
