<template>
    <v-row class="card-container" v-on:click.prevent @click="openAllPools()">
        <v-col cols="12" align-self="start">
            <v-row class="d-flex flex-row align-center header-row pl-4"
                   justify="center"
                   :style="{'--card-background': 'radial-gradient(108.67% 595.92% at 100% -3.25%, #001845 0%, #001845 27.05%, #0C255B 52.07%, ' + getParams(cardData.chain).networkColor + ' 100%)'}">
                    <div class="pool-logo-container">
                        <img :src="pool.token0Icon"
                             class="currency-logo currency-logo-first"
                             :alt="pool.token0Icon"/>
                        <img :src="pool.token1Icon"
                             class="currency-logo currency-logo-second"
                             :alt="pool.token1Icon"/>
                    </div>
                <v-row class="d-flex flex-column align-start mr-3 ml-8">
                    <v-row class="d-flex" align="center">
                        <label class="card-title" style="text-transform: none;">
                            {{pool.chainName === 'arbitrum' ? cardData.data.id.name.toUpperCase().replace('USDC', 'USDC.e') : cardData.data.id.name.toUpperCase()}} LP
                        </label>
                    </v-row>
                    <v-row class="d-flex" align="center">
                        <div class="platform-label">
                            <span v-if="pool.poolNameForAgregator">
                                {{pool.poolNameForAgregator.toUpperCase()}}
                            </span>
                            <span v-else>
                                {{pool.platform.toUpperCase()}}
                            </span>
                        </div>
                    </v-row>
                    <v-row class="d-flex mt-5">
                        <label class="percentage">
                            {{ $utils.formatMoneyComma((cardData.apr ? cardData.apr : 0), 0) + '%' }}
                        </label>
                        <div>
                            <div class="apy ml-3">CURRENT</div>
                            <div class="apy ml-3">APR</div>
                        </div>

                    </v-row>
                </v-row>
            </v-row>

            <v-container class="mt-3">
                <v-row align="center" justify="center" class="ma-0">
                    <label class="full-status-error-label">&nbsp;</label>
                </v-row>

                <v-row class="d-flex justify-space-between ma-0 mt-3">
                    <label class="progress-label-value">CURRENT TVL</label>
                    <label class="progress-label-value mb-5" v-if="cardData.tvl">
                        ${{ $utils.formatMoneyComma(cardData.tvl, 2) }}
                    </label>
                </v-row>
                <v-divider class="card-divider"></v-divider>

                <v-row class="ma-0 mt-8">
                    <label class="card-info">
                        Stake your LP tokens of Overnight pools with the highest yield. You can check your staked LP on the staking platform.
                    </label>
                </v-row>

                <v-row class="mt-3">
                    <v-col cols="6">
                        <v-row class="ma-0 mr-n2">
                            <div class="box">
                                <label class="box-name mt-2">Chain</label>
                                <div class="icon">
                                    <v-img :src="require('@/assets/network/' + cardData.chainName + '.svg')"
                                           class="mt-1"
                                           alt="chain icon"/>
                                </div>
                                <label class="chain-name mb-2 mt-1">{{ cardData.chainName }}</label>
                            </div>
                        </v-row>
                    </v-col>

                    <v-col cols="6">
                        <v-row class="ma-0 ml-n2">
                            <div class="box">
                                <label class="box-name mt-2">Staking Platform</label>
                                <div class="icon platform-logo">
                                    <v-img :src="require('@/assets/cards/platform/' + dexLogo + '.svg')"
                                           class="mt-1"
                                           alt="platform icon"/>
                                </div>
                                <label class="platform-name mb-2 mt-1">{{ cardData.platform }}</label>
                            </div>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </v-col>

        <v-col align-self="end">
            <v-container :class="$wu.isFull() ? 'mb-6' : 'mb-6'">

                <v-row class="d-flex justify-space-between ma-0" align="center"></v-row>

                <v-row class="d-flex justify-space-between ma-0 mt-2">
                    <template>
                        <v-col class="mr-1">
                            <v-row>
                                <v-btn v-if="cardData.zappable"
                                       class="button btn-filled"
                                       @click.stop="openZapIn(pool, 'featured')">
                                    ZAP IN
                                </v-btn>
                                <v-btn v-else
                                       class="button btn-outlined"
                                       outlined
                                       @click.stop="openExternalPool()">
                                    <label>STAKE</label>
                                    <img class="open-icon ml-1" :src="require('@/assets/icon/open_in_new_blue.svg')">
                                </v-btn>
                            </v-row>
                        </v-col>
                    </template>
                </v-row>
            </v-container>

            <v-row class="footer-row d-flex align-center justify-center" @click.stop="openExternalPool()">
                <label class="footer-link">View Pool on {{cardData.platform}}</label>
                <img class="open-icon ml-1" :src="require('@/assets/icon/open-in-new.svg')">
            </v-row>
        </v-col>

        <ZapModal :set-show-func='setIsZapModalShow'
                  :zap-pool="currentZapPool"
                  :is-show="isZapModalShow"
                  :type-of-pool="typeOfPool"
                  :pool-tokens-for-zap-map="poolTokensForZapMap"></ZapModal>

        <resize-observer @notify="$forceUpdate()"/>
    </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import polygonIcon from "@/assets/network/polygon.svg";
import optimismIcon from "@/assets/network/op.svg";
import arbitrumIcon from "@/assets/network/ar.svg";
import baseIcon from "@/assets/network/base.svg";
import lineaIcon from "@/assets/network/linea.svg";
import zksyncIcon from "@/assets/network/zk.svg";
import bscIcon from "@/assets/network/bsc.svg";
import { pool } from "@/components/mixins/pool";
import ZapModal from "@/components/zap/modals/ZapModal.vue";

export default {
    name: "UsdPlus",
    mixins: [pool],

    components: {
        ZapModal,
    },

    props: {
        networkName: {
            type: String,
            default: 'optimism',
        },

        cardData: {
            type: Object,
            required: true
        },
        pool: {
            type: Object,
            required: true
        }
    },

    computed: {
        ...mapGetters("dashboardData", ["profitUsdPlus", "apy", "slice"]),
        ...mapGetters("accountData", ["balance",]),
        ...mapGetters("wrapUI", ["showWrap"]),
        ...mapGetters('network', ['networkId', 'getParams']),
        ...mapGetters('magicEye', ['dataHidden']),



        networkParams: function() {
            return this.getParams(this.networkName);
        },

        dexLogo: function () {
            let dexName = this.cardData.platform;
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

        icon: function () {
            switch (this.networkParams.networkId) {
                case 137:
                    return polygonIcon;
                case 10:
                    return optimismIcon;
                case 56:
                    return bscIcon;
                case 42161:
                    return arbitrumIcon;
                case 8453:
                    return baseIcon;
                case 59144:
                    return lineaIcon;
                case 324:
                    return zksyncIcon;
            }

            return null
        },

        sliceLabel() {
            switch (this.slice) {
                case 7:
                    return "WEEK";
                case 30:
                    return "MONTH";
                default:
                    return "ALL";
            }
        }
    },

    data: () => ({
        avgApy: null,
        totalUsdPlusValue: null,
    }),

    watch: {
        networkName: function (newVal, oldVal) {
            this.loadData();
        }
    },

    mounted() {
        this.loadData();
    },

    methods: {
        ...mapActions("swapModal", ["showSwapModal", "showMintView"]),
        ...mapActions("swapModal", ["showSwapModal", "showRedeemView"]),
        ...mapActions('magicEye', ['switchEye']),
        ...mapActions('track', ['trackClick']),

        loadData() {
            // this.getUsdPlusAvgMonthApy();
            // this.loadTotalUsdPlus();
        },

        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },

        redeemAction() {
            this.showRedeemView();
            this.showSwapModal();
        },

        openAllPools() {
            this.goToActionByPath('/pools');
            try {
                this.trackClick({action: 'click_featured_pools', event_category: 'Click button', event_label: 'Click pools on featured page' });
            } catch (e) {
                console.error("Track error:", e);
            }
        },

        goToActionByPath(path, queryParams) {
            this.$router.push({
                path: path,
                query: queryParams ? queryParams : {}
            });
        },

        openPool() {
            if (this.cardData.zappable) {
                this.openZapIn(this.pool, 'featured');
                return
            }


            this.openExternalPool();
        },
        openExternalPool() {
            this.openLink(this.cardData);
        },

        goToAction(id) {
            this.$router.push(id);
        },

        getBgColor() {
            switch (this.networkParams.networkId) {
                case 137:
                    return 'radial-gradient(108.67% 595.92% at 100% -3.25%, #001845 0%, #001845 27.05%, #0C255B 52.07%, #7E46E3 100%)';
                case 42161:
                    return 'radial-gradient(108.67% 595.92% at 100% -3.25%, #95bfdc 0%, #545e71 27.05%, #2d374b 52.07%, #27a0ef 100%)';
                case 8453:
                    return 'radial-gradient(108.67% 595.92% at 100% -3.25%, #95bfdc 0%, #545e71 27.05%, #2d374b 52.07%, #0052ff 100%)';
                case 59144:
                    return 'radial-gradient(108.67% 595.92% at 100% -3.25%, #95bfdc 0%, #545e71 27.05%, #2d374b 52.07%, #5fdfff 100%)';
                case 324:
                    return 'radial-gradient(108.67% 595.92% at 100% -3.25%, #95bfdc 0%, #545e71 27.05%, #2d374b 52.07%, #27a0ef 100%)';
                case 10:
                    return 'radial-gradient(108.67% 595.92% at 100% -3.25%, #001845 0%, #001845 27.05%, #0C255B 52.07%, #FF0420 100%)';
                case 56:
                    return 'radial-gradient(108.67% 595.92% at 100% -3.25%, #001845 0%, #001845 27.05%, #0C255B 52.07%, #F3BA2F 100%)';
            }
        },

        // async loadTotalUsdPlus() {
        //     let usdPlusValue = (await axios.get(this.networkParams.appApiUrl + '/dapp/getTotalUsdPlusValue')).data;
        //     this.totalUsdPlusValue = usdPlusValue
        // },

        // async getUsdPlusAvgMonthApy() {
        //     let fetchOptions = {
        //         headers: {
        //             "Access-Control-Allow-Origin": this.networkParams.appApiUrl
        //         }
        //     };
        //
        //     await fetch(this.networkParams.appApiUrl + '/widget/avg-apy-info/month', fetchOptions)
        //         .then(value => value.json())
        //         .then(value => {
        //             this.avgApy = value;
        //             this.avgApy.date = moment(this.avgApy.date).format("DD MMM. ‘YY");
        //         }).catch(reason => {
        //             console.log('Error get data: ' + reason);
        //         })
        // },
    }
};
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 22px;
    }

    .button {
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .currency {
        height: 60px !important;
        width: 60px !important;
    }

    .your-deposit {
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        line-height: 22px;
    }

    .progress-label-value {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .footer-link {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
    }

    .header-row {
        height: 100px !important;
    }

    .card-container {
    }

    .card-title {
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        letter-spacing: 0.04em;
    }

    .percentage {
        font-style: normal;
        font-weight: 600;
        font-size: 40px;
        line-height: 40px;
    }

    .apy {
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 14px;
    }

    .tooltip {
        margin-top: -4px;
    }

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
    }


    .currency-logo {
        height: 40px!important;
    }

    .currency-logo-first {
        left: 44px!important;;
    }

    .currency-logo-second {
        top: 30px!important;;
        left: 3px!important;;
    }

    .pool-logo-container {
        height: 75px!important;;
        width: 85px!important;;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 22px;
    }

    .button {
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .currency {
        height: 60px !important;
        width: 60px !important;
    }

    .your-deposit {
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        line-height: 22px;
    }

    .progress-label-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.03em;
    }

    .footer-link {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .header-row {
        max-width: 440px;
        height: 110px !important;
    }

    .card-container {
        max-width: 440px;
    }

    .card-title {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.04em;
    }

    .percentage {
        font-style: normal;
        font-weight: 600;
        font-size: 50px;
        line-height: 56px;
    }

    .apy {
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
    }

    .tooltip {
        margin-top: 1px;
    }

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .hidden-label {
        width: 130px;
        height: 28px;
        background: var(--hide-account);
    }


    .currency-logo {
        height: 40px!important;
    }

    .currency-logo-first {
        left: 44px!important;;
    }

    .currency-logo-second {
        top: 30px!important;;
        left: 3px!important;;
    }

    .pool-logo-container {
        height: 75px!important;;
        width: 85px!important;;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .button {
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .currency {
        height: 78px !important;
        width: 78px !important;
    }

    .your-deposit {
        font-style: normal;
        font-weight: 800;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.05em;
    }

    .progress-label-value {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 22px;
        letter-spacing: 0.04em;
    }

    .footer-link {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .header-row {
        max-width: 460px;
        height: 130px !important;
    }

    .card-container {
        max-width: 460px;
    }

    .card-title {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 18px;
        letter-spacing: 0.04em;
    }

    .percentage {
        font-style: normal;
        font-weight: 600;
        font-size: 50px;
        line-height: 48px;
    }

    .apy {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
    }

    .tooltip {
        margin-top: 2px;
    }

    .full-status-error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
    }

    .hidden-label {
        width: 130px;
        height: 28px;
        background: var(--hide-account);
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .button {
        height: 36px !important;

        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 15px !important;
        line-height: 20px !important;
        letter-spacing: 0.02em !important;
    }

    .card-title {
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .percentage {
        font-style: normal;
        font-weight: 600;
        font-size: 38px;
        line-height: 42px;
    }

    .apy {
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 22px;
    }
}

.card-container {
    background: var(--secondary) !important;
    border-radius: 15px !important;
    height: 100% !important;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

.header-row {
    border-radius: 15px 15px 0 0;
    background: var(--card-background);
}

.card-title {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FFFFFF;
}

.percentage {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FFFFFF;
}

.apy {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
}

.card-info {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.box {
    background-color: var(--scroll-color);
    border-radius: 4px;
    text-align: center;

    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-transform: capitalize;
}

.box-name {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.03em;
    color: #707A8B;
    text-transform: uppercase;
}

.icon {
    height: 36px !important;
    width: 36px !important;
}

.chain-name {
    font-family: "Roboto", sans-serif;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    color: var(--main-gray-text);
}

.your-deposit {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-feature-settings: 'liga' off;
}

.your-deposit {
    color: var(--main-gray-text);
}

.button {
    border-radius: 2px;
    box-shadow: none !important;
    width: 100% !important;

    font-family: 'Roboto', sans-serif !important;
    text-align: center !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
}

.btn-filled {
    background: var(--blue-gradient);
    color: #FFFFFF !important;
}

.btn-outlined {
    color: var(--links-blue) !important;
}

.footer-row {
    background-color: var(--scroll-color) !important;
    padding: 5px;
    border-radius: 0 0 15px 15px;
}

.footer-link {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: #707A8B;
}

.open-icon {
    color: #707A8B;
    height: 18px;
    width: 18px;
}

.card-container:hover {
    filter: none !important;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.05), 0 4px 4px 0 rgba(0, 0, 0, 0.05);
}

* {
    cursor: pointer;
}

.progress-label-value {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.card-divider {
    border-color: var(--fourth-gray-text) !important;
}

.full-status-error-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
}


.platform-label {
    display: flex;
    padding: 4px 6px;
    height: 26px;

    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    /* Title 3 */

    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;

    color: #FFFFFF;
}


.currency-logo {
    height: 60px;
    position: absolute;
}

.currency-logo-first {
    left: 64px;
}

.currency-logo-second {
    top: 50px;
    left: 3px;
}
src="/assets/icon/swap/change-swap-vector.svg"

   background-image: url("/assets/icon/pool/feature/circulation.svg");
   background-size: cover;
   background-position: center;
   height: 120px;
   width: 120px;
   position: relative;
}

</style>
