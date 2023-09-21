<template>
    <div>
        <div class="info-container">
            <div class="info-header">
                You can easily move Overnight tokens from one chain to another with just one click! Please follow the instructions below:
            </div>
            <div class="info-body">
                <div class="info-item info-item-bordered">
                   <div class="row">
                       <div class="col-lg-8 col-md-8 col-sm-12">
                           <div class="info-text">
                               1. Ensure that your wallet <span class="info-warn">is connected </span> to our dapp.
                           </div>
                       </div>
                   </div>
                </div>
                <div class="info-item info-item-bordered">
                    <div class="row">
                        <div class="col-lg-12 col-md-8 col-sm-12 second-info-block">
                            <div class="sub-text-container">
                                <div class="info-text">
                                    2. Click on the 'Connect wallet' button in the <span class="info-warn"> top right corner of the bridge widget.</span>
                                </div>
                                <div class="link-text" @click="openIfBridgeNotLoad = !openIfBridgeNotLoad">
                                    <label class="sub-info-text" @click="openIfBridgeNotLoad">The bridge widget doesn't load</label>
                                    <v-icon color="var(--links-blue)" class="mt-2">
                                        {{ openIfBridgeNotLoad ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                    </v-icon>
                                </div>
                                <div v-if="openIfBridgeNotLoad">
                                    <div class="list-text mt-5 mb-3">
                                        If the bridge widget <strong>doesn't load</strong>, please check your privacy settings:
                                        <ol class="mt-2">
                                            <li class="list-text">
                                                Allow the use of third-party cookies in your browser (e.g., chrome://settings/cookies).
                                            </li>
                                            <li class="list-text">
                                                Check settings for installed ad blockers.
                                            </li>
                                            <li class="list-text">
                                                Review your antivirus settings.
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                            <div v-if="this.light" class="image-container">
                                <svg width="293" height="130" viewBox="0 0 293 130" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <rect width="292.835" height="130" fill="url(#pattern0)"/>
                                    <defs>
                                        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                                            <use xlink:href="#image0_10574_59346" transform="scale(0.00228833 0.00515464)"/>
                                        </pattern>
                                        <image id="image0_10574_59346" width="437" height="194" xlink:href="data:image/png;base64,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"/>
                                    </defs>
                                </svg>
                            </div>
                            <div v-else class="image-container">
                                <v-img class="dark_theme_img" :src="require('@/assets/bridge/bridge_help.svg')"></v-img>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="info-item info-item-bordered">
                    <div class="row">
                        <div class="col-lg-8 col-md-8 col-sm-12">
                            <div class="info-text">
                                3. Choose from <span class="info-warn"> which chain and which token </span> you want to move.
                            </div>
                        </div>
                    </div>
                </div>
                <div class="info-item info-item-bordered">
                    <div class="row">
                        <div class="col-lg-8 col-md-8 col-sm-12">
                            <div class="info-text">
                                4. Enter the required <span class="info-warn">amount.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="info-item info-item-bordered">
                    <div class="row">
                        <div class="col-lg-8 col-md-8 col-sm-12">
                            <div class="info-text">
                                5. Enter <span class="info-warn">the chain </span> to which you want to transfer.
                            </div>
                        </div>
                    </div>
                </div>
                <div class="info-item info-item-bordered">
                    <div class="row">
                        <div class="col-lg-8 col-md-8 col-sm-12">
                            <div class="info-text">
                                6. You can also <span class="info-warn"> select a different token and wallet</span> for the transfer.
                            </div>
                        </div>
                    </div>
                </div>
                <div class="info-item">
                    <div class="row">
                        <div class="col-lg-8 col-md-8 col-sm-12">
                            <div class="info-text">
                                7. Click the <span class="info-warn">'Bridge'</span> button."
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import { mapGetters } from "vuex";

export default defineComponent({
    name: "BridgeInformation",

    data: () => ({
        openIfBridgeNotLoad: false,
    }),

    computed: {
        ...mapGetters('theme', ['light']),

    }
})
</script>

<style scoped>
@media only screen and (max-width: 1400px) {
    .info-container {
        padding: 20px 20px 10px;
        text-align: center;
    }

    .info-header {
        font-size: 24px;
        line-height: 36px;
    }

    .info-item {
        padding-top: 28px;
        padding-bottom: 28px;
    }

    .info-text {
        font-size: 16px;
        line-height: 24px;
    }

    .sub-info-text {
        font-size: 16px;
        line-height: 24px;
        margin-left: 40px;
    }

    .second-info-block {
        display: flex;
        flex-direction: column;
    }

    .image-container {
        margin-left: 5px !important;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .info-container {
        padding: 40px;
        text-align: left;
    }

    .info-header {
        font-size: 30px;
        line-height: 40px;
    }

    .info-item {
        padding-top: 28px;
        padding-bottom: 28px;
    }

    .info-text {
        font-size: 18px;
        line-height: 28px;
    }

    .sub-info-text {
        font-size: 18px;
        line-height: 28px;
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .info-container {
        padding: 30px;
        text-align: left;

    }

    .info-header {
        font-size: 22px;
        line-height: 36px;
    }

    .info-item {
        padding-top: 18px;
        padding-bottom: 18px;
    }

    .info-text {
        font-size: 16px;
        line-height: 22px;
    }

    .sub-info-text {
        font-size: 15px;
        line-height: 20px;
    }

    .second-info-block {
        display: flex;
    }

    .sub-info-text {
        margin-top: 1px;
    }

    .link-text {
        display: flex;
        align-items: center;
    }

    .help-info-text {
        font-family: "Roboto", sans-serif;
        font-size: 14px;
        line-height: 22px;
        font-weight: 400;
    }
}
div {
    font-family: 'Roboto',serif;
}

.info-container {
    background: var(--secondary);
    border-radius: 28px;
}

.info-header {
    font-style: normal;
    font-weight: 400;
    color: var(--main-gray-text);
}

.info-body {

}

.info-item {

}

.info-item-bordered {
    border-bottom: 1px solid #DEE1E5;;
}

.info-text {
    font-style: normal;
    font-weight: 400;
    color: var(--main-gray-text);
}

.list-text {
    font-style: normal;
    font-weight: 400;
    color: var(--main-gray-text)
}

.info-warn {
    font-weight: bold;
}

.info-image {
    height: 60px;
}


.info-image-container {
    text-align: center;
}

.second-info-block {
    display: flex;
}

.sub-text-container {
    display: flex;
    flex-direction: column;
}

.sub-info-text {
    font-style: normal;
    font-weight: 400;
    color: var(--links-blue);
    cursor: pointer;
    margin-top: 10px;
}

.link-text {
    display: flex;
    align-items: center;
    margin-top: 10px !important;
}

.help-info-text {
    font-family: "Roboto", sans-serif;
    font-size: 14px;
    line-height: 22px;
    font-weight: 400;
}

.dark_theme_img {
    width: 290px;
    height: auto;
}
</style>
