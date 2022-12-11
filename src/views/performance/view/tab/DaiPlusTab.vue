<template>
    <div class="page-container">
        <v-row class="ma-0 info-card-container mt-5" justify="start" align="start">
            <v-col class="info-card-body-bottom">
                <v-row align="start" justify="start" class="ma-0">
                    <label class="section-title-label">DAI+ collateral assets</label>
                </v-row>

                <v-row align="start" justify="center">
                    <v-col :cols="!$wu.isFull() ? 12 : 8">
                        <TableStablecoins
                            only-percents
                            v-if="!$wu.isMobile()"
                            :data="stablecoinData"/>

                        <TableStablecoins
                            v-else
                            only-percents
                            minimized
                            :data="stablecoinData"/>
                    </v-col>

                    <v-col :cols="!$wu.isFull() ? 12 : 4">
                        <PieStablecoins :data="stablecoinData" :size="!$wu.isFull() ? 200 : 300"/>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

<!--        <v-row class="ma-0 info-card-container mt-3" justify="start" align="start">
            <v-col class="info-card-body-bottom">
                <v-row align="center" justify="start" class="ma-0">
                    <label class="section-title-label">DAI+ portfolio</label>
                </v-row>

                <v-row align="center" justify="center">
                    <v-col :cols="!$wu.isFull() ? 12 : 8">
                        <TableStrategies
                            v-if="!$wu.isMobile()"
                            :data="currentTotalData"/>

                        <TableStrategies
                            v-else
                            minimized
                            :data="currentTotalData"/>
                    </v-col>

                    <v-col :cols="!$wu.isFull() ? 12 : 4">
                        <DoughnutStrategies :data="currentTotalData" :size="!$wu.isFull() ? 200 : 300"/>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>-->

        <div class="ma-0 info-card-container d-flex mt-3">
            <div class="" :class="$wu.isMobile() ? 'ml-5 mr-5 mt-5' : 'ml-10 mr-5 my-5'" >
                <v-img class="currency" :src="require('@/assets/currencies/DAI+.svg')" />
            </div>
            <div class="info-card-container-box" :class="$wu.isMobile() ? 'mt-5 mb-5 mr-5' : 'mt-0'" >
                <label class="section-title-label label-about">About DAI+</label>
                <label class="section-text">DAI+ is the equivalent of USD+, pegged to DAI 1:1. DAI+ consist of aDAI (Aave) and USD+. It has been designed for boosted pools (Balancer and Beethoveen) on Optimism. It cannot be minted separately.</label>
            </div>
        </div>

        <v-row class=" ma-0 mt-3">
            <v-col class="currency-box" :cols="$wu.isFull() ? 6 : 12">
                <v-row align="center" :class="$wu.isMobile() ? 'ma-2' : 'ma-5'" @click="openLink('https://optimistic.etherscan.io/address/0x970d50d09f3a656b43e11b0d45241a84e3a6e011')">
                    <div>
                        <v-img class="currency-dai" :src="require('@/assets/currencies/DAI+.svg')" />
                    </div>
                    <label class="currency-text ml-2">DAI+ token address</label>

                    <v-spacer></v-spacer>

                    <label class="address-text ml-auto">{{ shortAddress('0x970D50d09F3a656b43E11B0D45241a84e3a6e011') }}</label>
                    <div class="ml-auto d-flex">
                        <v-img class="open-new mt-0 ml-1" :src="require('@/assets/icon/open-in-new.svg')"/>
                    </div>
                </v-row>
            </v-col>
        </v-row>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import TableStablecoins from "@/components/stats/pie/TableStablecoins";
import PieStablecoins from "@/components/stats/pie/PieStablecoins";
import TableStrategies from "@/components/stats/doughnut/TableStrategies";
import DoughnutStrategies from "@/components/stats/doughnut/DoughnutStrategies";

export default {
    name: "CollateralView",

    components: {
        DoughnutStrategies,
        TableStrategies,
        PieStablecoins,
        TableStablecoins
    },

    data: () => ({
        stablecoinData: [
            {
                label: 'USD+',
                value: 97.5,
                link: '0x73cb180bf0521828d8849bc8CF2B920918e23032',
                color: "#2775CA",
                logo: require('@/assets/currencies/USD+.png')
            },
            {
                label: 'DAI',
                value: 2.5,
                link: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
                color: "#FCCA46",
                logo: require('@/assets/currencies/stablecoins/DAI.png')
            },
        ],
    }),

    computed: {
        ...mapGetters("network", ['networkId']),
        ...mapGetters("statsData", ['currentTotalData']),

    },

    created() {
    },

    methods: {
        ...mapActions('swapModal', ['showSwapModal', 'showMintView']),

        openLink(url) {
            window.open(url, '_blank').focus();
        },

        shortAddress(address) {
            if (address) {
                return address.substring(0, 5) + '...' + address.substring(address.length - 4);
            } else {
                return null;
            }
        },
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }

    .currency {
        width: 80px;
        height: 80px;
    }

    .section-text {
        font-size: 14px;
        line-height: 22px;
    }

    .currency-dai {
        width: 30px ;
        height: 30px;
    }

    .currency-text {
        font-size: 14px;
        line-height: 22px;
    }

    .address-text {
        font-size: 14px;
        line-height: 22px;
    }

    .open-new {
        width: 20px;
        height: 20px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .currency {
        width: 100px;
        height: 100px;
    }

    .section-text {
        font-size: 16px;
        line-height: 24px;
    }

    .currency-dai {
        width: 38px;
        height: 38px;
    }

    .currency-text {
        font-size: 18px;
        line-height: 28px;
    }

    .address-text {
        font-size: 18px;
        line-height: 28px;
    }

    .open-new {
        width: 24px;
        height: 24px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .currency {
        width: 100px;
        height: 100px;
    }

    .section-text {
        font-size: 18px;
        line-height: 28px;
    }

    .currency-dai {
        width: 38px;
        height: 38px;
    }

    .currency-text {
        font-size: 18px;
        line-height: 28px;
    }

    .address-text {
        font-size: 18px;
        line-height: 28px;
    }

    .open-new {
        width: 24px;
        height: 24px;
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .section-title-label {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 24px;
        letter-spacing: 0.04em;
    }

    .label-about {
        margin-top: 15px !important;
    }

    .currency {
        width: 100px;
        height: 100px;
    }

    .section-text {
        font-size: 17px;
        line-height: 28px;
    }

    .currency-dai {
        width: 32px;
        height: 32px;
    }

    .currency-text {
        font-size: 16px;
        line-height: 25px;
    }

    .address-text {
        font-size: 16px;
        line-height: 28px;
    }

    .open-new {
        width: 22px;
        height: 22px;
    }
}

.page-container {
    margin-bottom: 5% !important;
}

.info-card-container {
    background: var(--secondary);
    border-radius: 12px;
}

.info-card-container-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
}

.info-card-body-bottom {
    margin: 2% 2% !important;
}

.section-title-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    text-transform: none;
    color: var(--secondary-gray-text);
}

.section-text {
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    color: var(--main-gray-text);
}

.currency-box {
    background: var(--secondary);
    border-radius: 12px;
}

.currency-box, .currency-box >>> * {
    cursor: pointer;
}

.address-text {
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 300;
    color: var(--secondary-gray-text);
}

.currency-text {
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 400;
    color: var(--secondary-gray-text);
}

</style>
