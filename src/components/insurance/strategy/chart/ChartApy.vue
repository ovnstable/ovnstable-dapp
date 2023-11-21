<template>
    <div class="apy-chart-container">
        <v-row class="chart-header-row">
            <v-col :cols="$wu.isMobile() ? 12 : 6">
                <v-row justify="start" align="left">
                    <label class="chart-title ml-5">
                        Cumulative return
                    </label>
                </v-row>
                <v-row justify="start" align="left">
                    <div>
                        <label class="mobile-info-title ml-5">
                            {{ (compoundData && compoundData.all) ? ($utils.formatMoneyComma(compoundData.all, 2)) + '%' : '' }}
                        </label>
                    </div>
                    <div class="chart-sub-title-apy ml-5 mb-5">
                        {{ (compoundData && compoundData.firstDate) ? compoundData.firstDate : '-'}}
                    </div>
                </v-row>
            </v-col>

            <v-col class="add-chart-info-col pt-10">
                <v-row>
                    <v-col cols="3">
                        <v-row justify="center">
                            <label :class="compoundData.day >= 0 ? 'chart-title-compound' : 'chart-title-compound-minus'">
                                {{ (compoundData && compoundData.day) ? ($utils.formatMoneyComma(compoundData.day, 2)) + '%' : '' }}
                            </label>
                        </v-row>
                        <v-row justify="center">
                            <label class="chart-sub-title-apy">
                                1 day
                            </label>
                        </v-row>
                    </v-col>

                    <v-col cols="3">
                        <v-row justify="center" class="chart-title-compound-container">
                            <label :class="compoundData.week >= 0 ? 'chart-title-compound' : 'chart-title-compound-minus'">
                                {{ (compoundData && compoundData.week) ? ($utils.formatMoneyComma(compoundData.week, 2)) + '%' : '' }}
                            </label>
                        </v-row>
                        <v-row justify="center">
                            <label class="chart-sub-title-apy">
                                1 week
                            </label>
                        </v-row>
                    </v-col>

                    <v-col cols="3">
                        <v-row justify="center" class="chart-title-compound-container">
                            <label :class="compoundData.month >= 0 ? 'chart-title-compound' : 'chart-title-compound-minus'">
                                {{ (compoundData && compoundData.month) ? ($utils.formatMoneyComma(compoundData.month, 2)) + '%' : '' }}
                            </label>
                        </v-row>
                        <v-row justify="center">
                            <label class="chart-sub-title-apy">
                                1 month
                            </label>
                        </v-row>
                    </v-col>

                    <v-col cols="3">
                        <v-row justify="center" class="chart-title-compound-container">
                            <label :class="compoundData.all >= 0 ? 'chart-title-compound' : 'chart-title-compound-minus'">
                                {{ (compoundData && compoundData.all) ? ($utils.formatMoneyComma(compoundData.all, 2)) + '%' : '' }}
                            </label>
                        </v-row>
                        <v-row justify="center" class="all-compound-container">
                            <label class="chart-sub-title-apy">
                                All
                            </label>

                            <div class="tooltip-compound">
                                <v-row align="start" justify="start">
                                    <Tooltip :size="16" :icon-color="light ? '#ADB3BD' :  '#707A8B'" text="Cumulative return for the period"/>
                                </v-row>
                            </div>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <div class="chart-row" id="line-chart-apy"></div>

        <v-row class="zoom-row" style="margin-top: -40px !important;">
            <v-spacer></v-spacer>
            <v-btn
                text
                id="week-zoom-btn"
                class="zoom-btn mt-5"
                dark
                @click="zoomChart('week')"
            >
                <label>Week</label>
            </v-btn>
            <v-btn
                text
                id="month-zoom-btn"
                class="zoom-btn mt-5"
                dark
                @click="zoomChart('month')"
            >
                Month
            </v-btn>
            <v-btn
                text
                id="all-zoom-btn"
                class="zoom-btn mr-3 mt-5"
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

import { mapGetters } from "vuex";
import {unixTsToDateStr} from "@/utils/dates.js";
import ApexCharts from 'apexcharts'
import Tooltip from "@/components/common/element/Tooltip";
import { insuranceApiService } from "@/services/insurance-api-service";

export default {
    name: "ChartApy",

    props: {
        data: {
            type: Object,
            default: null,
        },
        payouts: {
            type: Array,
            default: null,
        },
        compoundData: {
            type: Object,
        },
    },

    watch: {
        data: function (newVal, oldVal) {
            this.redraw();
        },

        light: function (newVal, oldVal) {
            this.redraw();
        },
    },

    components: {Tooltip},

    data: () => ({
        zoom: "month",
        slice: null,
        chart: null,

        apyData: null,

        apyValuesBySlice: [],
        apyFirstDate: null,
    }),

    computed: {
        ...mapGetters('network', ['polygonApi', 'bscApi', 'opApi', 'arApi', 'baseApi', "lineaApi", 'zkApi']),
        ...mapGetters('theme', ['light']),

        avgApyMessage() {
            return "Average APY for the selected period";
        },

        isMobile() {
            return window.innerWidth < 650;
        },

        avgApyBySlice() {
            let sum = 0;
            if (this.apyValuesBySlice && this.apyValuesBySlice.length === 0) {
                return 0;
            }

            this.apyValuesBySlice.forEach(v => sum += v);

            return sum / this.apyValuesBySlice.length;
        }
    },

    mounted() {
        this.redraw();
    },

    created() {
        this.zoomChart("month");
    },

    methods: {
        async zoomChart(zoom) {

            let url = "https://api.overnight.fi/optimism/usd+";
            insuranceApiService.getApyInfo(url)
                .then(data => {
                  console.log("avg apy info: ", data);

                  this.apyData = data;
            })
            .catch(e => {
              console.log('Error get data: ' + e);
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
            this.apyValuesBySlice = values;
            console.log("ins values: ", values)

            let labels = [];
            this.data.labels.forEach(v => labels.push(v));
            labels = this.slice ? labels.slice(this.slice) : labels;
            console.log("ins labels: ", labels)
            console.log("lastData: ", labels && labels.length ? labels[0] : null);

            if (labels && labels.length) {
                this.apyFirstDate = unixTsToDateStr(labels[0], "DD MMM. 'YY");
            }

            // let valuesUsdPlus = [];
            // labels.forEach(v => valuesUsdPlus.push(this.usdPlusData[v] ? this.usdPlusData[v] : null));

            // let averageValue = this.avgApy ? this.avgApy.value : 0;

            let maxValue;
            try {
               maxValue = Math.max.apply(Math, values);
              if (maxValue > 5) {
                maxValue = Math.round(Math.ceil(maxValue / 10)) * 10;
              }

            } catch (e) {
                maxValue = 50;
            }

            let minValue;
            try {
                minValue = Math.min.apply(Math, values);
                if (minValue < -5) {
                  minValue = Math.min(Math.floor(Math.floor(minValue / 10)) * 10, 0);
                }
            } catch (e) {
                minValue = 0;
            }

            let chartColor = this.$colorUtils.hexToRgb('#FF0420');

            let seriesList = [];

            seriesList.push(
                {
                    name: "Performance",
                    data: values
                }
            );

            let options = {
                series: seriesList,

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
                    yaxis: [
                        {
                            y: 0,
                            strokeDashArray: 5,
                            offsetX: 10,
                            offsetY: -5,
                            width: '98%',
                            label: {
                                borderColor: null,
                                position: 'left',
                                offsetX: 1,
                                offsetY: 0,
                                style: {
                                    color: "#707A8B",
                                    background: "#FFFFFF",
                                    fontSize: '14px',
                                    fontFamily: "Roboto",
                                },
                                text: "0"
                            },
                        }
                    ],
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
                    colors: ['#FF0420', "#22ABAC"],
                },

                xaxis: {
                    type: 'category',

                    tickAmount: this.isMobile ? 6 : 10,
                    tickPlacement: 'on',

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
                    min: minValue,
                    max: maxValue,

                    labels: {
                        show: false,
                    },
                },

                tooltip: {
                    enabled: true,

                    y: {
                        formatter: function (val, opts) {
                            return val ? ((val === 500 ? '>500' : val) + '%') : '—';
                        },
                    },
                },

                legend: {
                    show: false,
                },

                colors: this.light ? [`rgba(${chartColor.r}, ${chartColor.g}, ${chartColor.b}, 0.3)`, 'rgba(34, 171, 172, 0.3)'] : ['#FF0420', '#0d4444'],

                theme: {
                    mode: this.light ? 'light' : 'dark',
                },

                fill: {
                    type: ['gradient', 'gradient'],

                    gradient: {
                        shade: 'light',
                        type: "vertical",
                        shadeIntensity: 0.2,
                        opacityFrom: 1,
                        opacityTo: 0,
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

    .hold-checkbox-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
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

    .hold-checkbox-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
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
        height: 50px !important;
    }

    .chart-header-row {
        height: 150px !important;
    }

    .chart-row {
        height: 300px !important;
    }

    .apy-chart-container {
        height: 420px !important;
    }

    .hold-checkbox-label {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
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
    color: #707A8B !important;
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

.chart-title-compound-container {
  border-left: 1px solid #CED2D8;
}

.chart-title-compound {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 36px;

  color: #22ABAC;
}

.chart-title-compound-minus {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 36px;

  color: #CF3F92 !important;
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

.hold-checkbox, .hold-checkbox-label {
    z-index: 2 !important;
}

.hold-checkbox {
    margin-left: 4% !important;
}

.hold-checkbox-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #707A8B !important;
}

.tooltip-compound {
    position: absolute;
    right: 5px;
    top: -15px;
}

.all-compound-container {
  position: relative;
}

</style>
