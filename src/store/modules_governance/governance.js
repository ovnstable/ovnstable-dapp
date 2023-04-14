import BN from "bn.js";

const {axios} = require('@/plugins/http-axios');
const {utils} = require('@/plugins/utils');
import * as numberUtils from '@/utils/number-utils'

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

        let weights = data.weights
        let contractType = data.contractType

        let pm;
        if (!contractType || contractType === 'USD+') {
            pm = rootState.web3.contracts.pm;
        } else if (contractType === 'DAI+') {
            pm = rootState.web3.contracts.daiPm;
        } else if (contractType === 'USDT+') {
            pm = rootState.web3.contracts.usdtPm;
        } else {
            console.log("Error when checkAccount. Contract type not found: ", contractType)
            return;
        }

        let account = rootState.accountData.account;
        let params = {from: account, "gasPrice": rootState.gasPrice.gasPriceGwei};

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

        try {
            await pm.methods.setStrategyWeights(items).send(params);
        } catch (e) {
            console.log(e)
        }

        commit('setFinanceLoading', false);
    },

    async estimateSetStrategiesM2MWeights({commit, dispatch, getters, rootState}, data) {
        commit('setFinanceLoading', true);

        let weights = data.weights
        let contractType = data.contractType

        let pm;
        if (!contractType || contractType === 'USD+') {
            pm = rootState.web3.contracts.pm;
        } else if (contractType === 'DAI+') {
            pm = rootState.web3.contracts.daiPm;
        } else if (contractType === 'USDT+') {
            pm = rootState.web3.contracts.usdtPm;
        } else {
            console.log("Error when checkAccount. Contract type not found: ", contractType)
            return;
        }

        let result;
        let networkId = rootState.network.networkId;

        try {
            let blockNum = await rootState.web3.web3.eth.getBlockNumber();
            let account = rootState.accountData.account;
            let estimateOptions = {from: account, "gasPrice": rootState.gasPrice.gasPriceGwei};

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

            await pm.methods.setStrategyWeights(items).estimateGas(estimateOptions)
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
                            method: pm.methods.setStrategyWeights(items).encodeABI(),
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

    async rebalancePortfolio({commit, dispatch, getters, rootState}, contractType) {

        commit('setFinanceLoading', true);

        let pm;
        if (!contractType || contractType === 'USD+') {
            pm = rootState.web3.contracts.pm;
        } else if (contractType === 'DAI+') {
            pm = rootState.web3.contracts.daiPm;
        } else if (contractType === 'USDT+') {
            pm = rootState.web3.contracts.usdtPm;
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

        let m2m;
        let tokenPlusContract;
        let pm;
        if (contractType === 'USD+') {
            tokenPlusContract = rootState.web3.contracts.usdPlus;
            pm = rootState.web3.contracts.pm;
            m2m = rootState.web3.contracts.m2m;
        } else if (contractType === 'DAI+') {
            tokenPlusContract = rootState.web3.contracts.daiPlus;
            pm = rootState.web3.contracts.daiPm;
            m2m = rootState.web3.contracts.daiM2m;
        } else if (contractType === 'USDT+') {
            tokenPlusContract = rootState.web3.contracts.usdtPlus;
            pm = rootState.web3.contracts.usdtPm;
            m2m = rootState.web3.contracts.usdtM2m;
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
            let weight = strategyWeights[i];

            let mapping = strategiesMapping.find(value => value.address === asset.strategy);

            console.log('fromAsset6: ', fromAsset6)
            if (fromAsset6 && contractType === 'DAI+') {
                fromAsset6 = false;
            }
            console.log('rootState.network.assetDecimals: ', rootState.network.assetDecimals)

            items.push(
                {
                    name: mapping ? mapping.name : asset.strategy,
                    address: asset.strategy,
                    netAssetValue: (fromAsset6 ? numberUtils._fromE6(asset.netAssetValue.toString()) : numberUtils._fromE18(asset.netAssetValue.toString())),
                    liquidationValue: (fromAsset6 ? numberUtils._fromE6(asset.liquidationValue.toString()) : numberUtils._fromE18(asset.liquidationValue.toString())),
                    minWeight: (weight.minWeight ? parseInt(weight.minWeight) / 1000 : 0),
                    maxWeight: (weight.maxWeight ? parseInt(weight.maxWeight) / 1000 : 0),
                    riskFactor: (weight.riskFactor ? parseInt(weight.riskFactor) / 1000 : 0),
                    targetWeight: (weight.targetWeight ? parseInt(weight.targetWeight) / 1000 : 0),
                    enabled: weight.enabled,
                    enabledReward: weight.enabledReward
                });

            sum += parseFloat((fromAsset6 ? numberUtils._fromE6(asset.netAssetValue.toString()) : numberUtils._fromE18(asset.netAssetValue.toString())));
        }

        for (let i = 0; i < strategiesMapping.length; i++) {
            let mappingAsset = strategiesMapping[i];
            let added = items.find(value => value.address === mappingAsset.address);

            if (!added) {
                items.push(
                    {
                        name: mappingAsset.name,
                        address: mappingAsset.address,
                        netAssetValue: 0,
                        liquidationValue: 0,
                        minWeight: 0,
                        maxWeight: 0,
                        riskFactor: 0,
                        targetWeight: 0,
                        enabled: false,
                        enabledReward: false
                    });
            }
        }

        for (let i = 0; i < items.length; i++) {
            items[i].currentWeight = Number((100 * parseFloat(items[i].netAssetValue) / sum).toFixed(3));
        }

        commit('setM2mItems', items);
        commit('setM2mTotal', (fromAsset6 ? numberUtils._fromE6(totalNetAssets.toString()) : numberUtils._fromE18(totalNetAssets.toString())));

        if (tokenPlusContract) {
            let totalTokenPlus = numberUtils._fromE6(await tokenPlusContract.methods.totalSupply().call());
            let liquidityIndex = (await tokenPlusContract.methods.liquidityIndex().call()).toString();
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

        console.log("Error when update abroad. Contract type not found: ", contractType)
    },


    async getFinance({commit, dispatch, getters, rootState}, contractType) {

        commit('setFinanceLoading', true);

        dispatch('getAbroad', contractType);
        dispatch('checkAccount', contractType);
        await dispatch('getStrategyWeights', contractType);
        await dispatch('getM2M', contractType);

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
