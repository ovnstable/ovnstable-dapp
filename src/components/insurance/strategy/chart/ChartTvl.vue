<template>
    <div class="apy-chart-container">
        <v-row class="chart-header-row">
            <v-col cols="8">
                <v-row justify="start">
                    <label class="chart-title">{{ totalTvl ? ('Insurance&nbsp;') : ''}}</label>
                    <label class="chart-title" style="margin-left: 0 !important"><abbr title="Total Value Locked">TVL</abbr></label>
                </v-row>

                <v-row justify="start">
                    <label class="mobile-info-title">
                        {{ totalTvl ? ('$' + $utils.formatMoneyComma(totalTvl, 2)) : '' }}
                    </label>
                </v-row>
            </v-col>

            <v-col class="add-chart-info-col">
                <v-row justify="end">
                    <label class="chart-title-apy">
                        {{ totalTvl ? ('$' + $utils.formatMoneyComma(totalTvl, 2)) : '' }}
                    </label>
                </v-row>
                <v-row justify="end">
                    <label class="chart-sub-title-apy">
                        {{ totalTvl ? 'past 2 hours' : '' }}
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

import {mapActions, mapGetters} from "vuex";

import ApexCharts from 'apexcharts'

export default {
    name: "ChartTvl",

    props: {
        data: {
            type: Object,
            default: null,
        },

        insuranceData: {
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

    components: {},

    data: () => ({
        zoom: "all",
        slice: null,
        chart: null,

        totalTvl: null,
    }),

    computed: {
        ...mapGetters('theme', ['light']),
        ...mapGetters('supplyData', ['totalInsuranceSupply']),

        isMobile() {
            return window.innerWidth < 650;
        }
    },

    mounted() {
        this.redraw();
    },

    created() {
        this.zoomChart("all");
    },

    methods: {
        async zoomChart(zoom) {
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

            this.totalTvl = this.totalInsuranceSupply.polygon;

            let chartColor = this.$colorUtils.hexToRgb('#7944DA');

            let options = {
                series: [{
                    name: "TVL",
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
                    enabled: false,
                },

                stroke: {
                    curve: 'straight',
                    width: this.isMobile ? 1 : 2,
                    colors: ['#7944DA'],
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
                            return '$' + val
                        },
                    },
                },

                legend: {
                    horizontalAlign: 'left'
                },

                colors: [this.light ? `rgba(${chartColor.r}, ${chartColor.g}, ${chartColor.b}, 0.3)` : '#7944DA'],

                theme: {
                    mode: this.light ? 'light' : 'dark',
                },

                fill: {
                    type: ['gradient'],

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
        height: 300px !important;
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

</style>
