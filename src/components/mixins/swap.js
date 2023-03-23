import BN from "bn.js";
import {axios} from "@/plugins/http-axios";
import {mapActions} from "vuex";

export const swap = {
    data() {
        return {
            sumApproveCheckerId: null,
            sumApproveCheckerSec: 0
        }
    },
    methods: {
        ...mapActions("gasPrice", ['refreshGasPrice']),
        ...mapActions("referral", ['getReferralCode']),


        ...mapActions("errorModal", ['showErrorModal', 'showErrorModalWithMsg']),
        ...mapActions("waitingModal", ['showWaitingModal', 'closeWaitingModal']),
        ...mapActions("successModal", ['showSuccessModal']),

        ...mapActions("transaction", ['putTransaction', 'loadTransaction']),


        async checkApprove(action, account, sum, actionDecimals, exchangeContract, exchangeMethodName, actionContract, disapproveActionFunc, approveActionFunc) {
            console.log("Check Approve action", sum);

            try {
                if (!sum || isNaN(sum) || !account) {
                    return;
                }

                let contractSum;

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
                        console.error(`Decimals not found when check approve. account: ${account} sum: ${sum} actionDecimals: ${actionDecimals}`);
                        return ;
                }

                let allowApprove = await this.checkAllowance(action, account, contractSum, exchangeContract, exchangeMethodName, actionContract);
                console.log("Allow to approve : ", allowApprove, sum)
                if (!allowApprove) {
                    disapproveActionFunc();
                    return false;
                } else {
                    approveActionFunc();
                    return true;
                }
            } catch (e) {
                console.error(`Approve action error. Type: ${action}. Account: ${account}, Sum: ${sum}. Error: ${e}`);
                // this.showErrorModal('approve');
                this.showErrorModalWithMsg({errorType: 'approve', errorMsg: e}, );
                disapproveActionFunc();
                return false;
            }

        },
        getMax(originalBalance) {
            return originalBalance ? originalBalance + '' : null;
        },

        async approveAction(action, account, actionDecimals, exchangeContract, exchangeMethodName, actionContract, disapproveActionFunc, approveActionFunc) {
            try {
                this.showWaitingModal('Approving in process');

                let approveSum = "10000000";

                let sum;
                switch (actionDecimals) {
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

                let allowApprove = await this.checkAllowance(action, account, sum, exchangeContract, exchangeMethodName, actionContract);
                allowApprove = !allowApprove ? (await this.approveBlockchainAction(action, account, sum, exchangeContract, exchangeMethodName, actionContract)) : true;
                if (!allowApprove) {
                    this.closeWaitingModal();
                    // this.showErrorModal('approve');
                    this.showErrorModalWithMsg({errorType: 'approve', errorMsg: e}, );
                    disapproveActionFunc();
                    return;
                } else {
                    approveActionFunc();
                    this.closeWaitingModal();
                }
            } catch (e) {
                console.error(`Approve action error: ${e}. Type: ${action}. Account: ${account}. Error: ${e}`);
                disapproveActionFunc();
                // this.showErrorModal('approve');
                this.showErrorModalWithMsg({errorType: 'approve', errorMsg: e}, );
            }
        },

        async checkApproveCounter(action, account, sum, actionDecimals, exchangeContract, exchangeMethodName, actionContract, disapproveActionFunc, approveActionFunc) {
            if (!this.sumApproveCheckerId) {
                // first call
                this.sumApproveCheckerId = -1;
                await this.checkApprove(action, account, sum, actionDecimals, exchangeContract, exchangeMethodName, actionContract, disapproveActionFunc, approveActionFunc);
                return;
            }

            this.sumApproveCheckerSec = 0;
            let intervalId = setInterval(async () => {
                this.sumApproveCheckerSec++;

                if (this.sumApproveCheckerSec >= 2) {
                    if (this.sumApproveCheckerId === intervalId) {
                        this.sumApproveCheckerSec = 0;
                        try {
                            await this.checkApprove(action, account, sum, actionDecimals, exchangeContract, exchangeMethodName, actionContract, disapproveActionFunc, approveActionFunc);
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

        async approveBlockchainAction(action, account, sum, exchangeContract, exchangeMethodName, actionContract) {
            try {
                await this.refreshGasPrice();
                let from = account;

                let approveParams = {gasPrice: this.gasPriceGwei, from: from};

                let tx = await actionContract.methods.approve(exchangeContract.options.address, sum).send(approveParams);

                let minted = true;
                while (minted) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    let receipt = await this.web3.eth.getTransactionReceipt(tx.transactionHash);

                    if (receipt) {
                        if (receipt.status)
                            return true;
                        else {
                            return false;
                        }
                    }
                }

                return true;
            } catch (e) {
                console.error(`Approve blockchain action error. Type: ${action}. Sum: ${sum}. Account: ${account}. Error: ${e}`);
                return false;
            }
        },
        async checkAllowance(action, account, sum, exchangeContract, exchangeMethodName, actionContract) {
            let from = account;

            let allowanceValue = await actionContract.methods.allowance(from, exchangeContract.options.address).call();
            console.log('allowanceValue: ', allowanceValue, sum, allowanceValue * 1 >= sum * 1)
            return allowanceValue * 1 >= sum * 1;
        },

        async buyAction(action, sliderPercent, originalBalance, account, sum, actionDecimals, exchangeContract, exchangeMethodName, actionContract, resultTxInfo, finalizeFunc, disapproveActionFunc, approveActionFunc) {
            try {

                let sumInUsd = sum + '';
                let contractSum;

                if (sliderPercent === 100) {
                    let originalMax = this.getMax(originalBalance);
                    contractSum = originalMax;
                    if (!originalMax) {
                        console.error("Original max value not exist, when buy action in market invest.")
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

                if (!(await this.checkApprove(action, account, sum, actionDecimals, exchangeContract, exchangeMethodName, actionContract, disapproveActionFunc, approveActionFunc))) {
                    console.debug(`Buy-Action in ${action}. Approve not pass. Sum: ${contractSum} SumInUsd: ${sumInUsd}. Account: ${account}.`);
                    this.showErrorModalWithMsg({errorType: 'approve'}, );
                    return;
                }

                let contracts = this.contracts;
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

                    let etsActionData = this.etsData;

                    let method = await this.getContractMethodWithParams(action, account, contractSum, exchangeContract, exchangeMethodName, actionContract);
                    if (!method){
                        console.error("Exchange Method type not found when create method params in estimate gas. type: " + exchangeMethodName);
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


        async confirmSwapAction(action, sliderPercent, originalBalance, account, sum, actionDecimals, exchangeContract, exchangeMethodName, actionContract, resultTxInfo, finalizeFunc, disapproveActionFunc, approveActionFunc) {
            try {
                let contractSum;

                if (sliderPercent === 100) {
                    let originalMax = this.getMax(originalBalance);
                    contractSum = originalMax;
                    if (!originalMax) {
                        console.error("Original max value not exist, when confirm swap action in market invest.")
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
                let estimatedGasValue = await this.estimateGas(action, account, contractSum, 'test-product', exchangeContract, exchangeMethodName, actionContract);
                if (estimatedGasValue === -1 || estimatedGasValue === undefined) {
                    this.gas = null;

                    // todo 5
                    // this.gasAmountInMatic = null;
                    // this.gasAmountInUsd = null;

                    await this.buyAction(action, sliderPercent, originalBalance, account, sum, actionDecimals, exchangeContract, exchangeMethodName, actionContract, resultTxInfo, finalizeFunc, disapproveActionFunc, approveActionFunc);

                    this.closeWaitingModal();
                } else {
                    this.estimatedGas = estimatedGasValue;

                    /* adding 10% to estimated gas */
                    this.gas = new BN(Number.parseFloat(this.estimatedGas) * 1.1);

                    // todo 5
                    // this.gasAmountInMatic = this.web3.utils.fromWei(this.gas.muln(Number.parseFloat(this.gasPrice)), "gwei");
                    // this.gasAmountInUsd = this.web3.utils.fromWei(this.gas.muln(Number.parseFloat(this.gasPrice) * Number.parseFloat(this.gasPriceStation.usdPrice)), "gwei");

                    await this.buyAction(action, sliderPercent, originalBalance, account, sum, actionDecimals, exchangeContract, exchangeMethodName, actionContract, resultTxInfo, finalizeFunc, disapproveActionFunc, approveActionFunc);
                    this.closeWaitingModal();
                }
            } catch (e) {
                console.error(`Market swap action in ${action}. Sum: ${sum}. Account: ${account}. Error: ${e}`);
                this.showErrorModal('estimateGas');
            }
        },

        async estimateGas(action, account, sum, productName, exchangeContract, exchangeMethodName, exchangeParams, actionContract) {

            let from = account;
            let result;

            try {
                let estimateOptions = {from: from, "gasPrice": this.gasPriceGwei};
                let blockNum = await this.web3.eth.getBlockNumber();

                let method = await this.getContractMethodWithParams(action, account, sum, exchangeContract, exchangeMethodName, actionContract);
                 if (!method){
                    console.error("Exchange Method type not found when create method params in estimate gas. type: " + exchangeMethodName);
                    return;
                 }

                debugger

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
                return -1;
            }

            return result;
        },

        async getContractMethodWithParams(action, account, contractSum, exchangeContract, exchangeMethodName, actionContract) {

            // ets mint: (sum, referral)
            // usd+ mint  let mintParams = {
            //          asset: contracts.asset.options.address,
            //          amount: sum,
            //          referral: await this.getReferralCode(),
            //       }
            // wrap/unwrap (this.tokenContract.options.address, sum, this.account)


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
                } else if (action === 'swap-redeem' || action === 'dai-swap-redeem') {
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
