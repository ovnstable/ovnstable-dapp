<template>
    <div>
        <v-row class="zoom-row">
            <v-spacer></v-spacer>
            <v-btn
                    id="week-zoom-btn"
                    class="zoom-btn"
                    dark x-small outlined
                    @click="zoomChart('week')"
            >
                <label>Week</label>
            </v-btn>
            <v-btn
                    id="month-zoom-btn"
                    class="zoom-btn"
                    dark x-small outlined
                    @click="zoomChart('month')"
            >
                Month
            </v-btn>
            <v-btn
                    id="all-zoom-btn"
                    class="zoom-btn"
                    dark x-small outlined
                    @click="zoomChart('all')"
            >
                All
            </v-btn>
        </v-row>
        <div id="line-chart"></div>
    </div>
</template>

<script>
/* eslint-disable no-unused-vars,no-undef */

import {mapActions, mapGetters, mapMutations} from "vuex";

import ApexCharts from 'apexcharts'

export default {
    name: "LineChart",

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
        chart: null,
    }),

    computed: {
        ...mapGetters('dashboardBalance', ['slice']),

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
        ...mapActions('dashboardBalance', ['sliceClientDashboardData']),

        ...mapMutations('dashboardBalance', ['setSlice']),

        zoomChart(zoom) {
            this.zoom = zoom;

            switch (zoom) {
                case "week":
                    this.setSlice(-8);
                    break;
                case "month":
                    this.setSlice(-30)
                    break;
                case "all":
                    this.setSlice(null)
                    break;
                default:
                    this.setSlice(null)
            }

            this.sliceClientDashboardData();

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

            let averageValue = values.reduce((a, b) => (a + b)) / values.length;
            averageValue = averageValue.toFixed(1);

            let maxValue;
            try {
                maxValue = Math.max.apply(Math, values);
                maxValue = Math.round(Math.ceil(maxValue / 10)) * 10;
            } catch (e) {
                maxValue = 50;
            }

            let options = {
                series: [{
                    name: "Portfolio value",
                    data: values
                }],

                labels: labels,

                chart: {
                    type: 'area',
                    height: 250,

                    sparkline: {
                        enabled: false,
                    },

                    zoom: {
                        enabled: false
                    },

                    background: '#080a0c',

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
                    width: 1,
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
                        show: true,
                        color: '#B1B1B1',
                        height: 0.4,
                        width: '100%',
                        offsetX: 5,
                        offsetY: -5,
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
                        style: {
                            cssClass: 'yaxis-label',
                        },
                        formatter: (value) => {
                            return value
                        },
                    },
                },

                annotations: {
                    position: 'back',
                    yaxis: [
                        {
                            y: maxValue / 5,
                            strokeDashArray: 2,
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            offsetY: -3,
                            width: '100%',
                        },
                        {
                            y: 2 * maxValue / 5,
                            strokeDashArray: 2,
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            offsetY: -3,
                            width: '100%',
                        },
                        {
                            y: 3 * maxValue / 5,
                            strokeDashArray: 2,
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            offsetY: -3,
                            width: '100%',
                        },
                        {
                            y: 4 * maxValue / 5,
                            strokeDashArray: 2,
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            offsetY: -3,
                            width: '100%',
                        },
                        {
                            y: maxValue,
                            strokeDashArray: 2,
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            offsetY: -3,
                            width: '100%',
                        },
                    ],
                },

                legend: {
                    horizontalAlign: 'left'
                },

                colors: ['#48e400'],

                theme: {
                    mode: 'dark',
                },

                fill: {
                    type: ['gradient'],

                    gradient: {
                        shade: 'dark',
                        type: "vertical",
                        shadeIntensity: 0.8,
                        opacityFrom: 1,
                        opacityTo: 0,
                        stops: [0, 100],
                    },
                }
            };

            this.chart = new ApexCharts(document.querySelector("#line-chart"), options);
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

    .zoom-row {
        margin-bottom: 0px !important;
        margin-top: 15px !important;
    }
}

@media only screen and (min-width: 650px) {
    .yaxis-label {
        font-size: 12px !important;
        line-height: 12px !important;
        font-weight: 400;
        fill: rgba(255, 255, 255, 0.6) !important;
    }

    .zoom-row {
        margin-bottom: 0px !important;
        margin-top: 5px !important;
    }
}

#line-chart {
    overflow-x: hidden !important;
    overflow-y: hidden !important;
}

.zoom-btn {
    margin-right: 5px;
    border-color: rgba(0, 0, 0, 0) !important;
}

.selected {
    border-color: white !important;
}

</style>