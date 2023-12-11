<template>
    <div  class="main-container" :class="$wu.isMobile() ? 'px-2 pt-2' : 'px-5 pt-5'">
        <div class="loading-img">
            <v-img :src="require('@/assets/icon/error-circle.svg')"/>
        </div>

        <label class="error-label pt-5 pb-5">
            Undefined error
        </label>

        <div v-if="errorMsg" class="error-message-container">
            <div class="copy-container"  @click="copyErrorToClipboard('link', errorMsg)">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                >
                    <g transform="translate(24 0) scale(-1 1)">
                        <path
                            fill="var(--links-blue)"
                            d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"/>
                    </g>
                </svg>
                <div class="copied-message" v-if="isCopied">Copied to Clipboard</div>
            </div>
            <div class="error-message">
                {{errorMsg.message ? errorMsg.message : errorMsg}}
            </div>
        </div>

        <div class="info-container py-3 px-3">
            <label class="discord-label">Please, make a ticket in our Discord&nbsp;&nbsp;</label>
            <label class="discord-link" @click="openDiscord"># | submit-ticket</label>
        </div>
    </div>
</template>

<script>
export default {
  name: "UndefinedError",
  props: ["errorMsg", "copyError"],

  data() {
    return {
      showCopyTooltip: false,
      showCopyTooltipContainer: false,
      isCopied: false,
    }
  },
  methods: {
    openDiscord() {
      window.open(`https://discord.com/channels/933003627444969552/967813123149033542/967813482684760135/`, '_blank').focus();
    },

    shortAddress(address) {
      if (address) {
        return address.substring(0, 5) + '...' + address.substring(address.length - 4);
      } else {
        return null;
      }
    },
    copyErrorToClipboard(copyTooltip, errorMsg) {
        if (typeof this.copyError === 'function') {
          this.copyError(copyTooltip, errorMsg);

          this.isCopied = true;
          console.log(this.isCopied);

          setTimeout(() => {
              this.isCopied = false;
          }, 2000); // 2000 milliseconds (2 seconds)
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
        font-size: 20px;
        line-height: 30px;
    }

    .error-message-container {
        max-width: 300px;
        max-height: 100px;

        padding-left: 5px;
        margin-bottom: 10px;
        border: 1px dashed #c9c9c9;
    }

    .error-message {
        font-size: 14px;
        line-height: 24px;
    }

    .loading-img {
        width: 80px;
    }


    .copy-container {
        right: 50px;
    }

    .copied-message {
        top: -5px;
        right: 25px; /* Adjust the position as per your design */
        height: 30px;
        min-width: 145px;
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

    .error-message-container {
        max-width: 534px;
        max-height: 160px;

        padding: 5px;
        margin-bottom: 10px;
        border: 1px dashed #c9c9c9;
    }

    .error-message {
        font-size: 16px;
        line-height: 24px;
    }

    .loading-img {
        width: 100px;
    }

    .copy-container {
        right: 65px;
    }

    .copied-message {
        top: -5px;
        right: 25px; /* Adjust the position as per your design */
        height: 30px;
        min-width: 145px;
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

    .error-message-container {
        max-width: 534px;
        max-height: 160px;

        padding: 5px;
        margin-bottom: 10px;
        border: 1px dashed #c9c9c9;
    }

    .error-message {
        font-size: 16px;
        line-height: 24px;
    }

    .loading-img {
        width: 100px;
    }

    .copy-container {
        right: 65px;
    }

    .copied-message {
        top: -5px;
        right: 25px; /* Adjust the position as per your design */
        height: 30px;
        min-width: 145px;
    }
}

.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: left;
}

.error-message-container {
    white-space: unset;
    overflow-x: hidden;
    overflow-y: auto;

    margin-bottom: 10px;
    border: 1px dashed #c9c9c9;
    text-align: left;
}

.error-message {
    font-style: normal;
    font-weight: 400;
    color: var(--secondary-gray-text);
}

.info-container {
    background: var(--card-info-background);
    border-radius: 4px;
    text-align: center;
}

.info-item {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    color: var(--secondary-gray-text);

}

.info-item-link {
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

.copy-container {
    background-color: transparent;
    height: 25px;
    width: 25px;

    margin-left: auto;

    position: absolute;
}

.copy-container:hover {
    background-color: var(--card-banner-status-container);
}

.copied-message {
    position: absolute;
    color: #FFFFFF;
    opacity: 1;
    transition: opacity 0.3s;

    background-color: var(--links-blue);
    padding: 5px 10px;
    border-radius: 10px;

    font-size: 14px;
    font-weight: 500;
}



</style>
