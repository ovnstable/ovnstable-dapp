<template>
    <div>
        <div class="swap-container">
            <div class="not-available-container">
                <div class="not-available-logo-container text-center">
                    <img src="/assets/icon/swap/zksync-wait.svg" class="not-available-logo" alt="zksync-wait">
                </div>
                <div class="not-available-info text-center pt-10">
                    <div>
                        Swap will be available on {{networkName}} chain soon.
                    </div>
                    <div>
                        Now you can mint or redeem Overnight tokens.
                    </div>
                </div>
                <div class="not-available-button-container pt-10">
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <div class="text-right">
                                <v-btn  @click="mintAction"
                                        class="header-btn btn-filled mr-5">
                                    MINT
                                </v-btn>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <v-btn @click="redeemAction"
                                   class="header-btn btn-outlined mr-5">
                                REDEEM
                            </v-btn>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import {mapActions} from "vuex";

export default defineComponent({
    name: "network-not-available",
    props: ['networkName'],
    methods: {
        ...mapActions('swapModal', ['showSwapModal', 'showMintView', 'showRedeemView']),

        mintAction() {
            this.showMintView();
            this.showSwapModal();
        },

        redeemAction() {
            this.showRedeemView();
            this.showSwapModal();
        },
    }
})
</script>


<style scoped>

.swap-container {
    padding: 40px 30px;
    gap: 8px;
    background: var(--swap-main-banner-background);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
    border-radius: 28px;
    max-width: 600px;
}


.not-available-info {
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
    color: var(--main-gray-text);
}

.not-available-container {
    min-height: 500px;
    padding-top: 100px;
}

.btn-filled {
    background: var(--blue-gradient);
    color: #FFFFFF !important;
    width: 140px;
    height: 40px;
}

.btn-outlined {
    background-color:var(--swap-main-banner-background) !important;
    color: var(--links-blue);
    border: 1px solid #1C95E7;
    width: 140px;
    height: 40px;
}

.header-btn {
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 20px !important;
    letter-spacing: 0.02em !important;
}

</style>
