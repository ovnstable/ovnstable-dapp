<template>
    <v-row dense class="logo" justify="start" align="center">
        <img class="logo-img" :src="require('@/assets/logo.svg')" @click="clickLogo">
        <img class="logo-img-text ml-2" :src="require('@/assets/logo-text.svg')" @click="clickLogo">
        <label class="ml-2 logo-title" @click="clickLogo">
            <sup>&reg;{{ stand }}</sup>
        </label>

        <NetworkSelect class="network-btn"/>
    </v-row>
</template>

<script>
import NetworkSelect from "@/components/common/header/NetworkSelect";

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
            } else if (hostname === 'app.overnight.fi' || hostname === "avax.overnight.fi" || hostname === "bsc.overnight.fi") {
                return 'Beta';
            }else {
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
    .logo-img-text, .network-btn, .logo-title {
        display: none !important;
    }

    .logo-img {
        height: 40px !important ;
    }
}

@media only screen and (min-width: 1400px) {

    .logo-img {
        height: 40px !important ;
    }

    .logo-img-text {
        height: 34px !important ;
    }
}

.logo {
    width: 100vw !important;
}

.logo-img, .logo-title, .logo-img-text {
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
    vertical-align: super !important;
}

.logo-img {
    vertical-align: center !important;
}
</style>
