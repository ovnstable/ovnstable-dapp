import loadJSON from "@/utils/http-utils";
const { default: BigNumber } = require("bignumber.js");

export const zap = {

    data() {
        return {
            zapPlatformName: null,
            currentZapPlatformContractType: null,
            zapPlatformContractTypeMap: { // PlatformName: { name, type } name: ContractName, type: LP_WITH_STAKE_IN_ONE_STEP, LP_STAKE_DIFF_STEPS.
                'Chronos': {
                    name: 'ChronosZap',
                    type: 'LP_WITH_STAKE_IN_ONE_STEP'
                },
                'Thena': {
                    name: 'ThenaZap',
                    type: 'LP_STAKE_DIFF_STEPS'
                },
                'Velodrome': {
                    name: 'VelodromeZap',
                    type: 'LP_STAKE_DIFF_STEPS'
                },
                'Ramses': {
                    name: 'RamsesZap',
                    type: 'LP_STAKE_DIFF_STEPS'
                },
            },
            zapContract: null,
            pollsMap: {
                "0xb260163158311596ea88a700c5a30f101d072326": '0xcd4a56221175b88d4fb28ca2138d670cc1197ca9',
                "0x0d20ef7033b73ea0c9c320304b05da82e2c14e33": '0xaF618E6F5EF781e3aCFe00708BD005E0cc9A2e6F',
                "0x0df5f52afa0308fdd65423234c4fda9add0b9eba": '0xF319285fa8b5323A40c71D3c006dBd0BE4f5171b',
                "0x69fd0ea1041bc4c495d5371a074bf1dcd6700577": '0xD1C05e0770968c8b9C7dC0f3aC1DD419A3417971',
                "0x94c20b48faed9148a00ccf3229f4e50f791a26b6": '0x8Bc7811fdC24c82E842452F6EA3C7a20e1994889',
                "0xa885a1e7511cf6b572d949b1e60ac0a8449f3b18": '0xc8d79Fd3Ecc0F91d9C56E279Daba12257bE24619',
                "0xbbd7ff1728963a5eb582d26ea90290f84e89bd66": '0x3004F018B2C01d40D19C7dC4a5a0AFA8743a7e24',
                "0xcd78e225e36e724c9fb4bd8287296557d728cda7": '0x7de0998eE1Fce80c160AD1F5Fe768BFF9b0ee87f',
            }
        }
    },
    mounted() {
        this.loadZapContract();
    },
    methods: {

        async loadZapContract() {
            thiis.currentZapPlatformContractType = this.zapPlatformContractTypeMap[this.zapPlatformName];
            if (!this.currentZapPlatformContractType) {
                console.log("Error when load zap contract name. Contract not found.", zapContractName, this.zapPlatformName);
                return;
            }

            let abiFile = await loadJSON(`/contracts/arbitrum/${this.currentZapPlatformContractType.name}.json`);
            this.zapContract = this._loadContract(abiFile, this.web3, abiFile.address);
            console.log("Zap contract loaded: ", this.zapContract);
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
        approveGaugeForStake() {

        },
    }

}
