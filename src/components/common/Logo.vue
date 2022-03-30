<template>
    <v-row dense class="logo" justify="start">
        <div class="mr-1 logo-img" style="width: 40px; height: 40px">
            <v-img :src="require('../../assets/ovn.png')" @click="clickLogo"></v-img>
        </div>

        <label class="logo-title" @click="clickLogo">
            Overnight<sup>&reg;{{ stand }}</sup>
        </label>

        <NetworkSelect class="network-btn"/>
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

/* mobile */
@media only screen and (max-width: 1400px) {
    .logo-title, .network-btn {
        display: none !important;
    }
}

@media only screen and (min-width: 1400px) {
}

.logo {
    width: 100vw !important;
}

.logo-img, .logo-title {
    cursor: pointer;
}

.logo-title {
    font-family: 'Raleway', sans-serif;
    letter-spacing: 1px;
    font-weight: 700;
    font-size: 28px;
    color: var(--logo-color) !important;
}

.logo-title > sup {
    font-family: 'Lato', sans-serif;
    letter-spacing: normal;
    font-weight: 400 !important;
    font-size: 16px;
    vertical-align: super;
}
</style>
