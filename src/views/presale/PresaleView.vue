<template>
    <div>
        <div class="page-container">
            <div>
                <HeaderComponent/>
            </div>
            <div>
                <PresaleBodyComponent/>
            </div>
            <div>
                <RoundInfoComponent/>
            </div>
<!--            <div>
                <AllocationComponent/>
            </div>-->

            <div>
                <DisclaimerComponent/>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderComponent from "@/components/presale/HeaderComponent.vue";
import RoundInfoComponent from "@/components/presale/RoundInfoComponent.vue";
import PresaleBodyComponent from "@/components/presale/PresaleBodyComponent.vue";
import DisclaimerComponent from "@/components/presale/DisclaimerComponent.vue";
import {mapActions} from "vuex";

export default {
    name: "PresaleView.vue",
    components: {
        DisclaimerComponent,
        PresaleBodyComponent,
        RoundInfoComponent,
        HeaderComponent
    },
    methods: {
        ...mapActions('track', ['trackClick']),
    },
    mounted() {
        try {
            this.trackClick({action: 'presale_page_view', event_category: 'View page', event_label: 'View presale page' });
        } catch (e) {
            console.error("Track error:", e);
        }
    }
}
</script>



<style scoped>

</style>
