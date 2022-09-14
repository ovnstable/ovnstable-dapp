<template>
    <v-tooltip
            max-width="220px"
            color="#FFFFFF"
            class="tooltip-container"
            transition="none"
            right
            :close-delay="link ? 4000 : 100"
    >
        <template v-slot:activator="{ on, attrs }">
            <div class="info-icon ml-1"
                 v-bind="attrs"
                 v-on="on">
                <v-img :src="require('@/assets/icon/tooltip.svg')"/>
            </div>
        </template>
        <v-row class="ma-1" align="center" @click="openLink">
            <label class="tooltip-text" :class="link ? 'link-container' : ''">{{ text }}</label>
            <div v-if="link" class="icon-img ml-2" :class="link ? 'link-container' : ''">
                <v-img :src="require('@/assets/icon/openBlue.svg')"/>
            </div>
        </v-row>
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

        link: {
            type: String,
            default: null,
        },
    },

    data: () => ({
    }),

    computed: {
    },

    methods: {
        openLink() {
            if (this.link) {
                window.open(this.link, '_blank').focus();
            }
        },
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

.icon-img, .info-icon {
    width: 20px !important;
    height: 20px !important;
}

.link-container {
    cursor: pointer !important;
}

.v-tooltip__content {
    pointer-events: initial;
}
</style>
