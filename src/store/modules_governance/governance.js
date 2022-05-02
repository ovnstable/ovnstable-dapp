import {axios} from "../../plugins/http-axios";
import utils from "../../plugins/utils";
import abiDecoder from "../../plugins/abiDecoder";
import Web3Utils from 'web3-utils'

const proposalStates = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed'];
import BigNumber from "bignumber.js";


const state = {

    overview: {},
    overviewLoading: true,
    proposals: [],
    proposalsLoading: true,
    settings: {},
    settingsLoading: true,

    strategyWeights: null,
};

const getters = {

    overview(state) {
        return state.overview;
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

    proposals(state) {
        return state.proposals;
    },


    strategyWeights(state) {
        return state.strategyWeights;
    },
};

const actions = {

    async upgradeToAction({commit, dispatch, getters, rootState}, request) {

        let contract = rootState.web3.contracts[request.contract];
        let governor = rootState.web3.contracts.governor;
        let account = rootState.web3.account;

        let abi = contract.methods.upgradeTo(request.address).encodeABI();
        let name = 'Proposal #' + getters.proposals.length + 1 + ' UpgradeTo ' + request.contract;
        let params = {from: account};

        await governor.methods.proposeExec([contract.options.address], [0], [abi], name).send(params);
    },

    async runPayoutAction({commit, dispatch, getters, rootState}) {

        let contact = rootState.web3.contracts.exchange;

        let params = {from: rootState.web3.account};
        await contact.methods.payout().send(params);
    },

    async updateGovernanceSettings({commit, dispatch, getters, rootState}, value) {

        let governor = rootState.web3.contracts.governor;
        let account = rootState.web3.account;
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
        let account = rootState.web3.account;
        let contract = rootState.web3.contracts.timelockController;
        let params = {from: account};

        let abi = contract.methods.updateDelay(value).encodeABI();
        let name = 'Proposal #' + getters.proposals.length + 1 + 'Update delay';
        await governor.methods.proposeExec([contract.options.address], [0], [abi], name).send(params);
    },

    async cancel({commit, dispatch, getters, rootState}, id) {

        let governor = rootState.web3.contracts.governor;

        let account = rootState.web3.account;
        let params = {from: account};
        await governor.methods.cancel(id).send(params);
    },

    async execute({commit, dispatch, getters, rootState}, id) {

        let governor = rootState.web3.contracts.governor;

        let account = rootState.web3.account;
        let params = {from: account};
        await governor.methods.executeExec(id).send(params);
    },

    async queue({commit, dispatch, getters, rootState}, id) {

        let governor = rootState.web3.contracts.governor;

        let account = rootState.web3.account;
        let params = {from: account};
        await governor.methods.queueExec(id).send(params);
    },


    async vote({commit, dispatch, getters, rootState}, request) {

        let governor = rootState.web3.contracts.governor;

        let account = rootState.web3.account;
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
        let account = rootState.web3.account;

        let params = {from: account};

        let abi = contract.methods.setBuyFee(request.fee, request.feeDenominator).encodeABI();
        let name = 'Proposal #' + getters.proposals.length + 1 + 'Change set Buy Fee';
        await governor.methods.proposeExec([contract.options.address], [0], [abi], name).send(params);
    },


    async minting({commit, dispatch, getters, rootState}, request) {

        let govToken = rootState.web3.contracts.govToken;
        let account = rootState.web3.account;
        let governor = rootState.web3.contracts.governor;
        let params = {from: account};

        let wei = rootState.web3.web3.utils.toWei(request.sum, 'ether');
        let abi = await govToken.methods.mint(request.account, wei).encodeABI();
        let name = 'Proposal #' + getters.proposals.length + 1 + 'Mint gov tokens';
        await governor.methods.proposeExec([govToken.options.address], [0], [abi], name).send(params);

    },

    async delegate({commit, dispatch, getters, rootState}, address) {

        let govToken = rootState.web3.contracts.govToken;
        let account = rootState.web3.account;
        let params = {from: account};
        let result = await govToken.methods.delegate(address).send(params);
    },

    async getProposals({commit, dispatch, getters, rootState}) {

        commit('setProposalsLoading', true);

        let governor = rootState.web3.contracts.governor;
        let proposals = await governor.methods.getProposals().call();

        proposals = [...proposals].reverse();
        if (proposals.length > 5){
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
        let totalDelegated = await govToken.methods.getVotes(rootState.web3.account).call();
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

    async setStrategyWeights({commit, dispatch, getters, rootState}, weights) {


        let pm = rootState.web3.contracts.pm;
        let account = rootState.web3.account;
        let params = {from: account};

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

            items.push(item);
        }

        if (process.env.VUE_APP_POLYGON === "polygon_dev"){
            pm.methods.setStrategyWeights(items).send(params);
        }else {
            let governor = rootState.web3.contracts.governor;
            let abi = pm.methods.setStrategyWeights(items).encodeABI();
            let name = 'Proposal #' + getters.proposals.length + 1 + ' Change weights';
            await governor.methods.proposeExec([pm.options.address], [0], [abi], name).send(params);
        }

    },

    async rebalancePortfolio ({commit, dispatch, getters, rootState} ) {

        let pm = rootState.web3.contracts.pm;
        let account = rootState.web3.account;
        let params = {from: account};

        if (process.env.VUE_APP_POLYGON === "polygon_dev"){
            pm.methods.balance().send(params);
        }else {

            let governor = rootState.web3.contracts.governor;
            let abi = pm.methods.balance().encodeABI();
            let name = 'Proposal #' + getters.proposals.length + 1 + ' Balance';
            await governor.methods.proposeExec([pm.options.address], [0], [abi], name).send(params);
        }


    },

    async getStrategyWeights({commit, dispatch, getters, rootState}) {

        let pm = rootState.web3.contracts.pm;
        let weights = await pm.methods.getAllStrategyWeights().call();

        let items = [];

        let strategiesMapping = (await axios('/dapp/strategies')).data;

        for (let i = 0; i < strategiesMapping.length; i++) {

            let strategy = strategiesMapping[i];

            let weight = weights.find(value => strategy.address === value.strategy);

            let item = {};
            item.address = strategy.address;
            item.name = strategy.name;

            if (weight){
                item.minWeight = weight.minWeight / 1000;
                item.targetWeight = weight.targetWeight / 1000;
                item.maxWeight = weight.maxWeight / 1000;
                item.enabled = weight.enabled;
                item.enabledReward = weight.enabledReward;
            }else {
                item.minWeight = 0;
                item.targetWeight = 0;
                item.maxWeight = 0;
                item.enabled = false;
                item.enabledReward = false;
            }


            items.push(item);
        }

        commit('setStrategyWeights', items);
    }

};

const mutations = {

    setOverview(state, value) {
        state.overview = value;
    },

    setSettings(state, value) {
        state.settings = value;
    },

    setSettingsLoading(state, value) {
        state.settingsLoading = value;
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

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
