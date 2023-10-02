import {mapActions, mapGetters} from "vuex";
import moment from "moment/moment";
import loadJSON from "@/utils/http-utils";
import {balanceApiService} from "@/services/balance-api-service";
import {pool} from "@/components/mixins/pool";

const USER_PRESALE_STATE_MAP = {
    0: 'WAITING_FOR_PRESALE_START',
    1: 'COMMIT',
    2: 'CLAIM_REFUND',
    3: 'WAITING_FOR_CLAIM_BONUS',
    4: 'CLAIM_BONUS',
    5: 'WAITING_FOR_CLAIM_SALES_FIRST_PART',
    6: 'CLAIM_SALES_FIRST_PART',
    7: 'WAITING_FOR_CLAIM_VESTING',
    8: 'CLAIM_VESTING',
    9: 'NOTHING_TO_DO',
}

export const presale = {
    mixins: [pool],
    data() {
        return {
            isFirstLoading: true,
            isContractDataLoading: false,

            isShowSuccessModal: false,
            successData: null,

            finishType: 'HOLD',

            presaleTimestamp: 1695038400 * 1000,
            presaleEndTimestamp: 1695639600 * 1000,
            vestingTimestamp: 0,
            vestingDurationTimestamp: 0,
            claimBonusTimestamp: 0,
            claimSalesFirstPartTimestamp: 0,

            overflowFarmingPool: 25000,
            fundsInPresale: 0,
            farmingBonus: 0,
            totalCommitments: 0,
            softCap: 350000,
            hardCap: 500000,
            icoBalance: 0,

            // personal data
            accountTotalUsdPurchased: 0,
            accountTotalOvnPurchased: 0,
            accountVestingAmount: 0,
            accountClaimableAmount: 0,
            accountFarmingBonus: 0,
            accountOverflowFunds: 0,

            nftStatus: false,
            nftLoading: true,

            nftGalxeAddress: "0x512cc325bae1dd4590f6d67733aaf8e6a0526eab",
            nftPartnerAddress: "0xe750a85e77bb505d5465f8045f25b27a3437b5f1",
            galxeNftsIds: [],
            partnerNftsIds: [],

            ovnTokenAddress: "0xa3d1a8deb97b111454b294e2324efad13a9d8396", // ovn for test 0x2a40eab5dc171924937f242c5d73e1cd5a19e160
            presaleContractAddress: "0x5b4f6F099D5178209e032644B1184bFe906de836",

            ovnTokenContract: null,
            ovnWhitelistContract: null,
            ovnICOContract: null,

            currentStep: null,
            currentStepType: null,
            ovnWeiType: 'ether',
            usdPlusWeiType: 'mwei',

            turnOfStatusControls: false,
            devSteps: 0, // if 10 => turn of controls

            supportedNetwork: ['base'],

            initRefreshIntervalId: null
        }
    },
    mounted() {
        this.initRefreshData();
        this.loadAllData();
    },

    watch: {

        account: function (newVal, oldVal) {
            console.log("Account changed", newVal, oldVal)
            if (newVal) {
                this.loadAllData();
            }
        },

        networkName: function (newVal, oldVal) {
            console.log("Network changed", newVal, oldVal)
            if (newVal) {
                this.loadAllData();
            }
        },

    },

    computed: {
        ...mapGetters('network', ['networkName', 'networkId']),
        ...mapGetters('accountData', ['account']),
        ...mapGetters("web3", ["web3", "contracts"]),
        ...mapGetters("gasPrice", ["gasPriceGwei", "gasPrice", "gasPriceStation"]),

        isSupportedNetwork() {
            return this.supportedNetwork.includes(this.networkName);
        },

        formattedPresaleContractAddress() {
            if (!this.presaleContractAddress) {
                return 'XXXX...XXXX';
            }

            return this.presaleContractAddress.substring(0, 5) + '...' + this.presaleContractAddress.substring(this.presaleContractAddress.length - 4);
        },

        availableNftCount() {
            if (!this.isWhitelist) {
                return 0;
            }

            // 0 [true, false, true] - galxe
            // 1 [false, false, true, true, true, true, true, true, true, true] - partner
            let serviceNfts = this.isWhitelist[0];
            let serviceAvailableNftsCount = 0;
            if (serviceNfts && serviceNfts.length) {
                serviceAvailableNftsCount = serviceNfts.filter(item => item).length;
            }

            let partnerNfts = this.isWhitelist[1];
            let partnerAvailableNftsCount = 0;
            if (partnerNfts && partnerNfts.length) {
                partnerAvailableNftsCount = partnerNfts.filter(item => item).length;
            }

            return serviceAvailableNftsCount + partnerAvailableNftsCount;
        },

        formattedClaimTitle() {
            if (this.currentStepType === null || this.currentStep === null) {
                return "Claim";
            }

            if (this.currentStepType === 'CLAIM_REFUND') {
                return 'Claim Refund';
            }

            if (this.currentStepType === 'WAITING_FOR_CLAIM_BONUS') {
                return 'Waiting bonus';
            }

            if (this.currentStepType === 'CLAIM_BONUS') {
                return 'Claim bonus';
            }

            if (this.currentStepType === 'WAITING_FOR_CLAIM_SALES_FIRST_PART') {
                return 'Waiting claim';
            }

            if (this.currentStepType === 'CLAIM_SALES_FIRST_PART') {
                return 'Claim sales';
            }

            if (this.currentStepType === 'WAITING_FOR_CLAIM_VESTING') {
                return 'Waiting vesting';
            }

            if (this.currentStepType === 'CLAIM_VESTING') {
                return 'Claim vesting';
            }

            return "Claim";
        },

        presaleStartDate() {
            return moment(this.presaleTimestamp).utc().format('MMMM DD, YYYY hh:mm [UTC]');
        },
        presaleEndDate() {
            return moment(this.presaleEndTimestamp).utc().format('MMMM DD, YYYY hh:mm [UTC]');
        },
        differentdDysBeetwinStartAndEndPresale() {
            return moment(this.presaleEndTimestamp).diff(moment(this.presaleTimestamp), 'days') + 1;
        },
        vestingStartDate() {
            return moment(this.vestingTimestamp).utc().format('MMMM DD, YYYY hh:mm [UTC]');
        },

        vestingEndTimestamp() {
            if (!this.vestingTimestamp || !this.vestingDurationTimestamp) {
                return 0;
            }

            return this.vestingTimestamp + (this.vestingDurationTimestamp);
        },

        // vestingEndDate() {
        //     return moment(this.vestingDurationTimestamp).utc().format('MMMM DD, YYYY hh:mm [UTC]');
        // },
        formattedSoftCap() {
            if (!this.softCap) {
                return "000,000";
            }

            return this.softCap.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
        formattedHardCap() {
            if (!this.hardCap) {
                return "000,000";
            }

            return this.hardCap.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
        formattedOvnTotal() {
            if (!this.overflowFarmingPool) {
                return "000,000";
            }

            return this.overflowFarmingPool.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
        formattedFarmingBonus() {
            if (!this.account || !this.isSupportedNetwork || this.isFirstLoading) {
                return "000,000";
            }

            // presale finish:
            if (this.farmingBonus) {
                return this.farmingBonus.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            }

            // before presale finish:
            // (commitToken.balanceOf(address(this)) - totalCommitments)
            let farmingBonus = this.icoBalance - this.totalCommitments;
            if (farmingBonus <= 0) {
                return "000,000";
            }
            return farmingBonus.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
        formattedFundsInPresale() {
            if (!this.fundsInPresale) {
                return "000,000";
            }

            return this.fundsInPresale.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        formattedDifferentHowManyPercentFundInPresaleByHardCap() {
            if (!this.fundsInPresale || !this.hardCap) {
                return "0";
            }

            let percentage = (this.fundsInPresale / this.hardCap) * 100;
            return Math.round(percentage);
        },

        formattedAccountTotalUsdPurchased() {
            if (!this.account || !this.isSupportedNetwork || this.isFirstLoading) {
                return "-";
            }

            if (!this.accountTotalUsdPurchased) {
                return "000,000.00";
            }

            return this.accountTotalUsdPurchased.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        formattedAccountTotalOvnPurchased() {
            if (!this.account || !this.isSupportedNetwork || this.isFirstLoading) {
                return "-";
            }

            if (!this.accountTotalOvnPurchased) {
                return "000,000.00";
            }

            return this.accountTotalOvnPurchased.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        formattedAccountVestingAmount() {
            if (!this.account || !this.isSupportedNetwork || this.isFirstLoading) {
                return "-";
            }

            if (!this.accountVestingAmount) {
                return "000,000.00";
            }

            return this.accountVestingAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        formattedAccountClaimableAmount() {
            if (!this.account || !this.isSupportedNetwork || this.isFirstLoading) {
                return "-";
            }

            if (!this.accountClaimableAmount) {
                return "000,000.00";
            }

            return this.accountClaimableAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        formattedAccountFarmingBonus() {
            if (!this.account || !this.isSupportedNetwork || this.isFirstLoading) {
                return "-";
            }

            if (!this.accountFarmingBonus) {
                return "000,000.00";
            }

            return this.accountFarmingBonus.toFixed(6).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        formattedAccountOverflowFunds() {
            if (!this.account || !this.isSupportedNetwork || this.isFirstLoading) {
                return "-";
            }

            if (!this.accountOverflowFunds) {
                return "000,000.00";
            }

            return this.accountOverflowFunds.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
    },
    beforeDestroy() {
        if (this.initRefreshIntervalId) {
            clearInterval(this.initRefreshIntervalId);
        }
    },

    methods: {
        ...mapActions("gasPrice", ['refreshGasPrice']),

        ...mapActions("waitingModal", ['showWaitingModal', 'closeWaitingModal']),
        ...mapActions("errorModal", ['showErrorModal', 'showErrorModalWithMsg', 'closeErrorModal']),

        initRefreshData() {
            this.initRefreshIntervalId = setInterval(this.loadContractData, 30000);
        },

        async loadAllData() {
            await this.loadApiData();
            await this.loadIcoData();
            await this.loadContractData();
        },
        async loadApiData() {
            if (!this.account || !this.isSupportedNetwork) {
                console.log("Not loading api data when loadApiData. Account not exist or notwork not support.", this.account, this.isSupportedNetwork);
                return;
            }

            await this.loadContracts();
            this.loadNftData();
        },

        async loadNftData() {
            await this.loadNft();
        },
        async loadContractData() {
            if (!this.account || !this.isSupportedNetwork) {
                console.log("Not loading contract data when loadContractData. Account not exist or notwork not support.", this.account, this.isSupportedNetwork);
                return;
            }

            console.log("Load contract data")
            if (this.isContractDataLoading) {
                console.log("Data already in status loading")
                return;
            }

            this.isContractDataLoading = true;
            try {
                this.updateBaseAndUserInfo();
            } catch (e) {
                console.log("Load contract data Error", e);
            } finally {
                this.isContractDataLoading = false;
            }
        },

        timeoutUpdateCurrentUserStep() {
            setTimeout(() => {
                this.loadContractData();
            }, 2500);
        },
        updateBaseAndUserInfo() {
            if (!this.account || !this.isSupportedNetwork) {
                console.log("Not loading contract data when updateBaseAndUserInfo. Account not exist or notwork not support.", this.account, this.isSupportedNetwork);
                return;
            }

            this.updateCurrentUserStep();
            this.updateUserInfo();
        },


        /*    async loadData() {

            },*/

        showSuccessModal(isShow, hash, text, type, value) {
            this.isShowSuccessModal = isShow;
            console.log("Show success modal", isShow, hash, text, value);

            if (!isShow) {
                this.successData = null;
                this.isShowSuccessModal = false;
                return
            }

            this.successData = {
                chain: this.networkId,
                hash: hash,
                text: text,
                type: type,
                value: value
            }

            this.isShowSuccessModal = isShow;
            console.log("Show success modal", isShow, hash, text, value);
        },
        loadIcoData() {
            console.log("Load ICO data")

            this.presaleContractAddress = this.ovnICOContract.options.address
            console.log('presaleContractAddress: ', this.presaleContractAddress);

            this.ovnICOContract.methods.hardCap().call().then((result) => {
                console.log("Hard cap result", result)
                let fromWei = this.web3.utils.fromWei(result.toString(), this.usdPlusWeiType); // mwei - 6, gwei - 9, ether - 18
                this.hardCap = fromWei * 1;
                console.log("Hard cap", this.hardCap, fromWei)
            });

            this.ovnICOContract.methods.softCap().call().then((result) => {
                console.log("Soft cap result", result)
                let fromWei = this.web3.utils.fromWei(result.toString(), this.usdPlusWeiType); // mwei - 6, gwei - 9, ether - 18
                this.softCap = fromWei * 1;
                console.log("Soft cap", this.softCap, fromWei)
            });


            this.ovnICOContract.methods.totalSales().call().then((result) => {
                console.log("Overflow farming pool result", result)
                let fromWei = this.web3.utils.fromWei(result.toString(), this.ovnWeiType); // mwei - 6, gwei - 9, ether - 18
                this.overflowFarmingPool = fromWei * 1;
                console.log("Overflow farming pool", this.overflowFarmingPool, fromWei)
            });

            // start time
            this.ovnICOContract.methods.startTime().call().then((result) => {
                console.log("Start time result", result)
                this.presaleTimestamp = result * 1000;
                console.log("Start time", this.presaleTimestamp)
            });

            // end time
            /*       this.ovnICOContract.methods.endTime().call().then((result) => {
                       console.log("End time result", result)
                       this.presaleEndTimestamp = result * 1000;
                       console.log("End time", this.presaleEndTimestamp)
                   });*/

            // vestingBegin
            this.ovnICOContract.methods.vestingBeginTime().call().then((result) => {
                console.log("Vesting begin result", result)
                this.vestingTimestamp = result * 1000;
                console.log("Vesting begin", this.vestingTimestamp)
            });

            // vestingDuration
            this.ovnICOContract.methods.vestingDuration().call().then((result) => {
                console.log("Vesting duration result", result)
                this.vestingDurationTimestamp = result * 1000;
                console.log("Vesting duration", this.vestingDurationTimestamp)
            });

            // claimBonusTime
            this.ovnICOContract.methods.claimBonusTime().call().then((result) => {
                console.log("Claim bonus time result", result)
                this.claimBonusTimestamp = result * 1000;
                console.log("Claim bonus time", this.claimBonusTimestamp)
            });

            //claimSalesFirstPartTime
            this.ovnICOContract.methods.claimSalesFirstPartTime().call().then((result) => {
                console.log("Claim sales first part time result", result)
                this.claimSalesFirstPartTimestamp = result * 1000;
                console.log("Claim sales first part time", this.claimSalesFirstPartTimestamp)
            });


            // farmingBonus
            this.ovnICOContract.methods.totalCommitToBonus().call().then((result) => {
                console.log("Farming bonus result", result)
                let fromWei = this.web3.utils.fromWei(result.toString(), this.usdPlusWeiType); // mwei - 6, gwei - 9, ether - 18
                this.farmingBonus = fromWei * 1;
                console.log("Farming bonus", this.farmingBonus, fromWei)
            });

            // farmingBonus
            this.ovnICOContract.methods.totalCommitments().call().then((result) => {
                console.log("Total commitments result", result)
                let fromWei = this.web3.utils.fromWei(result.toString(), this.usdPlusWeiType); // mwei - 6, gwei - 9, ether - 18
                this.totalCommitments = fromWei * 1;
                console.log("Total commitments", this.totalCommitments, fromWei)
            });

            // fundsInPresale
            this.ovnICOContract.methods.totalCommitments().call().then((result) => {
                console.log("Funds in presale result", result)
                let fromWei = this.web3.utils.fromWei(result.toString(), this.usdPlusWeiType); // mwei - 6, gwei - 9, ether - 18
                this.fundsInPresale = fromWei * 1;
                console.log("Funds in presale", this.fundsInPresale, fromWei)
            });

            // user step
            this.updateCurrentUserStep();

            // getUserInfo
            this.updateUserInfo();

            // load ico usd+ balance
            this.loadIcoBalance();
        },

        loadIcoBalance() {
            this.contracts.usdPlus.methods.balanceOf(this.ovnICOContract.options.address).call().then((result) => {
                console.log("icoBalance result", result)
                let fromWei = this.web3.utils.fromWei(result.toString(), this.usdPlusWeiType); // mwei - 6, gwei - 9, ether - 18
                this.icoBalance = fromWei * 1;
                console.log("icoBalance", this.icoBalance, fromWei)
            });
        },

        async loadContracts() {
            console.log("Load contracts for tokens")

            const ERC20 = await loadJSON('/contracts/ERC20.json');
            console.log("Contracts ERC20 loaded", ERC20);
            this.ovnTokenContract = this._loadContract(ERC20, this.web3, this.ovnTokenAddress);
            console.log("Token contract be loaded.", this.ovnTokenContract)

            const whitelistFile = await loadJSON(`/contracts/${this.networkName}/presale/Whitelist.json`);
            this.ovnWhitelistContract = this._loadContract(whitelistFile, this.web3);
            console.log("Whitelist contract be loaded.", this.ovnWhitelistContract)

            const icoFile = await loadJSON(`/contracts/${this.networkName}/presale/OverflowICO.json`);
            this.ovnICOContract = this._loadContract(icoFile, this.web3);
            console.log("ICO contract be loaded.", this.ovnICOContract)
        },

        _loadContract(file, web3, address) {
            if (!address) {
                address = file.address;
            }

            return new web3.eth.Contract(file.abi, address);

        },
        async claimVesting() {
            if (this.currentStepType !== 'CLAIM_VESTING') {
                console.log("Not claim vesting step");
                return;
            }

            this.showWaitingModal('Claim Vesting in process');

            try {
                let buyParams;
                await this.refreshGasPrice();
                if (this.gas == null) {
                    buyParams = {from: this.account, gasPrice: this.gasPriceGwei};
                } else {
                    buyParams = {from: this.account, gasPrice: this.gasPriceGwei, gas: this.gas};
                }

                // claimVesting
                let result = await this.ovnICOContract.methods.claimVesting(this.account).send({
                    ...buyParams
                }).on('transactionHash', (hash) => {
                    console.log("Claim vesting result", hash)
                    this.showSuccessModal(true, hash, "You successfully claimed OVN tokens");
                    this.finishByFinishType(this.finishType);
                })
                console.log("Result: ", result)

                this.closeWaitingModal();
            } catch (e) {
                console.log("Claim vesting error", e)
                this.closeWaitingModal();
                this.showErrorModalWithMsg({errorType: 'claim-vesting', errorMsg: e.message});
            } finally {
                this.timeoutUpdateCurrentUserStep();
            }
            console.log("claim vesting");
        },

        async claimSalesPart1() {
            if (this.currentStepType !== 'CLAIM_SALES_FIRST_PART') {
                console.log("Not claim sales step");
                return;
            }

            this.showWaitingModal('Claim Sales First Part in process');

            try {

                let buyParams;
                await this.refreshGasPrice();
                if (this.gas == null) {
                    buyParams = {from: this.account, gasPrice: this.gasPriceGwei};
                } else {
                    buyParams = {from: this.account, gasPrice: this.gasPriceGwei, gas: this.gas};
                }

                // claimSalesPart1
                let result = await this.ovnICOContract.methods.claimSalesFirstPart().send({
                    ...buyParams
                }).on('transactionHash', (hash) => {
                    console.log("Claim sales part 1 result", hash)
                    this.closeWaitingModal();
                    this.showSuccessModal(true, hash, "You successfully claimed OVN tokens");
                    this.finishByFinishType(this.finishType);
                })

                console.log("Result: ", result)

                this.closeWaitingModal();
            } catch (e) {
                console.log("Claim sales part 1 error", e)
                this.closeWaitingModal();
                this.showErrorModalWithMsg({errorType: 'claim-sales-first-part', errorMsg: e.message});
            } finally {
                this.timeoutUpdateCurrentUserStep();
            }
            console.log("claim sales part 1");
        },

        async claimBonus() {
            if (this.currentStepType !== 'CLAIM_BONUS') {
                console.log("Not claim bonus step");
                return;
            }

            this.showWaitingModal('Claim Bonus in process');

            try {
                let buyParams;
                await this.refreshGasPrice();
                if (this.gas == null) {
                    buyParams = {from: this.account, gasPrice: this.gasPriceGwei};
                } else {
                    buyParams = {from: this.account, gasPrice: this.gasPriceGwei, gas: this.gas};
                }

                // claimBonus
                let result = await this.ovnICOContract.methods.claimBonus().send({
                    ...buyParams
                }).on('transactionHash', (hash) => {
                    console.log("Claim bonus result", hash)
                    this.closeWaitingModal();
                    this.showSuccessModal(true, hash, "You successfully claimed OVN tokens");
                    this.finishByFinishType(this.finishType);
                    this.timeoutUpdateCurrentUserStep();
                })

                console.log("Result: ", result)

                this.closeWaitingModal();
            } catch (e) {
                console.log("Claim bonus error", e)
                this.closeWaitingModal();
                this.showErrorModalWithMsg({errorType: 'claim-bonus', errorMsg: e.message});
            } finally {
                this.timeoutUpdateCurrentUserStep();
            }

            console.log("claim bonus");
        },

        goToClaim() {
            console.log("Go to claim");
            window.location.replace("/presale/claim");
        },

        async claimRefund() {
            if (this.currentStepType !== 'CLAIM_REFUND') {
                console.log("Not claim refund step");
                return;
            }

            this.showWaitingModal('Claim Bonus in process');
            try {
                let buyParams;
                await this.refreshGasPrice();
                if (this.gas == null) {
                    buyParams = {from: this.account, gasPrice: this.gasPriceGwei};
                } else {
                    buyParams = {from: this.account, gasPrice: this.gasPriceGwei, gas: this.gas};
                }

                // claimRefund
                console.log("Claim refund", buyParams)
                let result = await this.ovnICOContract.methods.claimRefund().send({
                    ...buyParams
                }).on('transactionHash', (hash) => {
                    console.log("Claim refund result", hash)
                    this.closeWaitingModal();
                    this.showSuccessModal(true, hash, "You successfully get your funds back", 'usd+');
                })

                console.log("Result: ", result)

                this.closeWaitingModal();
            } catch (e) {
                console.log("Claim refund error", e)
                this.closeWaitingModal();
                this.showErrorModalWithMsg({errorType: 'claim-refund', errorMsg: e.message});
            } finally {
                this.timeoutUpdateCurrentUserStep();
            }

            console.log("claim refund");
        },
        claimFunds() {
            console.log("claim funds")
        },
        async checkNftsInBlockchain() {
            // if not galaxe nfts and not partner nfts return null
            if (!this.galxeNftsIds.length && !this.partnerNftsIds.length) {
                this.nftStatus = false;
                return;
            }

            let isWhitelist;
            try {
                let account = this.account
                isWhitelist = await this.ovnWhitelistContract.methods.isWhitelist(account, this.galxeNftsIds, this.partnerNftsIds).call();
                this.isWhitelist = isWhitelist;
                console.log("Is whitelist result: ", isWhitelist)
            } catch (e) {
                console.log("Check nfts in blockchain error", e)
                this.nftStatus = false;
                return;
            }

            if (!isWhitelist) {
                this.nftStatus = false;
                console.log("NFT isWhitelist error", isWhitelist)
                return;
            }

            // service
            if (isWhitelist[0].includes(true)) {
                console.log("NFT service exist at user")
                this.nftStatus = true;
                return;
            }

            // partner
            if (isWhitelist[1].includes(true)) {
                console.log("NFT partner exist at user")
                this.nftStatus = true;
                return;
            }

            this.nftStatus = false;
        },
        async loadNft() {
            if (!this.account) {
                this.nftLoading = false;
                return;
            }

            this.nftLoading = true;

            let account = this.account;
            let url = "https://app.overnight.fi/api/presale";
            balanceApiService.checkBaseBalanceWithNft(url, account)
                .then(async (result) => {
                    console.log("NFT result", result)

                    if (!result || !result.data || !result.data.items || !result.data.items.length) {
                        this.nftStatus = false;
                        this.nftLoading = false;
                        return;
                    }

                    let galxeNfts = result.data.items.find((item) => {
                        return item.contract_address === this.nftGalxeAddress;
                    });

                    if (galxeNfts) {
                        this.galxeNftsIds = galxeNfts.nft_data.map((item) => {
                            return item.token_id;
                        })
                    }

                    // console.log()

                    let partnerNfts = result.data.items.find((item) => {
                        return item.contract_address === this.nftPartnerAddress;
                    });

                    if (partnerNfts) {
                        this.partnerNftsIds = partnerNfts.nft_data.map((item) => {
                            return item.token_id;
                        })
                    }

                    console.log("Nfts galxe: ", galxeNfts, this.galxeNftsIds);
                    console.log("Nfts partner: ", partnerNfts, this.partnerNftsIds);

                    await this.checkNftsInBlockchain()
                    this.nftLoading = false;
                }).catch(e => {
                console.log("NFT LOADING error", e)
                this.nftLoading = false;
            });
        },
        updateCurrentUserStep() {
            // current step
            this.ovnICOContract.methods.getUserState(this.account).call().then((result) => {
                console.log("Current step result", result)
                this.currentStep = result;
                this.currentStepType = USER_PRESALE_STATE_MAP[result];
                console.log("Current step", this.currentStep, this.currentStepType)
            });
        },
        updateUserInfo() {
            this.ovnICOContract.methods.getUserInfo(this.account).call().then((result) => {
                console.log("User info result", result)

                let fromWei = this.web3.utils.fromWei(result.userCommitments.toString(), this.usdPlusWeiType);
                this.accountTotalUsdPurchased = fromWei * 1;
                console.log("Total usd purchased", this.accountTotalUsdPurchased, fromWei)

                // salesToReceive
                let salesToReceive = this.web3.utils.fromWei(result.salesToReceive.toString(), this.ovnWeiType);
                this.accountTotalOvnPurchased = salesToReceive * 1;
                console.log("Total ovn purchased", this.accountTotalOvnPurchased, salesToReceive)

                //lockedSales
                let lockedSales = this.web3.utils.fromWei(result.lockedSales.toString(), this.ovnWeiType);
                this.accountVestingAmount = lockedSales * 1;
                console.log("Vesting amount", this.accountVestingAmount, lockedSales)

                // unlockedSales
                let unlockedSales = this.web3.utils.fromWei(result.unlockedSales.toString(), this.ovnWeiType);
                this.accountClaimableAmount = unlockedSales * 1;
                console.log("Claimable amount", this.accountClaimableAmount, unlockedSales)

                // commitToReceive
                let commitToReceive = this.web3.utils.fromWei(result.commitToReceive.toString(), this.usdPlusWeiType);
                this.accountFarmingBonus = commitToReceive * 1;
                console.log("Account Farming bonus", this.accountFarmingBonus, commitToReceive)

                // commitToRefund
                let commitToRefund = this.web3.utils.fromWei(result.commitToRefund.toString(), this.usdPlusWeiType);
                this.accountOverflowFunds = commitToRefund * 1;
                console.log("Overflow funds", this.accountOverflowFunds, commitToRefund)

                // end of loading
                this.isFirstLoading = false;
            });
        },
        updateStatus() {
            this.updateBaseAndUserInfo();
        },

        nextStep() {
            if (this.currentStep === null) {
                return;
            }

            if (this.currentStep >= 9) {
                this.currentStep = 9;
                return;
            }

            this.currentStep++
            this.currentStepType = USER_PRESALE_STATE_MAP[this.currentStep];
        },
        prevStep() {
            if (this.currentStep === null) {
                return;
            }

            if (this.currentStep <= 0) {
                this.currentStep = 0;
                return;
            }

            this.currentStep--
            this.currentStepType = USER_PRESALE_STATE_MAP[this.currentStep];
        },
        devStepsUpper() {
            if (this.devSteps === 8) {
                this.devSteps = 0;
                this.turnOfStatusControls = true;
            } else {
                this.devSteps++;
            }
        },

        finishByFinishType(finishType) {
            setTimeout(() => {
                try {
                    this.closeWaitingModal();
                    this.closeErrorModal();
                } catch (e) {
                    console.log("Close modal error", e)
                }

                if (finishType === 'HOLD') {
                    console.log("Finish transaction by type HOLD");
                    return;
                }

                if (finishType === 'BRIDGE') {
                    console.log("Finish transaction by type BRIDGE");
                    // location to bridge
                    window.location.replace("/bridge");
                    return;
                }

                if (finishType === 'FARM') {
                    console.log("Finish transaction by type FARM", this.aerodromePool);
                    this.openZapInWithInputOvn(this.aerodromePool, 'claim');
                    return;
                }

                if (finishType === 'INSURANCE') {
                    console.log("Finish transaction by type BRIDGE");
                    // location to bridge
                    window.location.replace("/insurance");
                    return;
                }

                console.error("Finish transaction type not found", finishType);
            }, 3000);
        }

    }
}
