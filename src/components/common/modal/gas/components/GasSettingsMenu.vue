<template>
    <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
            <div class="gas-select-main-container"
                 v-click-outside="clickMenuOutside"
                 @click="openMenu"
                 v-bind="attrs"
                 v-on="on">
                <v-row class="ma-0 gas-select-container">
                    <label class="gas-label">
                        {{ gasPriceType }}
                    </label>
                    <label class="gas-label-gwei">
                        &nbsp;/ {{ gasPriceStation[gasPriceType] }} Gwei
                    </label>
                    <v-icon color="var(--secondary-gray-text)" class="mb-1">
                        {{ openedList ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                    </v-icon>
                </v-row>
            </div>
        </template>

        <v-list class="gas-select-list">
            <v-list-item class="gas-list-item">
                <v-list-item-title @click="selectGasSpeed('low')">
                    <label class="gas-label">
                        Low
                    </label>
                    <label class="gas-label-gwei">
                        &nbsp;/ {{ gasPriceStation['low'] }} Gwei
                    </label>
                </v-list-item-title>
            </v-list-item>
            <v-list-item class="gas-list-item">
                <v-list-item-title @click="selectGasSpeed('standard')">
                    <label class="gas-label">
                        Standard
                    </label>
                    <label class="gas-label-gwei">
                        &nbsp;/ {{ gasPriceStation['standard'] }} Gwei
                    </label>
                </v-list-item-title>
            </v-list-item>
            <v-list-item class="gas-list-item">
                <v-list-item-title @click="selectGasSpeed('fast')">
                    <label class="gas-label">
                        Fast
                    </label>
                    <label class="gas-label-gwei">
                        &nbsp;/ {{ gasPriceStation['fast'] }} Gwei
                    </label>
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
    name: "GasSettingsMenu",

    props: {
    },

    computed: {
        ...mapGetters('gasPrice', ['gasPrice', 'gasPriceGwei', 'gasPriceStation', 'gasPriceType']),
    },

    data: () => ({
        openedList: false,
    }),

    methods: {
        ...mapActions('gasPrice', ['refreshGasPrice', 'hideGasSettings']),
        ...mapMutations('gasPrice', ['setGasPriceType']),

        selectGasSpeed(type){
            this.setGasPriceType(type);
            this.refreshGasPrice();
        },

        clickMenuOutside() {
            this.openedList = false;
        },

        openMenu() {
            this.refreshGasPrice();
            this.openedList = !this.openedList
        }
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .gas-label {
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
    }

    .gas-label-gwei {
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 20px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .gas-label {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
    }

    .gas-label-gwei {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .gas-label {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
    }

    .gas-label-gwei {
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 24px;
    }
}

.gas-label {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    text-transform: capitalize;
    color: var(--secondary-gray-text);
}

.gas-label-gwei {
    font-family: 'Roboto', sans-serif;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--action-label-text);
}

.gas-select-main-container {
    width: 100% !important;
}

.gas-select-list {
    background-color: var(--secondary) !important;
    border-radius: 10px;
}

.gas-select-container, .gas-select-container > *, .gas-list-item, .gas-list-item > *, .gas-label, .gas-label-gwei {
    cursor: pointer !important;
}
</style>
