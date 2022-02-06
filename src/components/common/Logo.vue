<template>
    <v-row dense class="logo" @click="clickLogo" justify="end">
        <div style="width: 40px; height: 40px">
            <v-img :src="require('../../assets/ovn.png')"></v-img>
        </div>
        <label class="logo-title" @click="clickLogo">
            Overnight<sup>&reg;{{ stand }}</sup>
        </label>
    </v-row>
</template>

<script>
export default {
    name: "Logo",

    components: {},

    data: () => ({
    }),

    computed: {

        stand: function () {

            let hostname = window.location.hostname;
            if (hostname === 'localhost') {
                return 'Localhost';
            } else if (hostname === 'dev.overnight.fi') {
                return 'Dev';
            } else if (hostname === 'app.overnight.fi') {
                return 'Beta';
            } else {
                return 'UnKnown';
            }
        }
    },

    methods: {
        clickLogo() {
            window.open('https://overnight.fi/', '_blank').focus();
        },
    }
}
</script>

<style scoped>
.logo {
    width: 400px;
    cursor: pointer;
}

.logo-title {
    font-family: 'Raleway', sans-serif;
    font-weight: 600;
    font-size: 28px;
    color: var(--logo-color) !important;
}

.logo-title > sup {
    font-size: 14px;
    font-weight: 400 !important;
    vertical-align: super;
}
</style>
