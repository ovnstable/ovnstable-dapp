<template>
    <div :class="$wu.isMobile() ? 'px-2 pt-2' : 'px-5 pt-5'">
        <div class="loading-img">
            <v-img :src="require('@/assets/icon/error-circle.svg')"/>
        </div>

        <label class="error-label pt-5 pb-5">
            Error in estimating gas
        </label>

        <div class="error-message pb-5">
            Issue with settings of gas fees or gas limits in your wallet.
        </div>

        <div class="info-container py-6 px-6">
            <div class="info-item">
                1. Change gas settings in your wallet manually
            </div>
            <div class="info-item">
                or
            </div>
            <div class="info-item">
                2. Change the input amount slightly
            </div>
            <div class="info-item">
                3. Delete your cookies for the last several hours
            </div>

            <div class="info-item pt-4">
                Useful article:
            </div>
            <div>
                <a href="https://overnight.fi/blog/2022/10/28/what-to-do-if-your-transaction-is-still-stuck/"
                   class="info-item-link pl-2"
                   target="_blank">
                    • What to do if your transaction is still stuck
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "GasError",
    props: ["errorMsg", 'errorCode'],

}
</script>

<style scoped>


/* mobile */
@media only screen and (max-width: 960px) {

    .error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 30px;
    }

    .error-message {
        font-size: 14px;
        line-height: 24px;
    }

    .info-container {
        min-width: 300px;
        min-height: 140px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 34px;
    }

    .info-container {
        min-width: 550px;
        min-height: 164px;
    }

    .error-message {
        font-size: 16px;
        line-height: 24px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 26px;
        line-height: 36px;
    }

    .info-container {
        min-width: 550px;
        min-height: 164px;
    }

    .error-message {
        font-size: 16px;
        line-height: 24px;
    }
}

.error-message {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    color: var(--secondary-gray-text);
}

.info-container {
    background: var(--card-info-background);

    border-radius: 4px;
}

.info-item {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    color: var(--secondary-gray-text);

}

.info-item-link {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    cursor: pointer;
    text-decoration: none;

    color: #1C95E7;

}

.error-label {
    color: var(--secondary-gray-text);
}

</style>
