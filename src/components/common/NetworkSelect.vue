<template>
    <div class="pt-1 ml-5" style="width: 40px; height: 40px">
        <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
                <div class="btn-icon"
                     @click="openedList = !openedList"
                     style="display: flex"
                     v-bind="attrs"
                     v-on="on">
                    <v-img :src="require('@/assets/network/polygon.svg')"/>
                    <v-icon color="white">
                        {{ openedList ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                    </v-icon>
                </div>
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
    width: 32px;
    height: 32px;
}
</style>
