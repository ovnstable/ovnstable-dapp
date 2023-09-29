<template>
    <div>
        <div class="mt-10 mb-2">
            <label class="title-label">Bridge</label>
        </div>

        <div class="body-container">
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
            <div class="info-container">
                <BridgeInformation />
            </div>
        </div>

    </div>
</template>

<script>
import {defineComponent} from 'vue'
import { mapActions, mapGetters } from "vuex";
import BridgeInformation from "@/components/bridge-module/BridgeInformation";

export default defineComponent({
    name: "Bridge",

    components: {
        BridgeInformation,
    },

    props: {
    },

    data: () => ({
        isIframeLoaded: false,
        link: "",
        allConfigs: {
            widgetConfig: {
                integratorId: "overnight-swap-widget",
                companyName: "Overnight",
                style: {
                    neutralContent: "#29323e",
                    baseContent: "#29323e",
                    base100: "#e5e7ea",
                    base200: "#f5f5f5",
                    base300: "#ffffff",
                    error: "#ED6A5E",
                    warning: "#FFB155",
                    success: "#2EAEB0",
                    primary: "#e5e7ea",
                    secondary: "#ffffff",
                    secondaryContent: "#ffffff",
                    neutral: "#ffffff",
                    roundedBtn: "26px",
                    roundedCornerBtn: "999px",
                    roundedBox: "1rem",
                    roundedDropDown: "20rem",
                },
                slippage: 0.5,
                infiniteApproval: false,
                enableExpress: true,
                apiUrl: "https://v2.api.squidrouter.com",
                comingSoonChainIds: [],
                titles: {
                    swap: "Bridge",
                    settings: "Settings",
                    wallets: "Wallets",
                    tokens: "Select Token",
                    chains: "Select Chains",
                    history: "History",
                    transaction: "Transaction",
                    allTokens: "Select Token",
                    destination: "Destination address"
                },
                priceImpactWarnings: {
                    warning: 3,
                    critical: 5
                },
                showOnRampLink: true,
                initialFromChainId: "8453",
                initialToChainId: "10",
                defaultTokens: [
                    {
                        chainId: "8453",
                        address: "0xA3d1a8DEB97B111454B294E2324EfAD13a9d8396",
                        symbol: "OVN",
                        name: "OVN"
                    },
                    {
                        chainId: "10",
                        address: "0x3b08fcd15280e7B5A6e404c4abb87F7C774D1B2e",
                        symbol: "OVN",
                        name: "OVN"
                    }
                ]
            },
            widgetConfigForDarkTheme: {
                integratorId: "overnight-swap-widget",
                companyName: "Overnight",
                style: {
                    neutralContent: "#ffffff",
                    baseContent: "#ffffff",
                    base100: "#3d4657",
                    base200: "#29323e",
                    base300: "#1d2029",
                    error: "#ED6A5E",
                    warning: "#FFB155",
                    success: "#2EAEB0",
                    primary: "#3d4657",
                    secondary: "#d9d8e4",
                    secondaryContent: "#F6F7FB",
                    neutral: "#1d2029",
                    roundedBtn: "8px",
                    roundedCornerBtn: "999px",
                    roundedBox: "12px",
                    roundedDropDown: "8px"
                },
                slippage: 0.5,
                infiniteApproval: false,
                enableExpress: true,
                apiUrl: "https://v2.api.squidrouter.com",
                comingSoonChainIds: [],
                titles: {
                    swap: "Bridge",
                    settings: "Settings",
                    wallets: "Wallets",
                    tokens: "Select Token",
                    chains: "Select Chain",
                    history: "History",
                    transaction: "Transaction",
                    allTokens: "Select Token",
                    destination: "Destination address"
                },
                priceImpactWarnings: {
                    warning: 3,
                    critical: 5
                },
                showOnRampLink: true,
                initialFromChainId: "8453",
                initialToChainId: "10",
                defaultTokens: [
                    {
                        chainId: "8453",
                        address: "0xA3d1a8DEB97B111454B294E2324EfAD13a9d8396",
                        symbol: "OVN",
                        name: "OVN"
                    },
                    {
                        chainId: "10",
                        address: "0x3b08fcd15280e7B5A6e404c4abb87F7C774D1B2e",
                        symbol: "OVN",
                        name: "OVN"
                    }
                ]
            }
        }
    }),

    computed: {
        ...mapGetters('theme', ['light']),
    },

    mounted() {
        this.updateLink();

        try {
            this.trackClick({action: 'bridge_page_view', event_category: 'Page view', event_label: 'Bridge page view' });
        } catch (e) {
            console.error("Track error:", e);
        }
    },

    watch: {
        light: function (newVal, oldVal) {
            this.updateLink();
        },
    },

    methods: {
        ...mapActions('track', ['trackClick']),

        updateLink() {
            if (this.light) {
                // Light theme link config
                this.link = this.generateIframeURL(this.allConfigs.widgetConfig);
                console.log("Widget White Theme Link:", this.link);
            } else {
                // Dark theme link config
                this.link = this.generateIframeURL(this.allConfigs.widgetConfigForDarkTheme);
                console.log("Widget Dark Theme Link:", this.link);
            }
        },

        generateIframeURL(config) {
            const encodedConfig = encodeURIComponent(JSON.stringify(config));

            return `https://squid-widget-git-main-v2-0xsquid.vercel.app/iframe?config=${encodedConfig}`;
        },

        handleIframeLoad(link) {
            this.isIframeLoaded = true;
            console.log(`Iframe loaded with link: ${link}`);
        },
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

    .body-container {
        display: flex;
        flex-direction: column;
        gap: 50px;
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

.loader-container {
    min-height: 40px;
}

.body-container {
    display: flex;
    gap: 50px;
}
</style>
