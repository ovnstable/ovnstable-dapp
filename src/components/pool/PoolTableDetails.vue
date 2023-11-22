<template>
    <div>
        <div v-if="$wu.isMobile()" class="d-block zap-btn">
            <v-btn v-if="pool.zappable"
                   x-small
                   class="button button-full-width btn-special btn-outlined mb-3"
                   @click.stop="openZapInFunc(pool, 'pools')" outlined>
                ZAP IN
            </v-btn>
        </div>
        <div class="row">
            <div @click="openPoolLink(pool)" class="col-3 col-xl-3 col-lg-3 col-md-3 col-sm-3" style="cursor: pointer">
                <div class="pool-table-header-item">
                   <div v-if="pool.isOpened" class="pool-table-platform-container">
                       <div class="pool-platform-icon">
                           <div class="icon mr-2">
                               <v-img :src="require('@/assets/cards/platform/' + pool.platform + '.svg')"
                                      :title="pool.platform"
                                        class="pool-platform-icon-one"
                               />
                           </div>
                       </div>

                       <div v-if="pool.platform === 'Baseswapdefiedge'" class="pool-platform-name">
                            <div>
                                Baseswap
                            </div>
                            <div>
                                Defiedge
                            </div>
                       </div>

                       <div v-else class="pool-platform-name">
                          {{ pool.platform === "Shekel" ? "Shekelswap": pool.platform }}
                       </div>

                       <div v-if="!$wu.isMobile()"
                                 v-bind:style="$wu.isMobile() ? 'right: -17px;' : 'right: -20px'"
                            class="pool-platform-link">
                           <img
                                :src="require('@/assets/icon/pool/platform-link.svg')"
                                alt="link"
                            />
                       </div>
                   </div>
                    <div v-else>
                        <div  class="pool-table-platform-container">
                            <div @click="openPoolLink(pool, true)"
                                 class="pool-platform-icon">
                                <div class="icon mr-2">
                                    <v-img :src="require('@/assets/cards/platform/' + pool.platform + '.svg')"
                                           :title="pool.platform"
                                           class="platform-icon "
                                    />
                                </div>
                            </div>
                            <div v-for="(aggregator, index) in pool.aggregators" :key="aggregator.id"
                                 @click="openAggregatorLink(aggregator)"
                                 v-bind:style="'left:' + (index + 1) * 35 + 'px;'"
                                 class="pool-platform-icon">
                                <div class="icon mr-2">
                                    <v-img :src="require('@/assets/cards/platform/' + aggregator.platform + '.svg')"
                                           :title="aggregator.platform"
                                            class="platform-icon"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div @click="toggleDetailsFunc(pool)"
                 class="col-3 col-xl-3 col-lg-3 col-md-3 col-sm-3">
                <div class="pool-table-header-item text-center">
                    <label v-if="pool.apr && !disabledAprInfoPlatformList.includes(pool.platform)" class="card-label">
                        {{ $utils.formatMoneyComma(pool.apr, 2) }}% <sup v-if="pool.platform === 'Beefy'">(apy)</sup>
                    </label>
                    <label v-else class="card-label see-on-dex-label">
                        see on platform
                    </label>
                </div>
            </div>
            <div @click="toggleDetailsFunc(pool)"
                 class="col-2 col-xl-2 col-lg-2 col-md-2 col-sm-2">
                <div v-if="pool.tvl >= 1000000 && !disabledTvlInfoPlatformList.includes(pool.platform)" class="pool-table-header-item">
                    <label v-if="pool.tvl" class="card-label">
                        ${{ $utils.formatNumberToMln(pool.tvl, 2) }}M
                    </label>
                    <label v-else class="card-label see-on-dex-label">
                        -
                    </label>
                </div>
                <div v-if="pool.tvl < 1000000 && !disabledTvlInfoPlatformList.includes(pool.platform)" class="pool-table-header-item">
                    <label v-if="pool.tvl" class="card-label">
                        ${{ $utils.formatNumberToThousands(pool.tvl, 0) }}K
                    </label>
                    <label v-else class="card-label see-on-dex-label">
                        -
                    </label>
                </div>
                <div v-if="disabledTvlInfoPlatformList.includes(pool.platform)" class="pool-table-header-item">
                    <label v-if="pool.tvl" class="card-label see-on-dex-label">
                        see on platform
                    </label>
                    <label v-else class="card-label see-on-dex-label">
                        -
                    </label>
                </div>
            </div>
            <div v-if="!$wu.isMobile()"
                 @click="toggleDetailsFunc(pool)"
                 class="col-2 col-xl-2 col-lg-2 col-md-2 col-sm-6">
                <div class="pool-table-header-item">

                    <v-btn v-if="pool.zappable"
                           x-small
                           class="button button-full-width btn-outlined mb-3"
                           @click.stop="openZapInFunc(pool, 'pools')" outlined>
                        ZAP IN
                    </v-btn>
                </div>
            </div>

            <div
                v-if="pool.stableFishUrl"
                class="col-2 col-xl-2 col-lg-2 col-md-2 col-sm-6">
                <div @click="openLinkToStableFish" class="tooltip-wrapper">
                    <div class="tooltip-trigger">
                        <v-img
                            :src="require('@/assets/icon/stableFish.svg')"
                            class="stable-fish-icon"
                        />
                    </div>
                    <div class="tooltip-content">
                        <Tooltip
                            top
                            text="See on Stable Fish"
                            :link="pool.stableFishUrl"/>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="pool.isOpened && !isShowOnlyZap && !isShowAprLimit && pool.aggregators && pool.aggregators.length">
            <div class="aggregator-hr mt-4 mb-4"></div>

            <div v-for="aggregator in pool.aggregators" :key="aggregator.id" class="row">
                <div class="col-12 col-lg-12 col-md-12 col-sm-12">
                    <div v-if="$wu.isMobile()" class="d-block zap-btn">
                        <v-btn v-if="aggregator.zappable"
                               x-small
                               class="button button-full-width btn-special btn-outlined mb-3"
                               @click.stop="openZapInFunc(aggregator, 'pools')" outlined>
                            ZAP IN
                        </v-btn>
                    </div>
                </div>
                <div @click="openAggregatorLink(aggregator)"
                     class="col-3 col-xl-3 col-lg-3 col-md-3 col-sm-3"
                     style="cursor: pointer">
                    <div class="pool-table-header-item">
                        <div class="pool-table-platform-container">
                            <div class="pool-platform-icon">
                                <div class="icon mr-2">
                                    <v-img :src="require('@/assets/cards/platform/' + aggregator.platform + '.svg')"
                                           :title="aggregator.platform"/>
                                </div>
                            </div>

                            <div class="pool-platform-name aggregator-name">
                                {{aggregator.platform}}
                            </div>

                            <div v-if="!$wu.isMobile()"
                                 v-bind:style="$wu.isMobile() ? 'right: -17px;' : 'right: -20px'"
                                class="pool-platform-link">
                                <img
                                    :src="require('@/assets/icon/pool/platform-link.svg')"
                                    alt="link"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-3 col-xl-3 col-lg-3 col-md-3 col-sm-3">
                    <div class="pool-table-header-item text-center">
                        <label v-if="aggregator.apr" class="card-label text-center">
                            {{ $utils.formatMoneyComma(aggregator.apr, 2) }}%<sup v-if="aggregator.platform === 'Beefy'">apy</sup>
                        </label>
                        <label v-else class="card-label see-on-dex-label see-on-dex-another">
                            see on platform
                        </label>
                    </div>
                </div>
                <div class="col-2 col-xl-2 col-lg-2 col-md-2 col-sm-2">
                    <div class="pool-table-header-item">
                        <label v-if="aggregator.tvl" class="card-label">
                            ${{ $utils.formatNumberToThousands(aggregator.tvl, 0) }}K
                        </label>
                        <label v-else class="card-label see-on-dex-label see-on-dex-another">
                            see on platform
                        </label>
                    </div>
                </div>
                <div v-if="!$wu.isMobile()" class="col-12 col-xl-2 col-lg-2 col-md-2 col-sm-12">
                    <div class="pool-table-header-item">
                        <v-btn v-if="aggregator.zappable"
                               x-small
                               class="button button-full-width btn-outlined mb-3"
                               @click.stop="openZapInFunc(aggregator, 'pools')" outlined>
                            ZAP IN
                        </v-btn>
                    </div>
                </div>
            </div>
        </div>
        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import {mapGetters} from "vuex";
import {pool} from "@/components/mixins/pool";
import Tooltip from "@/components/common/element/Tooltip";

export default defineComponent({
    name: "PoolTableDetails",
    mixins: [pool],
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
    components: {
        Tooltip,
    },
    data() {
        return {
            disabledAprInfoPlatformList: ['Chronos', 'Baseswap', 'Swapbased'],
            disabledTvlInfoPlatformList: ['Chronos', 'Baseswap'],
        }
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
        openLinkToStableFish(url) {
            window.open(this.pool.stableFishUrl, '_blank').focus();
        },
    }
})
</script>


<style scoped>
@media only screen and (max-width: 960px) {
    .zap-btn {
        max-width: 100%;
    }

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
        margin-left: 40px;
    }

    .icon {
        height: 20px;
        width: 20px;
    }

    .icon-token-pair {
        width: 38px;
    }

    .btn-special {
        width: 100% !important;
        max-width: 100% !important;
    }

    .see-on-dex-label {
        font-size: 12px!important;
    }

    .pool-platform-link {
        right: 45px;
        top: 3px;
        left: 120px;
    }

    .pool-platform-icon-one {
        position: absolute;
        width: 25px;
        top: 0px !important;
    }

    .see-on-dex-another {
        display: flex;
        margin-left: 40px;
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

    .see-on-dex-label {
        font-size: 14px!important;
    }

    .pool-platform-link {
        right: 45px;
        top: 3px
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .card-label {
        font-size: 16px;
        line-height: 24px;
    }

    .see-on-dex-label {
        font-size: 14px!important;
    }

    .pool-platform-link {
        right: 45px;
        top: 3px
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .card-label {
        font-size: 16px;
        line-height: 24px;
    }

    .see-on-dex-label {
        font-size: 14px!important;
    }

    .pool-platform-link {
        right: 45px;
        top: 3px
    }
}

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

.aggregator-name {
    padding-top: 0;
}

.pool-platform-icon {
    position: absolute;;
    top: -2px;
}

.pool-platform-link {
    position: absolute;
}

.pool-table-platform-container {
    position: relative;
    cursor: pointer;
}

.aggregator-hr {
    border-bottom: 1px solid var(--main-border);
}

.tooltip-wrapper {
    position: relative;
    display: inline-block;
    cursor: pointer;
}

.tooltip-content {
    position: absolute;
    bottom: 29%; /* Position the tooltip above the icon */
    left: 50%;
    transform: translateX(-50%); /* Center the tooltip horizontally */
    display: none; /* Hide the tooltip by default */
    opacity: 0;
}

.tooltip-wrapper:hover .tooltip-content {
    display: block; /* Show the tooltip when hovering over the icon */
}

/* Additional styles for the icon (adjust as needed) */
.stable-fish-icon {
    width: 32px;
    height: 32px;
    cursor: pointer;
}

</style>
