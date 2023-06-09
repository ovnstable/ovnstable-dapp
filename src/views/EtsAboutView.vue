<template>
    <div>
        <div class="page-container">
            <div class="mt-10 mb-10">
                <label class="title-label">About ETS</label>
            </div>
            <div class="info-container mb-5">
                <div class="">
                    <img
                        src="/assets/icon/ets_icon.svg"
                        class="ets-logo"
                        alt="ETS logo">
                </div>
                <div class="info-text">
                    The exchange-traded strategy (ETS) is an ERC-20 structured product built on Polygon, Optimism, Arbitrum or BNB chain, that lets you leverage a collateralized debt position of stablecoin to borrow a volatile asset, pair it with stablecoin, and provide pool liquidity on the DEX all in one action. This allows earning high APY and hedging against token volatility. ETS keeps track of pool’s tokens price changes. There are 3 types of price ranges: wide, narrow, very narrow.
                    <br>
                    <br>
                    The unique feature of ETS is that it automatically administers a health factor on a lending protocol and rebalances your Lent/Borrowed amounts to maintain a stringent Health Factor meaning. Payouts are happening every day and are auto compounded back into the strategy to further amplify rewards.
                </div>
            </div>
            <div class="how-container">
                <div class="first-container-how">
                    <div>
                        <label class="how-title">
                            How it works
                        </label>
                    </div>
                    <div class="sub-title-box mt-5">
                        <div class="number-border">
                            <span class="number">1</span>
                        </div>
                        <div>
                            <div>
                                <label class="subtitle-label">
                                    Deposit into Strategy
                                </label>
                            </div>
                            <div class="subtitle-info mt-5">
                                Deposit stablecoin into the vault. This triggers an automatic borrow of an equal value of volatile asset (from the lending protocol), which is invested alongside stablecoin deposit into pool on the DEX.
                            </div>
                        </div>
                    </div>
                    <div class="sub-title-box mt-5">
                        <div class="number-border second-number">
                            <span class="number">2</span>
                        </div>
                        <div>
                            <div>
                                <label class="subtitle-label">
                                    Strategy Generates Yield
                                </label>
                            </div>
                            <div class="subtitle-info mt-5">
                                Strategy automatically stakes the earned pool LP tokens into DEX gauge, and auto-compounds the rewards by re-investing into the pool for more LP tokens.
                            </div>
                            <div class="risk-container mt-5">
                                <div>
                                    <img
                                        src="/assets/icon/bellRed.svg"
                                        class="bell-icon"
                                        alt="Red Bell">
                                </div>
                                <div class="risk-info">
                                    It's important to compare your price invested and the current price, as a greater volatility causes a greater loss – is leading to  the LP tokens may result in an amount of tokens that are smaller than what was lent, in which case Strategy will swap the corresponding amount to repay the lender.
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="sub-title-box mt-10">
                        <div class="number-border third-number">
                            <span class="number">3</span>
                        </div>
                        <div class="third-box">
                            <div>
                                <label class="subtitle-label">
                                    Withdraw From Strategy
                                </label>
                            </div>
                            <div class="subtitle-info mt-5">
                                Withdraw at anytime by choosing what percent of your position you would like to divest.
                            </div>
                        </div>
                    </div>
                    <div class="link-block mt-10">
                        <img
                            src="/assets/icon/youtube-outlined.svg"
                            class="youtube-outlined-icon"
                            alt="Youtube Link">
                        <label class="youtube-link" @click="openLink('https://www.youtube.com/watch?v=wIVAiUMLmvA')">Learn more about ETS</label>
                    </div>
                </div>
                <div class="second-how-container">
                    <img
                        src="/assets/market/scheme.svg"
                        class="scheme"
                        alt="Scheme">
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "EtsAboutView",

    components: {
    },

    props: {},

    computed: {
    },

    data: () => ({
    }),

    watch: {
    },

    created() {
    },

    methods: {
        openLink(url) {
            window.open(url, '_blank').focus();
        },
    }
};
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 32px;
        line-height: 40px;
    }

    .ets-logo {
        width: 80px;
        height: 80px;
    }

    .info-container {
        border-radius: 12px;
        background-color: var(--secondary);
        padding: 30px;

        display: flex;
        flex-direction: column;
    }

    .how-container {
        border-radius: 12px;
        background-color: var(--secondary);
        padding: 20px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .info-container {
        padding: 20px;
        margin-bottom: 10px;
    }

    .scheme {
        width: 300px;
        max-width: 1000px;
    }

    .number-border {
        width: 160px;
        height: 30px;
        border: 1px solid #D7DADF;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .second-number {
        width: 230px;
        height: 30px;
    }

    .third-number {
        width: 80px;
        height: 30px;
    }

    .info-text {
        margin-bottom: 5px;
        margin-top: 0;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .number-border {
        width: 100px;
        height: 30px;
        border: 1px solid #D7DADF;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .second-number {
        width: 80px;
        height: 30px;
    }

    .third-number {
        width: 30px;
        height: 30px;
    }

    .how-container {
        padding: 40px;
    }

    .info-container {
        padding: 40px;
        margin-bottom: 20px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 54px;
        line-height: 60px;
    }

    .ets-logo {
        width: 130px;
        height: 130px;
    }

    .how-container {
        padding: 40px;
    }

    .info-container {
        padding: 40px;
        margin-bottom: 20px;
    }
}

@media
only screen and (-webkit-min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (   min--moz-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (     -o-min-device-pixel-ratio: 2/1)    and (min-width: 1300px),
only screen and (        min-device-pixel-ratio: 2)      and (min-width: 1300px),
only screen and (                min-resolution: 192dpi) and (min-width: 1300px),
only screen and (                min-resolution: 2dppx)  and (min-width: 1300px) {
    .title-label {
        font-style: normal;
        font-weight: 300;
        font-size: 48px;
        line-height: 60px;
    }

    .info-text {
        font-size: 16px;
        line-height: 24px;
    }

    .how-container {
        padding: 40px;
    }

    .info-container {
        padding: 40px;
        margin-bottom: 20px;
    }
}

.info-container {
    border-radius: 12px;
    background-color: var(--secondary);

    display: flex;
    gap: 50px;
}

.title-label {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}


.info-text {
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.how-title {
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 30px;
    line-height: 40px;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: var(--main-gray-text);
}

.how-container {
    border-radius: 12px;
    background-color: var(--secondary);

    display: flex;
    gap: 50px;
}

.sub-title-box {
    display: flex;
    gap: 10px;
}

.number {
    font-family: "Roboto", sans-serif;
    font-weight: 600;
    font-size: 20px;
    color: var(--main-gray-text);
}

.number-border {
    width: 60px;
    height: 30px;
    border: 1px solid #D7DADF;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.second-number {
    width: 80px;
    height: 30px;
}

.third-number {
    width: 30px;
    height: 30px;
}

.subtitle-label {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 18px;
    line-height: 28px;
    color: var(--main-gray-text);
}

.subtitle-info {
    font-family: "Roboto", sans-serif;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    color: var(--main-gray-text);
}

.risk-container {
    display: flex;
    gap: 10px;
    background-color: var(--red-container);
    padding: 30px;
}

.risk-info {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: var(--main-gray-text);
}

.link-block {
    display: flex;
    align-items: center;
    gap: 10px;
}

.youtube-link {
    color: var(--links-blue);
    cursor: pointer;
}

.scheme {}
</style>
