<template>
    <div>
        <div v-if="pool"
             v-bind:style="'background: linear-gradient(57.78deg, ' + getParams(pool.chain).networkColor + ' -94.19%, transparent 57.68%);'"
             v-bind:class="isShort ? 'pool-label-container-short' : ''"
             class="pool-label-container">
            <div class="row">
                <div
                    v-bind:class="isShort ? 'col-12 col-lg-12 col-md-12 col-sm-12' : 'col-12 col-lg-6 col-md-6 col-sm-12'">
                    <div class="row">
                        <div class="col-2 col-lg-2 col-md-2 col-sm-2">
                            <div class="icon mr-3 pt-3">
                                <v-img :src="require('@/assets/network/' + pool.chainName + '.svg')"
                                       v-bind:class="isShort ? 'icon-short' : ''"
                                       :title="pool.chainName.toUpperCase()"/>
                            </div>
                        </div>
                        <div
                            v-bind:class="isShort ? 'col-6 col-lg-6 col-md-6 col-sm-6' : 'col-5 col-lg-5 col-md-5 col-sm-5'"
                            class="text-center my-0">
                            <v-row class="ma-0 pt-3" justify="start" align="center">
                                <div class="icon">
                                    <v-img v-if="pool.token0Icon"
                                           v-bind:class="isShort ? 'icon-short' : ''"
                                           :src="pool.token0Icon"/>
                                </div>
                                <div  class="icon ml-n2 mr-2">
                                    <v-img v-if="pool.token1Icon"
                                           v-bind:class="isShort ? 'icon-short' : ''"
                                           :src="pool.token1Icon"/>
                                </div>
                            </v-row>
                        </div>
                        <div
                            v-bind:class="isShort ? 'col-4 col-lg-4 col-md-4 col-sm-4' : 'col-5 col-lg-5 col-md-5 col-sm-5'">
                            <div
                                v-bind:class="isShort ? 'short-title platform-name-short' : ''"
                                class="platform-name pt-1">
                                {{pool.name}}
                            </div>
                            <div
                                v-bind:class="isShort ? 'short-title' : ''"
                                class="platform-label-container">
                                <div class="platform-label">
                                    {{pool.platform ? pool.platform.toUpperCase() : '-'}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-bind:class="isShort ? 'col-12 col-lg-12 col-md-21 col-sm-12' : 'col-12 col-lg-6 col-md-6 col-sm-12'">
                    <div class="row">
                        <div
                            v-bind:class="isShort ? 'col-5 col-lg-5 col-md-5 col-sm-5' : 'col-4 col-lg-4 col-md-4 col-sm-4'">
                            <div
                                v-bind:class="isShort ? 'pool-detail-title-short' : ''"
                                class="pool-detail-title">
                                <span v-if="pool.platform === 'Beefy'">
                                    APY
                                </span>
                                <span v-else>
                                    APR
                                </span>
                            </div>
                            <div
                                v-bind:class="isShort ? 'pool-detail-item-short' : ''"
                                class="pool-detail-item">
                                <span  v-if="pool.apr < 10000">
                                    {{$utils.formatMoney(pool.apr, 2)}}%
                                </span>
                                <span v-else>
                                    {{ $utils.formatNumberToThousands(pool.apr, 0)}}K %
                                </span>
                            </div>
                        </div>
                        <div v-bind:class="isShort ? 'col-4 col-lg-4 col-md-4 col-sm-4' : 'col-4 col-lg-4 col-md-4 col-sm-4'">
                            <div
                                v-bind:class="isShort ? 'pool-detail-title-short' : ''"
                                class="pool-detail-title">
                                TVL
                            </div>
                            <div  v-if="pool.tvl >= 1000000"
                                  v-bind:class="isShort ? 'pool-detail-item-short' : ''"
                                  class="pool-detail-item">
                                {{('$' + $utils.formatNumberToMln(pool.tvl, 0))}}M
                            </div>
                            <div  v-if="pool.tvl < 1000000"
                                  v-bind:class="isShort ? 'pool-detail-item-short' : ''"
                                  class="pool-detail-item">
                                ${{ $utils.formatNumberToThousands(pool.tvl, 0)}}K
                            </div>
                        </div>
                        <div
                            v-bind:class="isShort ? 'col-3 col-lg-3 col-md-3 col-sm-3' : 'col-4 col-lg-4 col-md-4 col-sm-4'">
                            <div
                                v-bind:class="isShort ? 'pool-detail-title-short' : ''"
                                class="pool-detail-title">
                                Staking
                            </div>
                            <div>
                                <div class="icon mr-2">
                                    <v-img :src="require('@/assets/cards/platform/' + pool.platform + '.svg')"
                                           v-bind:class="isShort ? 'icon-short' : ''"
                                           :title="pool.platform"
                                            class="platform-icon"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import {mapGetters} from "vuex";

export default defineComponent({
    name: "PoolLabel",
    props: {
        pool: {
            type: Object,
            required: true
        },
        isShort: {
            type: Boolean,
            required: false,
        }
    },
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters('network', ['getParams', 'networkColor']),
    }
})
</script>

<style scoped>

.icon-short {
    height: 20px !important;
    width: 20px !important;
}

.icon-token-pair-short {
    width: 38px !important;
}


.pool-detail-item-short {
    font-style: normal;
    font-weight: 400;
    font-size: 12px!important;
    line-height: 28px;
    color: var(--main-gray-text);
}

div {
    font-family: 'Roboto',serif;
}

.pool-label-container-short {
    padding: 20px 10px;
}

.pool-label-container {
    padding: 20px;
    box-shadow: 0px 0px 4px var(--card-pool-label-shadow);
    border-radius: 20px;
}


.platform-label-container {
    padding: 2px 4px;
    background: var(--card-info-background);
    border-radius: 4px;
    max-width: 90px;
}

.platform-label {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: var(--action-label-text);
}

.platform-name-short {
    font-size: 12px!important;
}

.platform-name {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: var(--main-gray-text);
}

.icon {
    height: 35px;
    width: 35px;
}

.pool-detail-title-short {
    font-size: 11px!important;
}

.pool-detail-title {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: var(--third-gray-text);
}

.pool-detail-item {
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 36px;
    color: var(--main-gray-text);
}

/* mobile */
@media only screen and (max-width: 960px) {

    .icon {
        height: 20px !important;
        width: 20px !important;
    }

    .icon-token-pair {
        width: 38px !important;
    }


    .pool-detail-item {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 28px;
        color: var(--main-gray-text);
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

    .pool-detail-item {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 30px;
        color: var(--main-gray-text);
    }
}

</style>
