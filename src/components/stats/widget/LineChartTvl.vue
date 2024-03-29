<template>
    <div class="apy-chart-container">
        <v-row class="chart-header-row">
            <v-col>
                <v-row justify="start">
                    <label class="chart-title">{{ totalTvl ? `${assetType.toUpperCase()}&nbsp;` : '' }}</label>
                    <label class="chart-title" style="margin-left: 0 !important"><abbr title="Total Value Locked">TVL</abbr></label>
                    <div class="balance-network-icon ml-3 mt-7">
                        <v-img :src="icon"/>
                    </div>
                </v-row>

                <v-row justify="start">
                    <label v-if="this.assetType === 'eth+'" class="mobile-info-title">
                        {{ $utils.formatMoneyComma(totalTvl, 6) }} WETH
                    </label>
                    <label v-else class="mobile-info-title">
                        {{ totalTvl ? ((assetType === 'eth+' ? '' : '$') + $utils.formatMoneyComma(totalTvl, 2)) : '' }}
                    </label>
                </v-row>
            </v-col>

            <v-col class="add-chart-info-col">
                <v-row justify="end">
                    <label v-if="this.assetType === 'eth+'" class="chart-title-apy">
                        {{ $utils.formatMoneyComma(totalTvl, 6) }} WETH
                    </label>
                    <label v-else class="chart-title-apy">
                        {{ totalTvl ? ((assetType === 'eth+' ? '' : '$') + $utils.formatMoneyComma(totalTvl, 2)) : '' }}
                    </label>
                </v-row>
                <v-row justify="end">
                    <label class="chart-sub-title-apy">
                        {{ totalTvl ? 'past 2 hours' : '' }}
                    </label>
                </v-row>
            </v-col>
        </v-row>

        <div class="chart-row" id="line-chart-tvl"></div>

        <v-row class="zoom-row" style="margin-top: -40px !important;">
            <v-spacer></v-spacer>
            <v-btn
                    text
                    id="week-zoom-btn-tvl"
                    class="zoom-btn"
                    dark
                    @click="zoomChart('week')"
            >
                <label>Week</label>
            </v-btn>
            <v-btn
                    text
                    id="month-zoom-btn-tvl"
                    class="zoom-btn"
                    dark
                    @click="zoomChart('month')"
            >
                Month
            </v-btn>
            <v-btn
                    text
                    id="all-zoom-btn-tvl"
                    class="zoom-btn mr-3"
                    dark
                    @click="zoomChart('all')"
            >
                All
            </v-btn>
        </v-row>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>
/* eslint-disable no-unused-vars,no-undef */

import {mapActions, mapGetters} from "vuex";

import ApexCharts from 'apexcharts'
import {axios} from "@/plugins/http-axios";
import polygonIcon from "@/assets/network/polygon.svg";
import optimismIcon from "@/assets/network/op.svg";
import bscIcon from "@/assets/network/bsc.svg";
import arbitrumIcon from "@/assets/network/ar.svg";
import baseIcon from "@/assets/network/base.svg";
import lineaIcon from "@/assets/network/linea.svg";
import zksyncIcon from "@/assets/network/zk.svg";

export default {
    name: "LineChartTvl",

    props: {
        data: {
            type: Object,
            default: null,
        },

       assetType: {
          type: String,
          default: 'usd+'
        },

        networkName: {
            type: String,
            default: 'optimism'
        }
    },

    watch: {
        data: function (newVal, oldVal) {
           if (this.currentTotalData) this.redraw();
        },

        light: function (newVal, oldVal) {
            this.redraw();
        },

        currentTotalData: function (newVal, oldVal) {
            if (newVal) {
              this.totalTvl = this.getTotalTvl();
            }
        },
    },

    components: {},

    data: () => ({
        zoom: "all",
        slice: null,
        chart: null,
        currentTotalData: null,

        totalTvl: null,
    }),

    computed: {
      ...mapGetters('network', ['networkId', 'appApiUrl', 'apiUrl']),
      ...mapGetters('theme', ['light']),

        isMobile() {
            return window.innerWidth < 650;
        },

        chainColor() {
            if (this.networkName === null || this.networkName === 'polygon') {
                return '#7B3FE4';
            } else if (this.networkName === 'arbitrum') {
                return '#29A0F0';
            } else if (this.networkName === 'base') {
                return '#0052ff';
            } else if (this.networkName === 'linea') {
                return '#5fdfff';
            } else if (this.networkName === 'bsc') {
                return '#F0B90B';
            } else if (this.networkName === 'optimism') {
                return '#FF0420';
            } else if (this.networkName === 'zksync') {
                return '#8B8DFC';
            }
            
            return ""
        },

        icon: function () {
            switch (this.networkName){
                case 'polygon':
                    return polygonIcon;
                case 'optimism':
                    return optimismIcon;
                case 'bsc':
                    return bscIcon;
                case 'arbitrum':
                    return arbitrumIcon;
                case 'base':
                    return baseIcon;
                case 'linea':
                    return lineaIcon;
                case 'zksync':
                    return zksyncIcon;
                default:
                    return ""
            }
        },
    },

    mounted() {
        this.refreshCurrentTotalData();
    },

    created() {
        if (this.currentTotalData) this.zoomChart("all");
    },

    methods: {
        ...mapActions('track', ['trackClick']),

        zoomChart(zoom) {
            this.zoom = zoom;

            switch (zoom) {
                case "week":
                    // this.trackClick({action: 'switch-zoom-week-click', event_category: 'Widgets range', event_label: 'Change Range Week', value: 1 });
                    this.slice = -7;
                    break;
                case "month":
                    // this.trackClick({action: 'switch-zoom-month-click', event_category: 'Widgets range', event_label: 'Change Range Month', value: 1 });
                    this.slice = -30;
                    break;
                case "all":
                    // this.trackClick({action: 'switch-zoom-all-click', event_category: 'Widgets range', event_label: 'Change Range All', value: 1 });
                    this.slice = null;
                    break;
                default:
                    this.slice = null;
            }

            if (this.chart) {
                this.chart.destroy();
            }
            this.redraw();
        },

        hexToRGB(hex, alpha) {
            let r = parseInt(hex.slice(1, 3), 16),
                g = parseInt(hex.slice(3, 5), 16),
                b = parseInt(hex.slice(5, 7), 16);

            if (alpha) {
                return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
            } else {
                return "rgb(" + r + ", " + g + ", " + b + ")";
            }
        },

        changeZoomBtnStyle() {
        const zoomBtn = document.getElementById(this.zoom + "-zoom-btn-tvl");

        if (zoomBtn) {
            document.getElementById("week-zoom-btn-tvl").classList.remove("selected");
            document.getElementById("month-zoom-btn-tvl").classList.remove("selected");
            document.getElementById("all-zoom-btn-tvl").classList.remove("selected");

            zoomBtn.classList.add("selected");
        } 
    },


        getTotalTvl() {
            let sum = 0;
            if (this.currentTotalData?.length === 0) return 0;
            this.currentTotalData.forEach(dataItem => {
                sum += dataItem.value
            });

            return sum;
        },

        redraw() {
            if (this.chart) {
                this.chart.destroy();
            }

            this.changeZoomBtnStyle();

            let values = [];
            this.data.datasets[0].data.forEach(v => values.push(v));
            values = this.slice ? values.slice(this.slice) : values;

            let labels = [];
            this.data.labels.forEach(v => labels.push(v));
            labels = this.slice ? labels.slice(this.slice) : labels;

            let maxValue;
            try {
                maxValue = Math.max.apply(Math, values);
                if (maxValue > 5) {
                  maxValue = Math.round(Math.ceil(maxValue / 10)) * 10;
                }
            } catch (e) {
                maxValue = 50;
            }

            this.totalTvl = this.getTotalTvl();
            

            let options = {
                series: [{
                    name: "TVL",
                    color: this.hexToRGB(this.chainColor, 0.1),
                    data: values
                }],

                labels: labels,

                chart: {
                    type: 'area',
                    height: this.isMobile ? 100 : 230,

                    sparkline: {
                        enabled: false,
                    },

                    zoom: {
                        enabled: false
                    },

                    background: 'var(--secondary)',

                    toolbar: {
                        show: false
                    }
                },

                grid: {
                    show: false,
                },

                dataLabels: {
                    enabled: false
                },

                stroke: {
                    curve: 'straight',
                    width: this.isMobile ? 1 : 2,
                    colors: [this.chainColor],
                },

                xaxis: {
                    type: 'category',

                    tickAmount: this.isMobile ? 6 : 10,
                    tickPlacement: 'between',

                    labels: {
                        show: false,
                    },

                    axisBorder: {
                        show: false,
                    },

                    axisTicks: {
                        show: false,
                    },
                },

                yaxis: {
                    opposite: false,

                    tickAmount: 5,
                    min: 0,
                    max: maxValue,

                    labels: {
                        show: false,
                    },
                },

                tooltip: {
                    enabled: true,

                    y: {
                        formatter: (val, opts) => {
                            if (this.assetType === 'eth+') {
                                return val + ' WETH';
                            } else {
                                return '$' + val;
                            }
                        },
                    },
                },

                legend: {
                    horizontalAlign: 'left'
                },

                colors: [this.light ? this.chainColor : '#29323E'],

                theme: {
                    mode: this.light ? 'light' : 'dark',
                },

                fill: {
                    colors: [this.hexToRGB(this.chainColor, 0.1)],
                    opacity: 1,
                    type: 'gradient',

                    gradient: {
                        shade: 'light',
                        type: "vertical",
                        shadeIntensity: 10,
                        opacityFrom: 1,
                        opacityTo: 1,
                        gradientToColors: [this.light ? 'rgb(255, 255, 255)' : 'rgba(29, 32, 41, 1)'],
                        stops: [0, 100],
                    },
                }
            };

            this.chart = new ApexCharts(document.querySelector("#line-chart-tvl"), options);
            this.chart.render();
        },

        async refreshCurrentTotalData() {

          let result = [];

          let strategies = (await axios.get(this.apiUrl + `/${this.networkName}/${this.assetType}` + '/dapp/strategies')).data;
          strategies.sort((a,b) => b.netAssetValue - a.netAssetValue);

          let colors = [
            "#FCCA46",
            "#FE7F2D",
            "#3D8DFF",
            "#22ABAC",
            "#B22174",
            "#2775CA",
            "#26A17B",
            "#23DD00",
            "#6E56C4",
            "#002868"
          ];

          for (let i = 0; i < strategies.length; i++) {
            let element = strategies[i];

            result.push(
                {
                  label: element.name,
                  fullName: element.fullName,
                  value: element.netAssetValue,
                  liquidationValue: element.liquidationValue,
                  color: colors[i],
                  link: (element.address || element.explorerAddress) ? (process.env.VUE_APP_DEBANK_EXPLORER + 'profile/' + (element.explorerAddress ? element.explorerAddress : element.address)) : ''
                }
            );
          }

          this.currentTotalData = result;

          this.redraw();
        }
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {

    .chart-title {
        margin-top: 30px !important;
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
    }

    .mobile-info-title {
        margin-top: 5px !important;
        z-index: 2 !important;
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 28px;
    }

    .add-chart-info-col, .zoom-row {
        display: none !important;
    }

    .chart-row {
        margin-bottom: -10px !important;
    }

    .zoom-btn {
        font-size: 16px !important;
        line-height: 20px !important;
    }
}

@media only screen and (min-width: 1400px) {

    .chart-title {
        margin-top: 30px !important;
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 28px;
    }

    .chart-title-apy {
        margin-top: 30px !important;
        font-style: normal;
        font-weight: 400;
        font-size: 40px;
        line-height: 42px;
    }

    .chart-sub-title-apy {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .mobile-info-title {
        display: none !important;
    }

    .zoom-row {
        height: 20px !important;
    }

    .chart-header-row {
        height: 150px !important;
    }

    .chart-row {
        height: 250px !important;
    }

    .apy-chart-container {
        height: 420px !important;
    }

    .zoom-btn {
        font-size: 16px !important;
        line-height: 20px !important;
    }
}

@media only screen and (min-width: 1300px) {
    .chart-title {
        margin-top: 30px !important;
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 28px;
    }

    .chart-title-apy {
        margin-top: 30px !important;
        font-style: normal;
        font-weight: 400;
        font-size: 36px;
        line-height: 42px;
    }

    .chart-sub-title-apy {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    }

    .mobile-info-title {
        display: none !important;
    }

    .zoom-row {
        height: 20px !important;
    }

    .chart-header-row {
        height: 150px !important;
    }

    .chart-row {
        height: 285px !important;
    }

    .apy-chart-container {
        height: 420px !important;
    }

    .zoom-btn {
        font-size: 15px !important;
        line-height: 20px !important;
    }
}

#line-chart-tvl {
    overflow-x: hidden !important;
    overflow-y: hidden !important;
}

.yaxis-label {
    font-size: 12px !important;
    line-height: 12px !important;
    font-weight: 400;
    fill: rgba(255, 255, 255, 0.6) !important;
}

.zoom-btn {
    border: none !important;
    font-style: normal !important;
    font-weight: 400 !important;
    letter-spacing: 0.02em !important;
    text-transform: uppercase !important;
    font-feature-settings: 'pnum' on, 'lnum' on !important;
    color: var(--zoom-btn-color) !important;
}

.zoom-btn:hover {
    background: var(--hover);
    color: rgba(28, 149, 231, 1) !important;
}

.zoom-btn:active {
    background: var(--active);
}

.selected {
    color: var(--links-blue) !important;
    background-color: var(--selected-btn-color);
}

.yaxis-label {
    display: none !important;
}

.chart-header-row, .chart-row, .zoom-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
}

.chart-title {
    margin-left: 4%;
    font-feature-settings: 'liga' off;
    color: var(--secondary-gray-text) !important;
}

.chart-title-apy {
    margin-right: 4%;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text) !important;
}

.chart-sub-title-apy {
    margin-right: 4%;
    font-feature-settings: 'liga' off;
    color: #707A8B !important;
}

.mobile-info-title {
    margin-left: 4%;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text) !important;
}

.balance-network-icon {
    width: 7% !important;
    height: auto !important;
}
</style>
