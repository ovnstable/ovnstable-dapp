<template>
    <div>
        <div class="swap-container">
            <div class="not-available-container">
                <div class="not-available-logo-container text-center">
                    <img :src="require('@/assets/icon/swap/chain-wait.svg')" class="not-available-logo" alt="wait">
                </div>
                <div class="not-available-info text-center">
                    <div>
                        Swap will be available on <span class="network-name">{{networkName}}</span> chain soon.
                    </div>
                    <div>
                        Now you can mint or redeem Overnight tokens.
                    </div>
                </div>
                <div class="not-available-button-container">
                    <div class="col-lg-6 col-md-6">
                        <div class="text-right">
                            <v-btn  @click="mintAction"
                                    class="header-btn btn-filled">
                                MINT
                            </v-btn>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6">
                        <v-btn @click="redeemAction"
                               class="header-btn btn-outlined">
                            REDEEM
                        </v-btn>
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
/*Mobile*/
@media only screen and (max-width: 960px) {
    .swap-container {
        padding: 20px 20px 10px;
    }

    .not-available-container {
        min-height: 250px;
        padding-top: 10px;
    }

    .not-available-logo {
        width: 103px;
        height: 70px;
    }

    .not-available-info {
        font-size: 16px;
        line-height: 24px;
        padding-top: 15px;
    }

    .header-btn {
        font-size: 16px !important;
        line-height: 20px !important;
    }

    .btn-filled {
        width: 140px;
        height: 40px;
    }

    .btn-outlined {
        width: 140px;
        height: 40px;
    }

    .not-available-button-container {
        padding-top: 15px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .swap-container {
        padding: 40px 30px;
    }

    .not-available-container {
        min-height: 500px;
        padding-top: 100px;
    }

    .not-available-info {
        font-size: 20px;
        line-height: 28px;
        padding-top: 30px;
    }

    .header-btn {
        font-size: 16px !important;
        line-height: 20px !important;
    }

    .btn-filled {
        width: 140px;
        height: 40px;
    }

    .btn-outlined {
        width: 140px;
        height: 40px;
    }

    .not-available-button-container {
        padding-top: 30px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .swap-container {
        padding: 40px 30px;
    }

    .not-available-container {
        min-height: 500px;
        padding-top: 100px;
    }

    .not-available-info {
        font-size: 20px;
        line-height: 28px;
        padding-top: 40px;
    }

    .header-btn {
        font-size: 16px !important;
        line-height: 20px !important;
    }

    .btn-filled {
        width: 140px;
        height: 40px;
    }

    .btn-outlined {
        width: 140px;
        height: 40px;
    }

    .not-available-button-container {
        padding-top: 30px;
    }
}

@media only screen and (min-width: 1300px) {
    .swap-container {
        padding: 40px 30px;
    }

    .not-available-container {
        min-height: 500px;
        padding-top: 100px;
    }

    .not-available-info {
        font-size: 20px;
        line-height: 28px;
        padding-top: 40px;
    }

    .header-btn {
        font-size: 16px !important;
        line-height: 20px !important;
    }

    .btn-filled {
        width: 140px;
        height: 40px;
    }

    .btn-outlined {
        width: 140px;
        height: 40px;
    }
}

.swap-container {
    gap: 8px;
    background: var(--swap-main-banner-background);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
    border-radius: 28px;
    max-width: 600px;
}

.not-available-container {
    display: flex;
    flex-direction: column;
}

.not-available-info {
    font-style: normal;
    font-weight: 400;
    color: var(--main-gray-text);
}

.not-available-button-container {
    display: flex;
    flex-direction: row;
}

.btn-filled {
    background: var(--blue-gradient);
    color: #FFFFFF !important;
}

.btn-outlined {
    background-color:var(--swap-main-banner-background) !important;
    color: var(--links-blue);
    border: 1px solid #1C95E7;
}

.header-btn {
    font-style: normal !important;
    font-weight: 400 !important;
    letter-spacing: 0.02em !important;
    border-radius: 2px;
}

.network-name {
    text-transform: capitalize;
}

</style>
