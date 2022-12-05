<template>
    <div>
        <v-row align="center" justify="start" class="ma-0" :class="$wu.isMobile() ? 'mt-5' : 'mt-10'">
            <label class="strategy-info-label">
                USD+ Insurance on Polygon is a structured DeFi product enabling users to gain high yields at the expense of insuring of USD+. Underwrite in USD+ Insurance on Polygon underwrite every strategy in the USD+ collateral on Polygon. Each strategy has its own Risk Factor which governs APY shares for premiums:
            </label>
        </v-row>
        <v-row align="center" justify="start" class="ma-0 mt-2">
            <v-col :cols="$wu.isFull() ? 7 : 12" class="premiums-box">
                <v-row class="ma-0">
                    <v-col :cols="$wu.isMobile() ? 12 : 3">
                        <v-row justify="center" class="mb-5" v-if="!$wu.isMobile()">
                            <label></label>
                        </v-row>
                        <v-row :justify="$wu.isMobile() ? 'center' : 'start'" :align="$wu.isMobile() ? 'start' : 'end'" :class="$wu.isMobile() ? 'mb-0' : ''">
                            <label class="premium-box-value">USD+ premiums (share of yield)</label>
                        </v-row>
                    </v-col>
                    <v-divider v-if="!$wu.isMobile()" vertical class="card-divider"></v-divider>
                    <v-col>
                        <v-row justify="center" class="mb-5">
                            <label class="premium-box-title">low risk</label>
                        </v-row>
                        <v-row justify="center" align="end">
                            <label class="premium-box-value">0%</label>
                        </v-row>
                    </v-col>
                    <v-divider vertical class="card-divider"></v-divider>
                    <v-col>
                        <v-row justify="center" class="mb-5">
                            <label class="premium-box-title">medium risk</label>
                        </v-row>
                        <v-row justify="center" align="end">
                            <label class="premium-box-value">2%</label>
                        </v-row>
                    </v-col>
                    <v-divider vertical class="card-divider"></v-divider>
                    <v-col>
                        <v-row justify="center" class="mb-5">
                            <label class="premium-box-title">high risk</label>
                        </v-row>
                        <v-row justify="center" align="end">
                            <label class="premium-box-value">10%</label>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row align="center" justify="start" class="ma-0 notify-risk-box" :class="$wu.isMobile() ? 'mt-5' : 'mt-10'">
            <v-col>
                <v-row class="ma-2" align="center" :justify="$wu.isMobile() ? 'center' : 'start'">
                    <div class="title-modal-icon mr-2">
                        <v-img :src="require('@/assets/icon/bellRed.svg')"/>
                    </div>
                    <label class="risk-box-title">risks of Insurance providers</label>
                </v-row>
                <v-row class="ma-2 mt-4">
                    <label class="risk-box-text">Overnight Finance is an Asset Management Protocol that offers low to medium risk passive yield product. Overnight Finance offers protection on USD+ the yield bearing token that represents user’s deposits. User can file an event if USD+ will face the negative rebase.</label>
                </v-row>
            </v-col>
        </v-row>

        <v-row class="ma-0 mt-7 info-card-container-bottom" justify="start" align="start" :style="{'background': 'radial-gradient(128.35% 221.83% at 66.7% -84.67%, #011845 0%, #011439 31.55%, #011233 56.82%, #6135BD 93.94%)'}">
            <v-col class="info-card-body-bottom" :cols="$wu.isMobile() ? 0 : 5">
                <v-row class="info-row" justify="start" align="center">
                    <label class="card-info mt-1">Investors</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value">{{ (insuranceData.polygon && insuranceData.polygon.holders) ? $utils.formatMoneyComma(insuranceData.polygon.holders, 0) : '—' }}</label>
                </v-row>
                <v-row class="info-row mt-6" justify="start" align="center">
                    <label class="card-info mt-1">Risk factor</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value">HIGH</label>
                </v-row>
            </v-col>

            <v-col :cols="$wu.isMobile() ? 12 : 1"></v-col>

            <v-col class="info-card-body-bottom" :cols="$wu.isMobile() ? 0 : 5">
                <v-row class="info-row" justify="start" align="center">
                    <label class="card-info mt-1">Token address</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value info-value-address" @click="openTokenOnScan(insuranceData.polygon.rebaseAddress)">
                        {{ (insuranceData.polygon && insuranceData.polygon.rebaseAddress) ? shortAddress(insuranceData.polygon.rebaseAddress) : '—' }}
                    </label>
                    <div class="icon-img ml-2" :class="!$wu.isFull() ? 'mr-2' : ''" @click="openTokenOnScan(insuranceData.polygon.rebaseAddress)">
                        <v-icon size="20" style="margin-top: -2px" color="rgba(255, 255, 255, 0.5)">mdi-open-in-new</v-icon>
                    </div>
                </v-row>
                <v-row class="info-row mt-6" justify="start" align="center">
                    <label class="card-info mt-1">Inception date</label>
                    <v-spacer></v-spacer>
                    <label class="card-info-value">06 December 2022</label>
                </v-row>
            </v-col>
        </v-row>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import Tooltip from "@/components/common/element/Tooltip";

export default {
    name: "AboutTab",

    components: {
        Tooltip,
    },

    data: () => ({
    }),

    props: {

        insuranceData: {
            type: Object,
        },
    },

    watch: {
    },

    computed: {
    },

    methods: {
        shortAddress(address) {
            if (address) {
                return address.substring(0, 5) + '...' + address.substring(address.length - 4);
            } else {
                return null;
            }
        },

        openTokenOnScan(hash) {
            if (hash && hash !== '') {
                window.open("https://polygonscan.com/token/" + hash, '_blank').focus();
            }
        },
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .strategy-info-label {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .premium-box-title {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.03em;
    }

    .premium-box-value {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
    }

    .risk-box-title {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .risk-box-text {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .card-info-value, .card-info-risk {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.02em;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .strategy-info-label {
        font-style: normal;
        font-weight: 300;
        font-size: 18px;
        line-height: 28px;
    }

    .premium-box-title {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .premium-box-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
    }

    .risk-box-title {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.04em;
    }

    .risk-box-text {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 18px;
        line-height: 28px;
    }

    .card-info-value, .card-info-risk {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 22px;
        letter-spacing: 0.04em;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .strategy-info-label {
        font-style: normal;
        font-weight: 300;
        font-size: 18px;
        line-height: 28px;
    }

    .premium-box-title {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
    }

    .premium-box-value {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
    }

    .risk-box-title {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 22px;
        letter-spacing: 0.04em;
    }

    .risk-box-text {
        font-style: normal;
        font-weight: 300;
        font-size: 18px;
        line-height: 28px;
    }

    .card-info {
        font-style: normal;
        font-weight: 300;
        font-size: 18px;
        line-height: 28px;
    }

    .card-info-value, .card-info-risk {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 22px;
        letter-spacing: 0.04em;
    }
}

.strategy-info-label {
    font-family: 'Roboto', sans-serif;
    color: var(--secondary-gray-text);
}

.premiums-box {
    border: 1px solid var(--main-border);
    border-radius: 4px;
}

.premium-box-title {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.premium-box-value {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--main-gray-text);
}

.card-divider {
    border-color: var(--main-border) !important;
}

.notify-risk-box {
    background: var(--red-container);
    border: 1px solid rgba(207, 63, 146, 0.4);
    border-radius: 4px;
}

.risk-box-title {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.risk-box-text {
    font-family: 'Roboto', sans-serif;
    color: var(--main-gray-text);
}

.title-modal-icon {
    width: 24px;
    height: 24px;
}

.info-card-container-bottom {
    border-radius: 8px;
}

.info-card-body-bottom {
    margin: 2% 2% !important;
}

.info-row {
    border-top: 1px solid var(--secondary-border);
}

.card-info {
    font-family: 'Roboto', sans-serif;
    color: white;
}

.card-info-value {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: white;
}

.card-info-risk {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #FE7F2D;
}

.info-value-address {
    cursor: pointer;
}

.icon-img {
    width: 20px;
    height: 20px;
    cursor: pointer;
}
</style>
