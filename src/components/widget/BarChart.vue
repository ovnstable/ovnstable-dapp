<template>
    <div>
        <v-row class="chart-header-row" justify="start" align="center">
          <label class="chart-title">{{name}} {{type}}</label>
            <label class="chart-title chart-title-slice" v-if="$wu.isFull()">&nbsp;&nbsp;|&nbsp;</label>
            <v-spacer v-if="!$wu.isFull()"></v-spacer>
            <label class="chart-title chart-title-slice">{{ sliceLabel }}</label>
        </v-row>

        <div class="chart-row mt-4" :id="'bar-chart-dashboard-' + id"></div>

        <resize-observer @notify="$forceUpdate()"/>
    </div>
</template>

<script>
/* eslint-disable no-unused-vars,no-undef */

import {mapActions, mapGetters} from "vuex";

import ApexCharts from 'apexcharts'

export default {
    name: "BarChart",

    props: {
        data: {
            type: Object,
            default: null,
        },
        id: {
          type: Number,
          default: 1,
        },
        name: {
          type: String,
          default: "USD+",
        },
        type: {
          type: String,
          default: "Balance",
        },
    },

    watch: {
        slice: function (newVal, oldVal) {
            this.redraw();
        },

        light: function (newVal, oldVal) {
            this.redraw();
        },

        data: function (newVal, oldVal) {
            this.redraw();
        },
    },

    components: {},

    data: () => ({
        chart: null,
    }),

    computed: {
        ...mapGetters('dashboardData', ['slice']),
        ...mapGetters('theme', ['light']),

        isMobile() {
            return window.innerWidth < 650;
        },

        sliceLabel() {
            switch (this.slice){
                case 7:
                    return 'WEEK'
                case 30:
                    return 'MONTH'
                default:
                    return 'ALL';
            }
        }
    },

    mounted() {
        this.redraw();
    },

    created() {
    },

    methods: {
        ...mapActions('dashboardData', ['sliceDashboard']),

        redraw() {
            if (this.chart) {
                this.chart.destroy();
            }

            if (!this.data) {
                return;
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
                    type: 'bar',
                    height: this.isMobile ? 230 : 300,

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
                    colors: ["#1C95E7"],
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
                        show: true,

                        style: {
                            colors: ['#707A8B'],
                            fontSize: '14px',
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 400,
                            cssClass: 'apexcharts-yaxis-label',
                        },

                        formatter: function (val, opts) {
                            return '$' + Math.round(parseFloat(val));
                        },
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

                annotations: {
                    position: 'back',
                    yaxis: [
                        {
                            y: maxValue / 5,
                            strokeDashArray: 2,
                            borderColor: 'var(--input-placeholder)',
                            offsetY: -3,
                            width: '100%',
                        },
                        {
                            y: 2 * maxValue / 5,
                            strokeDashArray: 2,
                            borderColor: 'var(--input-placeholder)',
                            offsetY: -3,
                            width: '100%',
                        },
                        {
                            y: 3 * maxValue / 5,
                            strokeDashArray: 2,
                            borderColor: 'var(--input-placeholder)',
                            offsetY: -3,
                            width: '100%',
                        },
                        {
                            y: 4 * maxValue / 5,
                            strokeDashArray: 2,
                            borderColor: 'var(--input-placeholder)',
                            offsetY: -3,
                            width: '100%',
                        },
                        {
                            y: maxValue,
                            strokeDashArray: 2,
                            borderColor: 'var(--input-placeholder)',
                            offsetY: -3,
                            width: '100%',
                        },
                    ],
                },

                legend: {
                    horizontalAlign: 'left'
                },

                colors: [this.light ? '#E6F1FF' : '#093b5d'],

                theme: {
                    mode: this.light ? 'light' : 'dark',
                },

                fill: {
                    type: ['gradient'],

                    gradient: {
                        shade: 'rgba(230, 241, 255, 1)',
                        type: "vertical",
                        shadeIntensity: 0.2,
                        opacityFrom: 1,
                        opacityTo: 0,
                        stops: [0, 100],
                    },
                }
            };

            this.chart = new ApexCharts(document.querySelector("#bar-chart-dashboard-" + this.id), options);
            try {
                this.chart.render();
            } catch (e) {
                console.log('Error: ' + e.message);
            }
        },
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.destroy();
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
        font-size: 20px;
        line-height: 28px;
    }

    .chart-title-slice {
        font-size: 14px !important;
        line-height: 18px !important;
    }
}

@media only screen and (min-width: 1400px) {
    .chart-title {
        margin-top: 30px !important;
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 32px;
    }

    .chart-row {
        height: 250px !important;
    }

    .chart-title-slice {
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
        font-size: 23px;
        line-height: 28px;
    }

    .chart-row {
        height: 250px !important;
    }

    .chart-title-slice {
        font-size: 16px !important;
        line-height: 20px !important;
    }
}

#line-chart-dashboard {
    overflow-x: hidden !important;
    overflow-y: hidden !important;
}

.chart-header-row, .chart-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
}

.chart-title {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'liga' off;
    color: var(--secondary-gray-text) !important;
}

.chart-title-slice {
    color: var(--third-gray-text) !important;
}

</style>