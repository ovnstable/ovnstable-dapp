<template>
    <div>
        <v-row class="zoom-db-row mb-5 mt-6 mr-2">
            <v-spacer></v-spacer>
            <v-btn
              rounded
              text
              id="week-zoom-btn-db"
              class="zoom-btn"
              dark
              @click="zoomChart('week')"
            >
                <label>Week</label>
            </v-btn>
            <v-btn
              rounded
              text
              id="month-zoom-btn-db"
              class="zoom-btn"
              dark
              @click="zoomChart('month')"
            >
                Month
            </v-btn>
            <v-btn
              rounded
              text
              id="all-zoom-btn-db"
              class="zoom-btn"
              dark
              @click="zoomChart('all')"
            >
                All
            </v-btn>
            <v-spacer v-if="isMobile"></v-spacer>
        </v-row>

        <div class="chart-db-row" id="line-chart-dashboard"></div>
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
        zoom: "week",
        chart: null,
    }),

    computed: {
        ...mapGetters('dashboardData', ['slice']),

        isMobile() {
            return window.innerWidth < 650;
        }
    },

    mounted() {
        this.redraw();
    },

    created() {
        this.zoomChart("week");
    },

    methods: {
        ...mapActions('dashboardData', ['sliceDashboard']),

        ...mapMutations('dashboardData', ['setSlice']),

        zoomChart(zoom) {
            this.zoom = zoom;

            switch (zoom) {
                case "week":
                    this.setSlice(7);
                    break;
                case "month":
                    this.setSlice(30)
                    break;
                case "all":
                    this.setSlice(null)
                    break;
                default:
                    this.setSlice(null)
            }

            this.sliceDashboard();

            if (this.chart) {
                this.chart.destroy();
            }

            this.redraw();
        },

        changeZoomBtnStyle() {
            document.getElementById("week-zoom-btn-db").classList.remove("selected");
            document.getElementById("month-zoom-btn-db").classList.remove("selected");
            document.getElementById("all-zoom-btn-db").classList.remove("selected");

            document.getElementById(this.zoom + "-zoom-btn-db").classList.add("selected");
        },

        redraw() {
            if (this.chart) {
                this.chart.destroy();
            }

            if (!this.data) {
                return;
            }

            try {
                this.changeZoomBtnStyle();
            } catch (e) {
                if (e.message === "document.getElementById(...) is null")
                    return;
                else
                    throw new Error(e);
            }

            let values = [];
            this.data.datasets[0].data.forEach(v => values.push(v));
            values = this.slice ? values.slice(-this.slice) : values;

            let labels = [];
            this.data.labels.forEach(v => labels.push(v));
            labels = this.slice ? labels.slice(-this.slice) : labels;

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

                    background: '#1D2029',

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
                    colors: this.isMobile ? ["#23DD00"] : ["#51FF00"],
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
                            cssClass: 'yaxis-label-dashboard',
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

                colors: this.isMobile ? ['#181E25'] : ['#68D55A'],

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

            this.chart = new ApexCharts(document.querySelector("#line-chart-dashboard"), options);
            try {
                this.chart.render();
            } catch (e) {
                console.log('Error: ' + e.message);
            }
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

    .zoom-db-row {
        height: 20px !important;
    }

    .chart-db-row {
        margin-bottom: -10px !important;
    }

    .zoom-btn {
        border: none !important;
        font-family: 'Lato', sans-serif !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 14px !important;
        line-height: 20px !important;
        color: #707A8B !important;
    }
}

@media only screen and (min-width: 650px) {
    .yaxis-label {
        font-size: 12px !important;
        line-height: 12px !important;
        font-weight: 400;
        fill: rgba(255, 255, 255, 0.6) !important;
    }

    .zoom-db-row {
        height: 20px !important;
    }

    .chart-db-row {
        height: 250px !important;
    }

    .zoom-btn {
        border: none !important;
        font-family: 'Lato', sans-serif !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 24px !important;
        color: #707A8B !important;
    }
}

#line-chart-dashboard {
    overflow-x: hidden !important;
    overflow-y: hidden !important;
}

.selected {
    color: #FCCA46 !important;
    background-color: rgba(255, 213, 5, 0.15) !important;
}

</style>
