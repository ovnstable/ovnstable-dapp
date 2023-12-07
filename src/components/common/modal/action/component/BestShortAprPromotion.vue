<template>
    <div class="container-main py-2">
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
            <div v-if="initPool">
                <PoolLabel :pool="initPool" :isShort="true" />
            </div>
        </template>
    </div>
</template>

<script>
import PoolLabel from "@/components/zap/PoolLabel";
import { pool } from "@/components/mixins/pool";
import { mapActions } from "vuex";

export default {
    name: "BestShortAprPromotion",
    mixins: [pool],
    components: { PoolLabel },

    props: {
        initPool : {
            type: Object,
            required: false,
        }
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
    //box-shadow: 0 2px 3px 0px rgba(0, 0, 0, 0.2);
}

</style>
