<template>
    <v-container>
        <v-row justify="center">
            <h1>Finance</h1>
        </v-row>
        <ChangeWeightPanel/>

        <v-col lg="5">
            <AbroadControl/>
        </v-col>
    </v-container>
</template>

<script>
import ChangeWeightPanel from "../../components/governance/ChangeWeightPanel";
import AbroadControl from "@/components/governance/control/AbroadControl";

export default {
    name: "Finance",
    components: {AbroadControl, ChangeWeightPanel},

}
</script>

<style scoped>

</style>
