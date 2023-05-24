<template>
    <div>
        <div v-if="isShow">
            <v-dialog
                    v-model="isShow"
                    width="570"
                    persistent>
                <v-card class="container_body container-body airdrop-body pt-4 px-4"
                        style="border-radius: 28px!important;">
                    <v-toolbar class="container_header container-header" flat>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="setShowFunc(false)">
                            <v-icon class="close-icon">mdi-close</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-card-text>
                        <div class="tokens-container">
                            <div class="success-logo-container">
                                <img src="/assets/icon/swap/success.svg"
                                     alt="success">
                            </div>
                            <div class="success-text-container py-10">
                                You successfully swapped
                            </div>
                            <div class="success-table-info-container">
                                <div class="input-token-container">
                                    <div class="row">
                                        <div class="col-lg-6 col-md-6 col-sm-12">
                                            <div class="success-token-title">
                                                Swapped from
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-12">
                                            <div class="success-data-list">
                                                    <span v-for="(token, index) in successData.inputTokens" :key="token.symbol"
                                                          class="success-data-item">
                                                     {{index === 0 && token.selectedToken ?
                                                      token.selectedToken.symbol : ', ' + token.selectedToken.symbol}}
                                                    </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="output-token-container">
                                  <div class="row">
                                      <div class="col-lg-6 col-md-6 col-sm-12">
                                          <div class="success-token-title">
                                              Swapped to
                                          </div>
                                      </div>
                                      <div class="col-lg-6 col-md-6 col-sm-12">
                                          <div class="success-data-list">
                                            <span v-for="(token, index) in successData.outputTokens" :key="token.symbol"
                                                    class="success-data-item">
                                                {{index === 0 && token.selectedToken ?
                                                token.selectedToken.symbol : ', ' + token.selectedToken.symbol}}
                                            </span>
                                          </div>
                                      </div>
                                  </div>
                                </div>
                            </div>

                            <div class="scan-container pt-5">
                                <div @click="openOnExplorer" class="scan-title">
                                    View on Scan
                                </div>
                                <div class="scan-icon">
                                    <img src="/assets/icon/swap/scan-open.svg" alt="scan">
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
import SelectTokenShort from "@/components/swap-module/SelectTokenShort.vue";
import SelectTokenWithSearch from "@/components/swap-module/SelectTokenWithSearch.vue";
import {mapGetters} from "vuex";

export default defineComponent({
    name: "SuccessOdosModal",
    components: {
        SelectTokenWithSearch,
        SelectTokenShort
    },
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
            required: true
        },
    },
    data() {
      return {
      }
    },
    mounted() {

    },
    computed: {
        ...mapGetters('network', ['getParams']),
    },
    watch: {

    },
    methods: {
        openOnExplorer() {
            let explorerUrl = this.getParams(this.successData.chain).explorerUrl;
            window.open(explorerUrl + `tx/${this.successData.hash}`, '_blank').focus();
        }
    }
})
</script>

<style scoped>

div {
    font-family: 'Roboto',serif;
}

.tokens-container {
    padding-top: 15px;
    padding-bottom: 15px;
}

.title-container {
    font-style: normal;
    font-weight: 400;
    font-size: 30px;
    line-height: 40px;
    color: var(--main-gray-text);
}

.container-body {
    background: var(--secondary)!important;
}

.container-header {
    background: var(--secondary)!important;
}

.success-data-list {
    text-align: end;
}

.success-logo-container {
    text-align: center;
}

.success-text-container {
    text-align: center;
    font-style: normal;
    font-weight: 400;
    font-size: 30px;
    line-height: 40px;
    color: var(--main-gray-text);
}

.success-token-title {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #707A8B;
}

.success-data-item {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    color: var(--main-gray-text);
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
</style>
