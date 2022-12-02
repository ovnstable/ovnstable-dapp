<template>
    <v-tooltip
            :max-width="maxWidth + 'px'"
            color="var(--tooltip-bg)"
            class="tooltip-container"
            transition="none"
            :left="left"
            :bottom="bottom"
            :top="top"
            :right="right"
            :close-delay="link ? 4000 : 100"
    >
        <template v-slot:activator="{ on, attrs }">
            <div class="info-icon ml-1"
                 :style="{width: size + 'px', height: size + 'px'}"
                 v-bind="attrs"
                 v-on="on">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12ZM13 16V18H11V16H13ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM8 10C8 7.79 9.79 6 12 6C14.21 6 16 7.79 16 10C16 11.2829 15.21 11.9733 14.4408 12.6455C13.711 13.2833 13 13.9046 13 15H11C11 13.1787 11.9421 12.4566 12.7704 11.8217C13.4202 11.3236 14 10.8792 14 10C14 8.9 13.1 8 12 8C10.9 8 10 8.9 10 10H8Z" :fill="iconColor"/>
                </svg>
            </div>
        </template>
        <v-row class="ma-1" align="center" @click="openLink">
            <label class="tooltip-text" :class="link ? 'link-container' : ''" v-html="text"></label>
            <div v-if="link"
                 class="icon-img ml-2"
                 :style="{width: size + 'px', height: size + 'px'}"
                 :class="link ? 'link-container' : ''">
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

        iconColor: {
            type: String,
            default: "#9DA4B0",
        },

        size: {
            type: Number,
            default: 20,
        },

        maxWidth: {
            type: Number,
            default: 220,
        },

        right: {
            type: Boolean,
            default: true,
        },

        left: {
            type: Boolean,
            default: false,
        },

        top: {
            type: Boolean,
            default: false,
        },

        bottom: {
            type: Boolean,
            default: false,
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
    color: var(--tooltip-text);
}

.link-container {
    cursor: pointer !important;
}

.v-tooltip__content {
    pointer-events: initial;
}
</style>
