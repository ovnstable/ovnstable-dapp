<template>
    <div>
        <div class="page-container">
            <div>
                <HeaderComponent/>
            </div>
            <div>
                <BodyComponent/>
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
import BodyComponent from "@/components/presale/BodyComponent.vue";
import AllocationComponent from "@/components/presale/AllocationComponent.vue";
import DisclaimerComponent from "@/components/presale/DisclaimerComponent.vue";

export default {
    name: "PresaleView.vue",
    components: {
        DisclaimerComponent,
        AllocationComponent,
        BodyComponent,
        RoundInfoComponent,
        HeaderComponent
    }
}
</script>



<style scoped>

</style>
