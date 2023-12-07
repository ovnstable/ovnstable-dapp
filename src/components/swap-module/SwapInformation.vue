<template>
  <div class="info-part">
    <div class="info-container">
      <div class="info-header">Experience seamless Overnight token swap</div>
      <div class="info-body">
        <div class="info-item info-item-bordered">
          <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-12">
              <div class="info-image-container">
                <img
                  :src="require('@/assets/icon/swap/experience/swap.svg')"
                  class="info-image"
                  alt="swap"
                />
              </div>
            </div>
            <div class="col-lg-8 col-md-8 col-sm-12">
              <div class="info-text">
                1. On this page, you can
                <span class="info-warn">easily swap Overnight tokens</span> with
                any other digital assets of your choice and vice versa.
              </div>
            </div>
          </div>
        </div>
        <div class="info-item info-item-bordered">
          <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-12">
              <div class="info-image-container">
                <img
                  :src="require('@/assets/icon/swap/experience/best.svg')"
                  class="info-image"
                  alt="best"
                />
              </div>
            </div>
            <div class="col-lg-8 col-md-8 col-sm-12">
              <div class="info-text">
                2. Smart technology of our service ensures that you get
                <span class="info-warn">the best possible route</span> by
                identifying the optimal combination of minting, redeeming, and
                swapping, all within a single transaction.
              </div>
            </div>
          </div>
        </div>
        <div class="info-item">
          <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-12">
              <div class="info-image-container">
                <img
                  :src="require('@/assets/icon/swap/experience/mint.svg')"
                  class="info-image"
                  alt="mint"
                />
              </div>
            </div>
            <div class="col-lg-8 col-md-8 col-sm-12">
              <div class="info-text">
                3. If you prefer to
                <span class="info-warn">mint or redeem</span> Overnight tokens
                directly, simply head over to our dedicated tab “Mint/Redeem v.
                1.0”.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "SwapInformation"
});
</script>

<style scoped>
.info-part,
.info-container {
  height: 100%;
}
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

@media only screen and (min-width: 1300px) {
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
  border-bottom: 1px solid #dee1e5;
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
