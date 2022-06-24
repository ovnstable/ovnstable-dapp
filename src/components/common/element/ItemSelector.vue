<template>
    <v-menu
            rounded="lg"
            offset-y
            @input="setShow"
    >
        <template v-slot:activator="{ attrs, on }">
            <v-btn
                    :height="heightBtn"
                    v-bind="attrs"
                    v-on="on"
                    text
                    :style="{'background': selectedItem.background ? selectedItem.background : ''} "
                    :class="btnMainClass"
            >
                <div class="image-icon">
                    <v-img :src="selectedItem.image"/>
                </div>
                <span class="label-btn ml-2">{{ selectedItem.title }}</span>
                <v-icon class="ml-2" style="color: white" v-if="!show && !readonly">mdi-chevron-down</v-icon>
                <v-icon class="ml-2" style="color: white" v-if="show && !readonly">mdi-chevron-up</v-icon>
            </v-btn>
        </template>

        <v-list v-if="!readonly" :class="textListClass">
            <v-list-item
                    v-for="item in items"
                    :key="item.id"
                    link
                    :disabled="item.disabled !== null ? item.disabled : false"
                    @click="setItem(item)"
            >
                <v-list-item-avatar>
                    <div class="image-icon">
                        <v-img :src="item.image"/>
                    </div>
                </v-list-item-avatar>
                <v-list-item-title class="text-list-item" :class="item.disabled ? 'item-disabled' : ''" v-text="item.title"></v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
export default {
    name: "ItemSelector",

    props: {
        readonly: {
            type: Boolean,
            default: false,
        },

        heightBtn: {
            type: String,
            default: '64px'
        },

        classBtn: {
            type: String
        },

        classList: {
            type: String
        },

        selectedItem: {
            type: Object,
        },

        items: {
            type: Array,
            default: [],
        },
    },

    data: () => ({
        show: false,
    }),

    computed: {

        btnMainClass: function () {
            return "main-btn" + " " + this.classBtn;
        },

        textListClass: function () {
            return "text-list" + " " + this.classList;
        },
    },

    methods: {

        setShow(value) {
            this.show = value;
        },

        setItem(item) {
            this.selectedItem = item;
            this.$emit('update:selectedItem', item)
        }
    }
}
</script>

<style scoped>

.image-icon {
    width: 32px;
    height: 32px;
}

.main-btn {
    background: none !important;
    border-radius: 16px;
    border: 1px solid #101419;
}

.label-btn {
    color: white;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    text-transform: none !important;
}

.text-list {
    background-color: var(--secondary) !important;
    border-radius: 10px !important;
    margin-top: 10px !important;
}

.text-list-item {
    cursor: pointer;
    color: white;
    font-family: 'Lato', sans-serif !important;
    font-style: normal !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    line-height: 24px !important;
}

.item-disabled {
    cursor: default;
    color: rgba(255, 255, 255, 0.15);
}
</style>
