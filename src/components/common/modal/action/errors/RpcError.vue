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
          Error in your wallet
        </label>
      </v-row>

      <template v-if="errorMsg">
        {{errorMsg && errorMsg.message ? errorMsg.message : ''}}
      </template>

      <v-row justify="center">
        <v-col>
          <v-row>
            Check information in your wallet
          </v-row>
          <v-row>
            Try to repeat the transaction after some time
          </v-row>

          <v-row>
            Useful articles:
          </v-row>
          <v-row>
            What to do if your transaction is still stuck
          </v-row>
          <v-row>
            How to Add Alchemy RPC Endpoints to Metamask
          </v-row>
        </v-col>
      </v-row>

    </v-card-text>
  </div>
</template>

<script>
export default {
  name: "RpcError",
  props: ["errorMsg"],

}
</script>

<style scoped>

</style>
