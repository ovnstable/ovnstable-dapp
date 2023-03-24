<template>
  <div>
    <v-card-text :class="$wu.isMobile() ? 'px-2 pt-2' : 'px-5 pt-5'">
      <v-row justify="center">
        <div class="loading-img">
          <v-img :src="require('@/assets/icon/error-circle.svg')"/>
        </div>
      </v-row>

      <v-row justify="center">
        <label class="error-label pt-5 pb-5">
          Error in your wallet
        </label>
      </v-row>

      <div v-if="errorMsg">
          <v-row class="error-message-container">
              <v-row justify="center" class="error-message">
                [ rpc error: code: {{errorCode}}. {{errorMsg}} ]
              </v-row>
          </v-row>
      </div>

      <v-row justify="center">
        <div class="info-container py-6 px-6">
          <v-row class="info-item">
            1. Check information in your wallet
          </v-row>
          <v-row class="info-item">
            2. Try to repeat the transaction after some time
          </v-row>

          <v-row class="info-item pt-4">
            Useful articles:
          </v-row>
          <v-row>
              <a href="https://overnight.fi/blog/2022/10/28/what-to-do-if-your-transaction-is-still-stuck/"
                 class="info-item-link pl-2"
                 target="_blank">
                  • What to do if your transaction is still stuck
              </a>
          </v-row>
          <v-row>
            <a href="https://docs.alchemy.com/docs/how-to-add-alchemy-rpc-endpoints-to-metamask"
               class="info-item-link pl-2"
               target="_blank">
                • How to Add Alchemy RPC Endpoints to Metamask
            </a>
          </v-row>
        </div>
      </v-row>

    </v-card-text>
  </div>
</template>

<script>
export default {
    name: "RpcError",
    props: ["errorMsg", 'errorCode'],

}
</script>

<style scoped>


/* mobile */
@media only screen and (max-width: 960px) {

    .error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 22px;
        line-height: 30px;
    }

}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 34px;
    }

    .info-container {
        min-width: 550px;
        min-height: 164px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 26px;
        line-height: 36px;
    }

    .info-container {
        min-width: 550px;
        min-height: 164px;
    }
}

.error-message-container {
    max-width: 534px;
    max-height: 200px;
    white-space: unset;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 15px;
    margin-bottom: 20px;
    border: 1px dashed #c9c9c9;
}

.error-message {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: var(--secondary-gray-text);
}

.info-container {
    min-width: 550px;
    min-height: 164px;

    background: var(--card-info-background);
    border-radius: 4px;
}

.info-item {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    color: var(--secondary-gray-text);

}

.info-item-link {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    cursor: pointer;
    text-decoration: none;

    color: #1C95E7;

}

.error-label {
    color: var(--secondary-gray-text);
}

</style>
