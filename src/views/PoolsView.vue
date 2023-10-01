<template>
    <div>
        <PoolsContainer :type="'ALL'"></PoolsContainer>
    </div>
</template>

<script>


import PoolsContainer from "@/components/pool/PoolsContainer.vue";

export default {
    name: "PoolsView",
    components: {
        PoolsContainer
    },

    data: () => ({

    }),

    computed: {

    },
    async mounted() {

    },

    methods: {

    }
}
</script>

<style scoped>

</style>
