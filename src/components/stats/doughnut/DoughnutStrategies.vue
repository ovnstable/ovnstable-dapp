<template>
    <vc-donut
      background="var(--secondary)"
      :size="size" unit="px" :thickness="20"
      :sections="sections"
      :start-angle="0"
      :auto-adjust-text-size="false">

        <p class="total-label">Total {{assetType.toUpperCase()}}</p>
        <p v-if="assetType === 'eth+'" class="total-sum-label">{{ $utils.formatMoneyComma(totalValue, 4) }}</p>
        <p v-else class="total-sum-label">{{ $utils.formatMoneyComma(totalValue, 0) }}</p>
    </vc-donut>
</template>

<script>


/* eslint-disable no-unused-vars,no-undef */

export default {
    name: "DoughnutStrategies",

    props: {
        data: {
            type: Array,
            default: null,
        },

        totalValue: {
            type: Number,
            default: 0
        },

        size: {
            type: Number,
            default: 320,
        },

        networkName: {
            type: String,
            default: 'optimism'
        },
        assetType: {
            type: String,
            default: 'usd+'
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
    },

    mounted() {
        this.updateSectionsData();
    },

    created() {
        this.updateSectionsData();
    },

    methods: {
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

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .total-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
    }

    .total-sum-label {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .total-label {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
    }

    .total-sum-label {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .total-label {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }

    .total-sum-label {
        font-style: normal;
        font-weight: 400;
        font-size: 40px;
        line-height: 48px;
    }
}

@media only screen and (min-width: 1300px) {
    .total-label {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
    }

    .total-sum-label {
        font-style: normal;
        font-weight: 400;
        font-size: 36px;
        line-height: 48px;
    }
}

.total-label {
    text-align: center;
    font-feature-settings: 'liga' off;
    color: var(--main-gray-text);
}

.total-sum-label {
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}
</style>
