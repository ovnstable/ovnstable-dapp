<template>
    <vc-donut
      :background="'#0F1A26'"
      :size="size" unit="px" :thickness="30"
      :sections="sections"
      :start-angle="0" :auto-adjust-text-size="false">

        <p class="total-label">TOTAL USD+</p>

        <p class="total-sum-label">{{ $utils.formatMoneyComma(totalUsdPlusValue, 2) }}</p>
    </vc-donut>
</template>

<script>

import {mapActions, mapGetters, mapMutations} from "vuex";

/* eslint-disable no-unused-vars,no-undef */

export default {
    name: "Doughnut",

    props: {
        data: {
            type: Array,
            default: null,
        },

        size: {
            type: Number,
            default: 320,
        },
    },

    watch: {
        data: function (newVal, oldVal) {
            this.updateSectionsData();
        },

        size: function (newVal, oldVal) {
            this.updateSectionsData();
        },
    },

    components: {},

    data: () => ({
        sections: [],
    }),

    computed: {
        ...mapGetters("statsData", ['totalUsdPlusValue', 'currentTotalData', 'totalUsdPlus', ]),
        ...mapGetters("statsUI", [ 'loadingCurrentTotalData']),
    },

    mounted() {
        this.updateSectionsData();
    },

    created() {
        this.updateSectionsData();
    },

    methods: {
        ...mapActions([]),

        ...mapMutations([]),

        getPercent(item, data) {
            let sum = data.map(dataItem => dataItem.value).reduce((prev, next) => prev + next);

            return (item.value * 100 / sum) - 0;
        },

        updateSectionsData() {
            this.sections = [];

            if (this.data)
                this.data.forEach(item => {
                    this.sections.push(
                      {
                          color: item.color,
                          label: item.label,
                          value: this.getPercent(item, this.data),
                      }
                    )
                });
        },

        getTotal() {
            let sum = 0;
            this.data.forEach(dataItem => {
                sum += dataItem.value
            });

            return sum;
        },
    }
}
</script>

<style>

.total-label {
    font-family: 'Lato', sans-serif !important;
    font-weight: 300;
    font-size: 24px;
    line-height: 36px;
    color: white !important;
}

.total-sum-label {
    font-family: 'Lato', sans-serif !important;
    font-weight: 700;
    font-size: 34px;
    line-height: 42px;
    color: white !important;
}

</style>
