<template>
    <div>
        <v-row v-if="mapCountOfFutures[networkName] > 1">
            <v-col v-if="usdplusAvailibleNetworks.includes(networkName)"
                   class="col-lg-3 col-md-3 col-sm-6">
                <v-btn :class="modalType === 'USD+' ? 'btn-outlined-enabled' : ''"
                       @click.stop="swapAction"
                        class="button btn-outlined" outlined>
                    USD+
                </v-btn>
            </v-col>
            <v-col v-if="wusdAvailibleNetworks.includes(networkName)"
                   class="col-lg-3 col-md-3 col-sm-6">
                <v-btn :class="modalType === 'WUSD+' ? 'btn-outlined-enabled' : ''"
                       @click.stop="swapWusdAction"
                       class="button btn-outlined" outlined>
                    WUSD+
                </v-btn>
            </v-col>
            <v-col v-if="daiplusAvailibleNetworks.includes(networkName)"
                   class="col-lg-3 col-md-3 col-sm-6">
                <v-btn :class="modalType === 'DAI+' ? 'btn-outlined-enabled' : ''"
                       @click.stop="swapDaiAction"
                       class="button btn-outlined" outlined>
                    DAI+
                </v-btn>
            </v-col>
            <v-col v-if="usdtplusAvailibleNetworks.includes(networkName)"
                   class="col-lg-3 col-md-3 col-sm-6">
                <v-btn :class="modalType === 'USDT+' ? 'btn-outlined-enabled' : ''"
                       @click.stop="swapUsdtAction"
                       class="button btn-outlined" outlined>
                    USDT+
                </v-btn>
            </v-col>
            <v-col v-if="ethplusAvailibleNetworks.includes(networkName)"
                   class="col-lg-3 col-md-3 col-sm-6">
                <v-btn :class="modalType === 'ETH+' ? 'btn-outlined-enabled' : ''"
                       @click.stop="swapEthAction"
                       class="button btn-outlined" outlined>
                    ETH+
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import {mapActions, mapGetters} from "vuex";

export default defineComponent({
    name: "CoinButtons",
    props: ['modalType', 'modalActionType', 'closeFunc'],
    computed: {
        ...mapGetters('network', ['networkName']),

    },
    data() {
        return {
            usdplusAvailibleNetworks: ['optimism', 'arbitrum', 'bsc', 'polygon', 'zksync', 'base', 'linea'],
            daiplusAvailibleNetworks: ['optimism', 'arbitrum', 'base'],
            usdtplusAvailibleNetworks: ['bsc', 'linea', 'arbitrum'],
            ethplusAvailibleNetworks: ['arbitrum'],
            wusdAvailibleNetworks: ['optimism', 'arbitrum', 'polygon', 'base'],

            mapCountOfFutures: {} // network: count
        }
    },
    mounted() {
        this.initNeededModal();
        this.initSumOfFutures();
    },
    methods: {
        ...mapActions('swapModal', ['showSwapModal', 'showMintView', 'showRedeemView']),
        ...mapActions('swapDaiModal', ['showDaiSwapModal', 'showDaiMintView', 'showDaiRedeemView']),
        ...mapActions('swapUsdtModal', ['showUsdtSwapModal', 'showUsdtMintView', 'showUsdtRedeemView']),
        ...mapActions('swapEthModal', ['showEthSwapModal', 'showEthMintView', 'showEthRedeemView']),
        ...mapActions('wrapModal', ['showWrapModal', 'showWrapView', 'showUnwrapView']),

        initNeededModal() {
            if (this.$route.query.symbol) {
                setTimeout(() => {
                    console.log("this.$route.query.asset", this.$route.query.symbol)
                    if (this.$route.query.symbol === 'wUSD+') {
                        this.swapWusdAction();
                    } else if (this.$route.query.symbol === 'DAI+') {
                        this.swapDaiAction();
                    } else if (this.$route.query.symbol === 'USDT+') {
                        this.swapUsdtAction();
                    } else if (this.$route.query.symbol === 'ETH+') {
                        this.swapEthAction();
                    }

                    this.$router.push({ path: this.$route.path })
                }, 0);
            }
        },

        initSumOfFutures() {
            for (let i = 0; i < this.usdplusAvailibleNetworks.length; i++) {
                let network = this.usdplusAvailibleNetworks[i];
                this.mapCountOfFutures[network] = 1;

                if (this.daiplusAvailibleNetworks.includes(network)) {
                    this.mapCountOfFutures[network]++;
                }

                if (this.usdtplusAvailibleNetworks.includes(network)) {
                    this.mapCountOfFutures[network]++;
                }

                if (this.ethplusAvailibleNetworks.includes(network)) {
                    this.mapCountOfFutures[network]++;
                }

                if (this.wusdAvailibleNetworks.includes(network)) {
                    this.mapCountOfFutures[network]++;
                }
            }

            this.$forceUpdate();

        },


        swapAction() {
            if (this.modalType === 'USD+') {
                return;
            }

            if (this.modalActionType === 'MINT') {
                this.showSwapModal();
                this.showMintView();
                this.closeFunc();
                return;
            }

            this.showSwapModal();
            this.showRedeemView();
            this.closeFunc();
        },
        swapDaiAction() {
            if (this.modalType === 'DAI+') {
                return;
            }

            if (this.modalActionType === 'MINT') {
                this.showDaiSwapModal();
                this.showDaiMintView();
                this.closeFunc();
                return;
            }

            this.showDaiSwapModal();
            this.showDaiRedeemView();
            this.closeFunc();
        },
        swapUsdtAction() {
            if (this.modalType === 'USDT+') {
                return;
            }

            if (this.modalActionType === 'MINT') {
                this.showUsdtSwapModal();
                this.showUsdtMintView();
                this.closeFunc();
                return;
            }

            this.showUsdtSwapModal();
            this.showUsdtRedeemView();
            this.closeFunc();
        },
        swapEthAction() {
            if (this.modalType === 'ETH+') {
                return;
            }

            if (this.modalActionType === 'MINT') {
                this.showEthSwapModal();
                this.showEthMintView();
                this.closeFunc();
                return;
            }

            this.showEthSwapModal();
            this.showEthRedeemView();
            this.closeFunc();
        },
        swapWusdAction() {
            if (this.modalType === 'WUSD+') {
                return;
            }

            if (this.modalActionType === 'MINT') {
                this.showWrapModal();
                this.showWrapView();
                this.closeFunc();
                return;
            }


            this.showWrapModal();
            this.showUnwrapView();
            this.closeFunc();
        },
    }

})
</script>


<style scoped>

.btn-outlined {
    background-color: transparent;
    width: 110px;
    max-height: 40px;
    border: 1px solid var(--links-blue);
    border-radius: 4px;
    color: var(--zoom-btn-color);
}

.btn-outlined-enabled {
    color: var(--links-blue);
    border: 0 solid #1C95E7;
    background: rgba(28, 149, 231, 0.1);
}


</style>
