<template>
    <v-row dense class="logo" @click="clickLogo" justify="start">
        <div class="mr-1" style="width: 40px; height: 40px">
            <v-img :src="require('../../assets/ovn.png')"></v-img>
        </div>

        <label class="logo-title" @click="clickLogo">
            Overnight<sup>&reg;{{ stand }}</sup>
        </label>

        <NetworkSelect/>
    </v-row>
</template>

<script>
import NetworkSelect from "@/components/common/NetworkSelect";

export default {
    name: "Logo",

    components: {
        NetworkSelect,
    },

    data: () => ({
    }),

    computed: {

        stand: function () {

            let hostname = window.location.hostname;
            if (hostname === 'localhost') {
                return 'Local';
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
