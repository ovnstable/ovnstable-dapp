<template>
  <div>
    <v-card-text class="px-5 pt-5">
      <v-row justify="center" class="mb-10">
        <div class="loading-img">
          <v-img :src="require('@/assets/icon/error-circle.svg')"/>
        </div>
      </v-row>

      <v-row justify="center">
        <label class="error-label mb-5">
          Error in estimating gas
        </label>

        <v-row>
          <label>
            Issue with settings of gas fees or gas limits in your wallet.
          </label>
        </v-row>
      </v-row>

      <template v-if="errorMsg">
        {{errorMsg && errorMsg.message ? errorMsg.message : ''}}
      </template>

      <v-row justify="center">
        <v-col>
          <v-row>
            Change gas settings in your wallet manually  or
          </v-row>
          <v-row>
            1. Change the input amount slightly
          </v-row>
          <v-row>
            2. Delete your cookies for the last several hours
          </v-row>

          <v-row>
            Useful article:
          </v-row>
          <v-row>
            What to do if your transaction is still stuck
          </v-row>
        </v-col>
      </v-row>

    </v-card-text>
  </div>
</template>

<script>
export default {
  name: "GasError",
  props: ["errorMsg"],

}
</script>

<style scoped>

</style>
