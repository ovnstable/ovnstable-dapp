<template>
    <div>

        1. make list of stablecoin when load coins
        2.
        <BaseSwapView
            :view-type="'SWIPE'"
        ></BaseSwapView>
    </div>
</template>

<script>

import BaseSwapView from "@/views/BaseSwapView.vue";

export default {
    name: "SwipeView",
    components: {
        BaseSwapView
    },
    data() {
        return {
        }
    },
    methods: {

    }
}
</script>

<style scoped>

</style>
