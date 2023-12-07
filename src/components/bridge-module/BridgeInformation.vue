<template>
  <div>
    <div class="info-container">
      <div class="info-header">
        You can easily move Overnight tokens from one chain to another with just
        one click! Please follow the instructions below:
      </div>
      <div class="info-body">
        <div class="info-item info-item-bordered">
          <div class="row">
            <div class="col-lg-8 col-md-8 col-sm-12">
              <div class="info-text">
                1. Ensure that your wallet
                <span class="info-warn">is connected </span> to our dapp.
              </div>
            </div>
          </div>
        </div>
        <div class="info-item info-item-bordered">
          <div class="row">
            <div class="col-lg-12 col-md-8 col-sm-12 second-info-block">
              <div class="sub-text-container">
                <div class="info-text">
                  2. Click on the 'Connect wallet' button in the
                  <span class="info-warn">
                    top right corner of the bridge widget.</span
                  >
                </div>
                <div
                  class="link-text mb-4"
                  @click="openIfBridgeNotLoad = !openIfBridgeNotLoad"
                >
                  <label class="sub-info-text" @click="openIfBridgeNotLoad"
                    >The bridge widget doesn't load</label
                  >
                  <div class="ml-2">
                    <img class="bridge_open_info"
                    :src="openIfBridgeNotLoad ? require('@/assets/icon/up_blue.svg') : require('@/assets/icon/down_blue.svg')"
                    alt="down icon"
                    style="color: var(--links-blue);"
                  />
                  </div>
                </div>
                <div v-if="openIfBridgeNotLoad">
                  <div class="list-text mb-8">
                    If the bridge widget <strong>doesn't load</strong>, please
                    check your privacy settings:
                    <ol class="mt-2">
                      <li class="list-text mb-2">
                        Allow the use of third-party cookies in your browser
                        (e.g., chrome://settings/cookies).
                      </li>
                      <li class="list-text mb-2">
                        Check settings for installed ad blockers.
                      </li>
                      <li class="list-text mb-4">
                        Review your antivirus settings.
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
              <div v-if="this.light" class="image-container mb-4">
                <v-img
                  class="dark_theme_img"
                  :src="require('@/assets/bridge/bridge_help_light.png')"
                ></v-img>
              </div>
              <div v-else class="image-container mb-4">
                <v-img
                  class="dark_theme_img"
                  :src="require('@/assets/bridge/bridge_help.png')"
                ></v-img>
              </div>
            </div>
          </div>
        </div>
        <div class="info-item info-item-bordered">
          <div class="row">
            <div class="col-lg-8 col-md-8 col-sm-12">
              <div class="info-text">
                3. Choose from
                <span class="info-warn"> which chain and which token </span> you
                want to move.
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
                5. Enter <span class="info-warn">the chain </span> to which you
                want to transfer.
              </div>
            </div>
          </div>
        </div>
        <div class="info-item info-item-bordered">
          <div class="row">
            <div class="col-lg-8 col-md-8 col-sm-12">
              <div class="info-text">
                6. You can also
                <span class="info-warn">
                  select a different token and wallet</span
                >
                for the transfer.
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
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "BridgeInformation",

  data: () => ({
    openIfBridgeNotLoad: false
  }),

  computed: {
    ...mapGetters("theme", ["light"])
  }
});
</script>

<style scoped>
@media only screen and (max-width: 1400px) {
  .info-container {
    padding: 20px 20px 10px;
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
    margin-bottom: 10px;
  }

  .second-info-block {
    display: flex;
    flex-direction: column;
  }

  .image-container {
    margin-left: 5px !important;
  }
}

@media only screen and (min-width: 1400px) {
  .second-info-block {
    flex-wrap: wrap;
  }

  .info-container {
    padding: 30px;
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
}
/* full */
@media only screen and (min-width: 1400px) {
  .sub-text-container {
    margin-right: auto;
  }

  .info-container {
    padding: 40px;
  }

  .info-header {
    font-size: 24px;
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

.info-container {
  background: var(--secondary);
  border-radius: 28px;
}

.info-header {
  font-style: normal;
  font-weight: 400;
  color: var(--main-gray-text);
}

.info-item-bordered {
  border-bottom: 1px solid #dee1e5;
}

.info-text {
  font-style: normal;
  font-weight: 400;
  color: var(--main-gray-text);
}

.list-text {
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
}

.link-text {
  display: flex;
  align-items: center;
  margin-top: 10px !important;
}

.dark_theme_img {
  width: 290px;
  height: auto;
}

.bridge_open_info{
  width: 12px;
  height: 12px;
}
</style>
