import fs from "fs";
import {ethers} from "ethers";
import BN from "bn.js";

const {web3} = require("@openzeppelin/test-helpers/src/setup");

import Pool from "../../../contracts/abi/ERC4626LinearPool.json";
import Vault from "../../../contracts/abi/VaultBalancer.json";

const state = {

    amountValueLpUsdt: null,
    amountValueLpDai: null,
    amountValueLpUsdPlus: null,

    steps: {
        prepareStep: false,
        approveUsdt: false,
        approveUsdPlus: false,
        approveDai: false,
        joinPool: false,
        endStep: false,
    },

    balances: {
        lpUsdPlus: null,
        lpDai: null,
        lpUsdt: null,
        lpToken: null,
    }
};

const getters = {

    amountValueLpUsdt(state) {
        return state.amountValueLpUsdt;
    },

    amountValueLpDai(state) {
        return state.amountValueLpDai;
    },

    amountValueLpUsdPlus(state) {
        return state.amountValueLpUsdPlus;
    },


    balances(state) {
        return state.balances;
    },

    steps(state) {
        return state.steps;
    },
};

const actions = {

    async discardSteps({commit, dispatch, getters, rootState}) {
        let steps = {
            prepareStep: false,
            approveUsdt: false,
            approveUsdPlus: false,
            approveDai: false,
            joinPool: false,
            endStep: false,
        }

        commit('setSteps', steps);
    },


    async updateBalances({commit, dispatch, getters, rootState}, signer) {

        let account = await signer.getAddress();

        let poolUsdt = await new ethers.Contract("0x8A819a4caBD6EfCb4E5504fE8679A1aBD831Dd8f", Pool, signer);
        let poolUsdPlus = await new ethers.Contract("0x6933ec1CA55C06a894107860c92aCdFd2Dd8512f", Pool, signer);
        let poolDai = await new ethers.Contract("0x0503Dd6b2D3Dd463c9BeF67fB5156870Af63393E", Pool, signer);
        let poolStable = await new ethers.Contract("0xF48f01DCB2CbB3ee1f6AaB0e742c2D3941039d56", Pool, signer);
        let vault = await new ethers.Contract("0xba12222222228d8ba445958a75a0704d566bf2c8", Vault, signer);


        let balances = {
            lpUsdPlus: await poolUsdPlus.balanceOf(account) / 1e18,
            lpDai: await poolDai.balanceOf(account) / 1e18,
            lpUsdt: await poolUsdt.balanceOf(account) / 1e18,
            lpToken: await poolStable.balanceOf(account) / 1e18,
        };

        commit('setBalances', balances);


        await showBalances(vault, poolStable);

        async function showBalances(vault, pool) {
            const {tokens, balances} = await vault.getPoolTokens(await pool.getPoolId());

            console.log('Balance Stable Pool:')
            console.log('Tokens:   ' + tokens);
            console.log('Balances: ' + balances);

            for (let i = 0; i < tokens.length; i++) {
                let token = tokens[i];
                let balance = balances[i];

                let name = "";
                switch (token.toLowerCase()) {
                    case "0x8A819a4caBD6EfCb4E5504fE8679A1aBD831Dd8f".toLowerCase():
                        name = "LP USDT";
                        break
                    case "0x0503Dd6b2D3Dd463c9BeF67fB5156870Af63393E".toLowerCase():
                        name = "LP DAI ";
                        break
                    case "0x6933ec1CA55C06a894107860c92aCdFd2Dd8512f".toLowerCase():
                        name = "LP USD+"
                        break
                    default:
                        name = "LP  ";
                        break

                }

                console.log(`- ${name}:${balance}`);
            }

        }
    },

    async startProcess({commit, dispatch, getters, rootState}) {

        await dispatch('discardSteps');

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        console.log('Provider: ' + provider.connection.url);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        let account = await signer.getAddress();
        console.log("Account:", account)


        let poolUsdt = await new ethers.Contract("0x8A819a4caBD6EfCb4E5504fE8679A1aBD831Dd8f", Pool, signer);
        let poolUsdPlus = await new ethers.Contract("0x6933ec1CA55C06a894107860c92aCdFd2Dd8512f", Pool, signer);
        let poolDai = await new ethers.Contract("0x0503Dd6b2D3Dd463c9BeF67fB5156870Af63393E", Pool, signer);
        let poolStable = await new ethers.Contract("0xF48f01DCB2CbB3ee1f6AaB0e742c2D3941039d56", Pool, signer);

        let vault = await new ethers.Contract("0xba12222222228d8ba445958a75a0704d566bf2c8", Vault, signer);


        let steps = getters.steps;
        steps.prepareStep = true;
        commit('setSteps', steps);

        await dispatch('updateBalances', signer);


        let valueDai = new BN(10).pow(new BN(18)).muln(Number.parseInt(getters.amountValueLpDai)).toString();
        let valueUsdt = new BN(10).pow(new BN(18)).muln(Number.parseInt(getters.amountValueLpUsdt)).toString();
        let valueUsdPlus = new BN(10).pow(new BN(18)).muln(Number.parseInt(getters.amountValueLpUsdPlus)).toString();


        let {tokens, initAmountsIn} = await makeInitialBalances(vault, poolStable);
        let userData = web3.eth.abi.encodeParameters(['uint256', 'uint256[]'], [0, initAmountsIn]);
        console.log(`userData: ${userData}`);

        await (await poolUsdPlus.approve(vault.address, valueUsdPlus)).wait();
        steps.approveUsdPlus = true;
        commit('setSteps', steps);


        await (await poolUsdt.approve(vault.address, valueUsdt)).wait();
        steps.approveUsdt = true;
        commit('setSteps', steps);


        await (await poolDai.approve(vault.address, valueDai)).wait();
        steps.approveDai = true;
        commit('setSteps', steps);

        let uint256Max = new BN(2).pow(new BN(256)).subn(1).toString(); // type(uint256).max

        await (await vault.joinPool(
            await poolStable.getPoolId(),
            account,
            account,
            {
                assets: tokens,
                maxAmountsIn: [uint256Max, uint256Max, uint256Max, uint256Max],
                userData: userData,
                fromInternalBalance: false
            }
        )).wait();

        steps.joinPool = true;
        commit('setSteps', steps);

        await dispatch('updateBalances', signer);

        steps.endStep = true;
        commit('setSteps', steps);


        async function makeInitialBalances(vault, pool) {
            const {tokens, balances} = await vault.getPoolTokens(await pool.getPoolId());

            console.log('Init balances:')

            let initAmountsIn = []

            for (let i = 0; i < tokens.length; i++) {
                let token = tokens[i];

                let name = "";
                switch (token.toLowerCase()) {
                    case poolUsdt.address.toLowerCase():
                        name = "USDT";
                        initAmountsIn[i] = valueUsdt;
                        break
                    case poolDai.address.toLowerCase():
                        name = "DAI ";
                        initAmountsIn[i] = valueDai;
                        break
                    case poolUsdPlus.address.toLowerCase():
                        name = "UsdPlus ";
                        initAmountsIn[i] = valueUsdPlus;
                        break
                    default:
                        name = "Stable LP  ";
                        initAmountsIn[i] = "9000000000000000000";
                        break
                }

                console.log(`- ${name}: ${initAmountsIn[i]}`);
            }

            console.log(`- tokens array: ${tokens}`);
            console.log(`- initAmountsIn array: ${initAmountsIn}`);
            console.log(`------------------------------------`);

            return {
                tokens: tokens,
                initAmountsIn: initAmountsIn
            };
        }
    }
};

const mutations = {

    setBalances(state, value) {
        state.balances = value;
    },


    setSteps(state, value) {
        state.steps = value;
    },


    setAmountValueLpUsdt(state, value) {
        state.amountValueLpUsdt = value;
    },

    setAmountValueLpDai(state, value) {
        state.amountValueLpDai = value;
    },

    setAmountValueLpUsdPlus(state, value) {
        state.amountValueLpUsdPlus = value;
    },

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
