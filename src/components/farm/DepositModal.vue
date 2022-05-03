<template>
    <v-dialog
            :value="showDeposit"
            :width="width"
            @input="close"
            :persistent="persistent"
            scrollable>
        <v-card class="container_body">
            <v-toolbar class="container_header" flat>
                <v-row>
                    <v-spacer></v-spacer>
                    <label class="title-modal ml-4">
                        Deposit
                    </label>
                    <v-spacer></v-spacer>
                    <v-btn icon class="ml-auto" @click="close" dark>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-row>
            </v-toolbar>

            <v-card-text class="px-5 pt-5">
                <v-row>
                    <v-col class="ml-4 mr-4">
                        <v-row align="center">
                            <v-text-field placeholder="0.00"
                                          @keypress="isNumber($event)"
                                          flat
                                          solo
                                          class="ml-2 field-sum"
                                          hide-details
                                          dark
                                          background-color="transparent"
                                          v-model="sum">
                            </v-text-field>
                            <v-spacer></v-spacer>
                            <div>
                                <label class="max mr-5" @click="max">Max</label>
                                <ItemSelector :readonly="true" :selected-item="buyCurrency" :items="buyCurrencies"/>
                            </div>
                        </v-row>

                        <v-row class="balance-row">
                            <label class="balance-label ml-5 mb-1">Balance LP token: 10.00</label>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row class="mt-10">
                    <v-col class="ml-4 mr-4">
                        <v-row align="center">
                            <PromoSection/>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row class="mt-6">
                    <v-col class="ml-4 mr-4">
                        <v-btn dark
                               height="56"
                               class="buy enabled-buy">
                            Approve LP
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import ItemSelector from "../common/ItemSelector";
import ErrorModal from "@/components/common/ErrorModal";
import WaitingModal from "@/components/common/WaitingModal";
import SuccessModal from "@/components/common/SuccessModal";
import PromoSection from "@/components/farm/PromoSection";

export default {
    name: "DepositModal",

    components: {
        PromoSection,
        ItemSelector,
        ErrorModal,
        WaitingModal,
        SuccessModal,
    },

    props: {
        persistent: {
            type: Boolean,
            default: false,
        },

        width: {
            type: String,
            default: '500',
        }
    },

    computed: {
        ...mapGetters('farm', ['showDeposit', 'selectedPool']),
    },

    data: () => ({

        sum: null,

        buyCurrency: null,
        buyCurrencies: [{
            id: 'undefined',
            title: 'Pool',
            image: require('@/assets/currencies/undefined.svg')
        }],
    }),

    created() {
        this.buyCurrency = this.buyCurrencies[0];
    },

    methods: {
        ...mapActions('farm', ['hideDepositModal']),

        max() {
        },

        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            let charCode = (evt.which) ? evt.which : evt.keyCode;

            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                if (charCode === 46 && (!this.sum || this.sum.includes('.'))) {
                    evt.preventDefault();
                } else {
                    return true;
                }
            }
        },

        close() {
            this.hideDepositModal();

            this.$emit('input', false);
            this.$emit('m-close');
        },
    },
}
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 1400px) {
}

@media only screen and (min-width: 1400px) {
}


.container_body {
    border-radius: 24px !important;
    background-color: var(--secondary) !important;
}

.container_header {
    background-color: var(--secondary) !important;
}

.v-text-field >>> input {
    min-height: 42px !important;
    max-height: 42px !important;
    height: 42px !important;
}

.v-text-field >>> input::placeholder {
    color: #353E4C !important;
}

.v-text-field >>> input, .v-text-field >>> label, .v-text-field >>> button {
    font-family: 'Lato', sans-serif;
    font-style: normal !important;
    font-weight: 700 !important;
    font-size: 34px !important;
    line-height: 42px !important;

    color: #FE7F2D !important;
}

.field-sum {
    width: 45%;
}

.balance-label {
    color: white;
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
}

.max {
    color: var(--link);
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    cursor: pointer;
}

.balance-row {
    margin-top: -12px !important;
}

.enabled-buy {
    background: var(--orange-gradient) !important;
}

.disabled-buy {
    background: #181A21 !important;
    box-shadow: none !important;
    border: 1px solid #1D2029 !important;
}

.buy {
    width: 100%;
    border-radius: 40px;
    color: white !important;
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px !important;
    line-height: 24px !important;
    text-transform: none !important;
}

</style>
