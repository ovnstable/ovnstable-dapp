<template>
  <v-container class="pt-16">
    <v-row justify="center">
      <h1>Verify your Discord account</h1>
    </v-row>
    <v-row justify="center">
      <h5>Simply connect your wallet and sign the transaction</h5>
    </v-row>
    <v-row justify="center" class="pt-5">
      <v-col cols="5">
        <v-card rounded shaped color="#F3F5F7">
          <v-card-title>
            <v-row justify="center" class="pt-7">
              <div style="width: 60px; height: 60px">
                <v-img :src="require('../../assets/discord/connect.png')"/>
              </div>
            </v-row>
          </v-card-title>
          <v-card-subtitle>
            <v-row justify="center" class="pt-7">
              Click the button below to connect your wallet
            </v-row>
          </v-card-subtitle>
          <v-card-text>
            <v-row justify="center" class="pt-10 pb-16">
              <v-btn min-height="50px" class="connect_button" rounded>Connect your wallet</v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ConnectWallet"
}
</script>

<style scoped>
  .connect_button {
    background: linear-gradient(91.26deg, #FE7F2D 0%, #FCCA46 100%);
    border-radius: 40px;
    color: #FFFFFF;
  }
</style>
