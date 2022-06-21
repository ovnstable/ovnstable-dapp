<template>
    <v-container>
        <v-row justify="end">
            <button v-on:click="goToPolygon" class="switcher-btn">
                Switch to {{ networkName }}
            </button>
        </v-row>
    </v-container>
</template>

<script>
import {mapActions} from "vuex";

export default {
    name: "SwitchToPolygon",

    computed: {
        networkName() {
            return this.capitalize(process.env.VUE_APP_POLYGON)
        },
    },

    methods: {
        ...mapActions('web3', ['setNetwork']),

        capitalize(s) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        },

        goToPolygon() {
            this.setNetwork(process.env.VUE_APP_NETWORK_ID)
        }
    }
}
</script>

<style scoped>

.switcher-btn:hover {
    filter: brightness(110%);
}

.switcher-btn {
    color: white;
    width: 185px;
    height: 56px;
    border-radius: 40px;
    background: var(--orange-gradient);

    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px !important;
    line-height: 24px !important;
}

</style>
