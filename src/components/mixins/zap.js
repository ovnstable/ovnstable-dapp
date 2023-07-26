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
                    network: 'arbitrum',
                    typeOfDepositConstructor: 'BASE_CONSTRUCTOR'
                },
                'Thena': {
                    name: 'Thena',
                    type: 'LP_STAKE_DIFF_STEPS',
                    network: 'bsc',
                    typeOfDepositConstructor: 'BASE_CONSTRUCTOR'
                },
                'Velodrome': {
                    name: 'Velodrome',
                    type: 'LP_WITH_STAKE_IN_ONE_STEP',
                    network: 'optimism',
                    typeOfDepositConstructor: 'BASE_CONSTRUCTOR'
                },
                'Ramses': {
                    name: 'Ramses',
                    type: 'LP_STAKE_DIFF_STEPS',
                    network: 'arbitrum',
                    typeOfDepositConstructor: 'CONSTRUCTOR_WITH_TOKEN_ID'
                },
                'Arbidex': {
                    name: 'Arbidex',
                    type: 'LP_STAKE_DIFF_STEPS',
                    network: 'arbitrum',
                    typeOfDepositConstructor: 'CONSTRUCTOR_WITH_POOL_ID_AND_TOKEN_AMOUNT'
                },
                'Sperax': {
                    name: 'Sperax',
                    type: 'LP_STAKE_DIFF_STEPS',
                    network: 'arbitrum',
                    typeOfDepositConstructor: 'CONSTRUCTOR_WITH_NFT_ID'
                },
                'Defiedge': {
                    name: 'Defiedge',
                    type: 'LP_WITH_STAKE_IN_ONE_STEP',
                    network: 'optimism',
                    typeOfDepositConstructor: 'BASE_CONSTRUCTOR'
                },
            },
            zapContract: null,
            poolTokenContract: null,
            gaugeContract: null,

            pollsMap: {},

            poolsInfoMap: { // pool address : { gauge, poolId } poolId - id from dex, approveType - TOKEN, NFT
                // Chronos https://arbiscan.io/address/0xc72b5c6d2c33063e89a50b2f77c99193ae6cee6c#readProxyContract
                "0xb260163158311596ea88a700c5a30f101d072326": {
                    gauge: '0xCD4A56221175b88d4fb28CA2138d670Cc1197CA9',
                    poolId: 0,
                    approveType: 'TOKEN'
                },
                "0x0d20ef7033b73ea0c9c320304b05da82e2c14e33": {
                    gauge: '0xaF618E6F5EF781e3aCFe00708BD005E0cc9A2e6F',
                    poolId: 0,
                    approveType: 'TOKEN'
                },
                "0x0df5f52afa0308fdd65423234c4fda9add0b9eba": {
                    gauge: '0xF319285fa8b5323A40c71D3c006dBd0BE4f5171b',
                    poolId: 0,
                    approveType: 'TOKEN'
                },
                "0x69fd0ea1041bc4c495d5371a074bf1dcd6700577": {
                    gauge: '0xD1C05e0770968c8b9C7dC0f3aC1DD419A3417971',
                    poolId: 0,
                    approveType: 'TOKEN'
                },
                "0x94c20b48faed9148a00ccf3229f4e50f791a26b6": {
                    gauge: '0x8Bc7811fdC24c82E842452F6EA3C7a20e1994889',
                    poolId: 0,
                    approveType: 'TOKEN'
                },
                "0xa885a1e7511cf6b572d949b1e60ac0a8449f3b18": {
                    gauge: '0xc8d79Fd3Ecc0F91d9C56E279Daba12257bE24619',
                    poolId: 0,
                    approveType: 'TOKEN'
                },
                "0xbbd7ff1728963a5eb582d26ea90290f84e89bd66": {
                    gauge: '0x3004F018B2C01d40D19C7dC4a5a0AFA8743a7e24',
                    poolId: 0,
                    approveType: 'TOKEN'
                },
                "0xcd78e225e36e724c9fb4bd8287296557d728cda7": {
                    gauge: '0x7de0998eE1Fce80c160AD1F5Fe768BFF9b0ee87f',
                    poolId: 0,
                    approveType: 'TOKEN'
                },

                "0x1561d9618db2dcfe954f5d51f4381fa99c8e5689": {
                    gauge: '0x3877c2C3D75aE80f2Ed8E9d4d68e3C1BFc77e5A6',
                    poolId: 0,
                    approveType: 'TOKEN'
                },
                "0x1f3ca66c98d682fa1bec31264692dad4f17340bc": {
                    gauge: '0xB0a69681d82c90B80B689BaF43ccfa6270f1DdE5',
                    poolId: 0,
                    approveType: 'TOKEN'
                },

                // Velodrome https://api.velodrome.finance/api/v1/pairs
                '0x0b28C2e41058EDc7D66c516c617b664Ea86eeC5d': {
                    gauge: '0x93e1152951ccfb02b1ad4d8a4afc68b28cac0614',
                    poolId: 0,
                    approveType: 'TOKEN'
                },
                '0x667002F9DC61ebcBA8Ee1Cbeb2ad04060388f223': {
                    gauge: '0x4bc0547661f40e712a9793c3b99a14a68049a836',
                    poolId: 0,
                    approveType: 'TOKEN'
                },
                '0xD330841EF9527E3Bd0abc28a230C7cA8dec9423B': {
                    gauge: '0x89913088bf483c65325fbd43ce15051b78d762d4',
                    poolId: 0,
                    approveType: 'TOKEN'
                },

                '0xd95E98fc33670dC033424E7Aa0578D742D00f9C7': {
                    gauge: '0xc263655114cde848c73b899846fe7a2d219c10a8',
                    poolId: 0,
                    approveType: 'TOKEN'
                },

                '0x37e7D30CC180A750C83D68ED0C2511dA10694d63': {
                    gauge: '0x7dca0f3023b80e8c724b11ddccac788940275f41',
                    poolId: 4,
                    approveType: 'TOKEN'
                },

                // Ramses https://ramses-api-5msw7.ondigitalocean.app/mixed-pairs
                '0xeb9153afbaa3a6cfbd4fce39988cea786d3f62bb': {
                    gauge: '0x88d8d2bdc4f12862fbabea43cec08b8fcd2234da',
                    poolId: 0,
                    approveType: 'TOKEN'
                },

                // Sperax Demeter https://api.sperax.finance/api/v1/pairs
                '0x9be8026c5c55a3d5513d4c6607355b3678c0afdb': {
                    gauge: '0xC8F82e522BC5ca3C340753b69Cb18e68dA216362',
                    poolId: 0,
                    approveType: 'NFT'
                },

                // Arbidex
                '0xeE5e74Dc56594d070E0827ec270F974A68EBAF22': {
                    gauge: '0xd2bcFd6b84E778D2DE5Bb6A167EcBBef5D053A06',
                    poolId: 16,
                    approveType: 'TOKEN'
                },
                '0xE8C060d40D7Bc96fCd5b758Bd1437C8653400b0e': {
                    gauge: '0xd2bcFd6b84E778D2DE5Bb6A167EcBBef5D053A06',
                    poolId: 7,
                    approveType: 'TOKEN'
                },
                '0xECe52B1fc32D2B4f22eb45238210b470a64bfDd5': {
                    gauge: '0xd2bcFd6b84E778D2DE5Bb6A167EcBBef5D053A06',
                    poolId: 8,
                    approveType: 'TOKEN'
                },
                '0xb0Fb1787238879171Edc30b9730968600D55762A': {
                    gauge: '0xd2bcFd6b84E778D2DE5Bb6A167EcBBef5D053A06',
                    poolId: 34,
                    approveType: 'TOKEN'
                },
               /* '0xEa5f97aab76E397E4089137345c38b5c4e7939B3': {
                    gauge: '0xd2bcFd6b84E778D2DE5Bb6A167EcBBef5D053A06',
                    poolId: 17,
                    approveType: 'TOKEN'
                },*/
                '0x306132b6147751B85E608B4C1EC452E111531eA2': {
                    gauge: '0xd2bcFd6b84E778D2DE5Bb6A167EcBBef5D053A06',
                    poolId: 35,
                    approveType: 'TOKEN'
                },

                //  Defiedge
                '0xd1c33d0af58eb7403f7c01b21307713aa18b29d3': {
                    gauge: '0xd1c33d0af58eb7403f7c01b21307713aa18b29d3',
                    chef: '0xD7cf8Dc79b15a61714061C5B7A1c12ddE9f3f088',
                    poolId: 0,
                    approveType: 'TOKEN'
                },

            },

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
            let poolInfo = this.poolsInfoMap[poolAddress];
            if (!poolInfo) {
                console.log("Error when get proportion. Gauge not found at pool: ", poolAddress)
                return
            }

            let gaugeAddress = poolInfo.gauge;

            console.log("abiPoolTokenContractFile", this.currentZapPlatformContractType)
            let abiPoolTokenContractFile = await loadJSON(`/contracts/${this.currentZapPlatformContractType.network}/${this.currentZapPlatformContractType.name}PoolToken.json`);
            console.log("abiPoolTokenContractFile", abiPoolTokenContractFile)
            this.poolTokenContract = this._loadContract(abiPoolTokenContractFile, this.web3, poolAddress);
            console.log("Pool token contract loaded: ", this.poolTokenContract);

            console.log("abiGaugeContractFile")
            let abiGaugeContractFile = await loadJSON(`/contracts/${this.currentZapPlatformContractType.network}/${this.currentZapPlatformContractType.name}Gauge.json`);
            console.log("abiGaugeContractFile", abiGaugeContractFile)
            this.gaugeContract = this._loadContract(abiGaugeContractFile, this.web3, gaugeAddress);
            console.log("Gauge contract loaded: ", this.gaugeContract);
        },
        _loadContract(file, web3, address) {
            if (!address) {
                address = file.address;
            }

            return new web3.eth.Contract(file.abi, address);
        },
        getProportion(poolAddress, zapPool) {
            let poolInfo = this.poolsInfoMap[poolAddress];
            if (!poolInfo) {
                console.log("Error when get proportion. Gauge not found at pool: ", poolAddress)
                return
            }

            let gauge = poolInfo.gauge;
            console.log('getProportion: ', zapPool, this.zapContract, poolInfo, gauge);
            if (zapPool.data.platform === "Arbidex") {

                return this.zapContract.methods.getProportion(gauge, (poolInfo.poolId).toString()).call().then(data => {
                    console.log('Get proportion: ', poolAddress, gauge, data, poolInfo.poolId);
                    return data;
                }).catch(e => {
                    console.error('Error get proportion for: ', poolAddress, gauge, poolInfo, e);
                });
            }

            return this.zapContract.methods.getProportion(gauge).call().then(data => {
                console.log('Get proportion: ', poolAddress, gauge, data, poolInfo);
                return data;
            }).catch(e => {
                console.error('Error get proportion for: ', poolAddress, gauge, poolInfo, e);
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
        async depositAllAtGauge(account, lastPoolInfoData, lastNftTokenId) {
            console.log("depositAllAtGauge(), gauge contract: ", this.gaugeContract, this.currentZapPlatformContractType, lastPoolInfoData, account);
            let params = {from: this.account, gasPrice: this.gasPriceGwei};
            if (this.currentZapPlatformContractType.typeOfDepositConstructor === 'CONSTRUCTOR_WITH_TOKEN_ID') {
                return this.gaugeContract.methods.depositAll(0).send(params);
            }

            if (this.currentZapPlatformContractType.typeOfDepositConstructor === 'BASE_CONSTRUCTOR') {
                return this.gaugeContract.methods.depositAll().send(params);
            }

            if (this.currentZapPlatformContractType.typeOfDepositConstructor === 'CONSTRUCTOR_WITH_POOL_ID_AND_TOKEN_AMOUNT') {
                let balance = await this.poolTokenContract.methods.balanceOf(account).call();
                console.log('Deposit with pool id and token amount: ', this.currentZapPlatformContractType, balance, account, lastPoolInfoData);
                return this.gaugeContract.methods.deposit(lastPoolInfoData.poolId, balance).send(params);
            }

            if (this.currentZapPlatformContractType.typeOfDepositConstructor === 'CONSTRUCTOR_WITH_NFT_ID') {
                console.log('Deposit with nft id: ', this.currentZapPlatformContractType, lastNftTokenId, account);
                let data = {
                    from: account,
                    to: this.poolTokenContract.options.address,
                    tokenId: lastNftTokenId,
                    _data: '0x0000000000000000000000000000000000000000000000000000000000000000'
                }
                return this.gaugeContract.methods.safeTransferFrom(data.from, data.to, data.tokenId, data._data).send(params);
            }

            console.error('Type contracts for deposit in gauge not found: ', this.currentZapPlatformContractType, account);
        }
    }

}
