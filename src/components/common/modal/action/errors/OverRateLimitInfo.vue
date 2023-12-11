<template>
    <div class="main-container" :class="$wu.isMobile() ? 'px-2 pt-2' : 'px-5 pt-5'">

        <div class="loading-img">
            <v-img :src="require('@/assets/icon/over-rate-limit.svg')"/>
        </div>

        <label class="error-label pb-5 pt-5">
            Over rate limit
        </label>


        <div class="info-container" :class="$wu.isMobile() ? 'pa-2 pt-4' : 'pa-5'">
            <div class="info-container-text">
                An transaction limits error has occurred in your wallet.<br/>
                Check in your wallet whether the transaction went through.
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "OverRateLimitInfo",
    props: ["errorMsg", 'errorCode', 'copyError'],

    data: () => ({
    }),

    methods: {
    }
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {

    .info-container {
        min-width: 300px;
        min-height: 140px;
    }

    .error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 30px;
    }


    .loading-img {
        width: 90px;
    }


    .info-message-container {
        font-size: 15px;
    }

    .info-container {
        font-size: 16px;
    }

    .error-label {
        font-size: 25px;
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

    .loading-img {
        width: 120px;
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



    .loading-img {
        width: 120px!important;
    }

}

.loading-img {
    width: 180px;
}

.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: left;
}

.info-message-container {
    max-width: 534px;
    max-height: 160px;
    color: #ADB3BD;

    padding: 5px;
    margin-bottom: 20px;
    font-size: 20px;
}

.info-container {
    border-top: 1.5px solid #ADB3BD;

    color: var(--secondary-gray-text);

    font-style: normal;
    font-size: 20px;
    line-height: 30px;
    text-align: center;
}

.error-label {
    color: rgba(250, 136, 72, 1);
    font-size: 30px;
}


.info-container-text {
    padding-top: 15px;
}
</style>
