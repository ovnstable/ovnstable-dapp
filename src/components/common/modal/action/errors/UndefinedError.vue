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
                  Undefined error
              </label>
          </v-row>

          <div v-if="errorMsg">
              <v-row class="error-message-container">
                  <v-row justify="center" class="error-message">
                      {{errorMsg.message ? errorMsg.message : errorMsg}}
                  </v-row>
              </v-row>
          </div>

          <v-row justify="center">
              <div class="info-container py-3 px-3">
                  <label class="discord-label">Please, make a ticket in our Discord&nbsp;&nbsp;</label>
                  <label class="discord-link" @click="openDiscord"># | submit-ticket</label>
              </div>
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
    background: var(--card-info-background);
    border-radius: 4px;
    text-align: center;
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


.discord-link {
    cursor: pointer;
    color: var(--links-blue);
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
}

.discord-link:hover {
    text-decoration: underline;
}


.discord-label {
    color: var(--secondary-gray-text);
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
}

.error-label {
    color: var(--secondary-gray-text);
}

</style>
