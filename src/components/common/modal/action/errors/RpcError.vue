<template>
    <div class="main-container" :class="$wu.isMobile() ? 'px-2 pt-2' : 'px-5 pt-5'">
        <div class="loading-img">
            <v-img :src="require('@/assets/icon/error-circle.svg')"/>
        </div>

        <label class="error-label pb-5">
            Error in your wallet
        </label>

        <div v-if="errorMsg" class="error-message-container">
            <div class="copy-container" style="border: 1px solid red; height: 50px">
                <v-icon @click="copyErrorToClipboard('link', errorMsg)">
                    <svg xmlns="http://www.w3.org/2000/svg"
                         width="22"
                         height="22"
                         viewBox="0 0 512 512">
                        <path fill="#1d2029" d="M408 432h-32v32H112V136h32v-32H80v392h328v-64z"/>
                        <path fill="#1d2029" d="M176 16v384h320V153.373L358.627 16Zm288 352H208V48h104v152h152Zm0-200H344V48h1.372L464 166.627Z"/>
                    </svg>
                </v-icon>
            </div>
            <div class="error-message">
                [ rpc error: code: {{errorCode}}. {{errorMsg}} ]
            </div>
        </div>

        <div class="info-container " :class="$wu.isMobile() ? 'pa-2 pt-4' : 'pa-5'">
            <div class="info-item" :class="$wu.isMobile() ? 'pl-2 mb-1' : ''">
                1. Check information in your wallet
            </div>
            <div class="info-item" :class="$wu.isMobile() ? 'mb-2 pl-2' : ''">
                2. Try to repeat the transaction after some time
            </div>

            <div class="info-item" :class="$wu.isMobile() ? 'pl-2' : 'pt-4'">
                Useful articles:
            </div>
            <div>
                <a
                    href="https://overnight.fi/blog/2022/10/28/what-to-do-if-your-transaction-is-still-stuck/"
                    class="info-item-link"
                    :class="$wu.isMobile() ? 'pl-2' : 'pl-2'"
                    target="_blank"
                >
                  • What to do if your transaction is still stuck
                </a>
            </div>
            <div>
                <a
                    href="https://docs.alchemy.com/docs/how-to-add-alchemy-rpc-endpoints-to-metamask"
                    class="info-item-link"
                    :class="$wu.isMobile() ? 'pl-2' : 'pl-2'"
                    target="_blank"
                >
                    • How to Add Alchemy RPC Endpoints to Metamask
                </a>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: "RpcError",
    props: {
        errorMsg: String,
        errorCode: Number,
        copyError: Function,
    },

    methods: {
        copyErrorToClipboard(copyTooltip, errorMsg) {
            if (typeof this.copyError === 'function') {
                this.copyError(copyTooltip, errorMsg);
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

    .error-message {
        font-size: 14px;
        line-height: 24px;
    }

    .info-item {
        font-size: 14px;
        line-height: 18px;
    }

    .info-item-link {
        font-size: 14px;
        line-height: 18px;
    }

    .loading-img {
        width: 80px;
    }

    .info-container {
        min-width: 300px;
        min-height: 164px;
    }

    .error-message-container {
        max-width: 300px;
        max-height: 100px;

        padding-left: 5px;
        margin-bottom: 10px;
        border: 1px dashed #c9c9c9;
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

    .error-message {
        font-size: 16px;
        line-height: 24px;
    }

    .info-item {
        font-size: 16px;
        line-height: 24px;
    }

    .info-item-link {
        font-size: 16px;
        line-height: 24px;
    }

    .loading-img {
        width: 100px;
    }

    .error-message-container {
        max-width: 534px;
        max-height: 160px;

        padding: 5px;
        margin-bottom: 10px;
        border: 1px dashed #c9c9c9;
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

    .error-message {
        font-size: 16px;
        line-height: 24px;
    }

    .info-item {
        font-size: 16px;
        line-height: 24px;
    }

    .info-item-link {
        font-size: 16px;
        line-height: 24px;
    }

    .loading-img {
        width: 100px;
    }

    .error-message-container {
        max-width: 534px;
        max-height: 160px;

        padding: 5px;
        margin-bottom: 10px;
        border: 1px dashed #c9c9c9;
    }
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
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    color: var(--secondary-gray-text);
}

.info-container {
    background: var(--card-info-background);
    border-radius: 4px;
}

.info-item {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    color: var(--secondary-gray-text);
}

.info-item-link {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    cursor: pointer;
    text-decoration: none;

    color: #1C95E7;
}

.error-label {
    color: var(--secondary-gray-text);
}

.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: left;
}

.copy-container {
    background-color: transparent;
}

</style>
