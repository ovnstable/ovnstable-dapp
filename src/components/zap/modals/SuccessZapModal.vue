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
                                <v-row align="center">
                                    <div class="col-4"></div>
                                      <div class="icon">
                                          <v-img v-if="successData.pool.token0Icon" :src="successData.pool.token0Icon"/>
                                      </div>
                                      <div  class="icon ml-n2 mr-2">
                                          <v-img v-if="successData.pool.token1Icon" :src="successData.pool.token1Icon"/>
                                      </div>
                                      <div v-if="successData.pool.token2Icon" class="icon ml-n2 mr-2">
                                          <v-img :src="successData.pool.token2Icon"/>
                                      </div>
                                      <div v-if="successData.pool.token3Icon" class="icon ml-n2 mr-2">
                                          <v-img :src="successData.pool.token3Icon"/>
                                      </div>
                                    <div class="col-4"></div>
                                </v-row>
<!--                                <img v-for="token in successData.outputTokens" :key="token.selectedToken.symbol"-->
<!--                                     :src="'/assets/currencies/' + token.selectedToken.symbol + '.svg'"-->
<!--                                     :alt="token.selectedToken.symbol"-->
<!--                                >-->
<!--                                <img src="/assets/icon/swap/success.svg"-->
<!--                                     alt="success">-->
                            </div>
                            <div class="success-text-container py-10">
                                You successfully staked
                            </div>

                            <div class="success-table-info-container">
                                <div class="input-token-container">
                                    <div class="row">
                                        <div class="col-lg-6 col-md-6 col-sm-12">
                                            <div class="success-token-title">
                                                Pool name
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-12">
                                            <div class="success-data-list">
                                                <span class="success-data-item">
                                                    {{successData.pool.name}}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="input-token-container">
                                    <div class="row">
                                        <div class="col-lg-6 col-md-6 col-sm-12">
                                            <div class="success-token-title">
                                                DEX
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-12">
                                            <div class="success-data-list">
                                                <span class="success-data-item">
                                                    {{successData.pool.dex}}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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

                            <div class="success-table-position-info-container">
                                <div class="input-token-container">
                                    <div class="row">
                                        <div class="col-lg-6 col-md-6 col-sm-12">
                                            <div class="success-token-title" style="color: var(--main-gray-text)">
                                                Received stake position
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-12">
                                            <div class="success-data-list">
                                                <div v-for="stake in tokensStakeList" :key="stake.id" class="success-position-data-item">
                                                    {{ $utils.formatMoney(stake.value, 3)}} {{stake.token.symbol}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="input-token-container">
                                    <div class="row">
                                        <div class="col-lg-6 col-md-6 col-sm-12">
                                            <div class="success-token-title">
                                                Returned in wallet
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-12">
                                            <div class="success-data-list">
                                                <div v-for="returnData in tokensReturnList" :key="returnData.id" class="success-data-item">
                                                    {{ $utils.formatMoney(returnData.value, 6)}} {{returnData.token.symbol}}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div @click="openPositionOnPool"
                                 class="platform-position-container text-center mt-5">
                                <div class="position-title">
                                    MY POSITION IN POOL
                                </div>
                                <div class="position-icon">
                                    <img src="/assets/icon/swap/scan-open-white.svg"  alt="position">
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
    name: "SuccessZapModal",
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
          tokensStakeList: [], // [ { name: count }]
          tokensReturnList: [], // [ { name: count }]
      }
    },

    mounted() {
        this.initStakeList();
        this.initReturnList();
    },
    computed: {
        ...mapGetters('network', ['getParams']),
        ...mapGetters('web3', ['web3', 'getWeiMarker']),
    },
    watch: {
        successData: function (val, oldVal) {
            if (val) {
                this.initStakeList();
                this.initReturnList();
            }
        }
    },
    methods: {
        initStakeList() {
            console.log("initStakeList: ", this.successData)
            console.log(this.successData.outputTokens)
            for (let i = 0; i < this.successData.outputTokens.length; i++) {
                let token = this.successData.outputTokens[i];
                let originalValue = this.getCountFromPutInto(token.selectedToken.address);
                let value = this.web3.utils.fromWei(originalValue, this.getWeiMarker(token.selectedToken.decimals));

                this.tokensStakeList.push({
                    id: token.id + 'stake',
                    token: token.selectedToken,
                    value: value
                })
            }
        },
        initReturnList() {

            for (let i = 0; i < this.successData.outputTokens.length; i++) {
                let token = this.successData.outputTokens[i];
                let originalValue = this.getCountFromReturned(token.selectedToken.address);
                let value = this.web3.utils.fromWei(originalValue, this.getWeiMarker(token.selectedToken.decimals));
                this.tokensReturnList.push({
                    id: token.id + 'return',
                    token: token.selectedToken,
                    value: value
                })
            }
        },
        getCountFromPutInto(tokenAddress) {
            if (!this.successData.putIntoPoolEvent || !this.successData.putIntoPoolEvent.returnValues) {
                return 0;
            }

            console.log("getCountFromPutInto2")


            // this.successData.putIntoPoolEvent.returnValues[1] // addresses
            for (let i = 0; i < this.successData.putIntoPoolEvent.returnValues[1].length; i++) {
                let address = this.successData.putIntoPoolEvent.returnValues[1][i];
                if (tokenAddress.toLowerCase() === address.toLowerCase()) {
                    return this.successData.putIntoPoolEvent.returnValues[0][i]; // value from returnValues[0]
                }
            }

            return 0;
        },
        getCountFromReturned(tokenAddress) {
            if (!this.successData.returnedToUserEvent || !this.successData.returnedToUserEvent.returnValues) {
                return 0;
            }

            // this.successData.putIntoPoolEvent.returnValues[1] // addresses
            for (let i = 0; i < this.successData.returnedToUserEvent.returnValues[1].length; i++) {
                let address = this.successData.returnedToUserEvent.returnValues[1][i];
                if (tokenAddress.toLowerCase() === address.toLowerCase()) {
                    return this.successData.returnedToUserEvent.returnValues[0][i]; // value from returnValues[0]
                }
            }

            return 0;
        },
        openPositionOnPool() {
            console.log('openPositionOnPool')
            if (this.successData.pool.dex === 'Chronos') {
                window.open(`https://app.chronos.exchange/liquidity/${this.successData.pool.address}`, '_blank').focus();
                return
            }

            console.error("Open Position failed, dex not found.", this.successData.pool.dex)
        },
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
    position: relative;
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

.position-icon {
    position: absolute;
    top: 14px;
    padding-left: 97px;
    display: inline-block;
}

.success-table-position-info-container {
    padding: 16px 12px 12px;
    margin-top: 20px;
    background: rgba(28, 149, 231, 0.1);
    border-radius: 8px;
}

.success-position-data-item {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.5px;
    color: var(--main-gray-text);
}

.platform-position-container {
    position: relative;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 15px 12px;
    background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    border-radius: 2px;
    cursor: pointer;
    text-align: center;
}

.position-title {
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    color: #FFFFFF;
}

.icon {
    height: 80px !important;
    width: 80px !important;
}

.icon > .v-image {
    border-radius: 9999px !important;

}
</style>
