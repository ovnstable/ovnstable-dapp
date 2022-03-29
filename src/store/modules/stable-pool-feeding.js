import fs from "fs";
import {ethers} from "ethers";
import BN from "bn.js";
const {web3} = require("@openzeppelin/test-helpers/src/setup");

import Pool from "../../contracts/abi/StablePhantomPool.json";
import Vault from "../../contracts/abi/VaultBalancer.json";
import ERC20 from "../../contracts/abi/ERC20.json";

const state = {

    usdtAmountValue: null,
    daiAmountValue: null,
    lpAmountValue: null,

    prepareStep: false,
    approveLpStep: false,
    approveUsdtStep: false,
    approveDaiStep: false,
    joinPoolStep: false,
    endStep: false,
};

const getters = {

    usdtAmountValue(state) {
        return state.usdtAmountValue;
    },

    daiAmountValue(state) {
        return state.daiAmountValue;
    },

    lpAmountValue(state) {
        return state.lpAmountValue;
    },

    prepareStep(state) {
        return state.prepareStep;
    },

    approveLpStep(state) {
        return state.approveLpStep;
    },

    approveUsdtStep(state) {
        return state.approveUsdtStep;
    },

    approveDaiStep(state) {
        return state.approveDaiStep;
    },

    joinPoolStep(state) {
        return state.joinPoolStep;
    },

    endStep(state) {
        return state.endStep;
    },
};

const actions = {

    async discardSteps({commit, dispatch, getters, rootState}) {
        commit('setPrepareStep', false);
        commit('setApproveLpStep', false);
        commit('setApproveUsdtStep', false);
        commit('setApproveDaiStep', false);
        commit('setJoinPoolStep', false);
        commit('setEndStep', false);
    },

    async startProcess({commit, dispatch, getters, rootState}) {

        await dispatch('discardSteps');

        let usdtAddress = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";
        let daiAddress = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
        let lpUsdPlusAddress = "0x1aAFc31091d93C3Ff003Cff5D2d8f7bA2e728425";
        let stablePoolAddress = "0xE051605A83dEAe38d26a7346B100EF1AC2ef8a0b";

        let provider = ethers.provider;
        console.log('Provider: ' + provider.connection.url);
        let wallet = await new ethers.Wallet(process.env.PK_POLYGON, provider);
        console.log('Wallet: ' + wallet.address);
        const balance = await provider.getBalance(wallet.address);
        console.log('Balance: ' + balance / 1e18);

        let stablePool = await ethers.getContractAt(Pool, stablePoolAddress, wallet);
        let vault = await ethers.getContractAt(Vault, "0xba12222222228d8ba445958a75a0704d566bf2c8", wallet);

        console.log("stablePool.getPoolId: " + await stablePool.getPoolId());

        console.log('[Init Stable pool] ...');
        console.log("stablePool.totalSupply: " + await stablePool.totalSupply());

        let lpUsdPlus = await ethers.getContractAt(ERC20, lpUsdPlusAddress, wallet);
        let usdt = await ethers.getContractAt(ERC20, usdtAddress, wallet);
        let dai = await ethers.getContractAt(ERC20, daiAddress, wallet);


        console.log('Balance LP USD+: ' + await lpUsdPlus.balanceOf(wallet.address) / 1e18);

        // Same to (['uint256', 'uint256[]'], [StablePoolJoinKind.INIT, amountsIn]);

        const {tokens, balances} = await vault.getPoolTokens(await pool.getPoolId());

        console.log('Init balances:')

        let initAmountsIn = []

        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];

            let name = "";
            switch (token.toLowerCase()) {
                case "0xc2132d05d31c914a87c6611c10748aeb04b58e8f".toLowerCase():
                    name = "USDT";
                    initAmountsIn[i] = new BN(10).pow(new BN(6)).muln(getters.usdtAmountValue).toString(); // 35000$
                    break
                case "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063".toLowerCase():
                    name = "DAI ";
                    initAmountsIn[i] = new BN(10).pow(new BN(18)).muln(getters.daiAmountValue).toString(); // 35000$
                    break
                case lpUsdPlusAddress.toLowerCase():
                    name = "LP ";
                    initAmountsIn[i] = new BN(10).pow(new BN(18)).muln(getters.lpAmountValue).toString(); // 35000$
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

        let userData = web3.eth.abi.encodeParameters(['uint256', 'uint256[]'], [0, initAmountsIn]);
        console.log(`userData: ${userData}`);

        commit('setPrepareStep', true);

        await (await lpUsdPlus.approve(vault.address, getters.lpAmountValue)).wait();

        commit('setApproveLpStep', true);

        await (await usdt.approve(vault.address, getters.usdtAmountValue)).wait();

        commit('setApproveUsdtStep', true);

        await (await dai.approve(vault.address, getters.daiAmountValue)).wait();

        commit('setApproveDaiStep', true);

        console.log("Vault approved");

        let uint256Max = new BN(2).pow(new BN(256)).subn(1).toString(); // type(uint256).max

        console.log("Before stable joinPool")
        await (await vault.joinPool(
            await stablePool.getPoolId(),
            wallet.address,
            wallet.address,
            {
                assets: tokens,
                maxAmountsIn: [uint256Max, uint256Max, uint256Max, uint256Max],
                userData: userData,
                fromInternalBalance: false
            }
        )).wait();

        commit('setJoinPoolStep', true);

        console.log("joinPool done")

        console.log('Balance  LP USD+: ' + await lpUsdPlus.balanceOf(wallet.address) / 1e18);
        console.log('Balance  ST LP USD+: ' + await stablePool.balanceOf(wallet.address) / 1e18);

        commit('setEndStep', true);
    }
};

const mutations = {

    setUsdtAmountValue(state, value) {
        state.usdtAmountValue = value;
    },

    setDaiAmountValue(state, value) {
        state.daiAmountValue = value;
    },

    setLpAmountValue(state, value) {
        state.lpAmountValue = value;
    },

    setPrepareStep(state, value) {
        state.prepareStep = value;
    },

    setApproveLpStep(state, value) {
        state.approveLpStep = value;
    },

    setApproveUsdtStep(state, value) {
        state.approveUsdtStep = value;
    },

    setApproveDaiStep(state, value) {
        state.approveDaiStep = value;
    },

    setJoinPoolStep(state, value) {
        state.joinPoolStep = value;
    },

    setEndStep(state, value) {
        state.endStep = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
