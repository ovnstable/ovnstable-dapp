<template>
    <div>
        <div v-if="isShow">
            <v-dialog
                    v-model="isShow"
                    width="650"
                    persistent>
                <v-card class="container_body container-body airdrop-body pt-4 px-4 pb-10"
                        style="border-radius: 28px!important;">
                    <v-toolbar class="container_header container-header" flat>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="setShowFunc(false)">
                            <img :src="light ? require('@/assets/icon/swap/search-close.svg') : require('@/assets/icon/light-close.svg')" alt="close icon">
                        </v-btn>
                    </v-toolbar>

                    <v-card-text>
                        <div class="tokens-container">
                            <div class="success-logo-container">
                                <img
                                    v-if="successData && successData.type === 'usd+'"
                                    :src="require('@/assets/icon/presale/usd-success.svg')"
                                     alt="success"
                                >
                                <img
                                    v-else
                                    :src="require('@/assets/icon/presale/ovn-success.svg')"
                                    alt="success"
                                >
                            </div>
                            <div class="success-text-container py-10">
                                {{ successData? successData.text : 'Success'}}
                            </div>

                            <div v-if="successData && successData.type === 'buy'">
                                <div class="description-text">
                                    You can view your OVN tokens on the 'Claim' panel of the Presale page. Your OVN amount will vary during the Presale based on the amount of funds in the Presale contract. You will see the final amount of your OVN tokens and any overflow funds when the Presale ends.
                                </div>

                               <div class="pt-6 text-center class-share-button-container">
                                   <div @click="shareTwitter"
                                        class="button-buy">
                                       SHARE YOUR IMPRESSIONS
                                       <img
                                            :src="require('@/assets/icon/presale/twitter.svg')"
                                            alt="twitter"
                                        />
                                   </div>
                               </div>
                            </div>

                            <div class="scan-container pt-5">
                                <div @click="openOnExplorer" class="scan-title">
                                    View on Scan
                                </div>
                                <div class="scan-icon">
                                    <img
                                        :src="require('@/assets/icon/swap/scan-open.svg')"
                                        alt="scan"
                                    >
                                </div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>

            </v-dialog>

            <resize-observer @notify="$forceUpdate()"/>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import {mapActions, mapGetters} from "vuex";

export default defineComponent({
    name: "SuccessPresaleModal",

    props: {

        isShow: {
            type: Boolean,
            default: false
        },
        setShowFunc: {
            type: Function,
            required: true
        },

        successData: {
            type: Object,
            required: false
        },

    },
    data() {
      return {
      }
    },
    mounted() {
    },
    computed: {
        ...mapGetters('network', ['networkId', 'getParams']),
        ...mapGetters("theme", ["light"]),

    },
    watch: {
        isShow: function (val, oldVal) {

            if (val === true) {
                if (this.successData && this.successData.type === 'buy') {
                    try {
                        this.trackClick({action: 'presale_success_view', event_category: 'View page', event_label: 'View presale success window' });
                    } catch (e) {
                        console.error("Track error:", e);
                    }
                }
            }
        }

    },
    methods: {
        ...mapActions('track', ['trackClick']),

        openOnExplorer() {
            let explorerUrl = this.getParams(this.successData.chain).explorerUrl + `tx/${this.successData.hash}`;
            console.log("explorerUrl", explorerUrl);
            window.open(explorerUrl, '_blank').focus();
        },

        shareTwitter() {
            let valueText = (this.successData && this.successData.value ? " for $" + this.successData.value : '');
            let twitterLink = "https://twitter.com/share?text=I am participating in the $OVN Presale and have already purchased $OVN tokens" + valueText + ". See details on @overnight_fi dapp &url=https://app.overnight.fi/presale&hashtags=OVN_Presale"
            console.log("Twitter share link: ", twitterLink)
            window.open(twitterLink, '_blank').focus();
            try {
                this.trackClick({action: 'click_share_twitter_presale_info', event_category: 'Click button', event_label: 'Click share twitter' });
            } catch (e) {
                console.error("Track error:", e);
            }
        }

    }
})
</script>

<style scoped>
@media only screen and (max-width: 960px) {
    .success-text-container {
        font-size: 20px;
        line-height: 40px;
    }

    .success-table-info-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .input-token-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .output-token-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .success-text-container {
        font-size: 30px;
        line-height: 40px;
    }

    .success-table-info-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .input-token-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .output-token-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .success-text-container {
        font-size: 30px;
        line-height: 40px;
    }

    .success-table-info-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .input-token-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .output-token-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
}

@media only screen and (min-width: 1300px) {
    .success-text-container {
        font-size: 30px;
        line-height: 40px;
    }

    .success-table-info-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .input-token-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .output-token-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
}

.tokens-container {
    padding-top: 15px;
    padding-bottom: 15px;
}

.container-body {
    background: var(--secondary)!important;
}

.container-header {
    background: var(--secondary)!important;
}

.success-logo-container {
    text-align: center;
}

.success-text-container {
    text-align: center;
    font-style: normal;
    font-weight: 400;
    color: var(--main-gray-text);
}

.success-token-title {
    /* You successfully claimed $OVN token */

    /* Header/Header_3 R */
    font-style: normal;
    font-weight: 400;
    font-size: 30px;
    line-height: 40px;
    /* Grey/Grey 19_text */
    color: #29323E;

}

.success-data-item {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    color: var(--main-gray-text);
}

.success-data-item-out {
    font-size: 16px;
    font-weight: 800;
    line-height: 24px;
    color: rgba(34, 171, 172, 1);
}

.scan-title {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #1C95E7;
    display: inline-block;
}

.scan-container {
    text-align: center;
    position: relative;
    cursor: pointer;
}

.scan-icon {
    position: absolute;
    top: 22px;
    padding-left: 4px;
    display: inline-block;
}

.success-table-info-container {
    margin-bottom: 15px;
}

.success-gas-refund-table-info-container {
    background: rgba(34, 171, 172, 0.08);
    padding: 10px;
    cursor: pointer;
}

.gas-refund-title {
    color: rgba(34, 171, 172, 1);
    font-weight: bold;
}

.vert-line {
    width: 1px;
    background: rgba(173, 179, 189, 1);
    height: 100%;
    margin-left: 30px;
}

.divider {
    border-top: 1px solid #ADB3BD;
}

.description-text {
    /* Caption */
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    /* or 157% */
    font-feature-settings: 'pnum' on, 'lnum' on;

    color: #707A8B;

}

.button-buy {

    /* Auto layout */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6px 8px;
    gap: 8px;

    height: 40px;
    min-width: 270px;

    /* Blue gradient */
    background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
//background: linear-gradient(91.26deg, #989b9d 0%, rgba(120, 136, 146, 0.99) 100%);
    border-radius: 2px;

    color: white;

    cursor: pointer;

    /* Title 2 */
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
}

.class-share-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
