<template>
    <v-menu v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y>

        <template v-slot:activator="{ on }">
            <v-text-field
                    :disabled="disabled"
                    :label="label"
                    clearable
                    @click:clear="changeValue()"
                    dense
                    :value="value"
                    hide-details
                    outlined
                    readonly
                    v-on="on"/>
        </template>

        <v-date-picker
                first-day-of-week="1"
                :value="value"
                @input="changeValue"
                no-title
                scrollable
        />
    </v-menu>
</template>

<script>

export default {
    name: "InputDatePicker",
    props: {
        value: {
            type: String,
            default: '',
        },

        disabled: {
            type: Boolean,
            default: false,
        },

        label: {
            type: String,
            default: '',
        },
    },

    computed: {
    },

    data() {
        return {
            menu: false,
        };
    },
    
    methods: {
        changeValue(date) {
            this.menu = false;
            this.$emit('input', date);
        },
    },
}
</script>

<style>
</style>
