<template>
  <v-app>
    <v-col lg="3" md="1" cols="2" sm="2" class="ml-0 pl-0 pl-5">
      <Logo/>
    </v-col>
    <router-view></router-view>
  </v-app>
</template>

<script>
import Logo from "@/components/common/header/Logo";

export default {
  name: "Discord",
  components: {Logo}
}
</script>

<style scoped>

</style>
