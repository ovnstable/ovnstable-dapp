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

        <div v-if="!account">
            <div class="info-group">
                <div @click="connectWallet"
                     class="button-buy">
                    CONNECT WALLET
                </div>
            </div>
        </div>
        <div v-else>
            <div v-if="networkName === presaleChain" class="info-group">
                <div v-if="currentStepType === 'WAITING_FOR_PRESALE_START'">
                    <div class="button-buy-disabled">
                        NOT STARTED
                    </div>
                </div>
                <div v-else-if="currentStepType === 'COMMIT'">
                    <div v-if="!value"
                         class="button-buy-disabled">
                        ENTER AMOUNT
                    </div>
                    <div v-else-if="!approveData.approved" @click="approve"
                         class="button-buy">
                        APPROVE
                    </div>
                    <div v-else
                         @click="buyAndFarm"
                         class="button-buy">
                        BUY AND FARM
                    </div>
                </div>
                <div v-else>
                    <div class="button-buy-disabled">
                        PRESALE PASSED
                    </div>
                </div>
            </div>
            <div v-else class="info-group">
                <div @click="switchToNetwork"
                     class="button-buy">
                    SWITCH TO BASE
                </div>
            </div>

            <div v-if="errorMessage" class="error--text pt-3">
                {{errorMessage}}
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
import {mapActions, mapGetters} from "vuex";
import {contractApprove} from "@/components/mixins/contract-approve";

export default {
    name: "PresaleBuyForm",
    props: [
        'ovnICOContract',
        'ovnTokenContract',
        'ovnWhitelistContract',
        'currentStepType',
        'ovnWeiType',
        'usdPlusWeiType',
        'galxeNftsIds',
        'partnerNftsIds',
        'showSuccessModal',
        'timeoutUpdateCurrentUserStep'
    ],
    mixins: [contractApprove],
    components: {
    },
    data() {
        return {
            value: null,
            presaleChain: 'base',
            networkId: 8453,

            approveData: {
                allowanceValue: 0,
                approved: false
            },

            isBuyLoading: false,
            errorMessage: null,
        }
    },
    computed: {
        ...mapGetters('network', ['networkName']),
        ...mapGetters('network', ['networkName']),
        ...mapGetters("web3", ["web3", 'contracts']),
        ...mapGetters('accountData', ['balance', 'originalBalance', 'account']),
        ...mapGetters('gasPrice', ['gasPrice', 'gasPriceGwei', 'gasPriceStation', 'gasPriceType']),

        formattedBalanceUsdPlus() {
            if (!this.account || this.networkName !== this.presaleChain) {
                return "-"
            }

            if (!this.balance && !this.balance.usdPlus) {
                return '00.00'
            }

            let balance = (this.balance.usdPlus * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') * 1;
           return !isNaN(balance) ? balance : '00.00';
        }
    },
    methods: {
        ...mapActions("gasPrice", ['refreshGasPrice']),
        ...mapActions('network', ['setWalletNetwork']),
        ...mapActions('transaction', ['loadTransaction']),
        ...mapActions("walletAction", ['connectWallet']),

        ...mapActions("waitingModal", ['showWaitingModal', 'closeWaitingModal']),
        ...mapActions("errorModal", ['showErrorModal', 'showErrorModalWithMsg']),


        switchToNetwork() {
            this.setWalletNetwork(this.networkId.toString());
        },

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
            if (value === '') {
                this.value = null;
                return;
            }

            let weiValue = this.web3.utils.toWei(value + "", this.ovnWeiType)
            console.log('inputUpdate weiValue: ', weiValue);
            this.checkApproveForToken(weiValue);
        },
        async buyAndFarm() {
            console.log('buyAndFarm from component');
            if (this.isBuyLoading) {
                console.log('Buy method not available, prev buy in process');
                return;
            }

            this.isBuyLoading = true;
            this.showWaitingModal('Buy in process');

            try {
                // // 10**6
                // let contractValue = this.web3.utils.toWei(this.value + "", this.usdPlusWeiType);
                let contractValue = this.web3.utils.toWei(this.value + "", this.usdPlusWeiType);
                console.log('Buy contractValue: ', this.value, contractValue, this.usdPlusWeiType);

                let activeNft = await this.getFirstActiveNft();
                console.log("activeNft:::", activeNft);
                if (!activeNft) {
                    console.log('Buy method not available, no active nft');
                    this.errorMessage = 'You don’t have Presale NFT';
                    this.closeWaitingModal();
                    this.isBuyLoading = false;
                    return;
                }

                let tokenId = activeNft.tokenId;
                let typeOfNft = activeNft.typeOfNft;

                let buyParams;
                await this.refreshGasPrice();
                if (this.gas == null) {
                    buyParams = {from: this.account, gasPrice: this.gasPriceGwei};
                } else {
                    buyParams = {from: this.account, gasPrice: this.gasPriceGwei, gas: this.gas};
                }

                console.log('Buy contract call: ', this.ovnICOContract, this.account, contractValue, tokenId, typeOfNft, buyParams)
                let result = await this.ovnICOContract.methods.commit(contractValue, tokenId, typeOfNft)
                    .send(buyParams)
                    .on('transactionHash', (hash) => {
                        console.log('Buy transactionHash: ', hash);
                        this.showSuccessModal(true, hash, "You successfully bought and farmed $OVN token");
                        this.closeWaitingModal();
                    })

                console.log("Result: ", result)
            } catch (e) {
                console.error("Error when buy token.", e);
                this.closeWaitingModal();
                this.showErrorModalWithMsg({errorType: 'ico-buy', errorMsg: e},);
                this.isBuyLoading = false;
            } finally {
                this.closeWaitingModal();
                this.timeoutUpdateCurrentUserStep()
            }
        },
        async approve() {
            this.showWaitingModal('Approving in process');
            console.log("Approve contract token.")

            let contractValue = this.web3.utils.toWei(this.value + "", this.ovnWeiType)
            await this.checkApproveForToken(contractValue);
            if (this.approveData.approved) {
                console.log("Approve not needed for token.");
                this.closeWaitingModal();
                return;
            }

            // let approveValue = selectedToken.balanceData.originalBalance*1 ? selectedToken.balanceData.originalBalance : (10000000000000 + '');
            let approveValue = this.web3.utils.toWei("10000000", this.ovnWeiType);
            console.log('Approve contract approveValue: ', approveValue);
            console.log('Approve contract newApproveValue: ', this.contracts.usdPlus, this.account, this.ovnICOContract.options.address, approveValue);
            this.approveToken(this.contracts.usdPlus, this.ovnICOContract.options.address, approveValue)
                .then(data => {
                    console.log("Success approving", data);
                    this.checkApproveForToken(contractValue);
                    this.closeWaitingModal();
                })
                .catch(e => {
                    console.error("Error when approve token.", e);
                    this.closeWaitingModal();
                    this.showErrorModalWithMsg({errorType: 'approve', errorMsg: e}, );
                });
        },
        async checkApproveForToken(checkedAllowanceValue) { // checkedAllowanceValue in wei
            console.log('Check Approve contract: ', this.contracts.usdPlus, this.account, this.ovnICOContract.options.address);
            let allowanceValue = await this.getAllowanceValue(this.contracts.usdPlus, this.account, this.ovnICOContract.options.address);
            console.log('Approve value: ', allowanceValue);

            this.approveData.allowanceValue = allowanceValue * 1;
            if (!this.approveData.allowanceValue) {
                this.approveData.approved = false
                return;
            }

            if (!checkedAllowanceValue) {
                this.approveData.approved = true
                return;
            }

            this.approveData.approved = this.approveData.allowanceValue >= checkedAllowanceValue;
        },
        max() {
            console.log('max from component');
            this.value = this.balance.usdPlus * 1;
            this.inputUpdate(this.value);
        },
        async getFirstActiveNft() {
            let tokenId; // 1,2,3..
            let typeOfNft; // 0 - galxe, 1 - partner

            // if not galaxe nfts and not partner nfts return null
            if (!this.galxeNftsIds.length && !this.partnerNftsIds.length) {
                return null;
            }

            // check whitelist
            let isWhitelist
            try {
                isWhitelist = await this.ovnWhitelistContract.methods.isWhitelist(this.account, this.galxeNftsIds, this.partnerNftsIds).call();
                console.log('isWhitelist: ', isWhitelist);
            } catch (e) {
                console.error("Error when check whitelist.", e);
                this.errorMessage = 'Error when check nft';
                this.closeWaitingModal()
                return null;
            }

            if (!isWhitelist) {
                console.error("Error when check whitelist.");
                return
            }

            // isWhitelist return array of bool
            // 0 [true, false, true] - galxe
            // 1 [false, false, true, true, true, true, true, true, true, true] - partner
            // find first true and return nftid by index

            // service check
            if (isWhitelist[0].includes(true)) {
                let index = isWhitelist[0].indexOf(true);
                tokenId = this.galxeNftsIds[index];
                typeOfNft = 0;

                return {tokenId, typeOfNft};
            }

            // partner check
            if (isWhitelist[1].includes(true)) {
                let index = isWhitelist[1].indexOf(true);
                tokenId = this.partnerNftsIds[index];
                typeOfNft = 1;

                return {tokenId, typeOfNft};
            }


            return null;
        },
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

.button-buy-disabled {

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
    //background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    background: linear-gradient(91.26deg, #989b9d 0%, rgba(120, 136, 146, 0.99) 100%);
    border-radius: 2px;

    color: white;

    cursor: pointer;
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
    max-width: 180px;

    /* Blue gradient */
background: linear-gradient(91.26deg, #28A0F0 0%, rgba(6, 120, 196, 0.9917) 100%);
    //background: linear-gradient(91.26deg, #989b9d 0%, rgba(120, 136, 146, 0.99) 100%);
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
