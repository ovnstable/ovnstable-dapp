<template>
    <div>
        <div class="info-container">
            <div class="info-header">
                Manage your liquidity with USD+
            </div>
            <div class="info-body">
                <div class="welcome-message">
                    Dear investor, we noticed that you have accumulated stablecoins that do not work:
                </div>

                <div class="tokens-amount-table-container">
                    <div class="tokens-amount-table-header">
                        <div class="row">
<!--                            <div class="col-4 col-lg-4 col-md-4 col-sm-4">-->
<!--                                <div class="tokens-amount-table-header-item text-left">-->
<!--                                    Amount-->
<!--                                </div>-->
<!--                            </div>-->
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
                        <div v-for="token in sortedTokens" :key="token.symbol">
                            <div class="tokens-amount-info-container">
                                <div class="row">
                                    <div class="col-6 col-lg-6 col-md-6 col-sm-6">
                                        <div class="amount-info text-center">
                                            {{token.symbol}}
                                        </div>
                                    </div>
                                    <div class="col-6 col-lg-6 col-md-6 col-sm-6">
                                        <div class="amount-info text-center">
                                            ${{token.balanceData.balance ? parseFloat(token.balanceData.balance).toFixed(2) : 0.00}}
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


            <div class="possible-income-container">
                <div class="possible-income-header">
                    If you had invested these stablecoins in USD+:
                </div>
                <div class="possible-income-body">
                    <div class="row">
                        <div class="col-4 col-lg-4 col-md-4 col-sm-4">
                            <div class="date-info text-center text-center">
                                1 month ago
                            </div>
                            <div class="possible-income-info-container">
                                <div class="possible-income-info-text text-center">
                                    +$100
                                </div>
                            </div>
                        </div>
                        <div class="col-4 col-lg-4 col-md-4 col-sm-4">
                            <div class="date-info text-center">
                                3 month ago
                            </div>
                            <div class="possible-income-info-container">
                                <div class="possible-income-info-text text-center">
                                    +$300
                                </div>
                            </div>
                        </div>
                        <div class="col-4 col-lg-4 col-md-4 col-sm-4">
                            <div class="date-info text-center">
                                6 month ago
                            </div>
                            <div class="possible-income-info-container">
                                <div class="possible-income-info-text text-center">
                                    +$600
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pt-5">
                Make the most of your stablecoins – <span class="swipe-info">SWIPE LIQUIDITY FOR USD+</span>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
    name: "SwipeInformation",
    props: {
        stablecoinTokens: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            tokens: [
                {symbol: 'USDC', amount: '1000', usdValue: '1000'},
                // write more tokens here with random amounts and values
                {symbol: 'USDT', amount: '12313', usdValue: '12313'},
                {symbol: 'DAI', amount: '321', usdValue: '32'},
                {symbol: 'TUSD', amount: '42141', usdValue: '12'},
                {symbol: 'BUSD', amount: '32', usdValue: '32'},
                {symbol: 'DOLA', amount: '0', usdValue: '0'},
                {symbol: 'LUSD', amount: '0.0001', usdValue: '0.0001'},
            ],
        }
    },
    computed: {
        sortedTokens() {
            return this.stablecoinTokens.sort((a, b) => {
                return b.balanceData.balance - a.balanceData.balance
            })
        },
        totalTokenUsdValue() {
            return this.sortedTokens.reduce((acc, token) => {
                return acc + parseFloat(token.balanceData.balance ? token.balanceData.balance : 0)
            }, 0)
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
    background: rgba(245, 245, 245, 1);

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
    color: rgba(41, 50, 62, 1);
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
    background: rgba(245, 245, 245, 1);
    padding: 0px 8px 0px 8px;
    border-radius: 8px;
    margin-bottom: 5px;
}

.possible-income-info-container {
    padding: 10px 20px 10px 20px;
    border-radius: 8px;
    background: rgba(34, 171, 172, 0.1);
    color: rgba(34, 171, 172, 1);
    font-weight: bold;
}

.possible-income-container {
    max-width: 400px;
}

.swipe-info {
    font-family: Roboto;
    font-size: 18px;
    font-weight: 400;
    line-height: 28px;
    letter-spacing: 0px;
    text-align: left;
    color: #1C95E7;
    cursor: pointer;

}
</style>
