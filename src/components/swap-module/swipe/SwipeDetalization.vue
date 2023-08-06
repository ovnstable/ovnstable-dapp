<template>
    <div>

        <div v-if="!isAllDataLoaded" class="info-container" style="height: 180px;">
            <div class="loader-container pt-10">
                <div>
                    <v-row align="center" justify="center">
                        <v-progress-circular
                            width="2"
                            size="24"
                            color="#8FA2B7"
                            indeterminate
                        ></v-progress-circular>
                    </v-row>
                    <div class="possible-profit pt-10 text-center">
                        Your possible profit is calculated
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="info-container">
            <div class="info-header">
                Manage your liquidity with USD+
            </div>

            <div v-if="!isNullableAllBalances" class="welcome-message pb-3">
                Dear investor, we noticed that you have accumulated stablecoins that do not work.
            </div>

            <div class="">
                <div class="possible-income-container">
                    <div class="swipe-info">
                        <img src="/assets/icon/swipe/cash.svg" style="top: 4px;" alt="<-" class="swipe-arrow-img">
                        <div class="swipe-info-text">
                            YOUR POTENTIAL PROFIT
                        </div>
                    </div>

                    <div v-if="isNullableAllBalances" class="possible-income-header-text pb-2">
                        If you had invested $10K stablecoins in USD+ on the <span class="network-name">{{networkName}}</span> chain:
                    </div>
                    <div v-else class="possible-income-header-text pb-2">
                        If you had invested your stablecoins in USD+
                    </div>
                    <div class="possible-income-body">
                        <div class="row">
                            <div class="col-4 col-lg-4 col-md-4 col-sm-4">
                                <div class="possible-income-base-container">
                                    <div class="possible-income-hr"></div>

                                    <div class="date-info text-center text-center">
                                        1 month ago
                                    </div>
                                    <div class="possible-income-info-container">
                                        <div class="possible-income-info-text text-center">
                                            +${{possibleIncomeMonth.toFixed(0)}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-4 col-lg-4 col-md-4 col-sm-4">
                                <div class="possible-income-base-container">
                                    <div class="possible-income-hr"></div>

                                    <div class="date-info text-center">
                                        3 month ago
                                    </div>
                                    <div class="possible-income-info-container">
                                        <div class="possible-income-info-text text-center">
                                            +${{possibleIncomeThreeMonth.toFixed(0)}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-4 col-lg-4 col-md-4 col-sm-4">
                                <div class="possible-income-base-container">

                                    <div class="date-info text-center">
                                        6 month ago
                                    </div>
                                    <div class="possible-income-info-container">
                                        <div class="possible-income-info-text text-center">
                                            +${{possibleIncomeSixMonth.toFixed(0)}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="info-body pt-10">

                <div class="swipe-info pb-2">
                    <img src="/assets/icon/swipe/wallet.svg" alt="<-" class="swipe-arrow-img">
                    <div class="swipe-info-text">
                        YOUR ACCUMULATED STABLECOINS
                    </div>
                </div>

                <div v-if="isNullableAllBalances">
                    <div class="no-stablecoins-info pb-3">
                        There are no stablecoins in your wallet on the current chain.
                    </div>
                </div>
                <div  v-else>
                    <div class="tokens-amount-table-container">
                        <div class="tokens-amount-table-header">
                            <div class="row">
                                <div class="col-6 col-lg-6 col-md-6 col-sm-6">
                                    <div class="tokens-amount-table-header-item text-center">
                                        Stablecoin
                                    </div>
                                </div>
                                <div class="col-6 col-lg-6 col-md-6 col-sm-6">
                                    <div class="tokens-amount-table-header-item text-center">
                                        Value
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tokens-amount-table-body">
                            <div v-for="token in filteredTokens" :key="token.symbol">
                                <div class="tokens-amount-info-container">
                                    <div class="row">
                                        <div class="col-6 col-lg-6 col-md-6 col-sm-6">
                                            <div class="amount-info text-center">
                                                {{token.symbol}}
                                            </div>
                                        </div>
                                        <div class="col-6 col-lg-6 col-md-6 col-sm-6">
                                            <div class="amount-info text-center">
                                                ${{token.balanceData.balance ? parseFloat(token.balanceData.balance * TEST_MULTIPLY_COUNT).toFixed(2) : 0.00}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tokens-amount-table-footer">
                        <div class="total-amount">
                            <div class="total-amount-item-container">
                                <div class="total-amount-item">
                                    Total amount
                                </div>
                                <div class="total-amount-item text-right" style="float: right">
                                    <div>
                                        ${{totalTokenUsdValue.toFixed(2)}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            <div v-if="isNullableAllBalances">
                <div>
                    <div class="go-to-swap-message pb-3">
                        Go to Swap page to exchange any of your tokens for USD+.
                    </div>
                    <div>
                        <div  @click="goToSwap()"
                              class="to-swap-button-container">
                            <div class="to-swap-button-text">
                                SWAP IN USD+
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div v-else class="pt-10">
               <div
                   @click="scrollToDown"
                   class="swipe-info-container">
                   <div class="pb-4">
                       Make the most of your stablecoins
                   </div>
                   <div class="swipe-info">
                       <img src="/assets/icon/swipe/arrow.svg" alt="<-" class="swipe-arrow-img">
                       <div class="swipe-info-text" style="color: rgba(28, 149, 231, 1)">
                           SWIPE LIQUIDITY FOR USD+
                       </div>
                   </div>
               </div>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import {mapGetters} from "vuex";
import {payoutsApiService} from "@/services/payouts-api-service";

export default defineComponent({
    name: "SwipeDetalization",
    props: {
        stablecoinTokens: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            TEST_MULTIPLY_COUNT: 1,
            EXAMPLE_VALUE: 10000,
            monthApy: 0,
            threeMonthApy: 0,
            sixMonthApy: 0,
            isTokenApyLoaded: false,
            isBalanceUpdated: false
        }
    },
    mounted() {
        this.loadPayoutsData();
    },
    computed: {
        ...mapGetters("network", ['networkId', 'assetName', 'appApiUrl', 'apiUrl', 'getParams', 'networkName']),

        isAllDataLoaded() {
            return this.isTokenApyLoaded && this.isBalanceUpdated;
        },

        filteredTokens() {
            return this.sortedTokens.filter(token => {
                return token.balanceData.balance > 0
            })
        },

        isNullableAllBalances() {
            return this.filteredTokens.length === 0;
        },

        sortedTokens() {
            return this.stablecoinTokens.sort((a, b) => {
                return b.balanceData.balance - a.balanceData.balance
            })
        },
        totalTokenUsdValue() {
            if (this.isNullableAllBalances) {
                return this.EXAMPLE_VALUE;
            }

            return this.filteredTokens.reduce((acc, token) => {
                return acc + parseFloat(token.balanceData.balance ? token.balanceData.balance * this.TEST_MULTIPLY_COUNT : 0)
            }, 0)
        },
        possibleIncomeMonth() {
            return (this.totalTokenUsdValue * (this.monthApy / 12)) / 100;
        },
        possibleIncomeThreeMonth() {
            return ((this.totalTokenUsdValue * (this.threeMonthApy / 12)) / 100) * 3;
        },
        possibleIncomeSixMonth() {
            return ((this.totalTokenUsdValue * (this.sixMonthApy / 12)) / 100) * 6;
        }
    },
    watch: {
        networkName: function (val, oldVal) {
            if (val) {
                this.clearData();
                this.loadPayoutsData();
            }
        },
        stablecoinTokens: function (newVal, oldVal) {
            if (newVal && newVal.length > 0) {
                this.isBalanceUpdated = true;
            }
        }
    },
    methods: {
        goToSwap() {
            this.$router.push({
                path: '/swap',
            });
        },
        scrollToDown() {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        },
        initPossibleIncome() {
            this.loadPayoutsData();
        },
        loadPayoutsData() {
            payoutsApiService.getPayouts(this.apiUrl + `/${this.networkName}/usd+`)
                .then((response) => {
                    console.log("Swipe payouts: ", response)
                    this.calculateApys(response);
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        calculateApys(payouts) {
            // order payouts by date
            payouts = payouts.sort((a, b) => {
                return new Date(b.payableDate) - new Date(a.payableDate);
            });

            console.log("Sorted payouts: ", payouts)

            // get first 30 payouts
            const lastMonthPayouts = payouts.slice(0, 30);
            this.monthApy = lastMonthPayouts.reduce((acc, payout) => {
                return acc + payout.annualizedYield;
            }, 0) / lastMonthPayouts.length;

            const lastThreeMonthPayouts = payouts.slice(0, 90);
            this.threeMonthApy = lastThreeMonthPayouts.reduce((acc, payout) => {
                return acc + payout.annualizedYield;
            }, 0) / lastThreeMonthPayouts.length;

            const lastSixMonthPayouts = payouts.slice(0, 180);
            this.sixMonthApy = lastSixMonthPayouts.reduce((acc, payout) => {
                return acc + payout.annualizedYield;
            }, 0) / lastSixMonthPayouts.length;

            this.isTokenApyLoaded = true
        },
        clearData() {
            this.monthApy = 0;
            this.threeMonthApy = 0;
            this.sixMonthApy = 0;
            this.isTokenApyLoaded = false;
            this.isBalanceUpdated = false;
        }
    }
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
    padding-bottom: 20px;
}

.info-body {

}

.tokens-amount-table-container {
    max-width: 400px;
    height: 222px;
    padding: 12px 20px 12px 20px;
    border-radius: 8px;
    border: 1px solid rgba(197, 201, 209, 1)
}

.tokens-amount-table-header {
    border-bottom: 1px solid rgba(222, 225, 229, 1)
}

.tokens-amount-table-header-item {
//styleName: Caption;
    font-family: Roboto;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0em;
    text-align: right;
    color: rgba(173, 179, 189, 1);
}

.welcome-message {
    padding-bottom: 10px;
    color: var(--main-gray-text);
}

.tokens-amount-table-footer {
    max-width: 400px;
    padding-top: 10px;
    height: 36px;
}

.total-amount {
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 5px;
    padding-bottom: 5px;
    background: var(--swipe-lable-info);
    color: var(--main-gray-text);
    font-weight: bold;

}

.total-amount-item-container {
    //display: inline-block;
}

.total-amount-item {
    display: inline-block;
}

.amount-info {
//styleName: Text regular;
    font-family: Roboto;
    font-size: 18px;
    font-weight: 400;
    line-height: 28px;
    letter-spacing: 0px;
    text-align: center;
    color: var(--main-gray-text);
}

.tokens-amount-table-body {
    max-height: 180px;
    overflow-y: auto;
    overflow-x: hidden;
}

.possible-income-header {
    color: rgba(41, 50, 62, 1);
    font-weight: bold;
    padding-top: 30px;
    padding-bottom: 10px;
}

.date-info {
    background: var(--swipe-lable-info);
    color: var(--main-gray-text);
    padding: 0px 8px 0px 8px;
    border-radius: 8px;
    margin-bottom: 5px;
}

.possible-income-info-container {
    padding: 10px 20px 10px 20px;
    border-radius: 8px;
    //background: rgba(34, 171, 172, 0.1);
    color: rgba(34, 171, 172, 1);
    font-family: Roboto;
    font-size: 18px;
    font-weight: 700;
    line-height: 28px;
    letter-spacing: 0px;
}

.possible-income-container {
    //margin-top: 15px;
    max-width: 600px;
    //background: rgba(28, 149, 231, 0.1);
    border-radius: 8px;

}

.swipe-info {
    color: var(--swipe-info);
    font-family: Roboto;
    font-size: 18px;
    font-weight: 600;
    line-height: 22px;
    letter-spacing: 0.04em;

    position: relative;
}

.possible-income-header-text {
    //text-align: right;
    //padding-bottom: 10px;
    color: var(--main-gray-text);
}


.profit-text-container {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end; /* To center the text horizontally */
}

.profit-text {
    position: relative;
    font-family: Roboto;
    font-size: 18px;
    font-weight: 600;
    line-height: 28px;
    letter-spacing: 0px;
    text-align: left;
    color: rgba(41, 50, 62, 1);
    padding-bottom: 9px;

}

.possible-income-base-container {
    position: relative;

}

.possible-income-hr {
    position: absolute;
    height: 88%;
    right: -12px;
    background-color: rgb(200 200 200);
    width: 1px;
}

.money-img {
    position: absolute;
    left: -30px;
    top: 5px;
}

.swipe-info-container {
    cursor: pointer;
    color: var(--main-gray-text);

}

.swipe-info-text {
    padding-left: 23px;
}

.swipe-arrow-img {
    position: absolute;
}

.no-stablecoins-info {
    color: rgba(173, 179, 189, 1);
    font-family: Roboto;
    font-size: 18px;
    font-weight: 400;
    line-height: 28px;
    letter-spacing: 0px;
    text-align: left;

}


.to-swap-button-container {
    width: 127px;
    height: 40px;
    padding: 6px 8px 6px 8px;
    background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    border-radius: 2px;
    cursor: pointer;
}

.to-swap-button-text {
    padding-top: 5px;

    width: 111px;
    height: 20px;
    cursor: pointer;
//styleName: Title 2;
    font-family: Roboto;
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0.02em;
    text-align: center;
    color: rgba(255, 255, 255, 1);

}

.network-name:first-letter {
    text-transform: uppercase!important;
}

.possible-profit {
    color: var(--main-gray-text);

}

.go-to-swap-message {
    color: var(--main-gray-text);
}
</style>
