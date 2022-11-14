<template>
    <vc-donut
      :background="'var(--doughnut-bg)'"
      :foreground="'var(--doughnut-fg)'"
      :size="size" unit="px" :thickness="20"
      :sections="sections"
      :start-angle="0" :auto-adjust-text-size="false">
        <p class="total-label mt-5">Last payout was on</p>
        <p class="total-label-time mt-n3 mb-0">{{ timestamp }}</p>
        <p class="total-label mb-0">Please withdraw</p>
        <p class="total-label mt-n2">your funds</p>
    </vc-donut>
</template>

<script>

/* eslint-disable no-unused-vars,no-undef */

export default {
    name: "Doughnut",

    props: {
        size: {
            type: Number,
            default: 280,
        },

        color: {
            type: String,
            default: '#3D8DFF',
        },

        lastDate: {
            type: String,
            default: null,
        },
    },

    watch: {
        size: function (newVal, oldVal) {
            this.updateSectionsData();
        },

        lastDate: function (newVal, oldVal) {
            this.updateSectionsData();
        },
    },

    components: {},

    data: () => ({
        timestamp: ""
    }),

    computed: {

    },

    mounted() {
    },

    created() {
        setInterval(this.getNow);
    },

    methods: {
        getNow: function() {
            let today = new Date();
            let date = today.getFullYear()+'.'+(today.getMonth()+1)+'.'+today.getDate();
            const dateTime = date;
            this.timestamp = dateTime;
        }
    }
}
</script>

<style scoped>

.total-label {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 32px;
    text-align: center;
    color: var(--doughnut-text);
}

.total-label-time {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 40px;
    line-height: 54px;
    text-align: center;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--doughnut-text);
}
</style>
