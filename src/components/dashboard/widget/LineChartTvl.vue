<template>
    <div class="apy-chart-container">
        <v-row class="chart-header-row">
            <v-col>
                <v-row justify="start">
                    <label class="chart-title">USD+ TVL</label>
                </v-row>
            </v-col>
            <v-col>
                <v-row justify="end">
                    <label class="chart-title-apy">
                        ${{ $utils.formatMoneyComma(totalUsdPlusValue, 2) }}
                    </label>
                </v-row>
                <v-row justify="end">
                    <label class="chart-sub-title-apy">past 24 hours</label>
                </v-row>
            </v-col>
        </v-row>

        <div class="chart-row" id="line-chart-tvl"></div>

        <v-row class="zoom-row" style="margin-top: -40px !important;">
            <v-spacer></v-spacer>
            <v-btn
                    rounded
                    text
                    id="week-zoom-btn-tvl"
                    class="zoom-btn"
                    dark
                    @click="zoomChart('week')"
            >
                <label>Week</label>
            </v-btn>
            <v-btn
                    rounded
                    text
                    id="month-zoom-btn-tvl"
                    class="zoom-btn"
                    dark
                    @click="zoomChart('month')"
            >
                Month
            </v-btn>
            <v-btn
                    rounded
                    text
                    style="margin-right: 1%;"
                    id="all-zoom-btn-tvl"
                    class="zoom-btn"
                    dark
                    @click="zoomChart('all')"
            >
                All
            </v-btn>
        </v-row>
    </div>
</template>

<script>
/* eslint-disable no-unused-vars,no-undef */

import {mapActions, mapGetters, mapMutations} from "vuex";

import ApexCharts from 'apexcharts'

export default {
    name: "LineChartTvl",

    props: {
        data: {
            type: Object,
            default: null,
        },
    },

    watch: {
        data: function (newVal, oldVal) {
            this.redraw();
        },
    },

    components: {},

    data: () => ({
        zoom: "all",
        slice: null,
        chart: null,

        averageApy: null,
        firstDateApy: null,
    }),

    computed: {
        ...mapGetters("profile", ['totalUsdPlusValue']),

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
        ...mapMutations([]),

        zoomChart(zoom) {
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
            document.getElementById("week-zoom-btn-tvl").classList.remove("selected");
            document.getElementById("month-zoom-btn-tvl").classList.remove("selected");
            document.getElementById("all-zoom-btn-tvl").classList.remove("selected");

            document.getElementById(this.zoom + "-zoom-btn-tvl").classList.add("selected");
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

            this.firstDateApy = labels[0];

            let averageValue = values.reduce((a, b) => (a + b)) / values.length;
            averageValue = averageValue.toFixed(1);

            this.averageApy = averageValue;

            let maxValue;
            try {
                maxValue = Math.max.apply(Math, values);
                maxValue = Math.round(Math.ceil(maxValue / 10)) * 10;
            } catch (e) {
                maxValue = 50;
            }

            let options = {
                series: [{
                    name: "APY",
                    data: values
                }],

                labels: labels,

                chart: {
                    type: 'area',
                    height: 230,

                    sparkline: {
                        enabled: false,
                    },

                    zoom: {
                        enabled: false
                    },

                    background: '#1D2029',

                    toolbar: {
                        show: false
                    }
                },

                annotations: {
                    position: 'front',
                    yaxis: [{
                        y: averageValue,
                        strokeDashArray: 5,
                        borderColor: '#23DD00',
                        fillColor: '#23DD00',
                        label: {
                            show: false,
                        },
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
                    width: 2,
                    colors: ["#51FF00"],
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
                        show: true,
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

                legend: {
                    horizontalAlign: 'left'
                },

                colors: ['#68D55A'],

                theme: {
                    mode: 'dark',
                },

                fill: {
                    type: ['gradient'],

                    gradient: {
                        shade: 'dark',
                        type: "vertical",
                        shadeIntensity: 0.2,
                        opacityFrom: 1,
                        opacityTo: 0,
                        stops: [0, 100],
                    },
                }
            };

            this.chart = new ApexCharts(document.querySelector("#line-chart-tvl"), options);
            this.chart.render();
        },
    }
}
</script>

<style>

/* mobile */
@media only screen and (max-width: 650px) {
    .yaxis-label {
        font-size: 12px !important;
        line-height: 12px !important;
        font-weight: 400;
        fill: rgba(255, 255, 255, 0.6) !important;
    }
}

@media only screen and (min-width: 650px) {
    .yaxis-label {
        font-size: 12px !important;
        line-height: 12px !important;
        font-weight: 400;
        fill: rgba(255, 255, 255, 0.6) !important;
    }
}

#line-chart-tvl {
    overflow-x: hidden !important;
    overflow-y: hidden !important;
}

.zoom-btn {
    border: none !important;
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #707A8B !important;
}

.selected {
    color: #FCCA46 !important;
    background-color: rgba(255, 213, 5, 0.15);
}

.yaxis-label {
    display: none !important;
}

.apy-chart-container {
    height: 420px !important;
}

.chart-header-row {
    height: 150px !important;
}

.chart-row {
    height: 250px !important;
}

.zoom-row {
    height: 20px !important;
}

.chart-header-row, .chart-row, .zoom-row {
    margin-left: 4%;
    margin-right: 4%;
}

.chart-title {
    margin-left: 4%;
    margin-top: 30px !important;
    font-family: 'Raleway', sans-serif;
    font-style: normal;
    font-weight: 800;
    font-size: 24px;
    line-height: 36px;
    color: #FFFFFF;
}

.chart-title-apy {
    margin-right: 4%;
    margin-top: 30px !important;
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 34px;
    line-height: 42px;
    color: #FFFFFF;
}

.chart-sub-title-apy {
    margin-right: 4%;
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 28px;
    color: #707A8B;
}

</style>