import loadJSON from "@/utils/http-utils";
const { default: BigNumber } = require("bignumber.js");

export const zap = {

    data() {
        return {
            zapPoolRoot: null,
            currentZapPlatformContractType: null,
            zapPlatformContractTypeMap: { // PlatformName: { name, type } name: ContractName, type: LP_WITH_STAKE_IN_ONE_STEP, LP_STAKE_DIFF_STEPS.
                'Chronos': {
                    name: 'Chronos',
                    type: 'LP_WITH_STAKE_IN_ONE_STEP',
                    network: 'arbitrum'
                },
                'Thena': {
                    name: 'Thena',
                    type: 'LP_STAKE_DIFF_STEPS',
                    network: 'bsc'
                },
                'Velodrome': {
                    name: 'Velodrome',
                    type: 'LP_STAKE_DIFF_STEPS',
                    network: 'optimism'
                },
                'Ramses': {
                    name: 'Ramses',
                    type: 'LP_STAKE_DIFF_STEPS',
                    network: 'arbitrum'
                },
            },
            zapContract: null,
            poolTokenContract: null,
            gaugeContract: null,
            pollsMap: { // pool address : gauge
                // Chronos https://arbiscan.io/address/0xc72b5c6d2c33063e89a50b2f77c99193ae6cee6c#readProxyContract
                "0xb260163158311596ea88a700c5a30f101d072326": '0xCD4A56221175b88d4fb28CA2138d670Cc1197CA9',
                "0x0d20ef7033b73ea0c9c320304b05da82e2c14e33": '0xaF618E6F5EF781e3aCFe00708BD005E0cc9A2e6F',
                "0x0df5f52afa0308fdd65423234c4fda9add0b9eba": '0xF319285fa8b5323A40c71D3c006dBd0BE4f5171b',
                "0x69fd0ea1041bc4c495d5371a074bf1dcd6700577": '0xD1C05e0770968c8b9C7dC0f3aC1DD419A3417971',
                "0x94c20b48faed9148a00ccf3229f4e50f791a26b6": '0x8Bc7811fdC24c82E842452F6EA3C7a20e1994889',
                "0xa885a1e7511cf6b572d949b1e60ac0a8449f3b18": '0xc8d79Fd3Ecc0F91d9C56E279Daba12257bE24619',
                "0xbbd7ff1728963a5eb582d26ea90290f84e89bd66": '0x3004F018B2C01d40D19C7dC4a5a0AFA8743a7e24',
                "0xcd78e225e36e724c9fb4bd8287296557d728cda7": '0x7de0998eE1Fce80c160AD1F5Fe768BFF9b0ee87f',

                // Thena https://api.thena.fi/api/v1/fusions
                "0x1561d9618db2dcfe954f5d51f4381fa99c8e5689": '0x3877c2C3D75aE80f2Ed8E9d4d68e3C1BFc77e5A6',
                "0x1f3ca66c98d682fa1bec31264692dad4f17340bc": '0xB0a69681d82c90B80B689BaF43ccfa6270f1DdE5',

                // Velodrome https://api.velodrome.finance/api/v1/pairs
                '0xa99817d2d286c894f8f3888096a5616d06f20d46': '0x05d74f34ff651e80b0a1a4bd96d8867626ac2ddd',
                '0x69c28d5bbe392ef48c0dc347c575023daf0cd243': '0xfc73bd75f1493f39de41ff41c20af69c7563f33a',
                '0x947a96b025c70497dbc0d095d966f3b59a675a70': '0xae95f97c4b189144d0323b424121e2c94b823906',
                '0x67124355cce2ad7a8ea283e990612ebe12730175': '0xd2d95775d35a6d492ced7c7e26817aacb7d264f2',
                '0x8a9cd3dce710e90177b4332c108e159a15736a0f': '0x1032950b49fc23316655e5d0cc066bcd85b28ec7',

                // Ramses https://ramses-api-5msw7.ondigitalocean.app/mixed-pairs
                '0xeb9153afbaa3a6cfbd4fce39988cea786d3f62bb': '0x88d8d2bdc4f12862fbabea43cec08b8fcd2234da',

            }
        }
    },
    created() {
        setTimeout(() => {
            this.loadZapContract();
        }, 300)
    },
    methods: {

        async loadZapContract() {
            if (!this.zapPoolRoot) {
                console.error("Zap Pool Root not found: ", this.zapPoolRoot);
                return;
            }

            this.currentZapPlatformContractType = this.zapPlatformContractTypeMap[this.zapPoolRoot.platform];
            if (!this.currentZapPlatformContractType) {
                console.error("Error when load zap contract name. Contract not found.", this.zapPoolRoot);
                return;
            }

            console.log("Load contract: ", `/contracts/${this.currentZapPlatformContractType.network}/${this.currentZapPlatformContractType.name}Zap.json`);
            let abiFile = await loadJSON(`/contracts/${this.currentZapPlatformContractType.network}/${this.currentZapPlatformContractType.name}Zap.json`);
            this.zapContract = this._loadContract(abiFile, this.web3, abiFile.address);
            console.log("Zap contract loaded: ", this.zapContract);

            if (this.currentZapPlatformContractType.type === 'LP_STAKE_DIFF_STEPS') {
                this.loadPoolTokenAndGaugeContracts();
            }
        },
        async loadPoolTokenAndGaugeContracts() {
            console.log("loadPoolTokenAndGaugeContracts", this.zapPoolRoot);
            let poolAddress = this.zapPoolRoot.address;
            let gaugeAddress = this.pollsMap[poolAddress];
            if (!gaugeAddress) {
                console.log("Error when get proportion. Gauge not found at pool: ", poolAddress)
                return
            }

            let abiPoolTokenContractFile = await loadJSON(`/contracts/${this.currentZapPlatformContractType.network}/${this.currentZapPlatformContractType.name}PoolToken.json`);
            this.poolTokenContract = this._loadContract(abiPoolTokenContractFile, this.web3, poolAddress);
            console.log("Pool token contract loaded: ", this.poolTokenContract);

            let abiGaugeContractFile = await loadJSON(`/contracts/${this.currentZapPlatformContractType.network}/${this.currentZapPlatformContractType.name}Gauge.json`);
            this.gaugeContract = this._loadContract(abiGaugeContractFile, this.web3, gaugeAddress);
            console.log("Gauge contract loaded: ", this.gaugeContract);
        },
        _loadContract(file, web3, address) {
            if (!address) {
                address = file.address;
            }

            return new web3.eth.Contract(file.abi, address);
        },
        getProportion(poolAddress) {
            let gauge = this.pollsMap[poolAddress];
            if (!gauge) {
                console.log("Error when get proportion. Gauge not found at pool: ", poolAddress)
                return
            }

            console.log('getProportion: ', this.zapContract, gauge);
            return this.zapContract.methods.getProportion(gauge).call().then(data => {
                console.log('Get proportion: ', poolAddress, gauge, data);
                return data;
            }).catch(e => {
                console.error('Error get proportion for: ', poolAddress, gauge, e);
            });
        },
        calculateProportionForChronosSwapModif({
                                                   inputTokensDecimals,
                                                   inputTokensAddresses,
                                                   inputTokensAmounts,
                                                   inputTokensPrices,
                                                   outputTokensDecimals,
                                                   outputTokensAddresses,
                                                   outputTokensAmounts,
                                                   outputTokensPrices,
                                                   proportion0,
                                               }
        ) {
            const tokenOut0 = Number.parseFloat(new BigNumber(outputTokensAmounts[0].toString()).div(new BigNumber(10).pow(outputTokensDecimals[0])).toFixed(3).toString()) * outputTokensPrices[0];
            const tokenOut1 = Number.parseFloat(new BigNumber(outputTokensAmounts[1].toString()).div(new BigNumber(10).pow(outputTokensDecimals[1])).toFixed(3).toString()) * outputTokensPrices[1];
            const sumInitialOut = tokenOut0 + tokenOut1;
            let sumInputs = 0;
            for (let i = 0; i < inputTokensAmounts.length; i++) {
                sumInputs += Number.parseFloat(new BigNumber(inputTokensAmounts[i].toString()).div(new BigNumber(10).pow(inputTokensDecimals[i])).toFixed(3).toString()) * inputTokensPrices[i];
            }
            sumInputs += sumInitialOut;

            const output0InMoneyWithProportion = sumInputs * proportion0;
            const output1InMoneyWithProportion = sumInputs * (1 - proportion0);
            const inputTokens = inputTokensAddresses.map((address, index) => {
                return { "tokenAddress": address, "amount": inputTokensAmounts[index].toString() };
            });
            if (output0InMoneyWithProportion < tokenOut0) {
                const dif = tokenOut0 - output0InMoneyWithProportion;
                const token0AmountForSwap = new BigNumber((dif / outputTokensPrices[0]).toString()).times(new BigNumber(10).pow(outputTokensDecimals[0])).toFixed(0);
                inputTokens.push({ "tokenAddress": outputTokensAddresses[0], "amount": token0AmountForSwap.toString() })
                return {
                    "outputTokens": [
                        {
                            "tokenAddress": outputTokensAddresses[1],
                            "proportion": 1
                        }
                    ],
                    "inputTokens": inputTokens,
                    "amountToken0Out": (new BigNumber(outputTokensAmounts[0]).minus(token0AmountForSwap)).toFixed(0),
                    "amountToken1Out": outputTokensAmounts[1].toString(),
                }
            } else if (output1InMoneyWithProportion < tokenOut1) {
                const dif = tokenOut1 - output1InMoneyWithProportion;
                const token1AmountForSwap = new BigNumber((dif / outputTokensPrices[1]).toString()).times(new BigNumber(10).pow(outputTokensDecimals[1])).toFixed(0);
                // console.log(new BigNumber((output1InMoneyWithProportion / outputTokensPrices[1]).toString()).times(new BigNumber(10).pow(outputTokensDecimals[1])).toFixed(0), outputTokensAmounts[1].toString());
                inputTokens.push({ "tokenAddress": outputTokensAddresses[1], "amount": token1AmountForSwap.toString() })
                // console.log(inputTokens)
                return {
                    "outputTokens": [
                        {
                            "tokenAddress": outputTokensAddresses[0],
                            "proportion": 1
                        },
                    ],
                    "inputTokens": inputTokens,
                    "amountToken0Out": outputTokensAmounts[0].toString(),
                    "amountToken1Out": (new BigNumber(outputTokensAmounts[1]).minus(token1AmountForSwap)).toFixed(0),
                }
            }

            const difToGetFromOdos0 = output0InMoneyWithProportion - tokenOut0;
            const difToGetFromOdos1 = output1InMoneyWithProportion - tokenOut1;
            return {
                "inputTokens": inputTokens,
                "outputTokens": [
                    {
                        "tokenAddress": outputTokensAddresses[0],
                        "proportion": Number.parseFloat((difToGetFromOdos0 / (difToGetFromOdos0 + difToGetFromOdos1)).toFixed(2))
                    },
                    {
                        "tokenAddress": outputTokensAddresses[1],
                        "proportion": Number.parseFloat((difToGetFromOdos1 / (difToGetFromOdos0 + difToGetFromOdos1)).toFixed(2))
                    },
                ],
                "amountToken0Out": new BigNumber((tokenOut0 / outputTokensPrices[0]).toString()).times(new BigNumber(10).pow(outputTokensDecimals[0])).toFixed(0),
                "amountToken1Out": new BigNumber((tokenOut1 / outputTokensPrices[1]).toString()).times(new BigNumber(10).pow(outputTokensDecimals[1])).toFixed(0),
            }

        },
        async checkApproveForGauge(poolTokenContract, gaugeAddress, checkedAllowanceValue) { // checkedAllowanceValue in wei
            console.log('Check Approve pool contract for: ', gaugeAddress, poolTokenContract, this.account, this.routerContract.options.address);
            let allowanceValue = await this.getAllowanceValue(poolTokenContract, this.account, this.routerContract.options.address);
            console.log('Approve value: ', allowanceValue);
            return allowanceValue >= checkedAllowanceValue;
        },
        async approveGaugeForStake() {
            console.log("Approving gauge stake")
            this.showWaitingModal('Approving guage in process');

            let isGaugeApproved = this.checkApproveForGauge(this.poolTokenContract, this.gaugeContract.options.address, 100000000000000);
            if (!isGaugeApproved) {
                console.log("Approve not needed for pool: ");
                this.closeWaitingModal();
                return;
            }

            // console.log('Approve contract: ', token, tokenContract, this.account, this.routerContract.options.address);
            console.log('Approve contract: ', this.poolTokenContract, this.account, this.zapContract.options.address);
            let approveValue = 100000000000000;
            // this.approveToken(tokenContract, this.routerContract.options.address, approveValue)
           return this.approveToken(this.poolTokenContract, this.gaugeContract.options.address, approveValue)
                .then(data => {
                    console.log("Success gauge approving", data);
                    this.closeWaitingModal();
                })
                .catch(e => {
                    console.error("Error when approve token.", e);
                    this.closeWaitingModal();
                    this.showErrorModalWithMsg({errorType: 'approve', errorMsg: e}, );
                });
        },
        depositAllAtGauge() {
            let params = {from: this.account, gasPrice: this.gasPriceGwei};
            return this.gaugeContract.methods.depositAll().send(params);
        }
    }

}
