<template>
    <div>
        <BaseSwapView
            :view-type="'SWAP'"
        />
    </div>
</template>

<script>
import BaseSwapView from "@/views/BaseSwapView.vue";

export default {
    name: "SwapView",
    components: {
        BaseSwapView
    }
}
</script>

<style scoped>

</style>
