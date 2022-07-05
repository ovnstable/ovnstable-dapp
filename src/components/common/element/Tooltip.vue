<template>
    <v-tooltip
            max-width="220px"
            color="#FFFFFF"
            class="tooltip-container"
            right
    >
        <template v-slot:activator="{ on, attrs }">
            <div class="info-icon ml-2"
                 v-bind="attrs"
                 v-on="on">
                <v-img :src="require('@/assets/icon/tooltip.svg')"/>
            </div>
        </template>
        <p class="my-0 tooltip-text">{{ text }}</p>
    </v-tooltip>
</template>

<script>
export default {
    name: "Tooltip",

    props: {
        text: {
            type: String,
            default: '',
        },
    },

    data: () => ({
    }),

    computed: {
    },

    methods: {
    }
}
</script>

<style scoped>

.tooltip-container {
    border-radius: 2px;
}

.tooltip-text {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #333333;
}
</style>
