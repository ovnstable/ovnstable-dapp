import BN from "bn.js";

const {axios} = require('@/plugins/http-axios');
const {utils} = require('@/plugins/utils');
import * as numberUtils from '@/utils/number-utils'
import BigNumber from "bignumber.js";

const proposalStates = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed'];


const state = {

    overview: {},
    overviewLoading: true,
    proposals: [],
    proposalsLoading: true,
    settings: {},
    settingsLoading: true,
    financeLoading: true,

    strategyWeights: null,

    m2mItems: [],
    m2mTotal: null,
    usdPlusTotal: null,
    usdPlusLiquidityIndex: null,

    hasChangeAccount: false,

    rewardPools: [],

    abroad: {},
};

const getters = {

    overview(state) {
        return state.overview;
    },


    abroad(state) {
        return state.abroad;
    },

    assets(state) {
        return state.assets;
    },

    settings(state) {
        return state.settings;
    },

    overviewLoading(state) {
        return state.overviewLoading;
    },

    proposalsLoading(state) {
        return state.proposalsLoading;
    },

    settingsLoading(state) {
        return state.settingsLoading;
    },

    financeLoading(state) {
        return state.financeLoading;
    },

    proposals(state) {
        return state.proposals;
    },

    strategyWeights(state) {
        return state.strategyWeights;
    },

    m2mItems(state) {
        return state.m2mItems;
    },

    m2mTotal(state) {
        return state.m2mTotal;
    },

    usdPlusTotal(state) {
        return state.usdPlusTotal;
    },

    usdPlusLiquidityIndex(state) {
        return state.usdPlusLiquidityIndex;
    },

    rewardPools(state) {
        return state.rewardPools;
    },

    hasChangeAccount(state) {
        return state.hasChangeAccount;
    },
};

const actions = {

    async upgradeToAction({commit, dispatch, getters, rootState}, request) {

        let contract = rootState.web3.contracts[request.contract];
        let governor = rootState.web3.contracts.governor;
        let account = rootState.accountData.account;

        let abi = contract.methods.upgradeTo(request.address).encodeABI();
        let name = 'Proposal #' + getters.proposals.length + 1 + ' UpgradeTo ' + request.contract;
        let params = {from: account};

        await governor.methods.proposeExec([contract.options.address], [0], [abi], name).send(params);
    },

    async runPayoutAction({commit, dispatch, getters, rootState}) {

        let contact = rootState.web3.contracts.exchange;

        let params = {from: rootState.accountData.account};
        await contact.methods.payout().send(params);
    },

    async updateGovernanceSettings({commit, dispatch, getters, rootState}, value) {

        let governor = rootState.web3.contracts.governor;
        let account = rootState.accountData.account;
        let params = {from: account};

        let name = 'Proposal #' + getters.proposals.length + 1 + ' Update Governance Settings';

        let addresses = [];
        let abis = [];
        let values = [];

        if (value.votingDelay) {
            addresses.push(governor.options.address);
            abis.push(governor.methods.setVotingDelay(value.votingDelay).encodeABI());
            values.push(0);
        }

        if (value.votingPeriod) {
            addresses.push(governor.options.address);
            abis.push(governor.methods.setVotingPeriod(value.votingPeriod).encodeABI());
            values.push(0);
        }

        if (value.setProposalThreshold) {
            addresses.push(governor.options.address);
            abis.push(governor.methods.setProposalThreshold(value.proposalThreshold).encodeABI());
            values.push(0);
        }

        if (value.updateQuorumNumerator) {
            addresses.push(governor.options.address);
            abis.push(governor.methods.updateQuorumNumerator(value.updateQuorumNumerator).encodeABI());
            values.push(0);
        }

        await governor.methods.proposeExec(addresses, values, abis, name).send(params);
    },

    async updateDelay({commit, dispatch, getters, rootState}, value) {

        let governor = rootState.web3.contracts.governor;
        let account = rootState.accountData.account;
        let contract = rootState.web3.contracts.timelockController;
        let params = {from: account};

        let abi = contract.methods.updateDelay(value).encodeABI();
        let name = 'Proposal #' + getters.proposals.length + 1 + 'Update delay';
        await governor.methods.proposeExec([contract.options.address], [0], [abi], name).send(params);
    },

    async cancel({commit, dispatch, getters, rootState}, id) {

        let governor = rootState.web3.contracts.governor;

        let account = rootState.accountData.account;
        let params = {from: account};
        await governor.methods.cancel(id).send(params);
    },

    async execute({commit, dispatch, getters, rootState}, id) {

        let governor = rootState.web3.contracts.governor;

        let account = rootState.accountData.account;
        let params = {from: account};
        await governor.methods.executeExec(id).send(params);
    },

    async queue({commit, dispatch, getters, rootState}, id) {

        let governor = rootState.web3.contracts.governor;

        let account = rootState.accountData.account;
        let params = {from: account};
        await governor.methods.queueExec(id).send(params);
    },


    async vote({commit, dispatch, getters, rootState}, request) {

        let governor = rootState.web3.contracts.governor;

        let account = rootState.accountData.account;
        let params = {from: account};
        await governor.methods.castVote(request.id, request.status).send(params);
    },

    async getSettings({commit, dispatch, getters, rootState}) {

        commit('setSettingsLoading', true)
        let governor = rootState.web3.contracts.governor;
        let timelockController = rootState.web3.contracts.timelockController;

        let timeLockItem = {};
        timeLockItem.minDelay = await timelockController.methods.getMinDelay().call();

        let governorItem = {};
        governorItem.votingPeriod = await governor.methods.votingPeriod().call();
        governorItem.votingDelay = await governor.methods.votingDelay().call();
        governorItem.proposalThreshold = await governor.methods.proposalThreshold().call();
        governorItem.quorumNumerator = await governor.methods.quorumNumerator().call();

        let settings = {};
        settings.timeLock = timeLockItem;
        settings.governor = governorItem;

        commit('setSettings', settings);
        commit('setSettingsLoading', false)
    },

    async changeFeeBuy({commit, dispatch, getters, rootState}, request) {

        let contract = rootState.web3.contracts.exchange;
        let governor = rootState.web3.contracts.governor;
        let account = rootState.accountData.account;

        let params = {from: account};

        let abi = contract.methods.setBuyFee(request.fee, request.feeDenominator).encodeABI();
        let name = 'Proposal #' + getters.proposals.length + 1 + 'Change set Buy Fee';
        await governor.methods.proposeExec([contract.options.address], [0], [abi], name).send(params);
    },


    async minting({commit, dispatch, getters, rootState}, request) {

        let govToken = rootState.web3.contracts.govToken;
        let account = rootState.accountData.account;
        let governor = rootState.web3.contracts.governor;
        let params = {from: account};

        let wei = rootState.web3.web3.utils.toWei(request.sum, 'ether');
        let abi = await govToken.methods.mint(request.account, wei).encodeABI();
        let name = 'Proposal #' + getters.proposals.length + 1 + 'Mint gov tokens';
        await governor.methods.proposeExec([govToken.options.address], [0], [abi], name).send(params);

    },

    async delegate({commit, dispatch, getters, rootState}, address) {

        let govToken = rootState.web3.contracts.govToken;
        let account = rootState.accountData.account;
        let params = {from: account};
        let result = await govToken.methods.delegate(address).send(params);
    },

    async getProposals({commit, dispatch, getters, rootState}) {

        commit('setProposalsLoading', true);

        let governor = rootState.web3.contracts.governor;
        let proposals = await governor.methods.getProposals().call();

        proposals = [...proposals].reverse();
        if (proposals.length > 5) {
            proposals = proposals.slice(0, 5);
        }

        let items = [];
        for (let i = 0; i < proposals.length; i++) {
            let id = proposals[i];
            let item = await governor.methods.proposals(id).call();
            let status = await governor.methods.state(id).call();

            console.log(item)
            let proposal = {
                id: item.id,
                proposer: item.proposer,
                startBlock: item.startBlock,
                endBlock: item.endBlock,
                forVotes: item.forVotes / 10 ** 18,
                againstVotes: item.againstVotes / 10 ** 18,
                abstainVotes: item.abstainVotes / 10 ** 18,
                status: status,
                statusText: proposalStates[status],
            }
            items.push(proposal);
        }


        commit('setProposals', items);
        commit('setProposalsLoading', false);
    },

    async getOverview({commit, dispatch, getters, rootState}) {

        commit('setOverviewLoading', true);

        let govToken = rootState.web3.contracts.govToken;
        let governor = rootState.web3.contracts.governor;
        let totalVotes = await govToken.methods.totalSupply().call();
        let totalDelegated = await govToken.methods.getVotes(rootState.accountData.account).call();
        let totalProposals = await governor.methods.getProposals().call();

        let overview = {
            totalVotes: totalVotes / 10 ** 18,
            totalDelegated: totalDelegated / 10 ** 18,
            totalProposals: totalProposals.length
        }
        commit('setOverview', overview);

        commit('setOverviewLoading', false);

        dispatch('getSettings')
    },

    async checkAccount({commit, dispatch, getters, rootState}, contractType) {
        let pm;
        if (!contractType || contractType === 'USD+') {
            pm = rootState.web3.contracts.pm;
        } else if (contractType === 'DAI+') {
            pm = rootState.web3.contracts.daiPm;
        } else if (contractType === 'USDT+') {
            pm = rootState.web3.contracts.usdtPm;
        } else if (contractType === 'ETH+') {
            pm = rootState.web3.contracts.wethPm;
        } else {
            console.log("Error when checkAccount. Contract type not found: ", contractType)
            return;
        }

        let account = rootState.accountData.account;
        let roleId = await pm.methods.PORTFOLIO_AGENT_ROLE().call();
        let hasRole = await pm.methods.hasRole(roleId, account).call();

        commit('setHasChangeAccount', hasRole);
    },

    async setStrategiesM2MWeights({commit, dispatch, getters, rootState}, data) {
        commit('setFinanceLoading', true);
        console.debug("setStrategiesM2MWeights: ")

        let weights = data.weights
        let contractType = data.contractType

        let pm;
        console.debug("If contract type === USD+ in setStrategiesM2MWeights: ", contractType)
        if (!contractType || contractType === 'USD+') {
            pm = rootState.web3.contracts.pm;
        } else if (contractType === 'DAI+') {
            pm = rootState.web3.contracts.daiPm;
        } else if (contractType === 'USDT+') {
            pm = rootState.web3.contracts.usdtPm;
        } else if (contractType === 'ETH+') {
            pm = rootState.web3.contracts.wethPm;
        } else {
            console.log("Error when checkAccount. Contract type not found: ", contractType)
            return;
        }
        console.debug("PM contract in setStrategiesM2MWeights: ", pm)

        let account = rootState.accountData.account;
        console.debug("Account in setStrategiesM2MWeights: ", account)
        let params = {from: account, "gasPrice": rootState.gasPrice.gasPriceGwei};
        console.debug("Params in setStrategiesM2MWeights: ", params)

        // todo: remove after prod test
        let sum = weights.reduce((acc, obj) => {
            return new BigNumber(acc).plus(obj.targetWeight).toNumber();
        }, 0);
        console.debug("Gov difference reduce: ", sum)

        let items = [];
        for (let i = 0; i < weights.length; i++) {

            let weight = weights[i];

            let item = {};

            item.strategy = weight.address;
            item.minWeight =  new BigNumber(weight.minWeight).multipliedBy(1000).toNumber();
            item.targetWeight = new BigNumber(weight.targetWeight).multipliedBy(1000).toNumber();
            item.maxWeight = new BigNumber(weight.maxWeight).multipliedBy(1000).toNumber();
            item.enabled = weight.enabled;
            item.enabledReward = weight.enabledReward;
            item.riskFactor =  new BigNumber(weight.riskFactor).multipliedBy(1000).toNumber();

            items.push(item);
        }

        // todo: remove after prod test
        let sumFinal = items.reduce((acc, obj) => {
            return new BigNumber(acc).plus(obj.targetWeight).toNumber();
        }, 0);
        console.debug("Gov difference reduce final: ", sumFinal)
        console.debug("DATA setStrategiesM2MWeights: ", params, items)

        try {
            await pm.methods.setStrategyWeights(items).send(params);
        } catch (e) {
            console.error("Error with await pm.methods.setStrategyWeights(items).send(params):", e)
        }

        console.debug("DEBUG SUCCESSFUL in setStrategiesM2MWeights::")
        commit('setFinanceLoading', false);
    },

    async estimateSetStrategiesM2MWeights({commit, dispatch, getters, rootState}, data) {
        commit('setFinanceLoading', true);
        console.debug("estimateSetStrategiesM2MWeights: ")

        let weights = data.weights
        let contractType = data.contractType

        let pm;
        console.debug("If contract type === USD+: ", contractType)
        if (!contractType || contractType === 'USD+') {
            pm = rootState.web3.contracts.pm;
        } else if (contractType === 'DAI+') {
            pm = rootState.web3.contracts.daiPm;
        } else if (contractType === 'USDT+') {
            pm = rootState.web3.contracts.usdtPm;
        } else if (contractType === 'ETH+') {
            pm = rootState.web3.contracts.wethPm;
        }else {
            console.log("Error when checkAccount. Contract type not found: ", contractType)
            return;
        }
        console.debug("PM contract: ", pm)

        let result;
        let networkId = rootState.network.networkId;


        try {
            console.debug("Success try estimateSetStrategiesM2MWeights: ")
            let blockNum = await rootState.web3.web3.eth.getBlockNumber();
            let account = rootState.accountData.account;
            let estimateOptions = {from: account, "gasPrice": rootState.gasPrice.gasPriceGwei};

            console.debug("BlockNum, account and estimateOptions: ", blockNum, account, estimateOptions)
            let items = [];
            for (let i = 0; i < weights.length; i++) {

                let weight = weights[i];
                let item = {};

                item.strategy = weight.address;
                item.minWeight = weight.minWeight * 1000;
                item.targetWeight = weight.targetWeight * 1000;
                item.maxWeight = weight.maxWeight * 1000;
                item.enabled = weight.enabled;
                item.enabledReward = weight.enabledReward;
                item.riskFactor = weight.riskFactor * 1000;

                items.push(item);
            }

            console.debug("Estimate Set Strategy Weights ITEMS: ", items)

            await pm.methods.setStrategyWeights(items).estimateGas(estimateOptions)
                .then(function (gasAmount) {
                    console.debug("Success setStrategyWeights: ")
                    result = {
                        haveError: false,
                        gas: gasAmount,
                    };
                })
                .catch(function (error) {
                    console.debug("Failure setStrategyWeights WITH MESSAGE: ")
                    if (error && error.message) {
                        result = {
                            haveError: true,
                            from: account,
                            to: pm.options.address,
                            gas: null,
                            gasPrice: parseInt(estimateOptions.gasPrice, 16),
                            method: pm.methods.setStrategyWeights(items).encodeABI(),
                            message: error.message,
                            block: blockNum
                        };
                    } else {
                        console.debug("Failure setStrategyWeights UNDEFINED error:")
                        result = {
                            haveError: true,
                            message: "Unexpected error",
                        };
                    }
                });
        } catch (e) {
            console.debug("Failure catch estimateSetStrategiesM2MWeights: ")
            result = {
                haveError: true,
                message: "Unexpected error",
            };
        }

        console.debug("DEBUG SUCCESSFUL in estimateSetStrategiesM2MWeights:")
        commit('setFinanceLoading', false);

        return result;
    },

    async rebalancePortfolio({commit, dispatch, getters, rootState}, contractType) {

        commit('setFinanceLoading', true);

        let pm;
        if (!contractType || contractType === 'USD+') {
            pm = rootState.web3.contracts.pm;
        } else if (contractType === 'DAI+') {
            pm = rootState.web3.contracts.daiPm;
        } else if (contractType === 'USDT+') {
            pm = rootState.web3.contracts.usdtPm;
        } else if (contractType === 'ETH+') {
            pm = rootState.web3.contracts.wethPm;
        } else {
            console.log("Error when checkAccount. Contract type not found: ", contractType)
            return;
        }

        let account = rootState.accountData.account;
        let params = {from: account, "gasPrice": rootState.gasPrice.gasPriceGwei};

        try {
            await pm.methods.balance().send(params);
        } catch (e) {
            console.log(e)
        }

        commit('setFinanceLoading', false);
    },

    async estimateRebalancePortfolio({commit, dispatch, getters, rootState}, contractType) {

        commit('setFinanceLoading', true);

        let result;

        try {
            let blockNum = await rootState.web3.web3.eth.getBlockNumber();

            let pm;
            if (!contractType || contractType === 'USD+') {
                pm = rootState.web3.contracts.pm;
            } else if (contractType === 'DAI+') {
                pm = rootState.web3.contracts.daiPm;
            } else if (contractType === 'USDT+') {
                pm = rootState.web3.contracts.usdtPm;
            } else if (contractType === 'ETH+') {
                pm = rootState.web3.contracts.wethPm;
            } else {
                console.log("Error when checkAccount. Contract type not found: ", contractType)
                return;
            }

            let account = rootState.accountData.account;
            let estimateOptions = {from: account, "gasPrice": rootState.gasPrice.gasPriceGwei};

            await pm.methods.balance().estimateGas(estimateOptions)
                .then(function (gasAmount) {
                    result = {
                        haveError: false,
                        gas: gasAmount,
                    };
                })
                .catch(function (error) {
                    if (error && error.message) {
                        result = {
                            haveError: true,
                            from: account,
                            to: pm.options.address,
                            gas: null,
                            gasPrice: parseInt(estimateOptions.gasPrice, 16),
                            method: pm.methods.balance().encodeABI(),
                            message: error.message,
                            block: blockNum
                        };
                    } else {
                        result = {
                            haveError: true,
                            message: "Unexpected error",
                        };
                    }
                });
        } catch (e) {
            result = {
                haveError: true,
                message: "Unexpected error",
            };
        }

        commit('setFinanceLoading', false);

        return result;
    },

    async getStrategyWeights({commit, dispatch, getters, rootState}, contractType) {

        let pm;
        if (!contractType || contractType === 'USD+') {
            pm = rootState.web3.contracts.pm;
        } else if (contractType === 'DAI+') {
            pm = rootState.web3.contracts.daiPm;
        } else if (contractType === 'USDT+') {
            pm = rootState.web3.contracts.usdtPm;
        } else if (contractType === 'ETH+') {
            pm = rootState.web3.contracts.wethPm;
        } else {
            console.log("Error when checkAccount. Contract type not found: ", contractType)
            return;
        }

        let weights = await pm.methods.getAllStrategyWeights().call();

        let items = [];

        let apiUrl = rootState.network.apiUrl;
        let networkName = rootState.network.networkName;
        let url = apiUrl + `/${networkName}/${contractType.toLowerCase()}`
        console.log("Load strategies mapping from url: ", url)
        let strategiesMapping = (await axios.get(url + '/dict/strategies')).data;
        console.log("Loaded strategies mapping: ", strategiesMapping);

        for (let i = 0; i < strategiesMapping.length; i++) {

            let strategy = strategiesMapping[i];

            let weight = weights.find(value => strategy.address.toLowerCase() === value.strategy.toLowerCase());

            let item = {};
            item.address = strategy.address;
            item.name = strategy.name;

            if (weight) {
                item.minWeight = weight.minWeight / 1000;
                item.targetWeight = weight.targetWeight / 1000;
                item.maxWeight = weight.maxWeight / 1000;
                item.enabled = weight.enabled;
                item.enabledReward = weight.enabledReward;
                item.riskFactor = weight.riskFactor / 1000;
            } else {
                item.minWeight = 0;
                item.targetWeight = 0;
                item.maxWeight = 0;
                item.riskFactor = 0;
                item.enabled = false;
                item.enabledReward = false;
            }


            items.push(item);
        }

        console.log("Set strategy weights to: ", items)
        commit('setStrategyWeights', items);
    },

    async getM2M({commit, dispatch, getters, rootState}, contractType) {
        let web3 = rootState.web3;

        let m2m;
        let tokenPlusContract;
        let pm;
        if (contractType === 'USD+') {
            tokenPlusContract = web3.contracts.usdPlus;
            pm = web3.contracts.pm;
            m2m = web3.contracts.m2m;
        } else if (contractType === 'DAI+') {
            tokenPlusContract = web3.contracts.daiPlus;
            pm = web3.contracts.daiPm;
            m2m = web3.contracts.daiM2m;
        } else if (contractType === 'USDT+') {
            tokenPlusContract = web3.contracts.usdtPlus;
            pm = web3.contracts.usdtPm;
            m2m = web3.contracts.usdtM2m;
        } else if (contractType === 'ETH+') {
            tokenPlusContract = web3.contracts.ethPlus;
            pm = web3.contracts.wethPm;
            m2m = web3.contracts.wethM2m;
        } else {
            console.log("Error when get m2m. Contract type not found: ", contractType)
            return;
        }

        if (!tokenPlusContract || !pm) {
            console.log("Error when get m2m. Contract not found: ", contractType, tokenPlusContract, pm)
            return;
        }

        let strategyAssets = await m2m.methods.strategyAssets().call();
        let totalNetAssets = await m2m.methods.totalNetAssets().call();
        let strategyWeights = await pm.methods.getAllStrategyWeights().call();

        let strategiesMapping = [];
        try {

            let apiUrl = rootState.network.apiUrl;
            let networkName = rootState.network.networkName;
            let url = apiUrl + `/${networkName}/${contractType.toLowerCase()}`
            console.log("Load strategies mapping when get m2m from url: ", url, strategyAssets)
            strategiesMapping = (await axios.get(url + '/dict/strategies')).data;
            console.log("Loaded strategies mapping when get m2m: ", strategiesMapping)
        } catch (e) {
            console.log('Error: ' + e.message);
        }

        let fromAsset6 = rootState.network.assetDecimals === 6;
        let sum = 0;
        let items = [];

        for (let i = 0; i < strategyAssets.length; i++) {
            let asset = strategyAssets[i];
            console.log("ASSET:", asset)
            let weight = strategyWeights[i];

            let mapping = strategiesMapping.find(value => value.address === asset.strategy);

            console.log('fromAsset6: ', fromAsset6)
            if (fromAsset6 && contractType === 'DAI+' || contractType === 'ETH+') {
                fromAsset6 = false;
            }
            console.log('rootState.network.assetDecimals: ', rootState.network.assetDecimals)

            let nav = (fromAsset6 ? numberUtils._fromE6(asset.netAssetValue.toString()) : web3.web3.utils.fromWei(asset.netAssetValue, 'ether'));

            let targetWeights = (weight.targetWeight ? parseInt(weight.targetWeight) / 1000 : 0);
            let enabledReward = weight.enabledReward;
            let enabled = weight.enabled;
            let isHidden = !(nav > 0 || enabled || targetWeights > 0 || enabledReward );

            items.push(
                {
                    name: mapping ? mapping.fullName : asset.strategy,
                    address: asset.strategy,
                    netAssetValue: nav,
                    liquidationValue: (fromAsset6 ? numberUtils._fromE6(asset.liquidationValue.toString()) : web3.web3.utils.fromWei(asset.liquidationValue, 'ether')),
                    minWeight: (weight.minWeight ? parseInt(weight.minWeight) / 1000 : 0),
                    maxWeight: (weight.maxWeight ? parseInt(weight.maxWeight) / 1000 : 0),
                    riskFactor: (weight.riskFactor ? parseInt(weight.riskFactor) / 1000 : 0),
                    targetWeight: targetWeights,
                    enabled: enabled,
                    enabledReward: enabledReward,
                    isHidden: isHidden,
                });

            sum += parseFloat((fromAsset6 ? numberUtils._fromE6(asset.netAssetValue.toString()) : web3.web3.utils.fromWei(asset.netAssetValue, 'ether')));
        }

        for (let i = 0; i < strategiesMapping.length; i++) {
            let mappingAsset = strategiesMapping[i];
            let added = items.find(value => value.address === mappingAsset.address);
            if (!added) {
                items.push(
                    {
                        name: mappingAsset.fullName,
                        address: mappingAsset.address,
                        netAssetValue: 0,
                        liquidationValue: 0,
                        minWeight: 0,
                        maxWeight: 0,
                        riskFactor: 0,
                        targetWeight: 0,
                        enabled: false,
                        enabledReward: false,
                        isHidden: false,
                    });
            }
        }

        for (let i = 0; i < items.length; i++) {
            items[i].currentWeight = Number((100 * parseFloat(items[i].netAssetValue) / sum).toFixed(3));
            if (items[i].currentWeight < 0) {
                items[i].currentWeight = 0;
            }
            items[i].calculatedNav = (sum / 100) * items[i].targetWeight;
            console.log("CALCULATED NAV:", sum)
        }

        console.log("ITEMS:", items)

        commit('setM2mItems', items);
        commit('setM2mTotal', (fromAsset6 ? numberUtils._fromE6(totalNetAssets) : web3.web3.utils.fromWei(totalNetAssets, 'ether')));

        if (tokenPlusContract) {
            let totalTokenPlus = numberUtils._fromE6(await tokenPlusContract.methods.totalSupply().call());
            if (contractType === 'ETH+') {
                totalTokenPlus = web3.web3.utils.fromWei(await tokenPlusContract.methods.totalSupply().call(), 'ether');
                console.log(typeof totalTokenPlus);
            }
            console.log(typeof totalTokenPlus);
            let liquidityIndex = (await tokenPlusContract.methods.liquidityIndex().call());
            console.log("totalTokenPlus: ", totalTokenPlus)
            commit('setUsdPlusTotal', totalTokenPlus);
            commit('setUsdPlusLiquidityIndex', liquidityIndex);
        }
    },

    async getRewardPools({commit, dispatch, getters, rootState}) {

        let pools = [];

        /* dateFormat by default YYYY-DD-MM */
        pools.push({name: 'Pool 1 mock', rewardRate: '10', periodFinish: '2022-05-11'});
        pools.push({name: 'Pool 2 mock', rewardRate: '5', periodFinish: '2022-07-30'});

        commit('setRewardPools', pools);
    },

    async updateRewardPool({commit, dispatch, getters, rootState}, pool) {

        let pools = getters.rewardPools;

        pools = pools.filter(function (obj) {
            return obj.name !== pool.name;
        });

        pools.push(pool);

        commit('setRewardPools', pools);
    },


    async getAbroad({commit, dispatch, getters, rootState}, contractType) {

        let abroad = {};

        if (contractType === 'USD+') {
            console.log("getAbroad for usd ")
            abroad.min = await rootState.web3.contracts.exchange.methods.abroadMin().call();
            abroad.max = await rootState.web3.contracts.exchange.methods.abroadMax().call();
            console.log("getAbroad for usd: ", abroad)
            commit('setAbroad', abroad);
            return;
        }

        if (contractType === 'DAI+') {
            console.log("getAbroad for dai ")
            abroad.min = await rootState.web3.contracts.daiExchange.methods.abroadMin().call();
            abroad.max = await rootState.web3.contracts.daiExchange.methods.abroadMax().call();
            console.log("getAbroad for dai: ", abroad)
            commit('setAbroad', abroad);
            return;
        }

        if (contractType === 'USDT+') {
            console.log("getAbroad for usdt ")
            abroad.min = await rootState.web3.contracts.usdtExchange.methods.abroadMin().call();
            abroad.max = await rootState.web3.contracts.usdtExchange.methods.abroadMax().call();
            console.log("getAbroad for usdt: ", abroad)
            commit('setAbroad', abroad);
            return;
        }

        if (contractType === 'ETH+') {
            console.log("getAbroad for eth ")
            abroad.min = await rootState.web3.contracts.wethExchange.methods.abroadMin().call();
            abroad.max = await rootState.web3.contracts.wethExchange.methods.abroadMax().call();
            console.log("getAbroad for eth: ", abroad)
            commit('setAbroad', abroad);
            return;
        }

        console.log("Error when get abroad. Contract type not found: ", contractType)
    },

    async updateAbroad({commit, dispatch, getters, rootState}, abroad) {

        let account = rootState.accountData.account;
        let params = {from: account};

        let contractType = abroad.contractType;
        if (contractType === 'USD+') {
            await rootState.web3.contracts.exchange.methods.setAbroad(abroad.min, abroad.max).send(params);
            return;
        }

        if (contractType === 'DAI+') {
            await rootState.web3.contracts.daiExchange.methods.setAbroad(abroad.min, abroad.max).send(params);
            return;
        }

        if (contractType === 'USDT+') {
            await rootState.web3.contracts.usdtExchange.methods.setAbroad(abroad.min, abroad.max).send(params);
            return;
        }

        if (contractType === 'ETH+') {
            await rootState.web3.contracts.wethExchange.methods.setAbroad(abroad.min, abroad.max).send(params);
            return;
        }

        console.log("Error when update abroad. Contract type not found: ", contractType)
    },


    async getFinance({commit, dispatch, getters, rootState}, payload) {

        commit('setFinanceLoading', true);

        dispatch('getAbroad', payload.contractType);
        dispatch('checkAccount', payload.contractType);


        console.debug("isAddDelay: ", payload.isAddDelay);
        if (payload.isAddDelay) {
            setTimeout(async () => {
                console.debug("isAddDelay Update now.")
                await dispatch('getStrategyWeights', payload.contractType);
                await dispatch('getM2M', payload.contractType);
                commit('setFinanceLoading', false);
            }, 3500) // added delay for a blockchain waiting for 3.5 seconds

            return;
        }


        await dispatch('getStrategyWeights', payload.contractType);
        await dispatch('getM2M', payload.contractType);
        commit('setFinanceLoading', false);

    },
};

const mutations = {

    setOverview(state, value) {
        state.overview = value;
    },

    setAbroad(state, value) {
        state.abroad = value;
    },


    setSettings(state, value) {
        state.settings = value;
    },

    setSettingsLoading(state, value) {
        state.settingsLoading = value;
    },

    setFinanceLoading(state, value) {
        state.financeLoading = value;
    },

    setOverviewLoading(state, value) {
        state.overviewLoading = value;
    },

    setProposals(state, value) {
        state.proposals = value;
    },

    setProposalsLoading(state, value) {
        state.proposalsLoading = value;
    },

    setStrategyWeights(state, value) {
        state.strategyWeights = value;
    },

    setM2mItems(state, value) {
        state.m2mItems = value;
    },

    setM2mTotal(state, value) {
        state.m2mTotal = value;
    },

    setUsdPlusTotal(state, value) {
        state.usdPlusTotal = value;
    },

    setUsdPlusLiquidityIndex(state, value) {
        state.usdPlusLiquidityIndex = value;
    },

    setRewardPools(state, value) {
        state.rewardPools = value;
    },

    setHasChangeAccount(state, value) {
        state.hasChangeAccount = value;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
