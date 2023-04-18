<template>
    <div class="apy-chart-container">
        <v-row class="chart-header-row">
            <v-col>
                <v-row justify="start">
                    <label class="chart-title">{{ (avgApy && avgApy.value) ? ((isMobile ? '' : 'Average ') + `${assetType.toUpperCase()}&nbsp;`) : ''}}</label>
                    <label class="chart-title" style="margin-left: 0 !important"><abbr title="Annual Percentage Yield">APY</abbr></label>
                    <div class="balance-network-icon ml-3 mt-7">
                        <v-img :src="icon"/>
                    </div>
                </v-row>

                <v-row justify="start">
                    <label class="mobile-info-title">
                        {{ (avgApy && avgApy.value) ? ($utils.formatMoneyComma(avgApy.value, 1)) + '%' : '' }}
                    </label>
                </v-row>
            </v-col>

            <v-col class="add-chart-info-col">
                <v-row justify="end">
                    <label class="chart-title-apy">
                        {{ (avgApy && avgApy.value) ? ($utils.formatMoneyComma(avgApy.value, 1)) + '%' : '' }}
                    </label>
                </v-row>
                <v-row justify="end">
                    <label class="chart-sub-title-apy">
                        {{ (avgApy && avgApy.date) ? 'from ' + avgApy.date : '' }}
                    </label>
                </v-row>
            </v-col>
        </v-row>

        <div class="chart-row" id="line-chart-apy"></div>

        <v-row class="zoom-row" style="margin-top: -40px !important;">
            <v-spacer></v-spacer>
            <v-btn
                text
                id="week-zoom-btn"
                class="zoom-btn"
                dark
                @click="zoomChart('week')"
            >
                <label>Week</label>
            </v-btn>
            <v-btn
                text
                id="month-zoom-btn"
                class="zoom-btn"
                dark
                @click="zoomChart('month')"
            >
                Month
            </v-btn>
            <v-btn
                text
                id="all-zoom-btn"
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

import {mapGetters} from "vuex";
import moment from "moment";

import ApexCharts from 'apexcharts'
import polygonIcon from "@/assets/network/polygon.svg";
import optimismIcon from "@/assets/network/op.svg";
import bscIcon from "@/assets/network/bsc.svg";
import arbitrumIcon from "@/assets/network/ar.svg";
import zksyncIcon from "@/assets/network/zk.svg";

export default {
    name: "LineChartApy",

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
            this.redraw();
        },

        light: function (newVal, oldVal) {
            this.redraw();
        },

        appApiUrl: function (newVal, oldVal) {
            this.zoomChart(this.zoom);
        },
    },

    components: {},

    data: () => ({
        zoom: "all",
        slice: null,
        chart: null,

        avgApy: null,
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
            } else if (this.networkName === 'bsc') {
                return '#F0B90B';
            } else if (this.networkName === 'optimism') {
                return '#FF0420';
            } else if (this.networkName === 'zksync') {
                return '#8B8DFC';
            }
            /* TODO: add widget stub */
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
                case 'zksync':
                    return zksyncIcon;
            }
        },
    },

    mounted() {
        this.redraw();
    },

    created() {
        this.zoomChart("all");
    },

    methods: {
        async zoomChart(zoom) {
            let fetchOptions = {
                headers: {
                    "Access-Control-Allow-Origin": this.appApiUrl
                }
            };

            await fetch(this.apiUrl  + `/${this.networkName}/${this.assetType}` + '/widget/avg-apy-info/' + zoom, fetchOptions)
                .then(value => value.json())
                .then(value => {
                    this.avgApy = value;
                    this.avgApy.date = moment(this.avgApy.date).format("DD MMM. ‘YY");
                    this.redraw();
                }).catch(reason => {
                    console.log('Error get data: ' + reason);
                })

            this.zoom = zoom;

            switch (zoom) {
                case "week":
                    this.slice = -7;
                    break;
                case "month":
                    this.slice = -30;
                    break;
                case "all":
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
            document.getElementById("week-zoom-btn").classList.remove("selected");
            document.getElementById("month-zoom-btn").classList.remove("selected");
            document.getElementById("all-zoom-btn").classList.remove("selected");

            document.getElementById(this.zoom + "-zoom-btn").classList.add("selected");
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

            let averageValue = this.avgApy ? this.avgApy.value : 0;

            let maxValue;
            try {
                maxValue = Math.max.apply(Math, values);
                if (maxValue > 5) {
                    maxValue = Math.round(Math.ceil(maxValue / 10)) * 10;
                }
            } catch (e) {
                maxValue = 50;
            }

            let options = {
                series: [{
                    name: "APY",
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

                annotations: {
                    position: 'front',
                    yaxis: [{
                        y: averageValue,
                        strokeDashArray: 5,
                        borderColor: this.chainColor,
                        fillColor: this.chainColor,
                        label: {
                            show: false,
                        },
                        width: this.isMobile ? '0%' : '100%',
                    }]
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
                        formatter: function (val, opts) {
                            return val + '%';
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

            this.chart = new ApexCharts(document.querySelector("#line-chart-apy"), options);
            this.chart.render();
        },
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

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
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

#line-chart-apy {
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
    font-family: 'Roboto', sans-serif !important;
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
    background: var(--active),
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
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--secondary-gray-text) !important;
}

.chart-title-apy {
    margin-right: 4%;
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text) !important;
}

.chart-sub-title-apy {
    margin-right: 4%;
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: #707A8B !important;
}

.mobile-info-title {
    margin-left: 4%;
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--secondary-gray-text) !important;
}

.balance-network-icon {
    width: 8% !important;
    height: auto !important;
}
</style>
