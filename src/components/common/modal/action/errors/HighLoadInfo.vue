<template>
    <div class="main-container" :class="$wu.isMobile() ? 'px-2 pt-2' : 'px-5 pt-5'">

        <div class="loading-img">
            <v-img :src="require('@/assets/icon/high-load-network.svg')"/>
        </div>

        <label class="error-label pb-5 pt-5">
            Network load
        </label>

        <div class="info-message-container">
            The network is load and the transaction is delayed
        </div>

        <div class="info-container" :class="$wu.isMobile() ? 'pa-2 pt-4' : 'pa-5'">
            <div class="info-container-text">
                Track the transaction in your wallet
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "WaitingModal",
    props: ["errorMsg", 'errorCode', 'copyError'],

    data: () => ({
        isCopied: false, // Initialize it as false
    }),

    methods: {
        openDiscord() {
            window.open(`https://discord.com/channels/933003627444969552/967813123149033542/967813482684760135/`, '_blank').focus();
        },

        copyErrorToClipboard(copyTooltip, errorMsg) {
            if (typeof this.copyError === 'function') {
                this.copyError(copyTooltip, errorMsg); // Pass the error message as an argument

                // Set isCopied to true when the icon is clicked
                this.isCopied = true;

                // Log the value of isCopied to the console
                console.log(this.isCopied);

                // Use a setTimeout to reset isCopied after a certain time (e.g., 2 seconds)
                setTimeout(() => {
                    this.isCopied = false;
                }, 2000); // 2000 milliseconds (2 seconds)
            }
        },
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
        font-size: 19px;
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

    font-family: 'Roboto';
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 36px;
    text-align: center;
}

.error-label {
    color: var(--secondary-gray-text);
    font-size: 30px;
}


.info-container-text {
    padding-top: 15px;
}
</style>
