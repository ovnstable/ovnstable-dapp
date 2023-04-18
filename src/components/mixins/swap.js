import BN from "bn.js";
import {mapActions} from "vuex";

export const swap = {
    data() {
        return {
            sumApproveCheckerId: null,
            sumApproveCheckerSec: 0,
            isShowDecreaseAllowanceButton: true
        }
    },
    computed: {
        isShowDecreaseAllowance () {
            return this.isShowDecreaseAllowanceButton && this.account === '0x4473D652fb0b40b36d549545e5fF6A363c9cd686'; // test front dev address
        },
    },
    methods: {
        ...mapActions("gasPrice", ['refreshGasPrice']),
        ...mapActions("referral", ['getReferralCode']),


        ...mapActions("errorModal", ['showErrorModal', 'showErrorModalWithMsg']),
        ...mapActions("waitingModal", ['showWaitingModal', 'closeWaitingModal']),
        ...mapActions("successModal", ['showSuccessModal']),

        ...mapActions("transaction", ['putTransaction', 'loadTransaction']),


        async checkApprove(action, sliderPercent, originalBalance, account, sum, actionDecimals, exchangeContract, exchangeMethodName, actionContract, disapproveActionFunc, approveActionFunc, ovnStableContract) {
            console.log(`Check Approve action. Sum: ${sum} sliderPercent: ${sliderPercent} ActionDecimals: ${actionDecimals}`);
            console.log(`Check Approve action. Contracts: `, exchangeContract, actionContract);

            try {
                if (!sum || isNaN(sum) || !account) {
                    return;
                }

                let contractSum;
                if (sliderPercent === 100) {
                    let originalMax = this.getMax(originalBalance);
                    contractSum = originalMax;
                    if (!originalMax) {
                        let errorMessage = "Original max value not exist, when buy action. type: " + action ;
                        console.error(errorMessage)
                        this.showErrorModalWithMsg({errorType: 'buy', errorMsg: {code: 1, message: errorMessage}});
                        return;
                    }
                } else {
                    sum = sum + '';
                    switch (action === 'swap-redeem' ? 6 : actionDecimals) {
                        case 6:
                            contractSum = this.web3.utils.toWei(sum, 'mwei');
                            break;
                        case 8:
                            contractSum = this.web3.utils.toWei(sum, 'mwei') * 100;
                            break;
                        case 18:
                            contractSum = this.web3.utils.toWei(sum, 'ether');
                            break;
                        default:
                            console.error(`Decimals not found when check approve. account: ${account} sum: ${sum} actionDecimals: ${actionDecimals}`);
                            return ;
                    }
                }

                let allowApprove = await this.checkAllowance(action, account, contractSum, exchangeContract, exchangeMethodName, actionContract, ovnStableContract);
                console.log(`Allow to approve. allowApprove: ${allowApprove}, sum: ${sum}, contractSum: ${contractSum}, contractSumNum: ${contractSum * 1}, originalBalance: ${originalBalance}`, allowApprove);
                if (!allowApprove) {
                    disapproveActionFunc();
                    return false;
                } else {
                    approveActionFunc();
                    return true;
                }
            } catch (e) {
                console.error(`Approve action error. Type: ${action}. Account: ${account}, Sum: ${sum}. Error: ${e}`);
                this.showErrorModalWithMsg({errorType: 'approve', errorMsg: e});
                disapproveActionFunc();
                return false;
            }

        },
        getMax(originalBalance) {
            return originalBalance ? originalBalance + '' : null;
        },

        async clearApprove(action, account, exchangeContract, exchangeMethodName, actionContract, disapproveActionFunc, approveActionFunc, ovnStableContract) {
            try {
                console.log("Click Approve action. Action: " + action + ' MethodName: ' + exchangeMethodName);
                let from = account;
                let allowanceValue = await this.getAllowanceValue(action, account, exchangeContract, exchangeMethodName, actionContract, ovnStableContract);
                console.log('allowanceValue: ', allowanceValue);

                if (allowanceValue === 0) {
                    console.log("Allowance not needed");
                    return;
                }

                let buyParams;

                await this.refreshGasPrice();
                if (this.gas == null) {
                    buyParams = {from: from, gasPrice: this.gasPriceGwei};
                } else {
                    buyParams = {from: from, gasPrice: this.gasPriceGwei, gas: this.gas};
                }

                if (action === 'swap-redeem' || action === 'dai-swap-redeem' || action === 'usdt-swap-redeem' || action === 'market-redeem' || action === 'unwrap-redeem') {
                    console.log("Redeem clear allowance with ovnStableContract", ovnStableContract, allowanceValue)
                    await ovnStableContract.methods.decreaseAllowance(exchangeContract.options.address, allowanceValue)
                        .send(buyParams)
                        .on('transactionHash', (hash) => {
                            console.log("Success clear allowance. hash: ", hash)
                            this.isShowDecreaseAllowanceButton = false;
                        });
                } else {
                    console.log("Action clear contract allowance", actionContract, allowanceValue)
                    await actionContract.methods.decreaseAllowance(exchangeContract.options.address, allowanceValue)
                        .send(buyParams)
                        .on('transactionHash',  (hash) => {
                            console.log("Success clear allowance. hash: ", hash)
                            this.isShowDecreaseAllowanceButton = false;
                        });
                }
            } catch (e) {
                this.showErrorModalWithMsg({errorType: 'clear_approve', errorMsg: e});

            }
        },

        async approveAction(action, account, actionDecimals, exchangeContract, exchangeMethodName, actionContract, disapproveActionFunc, approveActionFunc, ovnStableContract) {
            try {
                this.showWaitingModal('Approving in process');

                let approveSum = "10000000";

                let sum;
                switch (action === 'swap-redeem' ? 6 : actionDecimals) {
                    case 6:
                        sum = this.web3.utils.toWei(approveSum, 'mwei');
                        break;
                    case 8:
                        sum = this.web3.utils.toWei(approveSum, 'mwei') * 100;
                        break;
                    case 18:
                        sum = this.web3.utils.toWei(approveSum, 'ether');
                        break;
                    default:
                        console.error(`Decimals not found when check approve action. Account: ${account} actionDecimals: ${actionDecimals}`);
                        return;
                }

                let allowApprove = await this.checkAllowance(action, account, sum, exchangeContract, exchangeMethodName, actionContract, ovnStableContract);
                allowApprove = !allowApprove ? (await this.approveBlockchainAction(action, account, sum, exchangeContract, exchangeMethodName, actionContract, ovnStableContract)) : true;
                if (!allowApprove) {
                    this.closeWaitingModal();
                    disapproveActionFunc();
                    return;
                } else {
                    approveActionFunc();
                    this.closeWaitingModal();
                }
            } catch (e) {
                console.error(`Approve action error: ${e}. Type: ${action}. Account: ${account}. Error: ${e}`);
                disapproveActionFunc();
                this.showErrorModalWithMsg({errorType: 'approve', errorMsg: e}, );
            }
        },

        async checkApproveCounter(action, sliderPercent, originalBalance, account, sum, actionDecimals, exchangeContract, exchangeMethodName, actionContract, disapproveActionFunc, approveActionFunc, ovnStableContract) {
            if (!this.sumApproveCheckerId) {
                // first call
                this.sumApproveCheckerId = -1;
                await this.checkApprove(action, sliderPercent, originalBalance, account, sum, actionDecimals, exchangeContract, exchangeMethodName, actionContract, disapproveActionFunc, approveActionFunc, ovnStableContract);
                return;
            }

            this.sumApproveCheckerSec = 0;
            let intervalId = setInterval(async () => {
                this.sumApproveCheckerSec++;

                if (this.sumApproveCheckerSec >= 2) {
                    if (this.sumApproveCheckerId === intervalId) {
                        this.sumApproveCheckerSec = 0;
                        try {
                            await this.checkApprove(action, sliderPercent, originalBalance, account, sum, actionDecimals, exchangeContract, exchangeMethodName, actionContract, disapproveActionFunc, approveActionFunc, ovnStableContract);
                        } catch (e) {
                            // ignore
                        } finally {
                            clearInterval(intervalId)
                        }
                    } else {
                        clearInterval(intervalId)
                    }

                }
            }, 1000);

            this.sumApproveCheckerId = intervalId;
        },

        async approveBlockchainAction(action, account, sum, exchangeContract, exchangeMethodName, actionContract, ovnStableContract) {
            try {
                await this.refreshGasPrice();
                let from = account;

                let approveParams = {gasPrice: this.gasPriceGwei, from: from};

                let tx;
                if (action === 'swap-redeem' || action === 'dai-swap-redeem' || action === 'usdt-swap-redeem' || action === 'market-redeem' || action === 'unwrap-redeem') {
                    console.log("Redeem approve with ovnStableContract", ovnStableContract)
                    tx = await ovnStableContract.methods.approve(exchangeContract.options.address, sum).send(approveParams);
                } else {
                    console.log("Redeem approve with action contract", actionContract)
                    tx = await actionContract.methods.approve(exchangeContract.options.address, sum).send(approveParams);
                }


                let minted = true;
                while (minted) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    let receipt = await this.web3.eth.getTransactionReceipt(tx.transactionHash);

                    if (receipt) {
                        if (receipt.status) {
                            this.isShowDecreaseAllowanceButton = true;
                            return true;
                        } else {
                            return false;
                        }
                    }
                }

                this.isShowDecreaseAllowanceButton = true;
                return true;
            } catch (e) {
                console.error(`Approve blockchain action error. Type: ${action}. Sum: ${sum}. Account: ${account}. Error: ${e}`);
                this.showErrorModalWithMsg({errorType: 'approve', errorMsg: e});
                return false;
            }
        },
        async checkAllowance(action, account, sum, exchangeContract, exchangeMethodName, actionContract, ovnStableContract) {
            let allowanceValue = await this.getAllowanceValue(action, account, exchangeContract, exchangeMethodName, actionContract, ovnStableContract);
            return allowanceValue >= sum * 1;
        },

        async getAllowanceValue(action, account, exchangeContract, exchangeMethodName, actionContract, ovnStableContract) {
            let from = account;

            let allowanceValue;
            if (action === 'swap-redeem' || action === 'dai-swap-redeem' || action === 'usdt-swap-redeem' || action === 'market-redeem' || action === 'unwrap-redeem') {
                console.log("Redeem allowance with ovnStableContract", ovnStableContract, exchangeContract)
                allowanceValue = await ovnStableContract.methods.allowance(from, exchangeContract.options.address).call();
                console.log('allowanceValue with ovnStable in redeem: ', allowanceValue)
            } else {
                console.log("Action contract allowance", actionContract, exchangeContract)
                allowanceValue = await actionContract.methods.allowance(from, exchangeContract.options.address).call();
                console.log('allowanceValue: ', allowanceValue)
            }

            return allowanceValue;
        },

        async buyAction(action, sliderPercent, originalBalance, account, sum, actionDecimals, exchangeContract, exchangeMethodName, actionContract, resultTxInfo, finalizeFunc, disapproveActionFunc, approveActionFunc, ovnStableContract) {
            try {

                let sumInUsd = sum + '';
                let contractSum;

                if (sliderPercent === 100) {
                    let originalMax = this.getMax(originalBalance);
                    contractSum = originalMax;
                    if (!originalMax) {
                        let errorMessage = "Original max value not exist, when buy action. type: " + action ;
                        console.error(errorMessage)
                        this.showErrorModalWithMsg({errorType: 'buy', errorMsg: {code: 1, message: errorMessage}});
                        return;
                    }
                } else {
                    sum = sum + '';

                    switch (actionDecimals) {
                        case 6:
                            contractSum = this.web3.utils.toWei(sum, 'mwei');
                            break;
                        case 8:
                            contractSum = this.web3.utils.toWei(sum, 'mwei') * 100;
                            break;
                        case 18:
                            contractSum = this.web3.utils.toWei(sum, 'ether');
                            break;
                        default:
                            console.error(`Decimals type not found for detect wei type in ${action}. Account: ${account} Sum: ${contractSum} SumInUsd: ${sumInUsd} ActionDecimals: ${actionDecimals}`);
                            return;
                    }
                }

                if (!(await this.checkApprove(action, sliderPercent, originalBalance, account, sum, actionDecimals, exchangeContract, exchangeMethodName, actionContract, disapproveActionFunc, approveActionFunc, ovnStableContract))) {
                    console.debug(`Buy-Action in ${action}. Approve not pass. Sum: ${contractSum} SumInUsd: ${sumInUsd}. Account: ${account}.`);
                    return;
                }

                let from = account;
                let self = this;

                try {
                    await this.refreshGasPrice();

                    let buyParams;

                    if (this.gas == null) {
                        buyParams = {from: from, gasPrice: this.gasPriceGwei};
                    } else {
                        buyParams = {from: from, gasPrice: this.gasPriceGwei, gas: this.gas};
                    }

                    let referral = await this.getReferralCode();
                    referral = referral ? referral : '';

                    let method = await this.getContractMethodWithParams(action, account, contractSum, exchangeContract, exchangeMethodName, actionContract, ovnStableContract);
                    if (!method){
                        let errorMessage = "Exchange Method type not found when create method params in buy action. MethodType: " + exchangeMethodName;
                        console.error(errorMessage);
                        this.showErrorModalWithMsg({errorType: 'approve', errorMsg: {code: 1, message: errorMessage}});
                        return;
                    }

                    console.debug(`Invest blockchain. Buy action Sum: ${contractSum}. decimals: ${actionDecimals}. usdSum: ${sum}. Account: ${account}. SlidersPercent: ${sliderPercent}`);
                    let buyResult = await method.send(buyParams).on('transactionHash', function (hash) {
                    let tx = {
                        hash: hash,
                        text: resultTxInfo.text,
                        product: resultTxInfo.product,
                        productName: resultTxInfo.productName,
                        action: resultTxInfo.action,
                        amount: sumInUsd,
                    };

                    self.putTransaction(tx);
                    self.showSuccessModal({
                        successTxHash: hash,
                        successAction: resultTxInfo.successAction,
                        etsData: resultTxInfo.etsData
                    });
                    self.loadTransaction();
                });

                if (this.isOvercapAvailable) {
                    // TODO 5: ??
                    // let noOvercapSum = parseFloat(this.etsData.maxSupply) - parseFloat(this.totalSupply[this.etsData.name]);
                    // let useOvercapSum;
                    //
                    // if (noOvercapSum <= 0) {
                    //     useOvercapSum = this.sum;
                    // } else {
                    //     useOvercapSum = Math.max(this.sum - noOvercapSum, 0);
                    // }
                    //
                    // await this.useOvercap({
                    //     overcapLeft: this.overcapRemaining(),
                    //     overcapVolume: useOvercapSum
                    // });
                }
                } catch (e) {
                    console.error(`[Contract part method]. Action buy in ${action}. Sum: ${sum}. ContractSum: ${contractSum}, Account: ${account}. Error: ${e}`);
                    this.showErrorModalWithMsg({errorType: 'approve', errorMsg: e}, );
                }

            } catch (e) {
                console.error(`[All method]. Action buy in ${action}. Sum: ${sum}. Account: ${account}. Error: ${e}`);
                this.showErrorModalWithMsg({errorType: 'approve', errorMsg: e}, );
            } finally {
                finalizeFunc();
            }
        },


        async confirmSwapAction(action, sliderPercent, originalBalance, account, sum, actionDecimals, exchangeContract, exchangeMethodName, actionContract, resultTxInfo, finalizeFunc, disapproveActionFunc, approveActionFunc, ovnStableContract) {
            try {
                let contractSum;

                if (sliderPercent === 100) {
                    let originalMax = this.getMax(originalBalance);
                    contractSum = originalMax;
                    if (!originalMax) {
                        let errorMessage = "Original max value not exist, when swap action. type: " + action ;
                        console.error(errorMessage)
                        this.showErrorModalWithMsg({errorType: 'approve', errorMsg: {code: 1, message: errorMessage}});
                        return;
                    }
                } else {
                    sum = sum + '';
                    switch (actionDecimals) {
                        case 6:
                            contractSum = this.web3.utils.toWei(sum, 'mwei');
                            break;
                        case 8:
                            contractSum = this.web3.utils.toWei(sum, 'mwei') * 100;
                            break;
                        case 18:
                            contractSum = this.web3.utils.toWei(sum, 'ether');
                            break;
                        default:
                            console.error(`Decimals type not found for detect wei type in ${action}. Account: ${account} Sum: ${contractSum} SumInUsd: ${sum} ActionDecimals: ${actionDecimals}`);
                            return;
                    }
                }

                // todo 5: 'test-product' remove
                let estimatedGasValue = await this.estimateGas(action, account, contractSum, 'test-product', exchangeContract, exchangeMethodName, actionContract, ovnStableContract);
                if (estimatedGasValue === -1 || estimatedGasValue === undefined) {
                    this.gas = null;

                    // todo 5
                    // this.gasAmountInMatic = null;
                    // this.gasAmountInUsd = null;

                    await this.buyAction(action, sliderPercent, originalBalance, account, sum, actionDecimals, exchangeContract, exchangeMethodName, actionContract, resultTxInfo, finalizeFunc, disapproveActionFunc, approveActionFunc, ovnStableContract);

                    this.closeWaitingModal();
                } else {
                    this.estimatedGas = estimatedGasValue;

                    /* adding 10% to estimated gas */
                    this.gas = new BN(Number.parseFloat(this.estimatedGas) * 1.1);

                    // todo 5
                    // this.gasAmountInMatic = this.web3.utils.fromWei(this.gas.muln(Number.parseFloat(this.gasPrice)), "gwei");
                    // this.gasAmountInUsd = this.web3.utils.fromWei(this.gas.muln(Number.parseFloat(this.gasPrice) * Number.parseFloat(this.gasPriceStation.usdPrice)), "gwei");

                    await this.buyAction(action, sliderPercent, originalBalance, account, sum, actionDecimals, exchangeContract, exchangeMethodName, actionContract, resultTxInfo, finalizeFunc, disapproveActionFunc, approveActionFunc, ovnStableContract);
                    this.closeWaitingModal();
                }
            } catch (e) {
                console.error(`Market swap action in ${action}. Sum: ${sum}. Account: ${account}. Error: ${e}`);
                this.showErrorModalWithMsg({errorType: 'estimateGas', errorMsg: e});
            }
        },

        async estimateGas(action, account, sum, productName, exchangeContract, exchangeMethodName, actionContract, ovnStableContract) {

            console.log("actionContract: ", actionContract);

            let from = account;
            let result;

            try {
                let estimateOptions = {from: from, "gasPrice": this.gasPriceGwei};
                let blockNum = await this.web3.eth.getBlockNumber();

                let method = await this.getContractMethodWithParams(action, account, sum, exchangeContract, exchangeMethodName, actionContract, ovnStableContract);
                 if (!method){
                     let errorMessage = "Exchange Method type not found when create method params in estimate gas. MethodType: " + exchangeMethodName;
                     console.error(errorMessage);
                     this.showErrorModalWithMsg({errorType: 'approve', errorMsg: {code: 1, message: errorMessage}});
                    return;
                 }

                await method.estimateGas(estimateOptions)
                    .then(function (gasAmount) {
                        result = gasAmount;
                    })
                    .catch(function (error) {
                        if (error && error.message) {
                            let msg = error.message.replace(/(?:\r\n|\r|\n)/g, '');

                            let errorMsg = {
                                product: productName,
                                data: {
                                    from: from,
                                    to: actionContract.options.address,
                                    gas: null,
                                    gasPrice: parseInt(estimateOptions.gasPrice, 16),
                                    method: method.encodeABI(),
                                    message: msg,
                                    block: blockNum
                                }
                            };

                            console.error(errorMsg);
                        } else {
                            console.error(error);
                        }

                        return -1;
                    });
            } catch (e) {
                console.error(`Estimate action in ${action}. Account: ${account} Sum: ${sum}.error: ${e} `);
                this.showErrorModalWithMsg({errorType: 'estimateGas', errorMsg: e});
                return -1;
            }

            return result;
        },

        async getContractMethodWithParams(action, account, contractSum, exchangeContract, exchangeMethodName, actionContract, ovnStableContract) {

            // ets mint: (sum, referral)
            // usd+ mint  let mintParams = {
            //          asset: contracts.asset.options.address,
            //          amount: sum,
            //          referral: await this.getReferralCode(),
            //       }
            // wrap/unwrap (this.tokenContract.options.address, sum, this.account)

            // contractSum = contractSum + "";

            let methodParam;

            let referral = await this.getReferralCode();
            referral = referral ? referral : '';

            if (exchangeMethodName === 'mint') {
                methodParam = {
                    asset: actionContract.options.address,
                    amount: contractSum,
                    referral: referral,
                }

                return exchangeContract.methods[exchangeMethodName](methodParam);
            }

            if (exchangeMethodName === 'buy') {
                methodParam = {
                    sum: contractSum,
                    referral: referral
                }

                return exchangeContract.methods[exchangeMethodName](...Object.values(methodParam));
            }

            if (exchangeMethodName === 'wrap') {
                methodParam = {
                    asset: actionContract.options.address,
                    sum: contractSum,
                    account: account
                }

                return exchangeContract.methods[exchangeMethodName](...Object.values(methodParam));
            }

            if (exchangeMethodName === 'unwrap') {
                methodParam = {
                    asset: actionContract.options.address,
                    sum: contractSum,
                    account: account
                }

                return exchangeContract.methods[exchangeMethodName](...Object.values(methodParam));
            }

            if (exchangeMethodName === 'redeem') {
                if (action === 'market-redeem') {
                    methodParam = {
                        sum: contractSum,
                    }
                } else if (action === 'swap-redeem' || action === 'dai-swap-redeem' || action === 'usdt-swap-redeem') {
                    methodParam = {
                        asset: actionContract.options.address,
                        sum: contractSum,
                    }
                } else {
                    console.error("Exchange Method redeem error. Action not found when create method params in estimate gas. action: " + action);
                    return;
                }


                return exchangeContract.methods[exchangeMethodName](...Object.values(methodParam));
            }

            return null;
        }
    }
}
