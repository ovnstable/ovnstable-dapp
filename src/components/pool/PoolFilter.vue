<template>
    <div>
        <div class="pool-filter-container">
            <div class="row">
                <div class="col-12 col-lg-6 -col-md-6 col-sm-12">
                    <div class="networks-container">
                        <div
                            @click="setSelectedTabFunc('ALL')"
                            :class="selectedTabs.includes('ALL') ? 'networks-item-selected' : ''"
                            class="networks-item">
                            ALL
                        </div>
                        <div
                            v-for="networkConfig in allNetworkConfigs" :key="networkConfig.networkName"
                            @click="setSelectedTabFunc(networkConfig.networkName)"
                            :class="selectedTabs.includes(networkConfig.networkName) ? 'networks-item-selected' : ''"
                            class="networks-item">
                            <img :src="`/assets/network/${networkConfig.networkName}.svg`"
                                 :alt="networkConfig.networkName"
                                 class="network-logo">
                        </div>
                    </div>
                </div>

                <div class="col-12 col-lg-6 -col-md-6 col-sm-12">

                    <div class="row">
                        <div class="col-4 col-lg-4 -col-md-4 col-sm-4">
                            <div
                                 class="filter-container text-center">
                                <v-checkbox
                                    @click="showWithZap(!isShowOnlyZap)"
                                    class="filter-item">
                                    <template v-slot:label>
                                        <span id="filter-title">
                                            Zappable
                                        </span>
                                    </template>
                                </v-checkbox>
                            </div>
                        </div>
                        <div class="col-4 col-lg-4 col-md-4 col-sm-4">
                            <div class="filter-container text-center">
                                <v-checkbox
                                    @click="showAprLimit(!isShowAprLimit)"
                                    class="filter-item"
                                >
                                    <template v-slot:label>
                                        <span id="filter-title">
                                            Over 15% APR
                                        </span>
                                    </template>
                                </v-checkbox>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import {mapGetters} from "vuex";

export default defineComponent({
    name: "PoolFilter",
    props: {
        selectedTabs: {
            type: Array,
            required: true
        },
        setSelectedTabFunc: {
            type: Function,
            required: true
        },
        zapFilterFunc: {
            type: Function,
            required: true
        },
        isShowOnlyZap: {
            type: Boolean,
            required: true
        },
        aprLimitFilterFunc: {
            type: Function,
            required: true
        },
        isShowAprLimit: {
            type: Boolean,
            required: true
        },
    },
    data() {
        return {
            aprLimitForFilter: 15,
        }
    },
    computed: {
        ...mapGetters('network', ['allNetworkConfigs']),
    },
    methods: {
        showWithZap(isShow) {
            this.zapFilterFunc(isShow);
        },
        showAprLimit(isShow) {
            this.aprLimitFilterFunc(isShow, this.aprLimitForFilter);
        },
    }
})
</script>


<style scoped>
.pool-filter-container {

}

.networks-container {
    display: flex;
}

.networks-item {
    padding: 10px 20px;
    border: 1px solid var(--network-tab);
    color: var(--main-gray-text);
    border-radius: 8px;

    width: 68px;
    height: 44px;
    display: inline-block;

    margin-right: 11px;
    cursor: pointer;
    position: relative;
}

.networks-item-selected {
    border: 2px solid #1C95E7;
    color: #1C95E7;
}

.network-logo {
    max-height: 27px;
    position: absolute;
    top: 7px;
}

.filter-container {
    cursor: pointer;
    color: var(--main-gray-text);
}

.filter-item {
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 28px;
    color: var(--main-gray-text)!important;
    cursor: pointer;
}

.filter-item label {
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 28px;
    color: var(--main-gray-text)!important;
    cursor: pointer;
}

#filter-title {
    color: var(--main-gray-text);
}
</style>