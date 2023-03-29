<template>
    <div class="apy-chart-container">
        <v-row class="chart-header-row">
            <v-col cols="6" :cols="$wu.isMobile() ? 12 : 6">
              <v-row justify="start" align="left">
                <label class="chart-title ml-5">
                  ETS {{ etsData.nameUp }}
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

<!--                <v-row justify="start" v-if="!isMobile">-->
<!--                    <v-checkbox-->
<!--                        class="hold-checkbox"-->
<!--                        color="#22ABAC"-->
<!--                        @click="redraw"-->
<!--                        v-model="usdPlusDataEnabled"-->
<!--                    >-->
<!--                        <template v-slot:label>-->
<!--                            <label class="hold-checkbox-label">USD+ APY</label>-->
<!--                        </template>-->
<!--                    </v-checkbox>-->
<!--                </v-row>-->
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
                       <v-row align="center" justify="end">
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
import moment from "moment";

import ApexCharts from 'apexcharts'
import Tooltip from "@/components/common/element/Tooltip";

export default {
    name: "ChartApy",

    props: {
        data: {
            type: Object,
            default: null,
        },

        usdPlusData: {
            type: Object,
            default: null,
        },

        etsData: {
            type: Object,
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

        usdPlusData: function (newVal, oldVal) {
            this.redraw();
        },
    },

    components: {Tooltip},

    data: () => ({
        zoom: "month",
        slice: null,
        chart: null,

        avgApy: null,
        usdPlusDataEnabled: false,
    }),

    computed: {
        ...mapGetters('network', ['polygonApi', 'bscApi', 'opApi', 'arApi', 'zkApi']),
        ...mapGetters('theme', ['light']),

        isMobile() {
            return window.innerWidth < 650;
        }
    },

    mounted() {
        this.redraw();
    },

    created() {
        this.zoomChart("month");
    },

    methods: {
        ...mapActions('track', ['trackClick']),

        async zoomChart(zoom) {

            let apiUrl;

            switch (this.etsData.chain) {
                case 137:
                    apiUrl = this.polygonApi;
                    break;
                case 10:
                    apiUrl = this.opApi;
                    break;
                case 56:
                    apiUrl = this.bscApi;
                    break;
                case 42161:
                    apiUrl = this.arApi;
                    break;
                case 324:
                    apiUrl = this.zkApi;
                    break;
                default:
                    apiUrl = this.polygonApi;
                    break;
            }

            let fetchOptions = {
                headers: {
                    "Access-Control-Allow-Origin": apiUrl
                }
            };

            await fetch(apiUrl + '/hedge-strategies/' + this.etsData.address + '/avg-apy-info/' + zoom, fetchOptions)
                .then(value => value.json())
                .then(value => {
                    this.avgApy = value;

                    if (this.avgApy.date) {
                        this.avgApy.date = moment(this.avgApy.date).format("DD MMM. ‘YY");
                    }
                }).catch(reason => {
                    console.log('Error get data: ' + reason);
                })

            this.zoom = zoom;

            switch (zoom) {
                case "week":
                    this.trackClick({action: 'switch-zoom-week-click', event_category: 'Widgets range', event_label: 'Change Range Week', value: 1 });
                    this.slice = -7;
                    break;
                case "month":
                    this.trackClick({action: 'switch-zoom-month-click', event_category: 'Widgets range', event_label: 'Change Range Month', value: 1 });
                    this.slice = -30;
                    break;
                case "all":
                    this.trackClick({action: 'switch-zoom-all-click', event_category: 'Widgets range', event_label: 'Change Range All', value: 1 });
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

            let valuesUsdPlus = [];
            labels.forEach(v => valuesUsdPlus.push(this.usdPlusData[v] ? this.usdPlusData[v] : null));

            let averageValue = this.avgApy.value;

            let maxValue;
            try {

                if (this.usdPlusDataEnabled) {
                    let maxValueEts = Math.max.apply(Math, values);
                    let maxValueUsdPlus = Math.max.apply(Math, valuesUsdPlus);
                    maxValue = Math.max(maxValueEts, maxValueUsdPlus);
                } else {
                    maxValue = Math.max.apply(Math, values);
                }

                if (maxValue > 5) {
                  maxValue = Math.round(Math.ceil(maxValue / 10)) * 10;
                }
            } catch (e) {
                maxValue = 50;
            }

            let minValue;
            try {

                if (this.usdPlusDataEnabled) {
                    let minValueEts = Math.min.apply(Math, values);
                    let minValueUsdPlus = Math.min.apply(Math, valuesUsdPlus);

                    minValue = Math.min(minValueEts, minValueUsdPlus);
                } else {
                    minValue = Math.min.apply(Math, values);
                }

                if (minValue < -5) {
                    minValue = Math.min(Math.floor(Math.floor(minValue / 10)) * 10, 0);
                }
            } catch (e) {
                minValue = 0;
            }

            let chartColor = this.$colorUtils.hexToRgb(this.etsData.mainColor);

            let seriesList = [];

            seriesList.push(
                {
                    name: "ETS " + this.etsData.nameUp + " Cumulative return",
                    data: values
                }
            );

            if (this.usdPlusDataEnabled) {
                seriesList.push(
                    {
                        name: "USD+ APY",
                        data: valuesUsdPlus
                    }
                );
            }

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
                            y: minValue = 0,
                            strokeDashArray: 5,
                            offsetX: 10,
                            offsetY: -5,
                            width: '97%',
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
                    colors: [this.etsData.mainColor, "#22ABAC"],
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
                            return val ? (val + '%') : '—';
                        },
                    },
                },

                legend: {
                    show: false,
                },

                colors: this.light ? [`rgba(${chartColor.r}, ${chartColor.g}, ${chartColor.b}, 0.3)`, 'rgba(34, 171, 172, 0.3)'] : [this.etsData.mainColor, '#0d4444'],

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
        font-size: 15px;
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
        font-size: 23px;
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
  right: 30px;
  top: 11px;
}

.all-compound-container {
  position: relative;
}

</style>
