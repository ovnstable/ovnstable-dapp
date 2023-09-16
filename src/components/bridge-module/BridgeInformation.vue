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
                        <div class="col-lg-8 col-md-8 col-sm-12">
                            <div class="info-text">
                                2. Click on the 'Connect wallet' button in the <span class="info-warn"> top right corner of the bridge widget.</span>
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

export default defineComponent({
    name: "BridgeInformation"
})
</script>

<style scoped>
@media only screen and (max-width: 960px) {
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
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
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
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
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

.info-warn {
    font-weight: bold;
}

.info-image {
    height: 60px;
}


.info-image-container {
    text-align: center;
}
</style>
