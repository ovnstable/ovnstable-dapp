<template>
    <v-row justify="center">
        <div>
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                            height="56px"
                            class="network-select-btn"
                            dark
                            @click="openedList = !openedList"
                            v-bind="attrs"
                            v-on="on">
                        <div class="btn-icon">
                            <v-img :src="require('@/assets/network/polygon.svg')"/>
                        </div>
                        <span class="btn-label">Polygon</span>
                        <v-icon>
                            {{openedList ? 'mdi-chevron-up' : 'mdi-chevron-down'}}
                        </v-icon>
                    </v-btn>
                </template>
                <v-list class="network-select-list">
                    <v-list-item style="cursor: pointer">
                        <v-list-item-avatar>
                            <div class="list-item-icon">
                                <v-img :src="require('@/assets/network/polygon.svg')"/>
                            </div>
                        </v-list-item-avatar>
                        <v-list-item-title class="network-select-list-item">
                            Polygon (Matic)
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item disabled>
                        <v-list-item-avatar>
                            <div class="list-item-icon">
                                <v-img :src="require('@/assets/network/arbitrum.svg')"/>
                            </div>
                        </v-list-item-avatar>
                        <v-list-item-title class="list-item-disabled">
                            Arbitrum (Soon)
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item disabled>
                        <v-list-item-avatar>
                            <div class="list-item-icon">
                                <v-img :src="require('@/assets/network/avax.png')"/>
                            </div>
                        </v-list-item-avatar>
                        <v-list-item-title class="list-item-disabled">
                            Avalanche (Soon)
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item disabled>
                        <v-list-item-avatar>
                            <div class="list-item-icon">
                                <v-img :src="require('@/assets/network/ftm.png')"/>
                            </div>
                        </v-list-item-avatar>
                        <v-list-item-title class="list-item-disabled">
                            Fantom (Soon)
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item disabled>
                        <v-list-item-avatar>
                            <div class="list-item-icon">
                                <v-img :src="require('@/assets/currencies/eth.svg')"/>
                            </div>
                        </v-list-item-avatar>
                        <v-list-item-title class="list-item-disabled">
                            Ethereum (Soon)
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </v-row>
</template>

<script>
export default {
    name: "NetworkSelect",

    components: {},

    data: () => ({
        openedList: false,
    }),

    computed: {},

    methods: {}
}
</script>

<style scoped>

.network-select-list {
    background-color: var(--secondary) !important;
    border-radius: 10px;
    margin-top: 10px;
}

.network-select-list-item {
    color: white;
    font-weight: 600;
    font-size: 17px;
    margin-left: -5px;
}

.list-item-icon {
    width: 32px;
    height: 32px;
}

.list-item-disabled {
    color: rgba(255, 255, 255, 0.15);
    font-weight: 600;
    font-size: 17px;
    margin-left: -5px;
}

.btn-icon {
    width: 24px;
    height: 24px;
}

.network-select-btn {
    border-radius: 8px;
    background: linear-gradient(91.26deg, rgba(130, 71, 229, 0.0651) 0%, rgba(129, 71, 228, 0.8845) 0.01%, rgba(96, 39, 192, 0.8845) 100%) !important;
}

.btn-label {
    font-size: 16px;
    text-transform: none;
    margin-left: 10px;
    margin-right: 10px;
}

</style>
