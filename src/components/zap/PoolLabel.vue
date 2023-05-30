<template>
    <div>
        <div v-if="pool"
             v-bind:style="'background: linear-gradient(57.78deg, ' + getParams(pool.chain).networkColor + ' -94.19%, transparent 57.68%);'"
             class="pool-label-container">
            <div class="row">
                <div class="col-12 col-lg-6 col-md-6 col-sm-12">
                    <div class="row">
                        <div class="col-2 col-lg-2 col-md-2 col-sm-2">
                            <div class="icon mr-3 pt-3">
                                <v-img :src="require('@/assets/network/' + pool.chainName + '.svg')"
                                    :title="pool.chainName.toUpperCase()"/>
                            </div>
                        </div>
                        <div class="col-5 col-lg-5 col-md-5 col-sm-5 text-center my-0">
                            <v-row class="ma-0 pt-3" justify="start" align="center">
                                <div class="icon">
                                    <v-img v-if="pool.token0Icon" :src="pool.token0Icon"/>
                                </div>
                                <div  class="icon ml-n2 mr-2">
                                    <v-img v-if="pool.token1Icon" :src="pool.token1Icon"/>
                                </div>
                            </v-row>
                        </div>
                        <div class="col-5 col-lg-5 col-md-5 col-sm-5">
                            <div class="platform-name pt-1">
                                {{pool.name}}
                            </div>
                            <div class="platform-label-container">
                                <div class="platform-label">
                                    {{pool.platform ? pool.platform.toUpperCase() : '-'}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-6 col-md-6 col-sm-12">
                    <div class="row">
                        <div class="col-4 col-lg-4 col-md-4 col-sm-4">
                            <div class="pool-detail-title">
                                APR
                            </div>
                            <div class="pool-detail-item">
                                {{$utils.formatMoney(pool.apr, 2)}}%
                            </div>
                        </div>
                        <div class="col-4 col-lg-4 col-md-4 col-sm-4">
                            <div class="pool-detail-title">
                                TVL
                            </div>
                            <div class="pool-detail-item">
                                {{('$' + $utils.formatNumberToMln(pool.tvl, 0))}}M
                            </div>
                        </div>
                        <div class="col-4 col-lg-4 col-md-4 col-sm-4">
                            <div class="pool-detail-title">
                                Staking
                            </div>
                            <div>
                                <div class="icon mr-2">
                                    <v-img :src="require('@/assets/cards/platform/' + pool.platform + '.svg')"
                                           :title="pool.platform"/>
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

div {
    font-family: 'Roboto',serif;
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

.platform-name {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    color: var(--main-gray-text);
}

.icon {
    height: 35px;
    width: 35px;
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
    font-size: 18px;
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
