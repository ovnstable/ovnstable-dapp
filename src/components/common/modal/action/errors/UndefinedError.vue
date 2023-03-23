<template>
  <div>
    <v-card-text class="px-5 pt-5">
      <v-row justify="center" class="mb-10">
        <div class="loading-img">
          <v-img :src="require('@/assets/icon/error-circle.svg')"/>
        </div>
      </v-row>

      <v-row justify="center">
        <label class="error-label mb-5">Transaction execution error</label>
      </v-row>

      <template v-if="errorMsg">
        <v-tooltip
            v-model="showCopyTooltipContainer"
            color="#202832"
            bottom
        >
          <template v-slot:activator="{on}">
            <v-container class="error-container" @click="copyErrorToClipboard('container')">
              <v-row class="mt-8 error-container-row" justify="center">
                <label class="error-msg-title">Error message</label>
              </v-row>
              <v-row class="mt-4 error-container-row" justify="center">
                <v-col class="ma-n3">
                  <label class="error-msg-value">{{ errorMsg.message }}</label>
                </v-col>
              </v-row>

              <v-row class="mt-8 error-container-row">
                <v-spacer></v-spacer>
                <label class="error-msg-title">From</label>
                <v-spacer></v-spacer>
                <label class="error-msg-title">To</label>
                <v-spacer></v-spacer>
              </v-row>
              <v-row class="mt-4 mb-8 error-container-row">
                <v-spacer></v-spacer>
                <label class="error-msg-value">{{ shortAddress(errorMsg.from) }}</label>
                <v-spacer></v-spacer>
                <label class="error-msg-value">{{ shortAddress(errorMsg.to) }}</label>
                <v-spacer></v-spacer>
              </v-row>
            </v-container>
          </template>
          <p class="my-0">Copied!</p>
        </v-tooltip>
      </template>

      <v-row justify="center">
        <label class="discord-label">Error report has been automatically logged.</label>
      </v-row>

      <v-row justify="center" class="mb-5">
        <label class="discord-label">Please,&nbsp;</label>
        <v-tooltip
            v-if="errorMsg"
            v-model="showCopyTooltip"
            color="#202832"
            bottom
        >
          <template v-slot:activator="{on}">
            <label class="discord-link" @click="copyErrorToClipboard('link')">copy the full error</label>
          </template>
          <p class="my-0">Copied!</p>
        </v-tooltip>
        <label class="discord-label" v-if="errorMsg">&nbsp;and&nbsp;</label>
        <label class="discord-label">contact our&nbsp;</label>
        <label class="discord-link" @click="openDiscord">Discord Support</label>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
export default {
  name: "UndefinedError",
  props: ["errorMsg"],

  data() {
    return {
      showCopyTooltip: false,
      showCopyTooltipContainer: false,
    }
  },
  methods: {
    openDiscord() {
      window.open(`https://discord.gg/overnight-fi`, '_blank').focus();
    },

    async copyErrorToClipboard(copyTooltip) {
      if (copyTooltip === 'container') {
        this.showCopyTooltipContainer = true;
      }
      if (copyTooltip === 'link') {
        this.showCopyTooltip = true;
      }

      await navigator.clipboard.writeText(JSON.stringify(this.errorMsg));

      await new Promise(resolve => setTimeout(resolve, 1000));

      if (copyTooltip === 'container') {
        this.showCopyTooltipContainer = false;
      }
      if (copyTooltip === 'link') {
        this.showCopyTooltip = false;
      }
    },
    shortAddress(address) {
      if (address) {
        return address.substring(0, 5) + '...' + address.substring(address.length - 4);
      } else {
        return null;
      }
    },
  }
}
</script>

<style scoped>

</style>
