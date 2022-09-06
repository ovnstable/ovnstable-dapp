<template>
    <div class="main">
        <template v-if="portfolioValue">
            <LineChart :data="portfolioValue"/>
        </template>
    </div>
</template>

<script>

import {mapGetters} from "vuex";
import LineChart from "@/components/widget/LineChart";

export default {
    name: "DashboardWidget",

    components: {
        LineChart
    },

    data: () => ({
    }),

    props: {
    },

    computed: {
        ...mapGetters('dashboardData', ['portfolioValue']),
    },

    methods: {
    }
}
</script>

<style>

.main {
    font-style: normal;
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
    display: inline-block;

    border: none;
    background: none !important;

    text-align: center;
}

</style>
