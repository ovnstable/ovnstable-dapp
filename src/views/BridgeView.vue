<template>
    <div>
        <div class="mt-10 mb-2">
            <label class="title-label">Bridge</label>
        </div>

        <div class="bridge-container">
            <div v-if="!isIframeLoaded" class="loader-container">
                <v-row align="center" justify="center">
                    <v-progress-circular
                        width="2"
                        size="24"
                        color="#8FA2B7"
                        indeterminate
                    ></v-progress-circular>
                </v-row>
            </div>
            <div class="iframe-container">
                <iframe id="iframe"
                        style="border: none;"
                        title="squid_widget"
                        width="482" height="690"
                        :src="link"
                        @load="handleIframeLoad(link)">
                </iframe>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
    name: "Bridge",

    components: {
    },

    props: {
    },

    data: () => ({
        isIframeLoaded: false,
        link: "https://widget.squidrouter.com/iframe?config=%7B%22integratorId%22%3A%22squid-swap-widget%22%2C%22companyName%22%3A%22Custom%22%2C%22style%22%3A%7B%22neutralContent%22%3A%22%2329323e%22%2C%22baseContent%22%3A%22%2329323e%22%2C%22base100%22%3A%22%23e5e7ea%22%2C%22base200%22%3A%22%23f5f5f5%22%2C%22base300%22%3A%22%23ffffff%22%2C%22error%22%3A%22%23ED6A5E%22%2C%22warning%22%3A%22%23FFB155%22%2C%22success%22%3A%22%232EAEB0%22%2C%22primary%22%3A%22%23e5e7ea%22%2C%22secondary%22%3A%22%23ffffff%22%2C%22secondaryContent%22%3A%22%23ffffff%22%2C%22neutral%22%3A%22%23ffffff%22%2C%22roundedBtn%22%3A%22999px%22%2C%22roundedCornerBtn%22%3A%22999px%22%2C%22roundedBox%22%3A%221rem%22%2C%22roundedDropDown%22%3A%22999px%22%7D%2C%22slippage%22%3A1.5%2C%22infiniteApproval%22%3Afalse%2C%22enableExpress%22%3Atrue%2C%22apiUrl%22%3A%22https%3A%2F%2Fapi.squidrouter.com%22%2C%22comingSoonChainIds%22%3A%5B%5D%2C%22titles%22%3A%7B%22swap%22%3A%22Swap%22%2C%22settings%22%3A%22Settings%22%2C%22wallets%22%3A%22Wallets%22%2C%22tokens%22%3A%22Select%20Token%22%2C%22chains%22%3A%22Select%20Chain%22%2C%22history%22%3A%22History%22%2C%22transaction%22%3A%22Transaction%22%2C%22allTokens%22%3A%22Select%20Token%22%2C%22destination%22%3A%22Destination%20address%22%7D%2C%22priceImpactWarnings%22%3A%7B%22warning%22%3A3%2C%22critical%22%3A5%7D%2C%22showOnRampLink%22%3Atrue%7D",
    }),

    computed: {

    },

    methods: {
        handleIframeLoad(link) {
            this.isIframeLoaded = true;
            console.log(`Iframe loaded with link: ${link}`);
        }
    }
})

</script>

<style scoped>
/* mobile */
@media only screen and (max-width: 960px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 32px;
        line-height: 40px;
    }

    .bridge-container {
        max-width: 380px;
        padding: 20px 0;
    }

    iframe {
        max-width: 340px;
    }

    .loader-container {
        padding-top: 10px;
        padding-left: 350px;
        min-height: 40px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .bridge-container {
        max-width: 500px;
    }

    .iframe-container {
        padding-top: 20px;
    }

    iframe {
        max-width: 400px;
    }

    .loader-container {
        padding-top: 10px;
        padding-left: 410px;
        min-height: 40px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .bridge-container {
        max-width: 520px;
        padding-left: 40px;
    }

    .iframe-container {
        padding-top: 20px;
    }

    iframe {
        max-width: 500px;
    }

    .loader-container {
        padding-top: 10px;
        padding-left: 450px;
        min-height: 40px;
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 48px;
        line-height: 60px;
    }

    .bridge-container {
        max-width: 520px;
        padding-left: 40px;
    }

    .iframe-container {
        padding-top: 20px;
    }

    iframe {
        max-width: 500px;
    }

    .loader-container {
        padding-top: 10px;
        padding-left: 450px;
        min-height: 40px;
    }
}

.title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.bridge-container {
    background: var(--swap-main-banner-background);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
    border-radius: 28px;

    display: flex;
    align-items: center;
    justify-content: center;
}
</style>