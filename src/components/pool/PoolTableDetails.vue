<template>
    <div>
        <div class="row">
            <div @click="openPoolLink(pool)" class="col-4 col-xl-4 col-lg-4 col-md-4 col-sm-4" style="cursor: pointer">
                <div class="pool-table-header-item">
                   <div v-if="pool.isOpened" class="pool-table-platform-container">
                       <div class="pool-platform-icon">
                           <div class="icon mr-2">
                               <v-img :src="require('@/assets/cards/platform/' + pool.platform + '.svg')"
                                      :title="pool.platform"/>
                           </div>
                       </div>

                       <div class="pool-platform-name">
                           {{pool.platform}}
                       </div>

                       <div v-bind:style="$wu.isMobile() ? 'right: -17px;' : ''"
                            class="pool-platform-link">
                           <img src="/assets/icon/pool/platform-link.svg" alt="link"/>
                       </div>
                   </div>
                    <div v-else>
                        <div  class="pool-table-platform-container">
                            <div @click="openPoolLink(pool, true)"
                                 class="pool-platform-icon">
                                <div class="icon mr-2">
                                    <v-img :src="require('@/assets/cards/platform/' + pool.platform + '.svg')"
                                           :title="pool.platform"/>
                                </div>
                            </div>
                            <div v-for="(aggregator, index) in pool.aggregators" :key="aggregator.id"
                                 @click="openAggregatorLink(aggregator)"
                                 v-bind:style="'left:' + (index + 1) * 35 + 'px;'"
                                 class="pool-platform-icon">
<!--                                {{index}}-->
                                <div class="icon mr-2">
                                    <v-img :src="require('@/assets/cards/platform/' + aggregator.platform + '.svg')"
                                           :title="aggregator.platform"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div @click="toggleDetailsFunc(pool)"
                 class="col-2 col-xl-2 col-lg-2 col-md-2 col-sm-4">
                <div class="pool-table-header-item">
                    <label v-if="pool.apr" class="card-label">
                        {{ $utils.formatMoneyComma(pool.apr, 2) }}%
                    </label>
                    <label v-else class="card-label see-on-dex-label">
                        {{ pool.platform !== 'Gnd' ? 'see on dex' : 'see on protocol UI'}}
                    </label>
                </div>
            </div>
            <div @click="toggleDetailsFunc(pool)"
                 class="col-2 col-xl-2 col-lg-2 col-md-2 col-sm-4">
                <div class="pool-table-header-item">
                    <label v-if="pool.tvl" class="card-label">
                        ${{ $utils.formatNumberToMln(pool.tvl, 0) }}M
                    </label>
                    <label v-else class="card-label see-on-dex-label">
                        -
                    </label>
                </div>
            </div>
            <div @click="toggleDetailsFunc(pool)"
                 class="col-4 col-xl-4 col-lg-4 col-md-4 col-sm-12">
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

        <div v-if="pool.isOpened && !isShowOnlyZap && !isShowAprLimit && pool.aggregators && pool.aggregators.length">
            <div class="aggregator-hr mt-4 mb-4"></div>

            <div v-for="aggregator in pool.aggregators" :key="aggregator.id" class="row">
                <div @click="openAggregatorLink(aggregator)" class="col-4 col-xl-4 col-lg-4 col-md-4 col-sm-4" style="cursor: pointer">
                    <div class="pool-table-header-item">
                        <div class="pool-table-platform-container">
                            <div class="pool-platform-icon">
                                <div class="icon mr-2">
                                    <v-img :src="require('@/assets/cards/platform/' + aggregator.platform + '.svg')"
                                           :title="aggregator.platform"/>
                                </div>
                            </div>

                            <div class="pool-platform-name">
                                {{aggregator.platform}}
                            </div>

                            <div v-bind:style="$wu.isMobile() ? 'right: -14px;' : ''"
                                class="pool-platform-link">
                                <img src="/assets/icon/pool/platform-link.svg" alt="link"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-2 col-xl-2 col-lg-2 col-md-2 col-sm-4">
                    <div class="pool-table-header-item">
                        <label v-if="aggregator.apr" class="card-label">
                            {{ $utils.formatMoneyComma(aggregator.apr, 2) }}%
                        </label>
                        <label v-else class="card-label see-on-dex-label">
                            {{ 'see on protocol UI' }}
                        </label>
                    </div>
                </div>
                <div class="col-3 col-xl-3 col-lg-3 col-md-3 col-sm-4">
                    <div class="pool-table-header-item">
                        <label v-if="aggregator.tvl" class="card-label">
                            ${{ $utils.formatNumberToMln(aggregator.tvl, 0) }}M
                        </label>
                        <label v-else class="card-label see-on-dex-label">
                            {{ 'see on protocol UI' }}
                        </label>
                    </div>
                </div>
                <div class="col-3 col-xl-3 col-lg-3 col-md-3 col-sm-12">
                    <!--                <div class="pool-table-header-item">-->
                    <!--                    <v-btn v-if="aggregator.zappable"-->
                    <!--                           x-small-->
                    <!--                           class="button button-full-width btn-outlined mb-3"-->
                    <!--                           @click.stop="openAggregatorZapInFunc(aggregator)" outlined>-->
                    <!--                        ZAP IN-->
                    <!--                    </v-btn>-->
                    <!--                </div>-->
                </div>
            </div>
        </div>
        <resize-observer @notify="$forceUpdate()"/>
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
        toggleDetailsFunc: {
            type: Function,
            required: true
        },
        isShowOnlyZap: {
            type: Boolean,
            required: true
        },
        isShowAprLimit: {
            type: Boolean,
            required: true
        },
    },
    computed: {
        ...mapGetters('network', ['networkName']),
    },
    methods: {
        openPoolLink(pool, isForce) {
            if (!isForce && !pool.isOpened) {
                console.log("Pool not move to link, pool is not opened");
                return;
            }

            this.openLink(pool);
        },
        openAggregatorLink(aggregator) {
            if (aggregator.link) {
                window.open(aggregator.link, '_blank').focus();
                return
            }

            this.openLink(aggregator)
        },

        openLink(pool) {

            let url;

            switch (pool.platform) {
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
                case 'Beefy':
                    url = 'https://app.beefy.com';
                    break;
                case 'Ennead':
                    url = 'https://beta.ennead.farm/pools';
                    break;
                default:
                    url = pool.explorerUrl + '/address/';
                    break;
            }

            if (pool.platform === 'Thena' ||
                pool.platform === 'Wombat' ||
                pool.platform === 'Beefy' ||
                pool.platform === 'Ennead') {
                window.open(url, '_blank').focus();
                return;
            }

            if (pool.platform === 'Beethoven') {
                url += pool.address + '0000000000000000000000ae';
                window.open(url, '_blank').focus();
                return;
            }

            url += pool.address;
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
    max-width: 100px;

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
    color: #b2b2b2;
    font-size: 12px!important;
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

.aggregator-hr {
    border-bottom: 1px solid var(--main-border);
}

/* mobile */
@media only screen and (max-width: 960px) {

    .pool-platform-name {
        padding-left: 25px;
        font-size: 14px;
    }

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
    .pool-platform-name {
        padding-left: 25px;
        font-size: 14px;
    }

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
