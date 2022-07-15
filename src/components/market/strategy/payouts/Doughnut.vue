<template>
    <vc-donut
      :background="'#FFFFFF'"
      :size="size" unit="px" :thickness="20"
      :sections="sections"
      :start-angle="0" :auto-adjust-text-size="false">
        <p class="total-label mt-5">Last payout was</p>
        <p class="total-label-time mt-n3 mb-0">{{ timeDisplay }}</p>
        <p class="total-label">hours ago</p>
    </vc-donut>
</template>

<script>

import {mapActions, mapGetters, mapMutations} from "vuex";

/* eslint-disable no-unused-vars,no-undef */

export default {
    name: "Doughnut",

    props: {
        size: {
            type: Number,
            default: 280,
        },
    },

    watch: {
        size: function (newVal, oldVal) {
            this.updateSectionsData();
        },

        wmaticStrategyData: function (newVal, oldVal) {
            this.updateSectionsData();
        },
    },

    components: {},

    data: () => ({
        sections: [],
    }),

    computed: {
        ...mapGetters('marketData', ['wmaticStrategyData']),

        timeDisplay: function () {
            let hours = Math.trunc(this.getHours());
            let minutes = Math.trunc((this.getHours() - Math.trunc(this.getHours())) * 60.0);

            if (hours < 10) {
                hours = "0" + hours;
            }

            if (minutes < 10) {
                minutes = "0" + minutes;
            }

            return hours + " : " + minutes;
        },
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

        getHours() {
            let now = this.$moment(new Date());
            let lastPayoutDateTime = this.$moment(this.wmaticStrategyData.payoutItems[this.wmaticStrategyData.payoutItems.length - 1].payableDate);
            let duration = this.$moment.duration(now.diff(lastPayoutDateTime));

            return duration.asHours();
        },

        getPercent(item, data) {
            return Math. min((this.getHours() / 24.0) * 100, 100);
        },

        updateSectionsData() {
            this.sections = [];

            this.sections.push(
                {
                    color: "#3D8DFF",
                    label: "Time",
                    value: this.getPercent(),
                }
            );
        },
    }
}
</script>

<style scoped>

.total-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 18px;
    line-height: 32px;
    text-align: center;
    color: #333333;
}

.total-label-time {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 54px;
    line-height: 60px;
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}
</style>