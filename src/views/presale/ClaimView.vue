<template>
    <div>
        <div class="page-container">
            <div>
                <ClaimHeaderComponent/>
            </div>
            <div>
                <ClaimBodyComponent/>
            </div>
        </div>
    </div>
</template>

<script>
import ClaimBodyComponent from "@/components/presale/ClaimBodyComponent.vue";

import {mapActions} from "vuex";
import ClaimHeaderComponent from "@/components/presale/ClaimHeaderComponent.vue";

export default {
    name: "ClaimView.vue",
    components: {
        ClaimHeaderComponent,
        ClaimBodyComponent,
    },
    methods: {
        ...mapActions('track', ['trackClick']),
    },
    mounted() {
        try {
            this.trackClick({action: 'claim_page_view', event_category: 'View page', event_label: 'View claim page' });
        } catch (e) {
            console.error("Track error:", e);
        }
    }
}
</script>



<style scoped>

</style>
