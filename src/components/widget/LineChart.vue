<template>
    <div>
        <v-row class="chart-header-row" justify="start" align="center">
            <label class="chart-title">USD+ Balance</label>
            <label class="chart-title chart-title-slice" v-if="$wu.isFull()">&nbsp;&nbsp;|&nbsp;</label>
            <v-spacer v-if="!$wu.isFull()"></v-spacer>
            <label class="chart-title chart-title-slice">{{ sliceLabel }}</label>
        </v-row>

        <div class="chart-row mt-4" id="line-chart-dashboard"></div>

        <resize-observer @notify="$forceUpdate()"/>
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
        slice: function (newVal, oldVal) {
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

        ...mapMutations('dashboardData', ['setSlice']),

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
                    type: 'area',
                    height: this.isMobile ? 230 : 300,

                    sparkline: {
                        enabled: false,
                    },

                    zoom: {
                        enabled: false
                    },

                    background: '#FFFFFF',

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
                        show: true,
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
                            borderColor: '#C5C9D1',
                            offsetY: -3,
                            width: '100%',
                        },
                        {
                            y: 2 * maxValue / 5,
                            strokeDashArray: 2,
                            borderColor: '#C5C9D1',
                            offsetY: -3,
                            width: '100%',
                        },
                        {
                            y: 3 * maxValue / 5,
                            strokeDashArray: 2,
                            borderColor: '#C5C9D1',
                            offsetY: -3,
                            width: '100%',
                        },
                        {
                            y: 4 * maxValue / 5,
                            strokeDashArray: 2,
                            borderColor: '#C5C9D1',
                            offsetY: -3,
                            width: '100%',
                        },
                        {
                            y: maxValue,
                            strokeDashArray: 2,
                            borderColor: '#C5C9D1',
                            offsetY: -3,
                            width: '100%',
                        },
                    ],
                },

                legend: {
                    horizontalAlign: 'left'
                },

                colors: ['#E6F1FF'],

                theme: {
                    mode: 'light',
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
    color: var(--third-lightgray-text) !important;
}

</style>
