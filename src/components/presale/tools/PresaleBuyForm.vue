<template>
    <div>
        <div class="input-container">
            <div class="input-data-container">
                <div class="row">
                    <div class="col-7">
                        <input
                            v-model="value"
                            type="text"
                            @keypress="isNumber($event)"
                            placeholder="0"
                            @input="inputUpdate(value)"
                            class="input-style"/>
                    </div>
                    <div class="col-5 selected-image-right">
                        <v-btn class="button btn-outlined" @click="max" outlined>
                            MAX
                        </v-btn>
                    </div>
                </div>
            </div>
        </div>

        <div class="balance-container">
            <div class="row">
                <div class="col-8 col-lg-8 col-md-8 col-sm-8">
                    <span class="balance-detail">Balance: {{ formattedBalanceUsdPlus }}</span> USD+
                </div>
                <div class="col-4 col-lg-4 col-md-4 col-sm-4">
                    <div style="float: right">
                        <a href="/#/swap">Swap USD+</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-group">
            <div @click="buyAndFarm"
                 class="button-buy">
                BUY AND FARM
            </div>
        </div>

        <div class="info-group">
            <div class="warn-message">
                By participating in Private Presale you accept <a href="https://docs.overnight.fi/other/terms-of-service" target="_blank">Overnight's Terms of Service</a> and <a href="https://docs.overnight.fi/other/privacy-policy" target="_blank">Privacy Policy</a>.
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "PresaleBuyForm",
    data() {
        return {
            value: null,
        }
    },
    computed: {
        ...mapGetters('accountData', ['balance', 'originalBalance', 'account']),

        formattedBalanceUsdPlus() {
            if (!this.balance && !this.balance.usdPlus) {
                return '00.00'
            }

           return (this.balance.usdPlus * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        }
    },
    methods: {

        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            let charCode = (evt.which) ? evt.which : evt.keyCode;

            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                if (charCode === 46 && (!this.token.value || this.token.value.includes('.'))) {
                    evt.preventDefault();
                } else {
                    return true;
                }
            }
        },
        inputUpdate(value) {
            console.log(value);
            // this.updateTokenValueFunc(this.tokenInfo, value)
        },
        buyAndFarm() {
            console.log('buyAndFarm from component');
        },
        max() {
            console.log('max from component');
            this.value = this.balance.usdPlus * 1;
        }
    }
}
</script>


<style scoped>

.input-container {

    justify-content: space-between;
    align-items: center;
    padding: 20px 20px;

    background: var(--swap-input-placeholder);
    border-radius: 20px;
}


.input-data-container {
    position: relative;
}

.selected-image-right {
    display: flex;
    justify-content: flex-end;
    padding-right: 25px;
    padding-top: 17px;
}

.input-style {
    border:none;
    background: transparent;
    outline: 0;

    max-width: 100%;

    color: var(--main-gray-text);

    font-style: normal;
    font-weight: 400;
    font-size: 40px;
    line-height: 48px;

}

.input-style::placeholder {
    color: #C5C9D1;
}

.btn-outlined {
    color: var(--links-blue) !important;
    max-width: 150px;
}

.button-buy {

    /* Auto layout */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6px 8px;
    gap: 8px;

    height: 40px;
    max-width: 150px;

    /* Blue gradient */
    background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    border-radius: 2px;

    color: white;

    cursor: pointer;
}

.info-group {
    padding-top: 15px;
}

.warn-message {

    /* Caption */
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    /* or 157% */
    font-feature-settings: 'pnum' on, 'lnum' on;

    /* Grey/Grey 19_text */
    color: #29323E;

}

.balance-container {
    padding-top: 10px;
}

.balance-detail {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    color: #707A8B;
}
</style>
