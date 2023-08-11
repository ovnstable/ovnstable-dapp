<template>
    <div class="container-main">
        <div>
            <label class="container-title">
                Best APR of the day
            </label>
        </div>
        <div>
            <PoolLabel :pool="zapPool" />
        </div>
        <div>
            <v-btn>
                Zap in this pool
            </v-btn>
        </div>
    </div>
</template>

<script>
import PoolLabel from "@/components/zap/PoolLabel";

export default {
    name: "BestAprPromotion",
    components: { PoolLabel },

    props: {
        zapPool: {
            type: Object,
            required: false,
            default: null
        },
    },
    data() {
        return {}
    },
    computed: {

    }
};

</script>

<style scoped>

</style>