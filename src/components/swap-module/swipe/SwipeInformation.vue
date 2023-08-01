<template>
    <div>
        <div class="info-container">
            <div class="info-header">
                Manage your liquidity with USD+ ️
            </div>
            <div class="info-body">
                <div class="info-item info-item-bordered">
                   <div class="row">
                       <div class="col-lg-4 col-md-4 col-sm-12">
                           <div class="info-image-container">
                               <img src="/assets/icon/swipe/experience/accomulate.svg"
                                    class="info-image"
                                    alt="swap">
                           </div>
                       </div>
                       <div class="col-lg-8 col-md-8 col-sm-12">
                           <div class="info-text">
                               1. The Swipe feature is designed for investors who accumulate a <span class="info-warn">significant amount</span> of stablecoins.
                           </div>
                       </div>
                   </div>
                </div>
                <div class="info-item info-item-bordered">
                    <div class="row">
                        <div class="col-lg-4 col-md-4 col-sm-12">
                            <div class="info-image-container">
                                <img src="/assets/icon/swipe/experience/potential-income.svg"
                                     class="info-image"
                                     alt="best">
                            </div>
                        </div>
                        <div class="col-lg-8 col-md-8 col-sm-12">
                            <div class="info-text">
                                2. On this page, all your stablecoins on the connected chain will be <span class="info-warn">automatically gathered</span>, and you will see their <span class="info-warn">potential profit</span> if you invest your stablecoins in USD+.
                            </div>
                        </div>
                    </div>
                </div>
                <div class="info-item">
                    <div class="row">
                        <div class="col-lg-4 col-md-4 col-sm-12">
                            <div class="info-image-container">
                                <img src="/assets/icon/swipe/experience/swap.svg"
                                     class="info-image"
                                     alt="mint">
                            </div>
                        </div>
                        <div class="col-lg-8 col-md-8 col-sm-12">
                            <div class="info-text">
                                3. If you don't have any stablecoins in your wallet, you can simply use the <span class="info-warn">Swap feature</span> to exchange any of your tokens for USD+.
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
    name: "SwapInformation"
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
