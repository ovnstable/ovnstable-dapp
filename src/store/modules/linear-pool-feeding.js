import fs from "fs";
import {ethers} from "ethers";
import BN from "bn.js";

import Pool from "../../contracts/abi/ERC4626LinearPool.json";
import USDPlus from "../../contracts/abi/UsdPlusToken.json";
import Vault from "../../contracts/abi/VaultBalancer.json";
import StaticUsdPlus from "../../contracts/abi/StaticUsdPlusToken.json";
import ERC20 from "../../contracts/abi/ERC20.json";

const state = {

    amountValueUsdc: null,
    amountValueUsdPlus: null,

    prepareStep: false,
    approveUsdPlusStep: false,
    depositStaticStep: false,
    approveUsdcStep: false,
    swappingFirstStep: false,
    approveStaticUsdPlusStep: false,
    swappingSecondStep: false,
    endStep: false,


    balances: {
        usdPlus: null,
        usdc: null,
        staticUsdPlus: null,
        lpToken: null,
    }
};

const getters = {

    amountValueUsdc(state) {
        return state.amountValueUsdc;
    },

    amountValueUsdPlus(state) {
        return state.amountValueUsdPlus;
    },

    balances(state) {
        return state.balances;
    },

    prepareStep(state) {
        return state.prepareStep;
    },

    approveUsdPlusStep(state) {
        return state.approveUsdPlusStep;
    },

    depositStaticStep(state) {
        return state.depositStaticStep;
    },

    approveUsdcStep(state) {
        return state.approveUsdcStep;
    },

    swappingFirstStep(state) {
        return state.swappingFirstStep;
    },

    approveStaticUsdPlusStep(state) {
        return state.approveStaticUsdPlusStep;
    },

    swappingSecondStep(state) {
        return state.swappingSecondStep;
    },

    endStep(state) {
        return state.endStep;
    },
};

const actions = {

    async discardSteps({commit, dispatch, getters, rootState}) {
        commit('setPrepareStep', false);
        commit('setApproveUsdPlusStep', false);
        commit('setDepositStaticStep', false);
        commit('setApproveUsdcStep', false);
        commit('setSwappingFirstStep', false);
        commit('setApproveStaticUsdPlusStep', false);
        commit('setSwappingSecondStep', false);
        commit('setEndStep', false);
    },


    async updateBalances({commit, dispatch, getters, rootState}, signer){

        let poolAddress = "0x6933ec1CA55C06a894107860c92aCdFd2Dd8512f";

        let account = await signer.getAddress();

        let usdPlus = await new ethers.Contract("0x236eeC6359fb44CCe8f97E99387aa7F8cd5cdE1f", USDPlus.abi, signer );
        let staticUsdPlus = await new ethers.Contract("0x5d9D8509C522a47D9285b9e4e9ec686e6A580850", StaticUsdPlus.abi , signer );
        let usdc = await new ethers.Contract("0x2791bca1f2de4661ed88a30c99a7a9449aa84174", ERC20, signer);
        let pool = await new ethers.Contract(poolAddress, Pool , signer);
        let vault = await new ethers.Contract("0xba12222222228d8ba445958a75a0704d566bf2c8" ,Vault , signer);

        let usdPlusBalance = await usdPlus.balanceOf(account) / 1e6;
        console.log('Balance USD+: ' + usdPlusBalance);
        let usdcBalance = await usdc.balanceOf(account) / 1e6;
        console.log('Balance USDC: ' + usdcBalance);
        let staticUsdPlusBalance = await staticUsdPlus.balanceOf(account) / 1e6;
        console.log('Balance StaticUSD+: ' + staticUsdPlusBalance);
        let poolBalance = await pool.balanceOf(account) / 1e18;
        console.log('Balance Pool LP: ' + poolBalance);


        let targets = await pool.getTargets();
        let balancesVault = await vault.getPoolTokens(await pool.getPoolId());

        console.log(`Targets: lower: ${targets[0].toString()} upper: ${targets[1].toString()}`);
        console.log(`Balances: ${balancesVault[0].toString()} : ${balancesVault[1].toString()}`);

        let balances = {
            usdPlus: usdPlusBalance,
            usdc: usdcBalance,
            staticUsdPlus: staticUsdPlusBalance,
            lpToken: poolBalance,
        };

        commit('setBalances', balances);
    },

    async startProcess({commit, dispatch, getters, rootState}) {

        await dispatch('discardSteps');

        let poolAddress = "0x6933ec1CA55C06a894107860c92aCdFd2Dd8512f";

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        console.log('Provider: ' + provider.connection.url);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        let account = await signer.getAddress();
        console.log("Account:", account);


        let usdPlus = await new ethers.Contract("0x236eeC6359fb44CCe8f97E99387aa7F8cd5cdE1f", USDPlus.abi, signer );
        let staticUsdPlus = await new ethers.Contract("0x5d9D8509C522a47D9285b9e4e9ec686e6A580850", StaticUsdPlus.abi , signer );
        let usdc = await new ethers.Contract("0x2791bca1f2de4661ed88a30c99a7a9449aa84174", ERC20, signer);
        let pool = await new ethers.Contract(poolAddress, Pool , signer);
        let vault = await new ethers.Contract("0xba12222222228d8ba445958a75a0704d566bf2c8" ,Vault , signer);

        await dispatch('updateBalances', signer);


        let amountToUsdPlus = Number.parseInt(getters.amountValueUsdPlus);

        console.log('Input: usdPlus ' + getters.amountValueUsdPlus);
        console.log('Input: USDC ' + getters.amountValueUsdc);

        let amountToUsdPlusScaled = new BN(10).pow(new BN(6)).muln(amountToUsdPlus).toString();
        let convertedAmount = await staticUsdPlus.staticToDynamicAmount(amountToUsdPlusScaled);

        commit('setPrepareStep', true);

        await (await usdPlus.approve(staticUsdPlus.address, convertedAmount )).wait();

        commit('setApproveUsdPlusStep', true);

        await (await staticUsdPlus.deposit(convertedAmount, account)).wait();

        await dispatch('updateBalances', signer);

        commit('setDepositStaticStep', true);

        let amountUsdcToLp = Number.parseInt(getters.amountValueUsdc);
        let amountStUsdPlusToLp = Number.parseInt(getters.amountValueUsdPlus);

        let amountUsdcToLpScaled = new BN(10).pow(new BN(6)).muln(amountUsdcToLp).toString();
        let amountStUsdPlusToLpScaled = new BN(10).pow(new BN(6)).muln(amountStUsdPlusToLp).toString();

        await (await usdc.approve(vault.address, amountUsdcToLpScaled)).wait();

        commit('setApproveUsdcStep', true);

        await (await vault.swap(
            {
                poolId: await pool.getPoolId(),
                kind: 0,
                assetIn: usdc.address,
                assetOut: poolAddress,
                amount: amountUsdcToLpScaled,
                userData: "0x",
            },
            {
                sender: account,
                fromInternalBalance: false,
                recipient: account,
                toInternalBalance: false,
            },
            0,
            1000000000000
        )).wait();

        commit('setSwappingFirstStep', true);


        await dispatch('updateBalances', signer);


        await (await staticUsdPlus.approve(vault.address, amountStUsdPlusToLpScaled )).wait();

        commit('setApproveStaticUsdPlusStep', true);

        await dispatch('updateBalances', signer);


        await (await vault.swap(
            {
                poolId: await pool.getPoolId(),
                kind: 0,
                assetIn: staticUsdPlus.address,
                assetOut: poolAddress,
                amount: amountStUsdPlusToLpScaled,
                userData: "0x",
            },
            {
                sender: account,
                fromInternalBalance: false,
                recipient: account,
                toInternalBalance: false,
            },
            0,
            1000000000000,
        )).wait();

        commit('setSwappingSecondStep', true);

        await dispatch('updateBalances', signer);

        commit('setEndStep', true);
    }
};

const mutations = {

    setAmountValueUsdPlus(state, value) {
        state.amountValueUsdPlus = value;
    },

    setAmountValueUsdc(state, value) {
        state.amountValueUsdc = value;
    },

    setBalances(state, value) {
        state.balances = value;
    },

    setPrepareStep(state, value) {
        state.prepareStep = value;
    },

    setApproveUsdPlusStep(state, value) {
        state.approveUsdPlusStep = value;
    },

    setDepositStaticStep(state, value) {
        state.depositStaticStep = value;
    },

    setApproveUsdcStep(state, value) {
        state.approveUsdcStep = value;
    },

    setSwappingFirstStep(state, value) {
        state.swappingFirstStep = value;
    },

    setApproveStaticUsdPlusStep(state, value) {
        state.approveStaticUsdPlusStep = value;
    },

    setSwappingSecondStep(state, value) {
        state.swappingSecondStep = value;
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
