<template>
    <div class="container-main pa-2" @click="openLink('https://app.overnight.fi/pools')">
        <v-row v-if="isPoolsLoading">
            <v-row align="center" justify="center" class="py-15">
                <v-progress-circular
                    width="2"
                    size="24"
                    color="#8FA2B7"
                    indeterminate
                ></v-progress-circular>
            </v-row>
        </v-row>
        <template v-if="!isPoolsLoading">
            <div v-if="topPool" class="container-title mt-1 mb-1">
                <label class="title">
                    Best APR of the day
                </label>
            </div>
            <div v-if="topPool">
                <PoolLabel :pool="topPool" />
            </div>
            <div class="container-subtitle mt-2">
                <label class="subtitle">
                    See all pools here
                </label>
                <div>
                    <v-img class="arrow-icon" :src="require('@/assets/icon/arrow-right.svg')"/>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import PoolLabel from "@/components/zap/PoolLabel";
import { pool } from "@/components/mixins/pool";
import { mapActions } from "vuex";

export default {
    name: "BestAprPromotion",
    mixins: [pool],
    components: { PoolLabel },

    props: {
    },

    data() {
        return {}
    },

    computed: {
    },

    mounted() {
        this.loadPools()
    },

    methods: {
        ...mapActions('track', ['trackClick']),

        openLink(url) {
            window.open(url, '_blank').focus();
            try {
                this.trackClick({action: 'go_to_all_pools_from_promotion', event_category: 'Click Link', event_label: 'Open Link To Featured' });
            } catch (e) {
                console.error("Track error:", e);
            }
        },
    }
};

</script>

<style scoped>
.container-main {
    display: flex;
    flex-direction: column;
    box-shadow: none;
    background-color: transparent;
    border-radius: 12px;
    cursor: pointer;
}

.container-main:hover {
    box-shadow: 0 2px 3px 0px rgba(0, 0, 0, 0.2);
}

.container-title {
    text-align: center;
}

.container-subtitle {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
}

.title {
    font-weight: 700;
    font-size: 24px;
    line-height: 36px;
    color: var(--main-gray-text);
}

.subtitle {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: var(--links-blue);
    cursor: pointer;
}

.arrow-icon {
    cursor: pointer;
}
</style>
