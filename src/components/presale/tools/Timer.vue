<template>
    <div>
        <div class="timer-container">
            <div v-if="!endOfTime" class="timer-title">
                {{ title }}
            </div>
            <div v-else class="timer-title">
                {{ endOfMessage }}
            </div>

            <div class="timer-info">
                {{ days }} : {{ hours }} : {{ minutes }} : {{ seconds }}
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: "Timer",
    props: [
        'timestamp',
        "title",
        'endOfMessage'
    ],
    data() {
        return {
            timer: null,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        }
    },
    mounted() {
       this.initCountdown();
    },
    computed: {
        endOfTime() {
            return this.days === 0 && this.hours === 0 && this.minutes === 0 && this.seconds === 0;
        }
    },
    methods: {
        initCountdown() {
            // event countdown
            this.timer = setInterval(() => {
                let now = new Date().getTime();
                let distance = this.timestamp - now;
                // console.log("now        ", now);
                // console.log("timestamp", this.timestamp);
                // console.log("distance", distance);

                this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
                this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                this.seconds = Math.floor((distance % (1000 * 60)) / 1000);

                this.days = this.days < 10 ? "0" + this.days : this.days;
                this.hours = this.hours < 10 ? "0" + this.hours : this.hours;
                this.minutes = this.minutes < 10 ? "0" + this.minutes : this.minutes;
                this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;

                if (distance < 0) {
                    clearInterval(this.timer);
                    this.days = 0;
                    this.hours = 0;
                    this.minutes = 0;
                    this.seconds = 0;
                }
            }, 1000);
        },
    }
}
</script>


<style scoped>

@media only screen and (min-width: 1695px) {
    .timer-container {
        width: 100%;
        height: 100%;
    }
    .timer-info {
        font-size: 35px!important;
    }
    .timer-title {
        font-size: 14px;
    }
}

@media only screen and (min-width: 1650px) {
    .timer-container {
        width: 100%;
        height: 100%;
    }
    .timer-info {
        font-size: 33px!important;
    }
    .timer-title {
        font-size: 14px;
    }
}


.timer-container {
    /* Auto layout */
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 12px;
    gap: 12px;

    //width: 302px;
    width: 100%;
    height: 108px;

    /* 10% Blue */
    background: rgba(28, 149, 231, 0.1);
    border-radius: 12px;
}

.timer-info {

    font-family: 'Roboto';
    font-style: normal;
    font-weight: 600;
    font-size: 25px;
    line-height: 28px;
    /* identical to box height, or 70% */
    font-feature-settings: 'liga' off;

    /* Main blue */
    color: #1C95E7;

}

.timer-title {
    /* Secondary text bold */
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 800;
    font-size: 16px;
    line-height: 24px;
    /* identical to box height, or 150% */
    letter-spacing: 0.5px;
    font-feature-settings: 'liga' off;

    /* Grey/Grey 19_text */
    color: #29323E;
}

</style>
