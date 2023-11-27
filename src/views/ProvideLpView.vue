<template>
    <div>
        <PoolsContainer :type="'OVN'" />
    </div>
</template>

<script>


import PoolsContainer from "@/components/pool/PoolsContainer.vue";

export default {
    name: "ProvideLpView",
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
