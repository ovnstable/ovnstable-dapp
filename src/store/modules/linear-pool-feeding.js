import fs from "fs";
import {ethers} from "ethers";
import BN from "bn.js";

import Pool from "../../contracts/abi/ERC4626LinearPool.json";
import USDPlus from "../../contracts/abi/UsdPlusToken.json";
import Vault from "../../contracts/abi/VaultBalancer.json";
import StaticUsdPlus from "../../contracts/abi/StaticUsdPlusToken.json";
import ERC20 from "../../contracts/abi/ERC20.json";

const state = {

    amountValue: null,

    prepareStep: false,
    approveUsdPlusStep: false,
    depositStaticStep: false,
    approveUsdcStep: false,
    swappingFirstStep: false,
    approveStaticUsdPlusStep: false,
    swappingSecondStep: false,
    endStep: false,
};

const getters = {

    amountValue(state) {
        return state.amountValue;
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

    async startProcess({commit, dispatch, getters, rootState}) {

        await dispatch('discardSteps');

        let poolAddress = "0x1aAFc31091d93C3Ff003Cff5D2d8f7bA2e728425";

        let provider = ethers.provider;
        console.log('Provider: ' + provider.connection.url);
        let wallet = await new ethers.Wallet(process.env.PK_POLYGON, provider);
        console.log('Wallet: ' + wallet.address);
        const balance = await provider.getBalance(wallet.address);

        let usdPlus = await ethers.getContractAt(USDPlus.abi, USDPlus.address, wallet);
        let staticUsdPlus = await ethers.getContractAt(StaticUsdPlus.abi, StaticUsdPlus.address, wallet);
        let usdc = await ethers.getContractAt(ERC20, "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", wallet);
        let vault = await ethers.getContractAt(Vault, "0xba12222222228d8ba445958a75a0704d566bf2c8", wallet);

        console.log('1: Balance USD+: ' + await usdPlus.balanceOf(wallet.address) / 1e6);
        console.log('1: Balance USDC: ' + await usdc.balanceOf(wallet.address) / 1e6);
        console.log('1: Balance StaticUSD+: ' + await staticUsdPlus.balanceOf(wallet.address) / 1e6);


        let amountToUsdPlus = getters.amountValue;
        let amountToUsdPlusScaled = new BN(10).pow(new BN(6)).muln(amountToUsdPlus).toString();
        let convertedAmount = staticUsdPlus.staticToDynamicAmount(amountToUsdPlusScaled);

        commit('setPrepareStep', true);

        await (await usdPlus.approve(staticUsdPlus.address, convertedAmount, {
            maxFeePerGas: "250000000000",
            maxPriorityFeePerGas: "250000000000"
        })).wait();

        commit('setApproveUsdPlusStep', true);

        await (await staticUsdPlus.deposit(convertedAmount, wallet.address, {
            maxFeePerGas: "250000000000",
            maxPriorityFeePerGas: "250000000000"
        })).wait();

        commit('setDepositStaticStep', true);

        console.log('2: Balance USD+: ' + await usdPlus.balanceOf(wallet.address) / 1e6);
        console.log('2: Balance USDC: ' + await usdc.balanceOf(wallet.address) / 1e6);
        console.log('2: Balance StaticUSD+: ' + await staticUsdPlus.balanceOf(wallet.address) / 1e6);

        let amountUsdcToLp = 30000;
        let amountUsdcToLpScaled = new BN(10).pow(new BN(6)).muln(amountUsdcToLp).toString();
        let amountStUsdPlusToLp = 400000;
        let amountStUsdPlusToLpScaled = new BN(10).pow(new BN(6)).muln(amountStUsdPlusToLp).toString();

        let pool = await ethers.getContractAt(Pool, poolAddress, wallet);

        let targets = await pool.getTargets();
        let balances = await vault.getPoolTokens(await pool.getPoolId());

        console.log(`2: Targets: lower: ${targets[0].toString()} upper: ${targets[1].toString()}`);
        console.log(`2: Balances: ${balances[0].toString()} : ${balances[1].toString()}`);
        await (await usdc.approve(vault.address, amountUsdcToLpScaled, {
            maxFeePerGas: "250000000000",
            maxPriorityFeePerGas: "250000000000"
        })).wait();

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
                sender: wallet.address,
                fromInternalBalance: false,
                recipient: wallet.address,
                toInternalBalance: false,
            },
            0,
            1000000000000,
            {maxFeePerGas: "250000000000", maxPriorityFeePerGas: "250000000000"}
        )).wait();

        commit('setSwappingFirstStep', true);

        console.log('3: Balance USD+: ' + await usdPlus.balanceOf(wallet.address) / 1e6);
        console.log('3: Balance USDC: ' + await usdc.balanceOf(wallet.address) / 1e6);
        console.log('3: Balance StaticUSD+: ' + await staticUsdPlus.balanceOf(wallet.address) / 1e6);
        console.log('3: Balance Pool LP: ' + await pool.balanceOf(wallet.address) / 1e18);

        targets = await pool.getTargets();
        balances = await vault.getPoolTokens(await pool.getPoolId());

        console.log(`3: Targets: lower: ${targets[0].toString()} upper: ${targets[1].toString()}`);
        console.log(`3: Balances: ${balances[0].toString()} : ${balances[1].toString()}`);


        await (await staticUsdPlus.approve(vault.address, amountStUsdPlusToLpScaled, {
                maxFeePerGas: "250000000000",
                maxPriorityFeePerGas: "250000000000"
            })
        ).wait();

        commit('setApproveStaticUsdPlusStep', true);

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
                sender: wallet.address,
                fromInternalBalance: false,
                recipient: wallet.address,
                toInternalBalance: false,
            },
            0,
            1000000000000,
            {maxFeePerGas: "250000000000", maxPriorityFeePerGas: "250000000000"}
        )).wait();

        commit('setSwappingSecondStep', true);


        console.log('4: Balance USD+: ' + await usdPlus.balanceOf(wallet.address) / 1e6);
        console.log('4: Balance USDC: ' + await usdc.balanceOf(wallet.address) / 1e6);
        console.log('4: Balance StaticUSD+: ' + await staticUsdPlus.balanceOf(wallet.address) / 1e6);
        console.log('4: Balance Pool LP: ' + await pool.balanceOf(wallet.address) / 1e18);

        targets = await pool.getTargets();
        balances = await vault.getPoolTokens(await pool.getPoolId());

        console.log(`4: Targets: lower: ${targets[0].toString()} upper: ${targets[1].toString()}`);
        console.log(`4: Balances: ${balances[0].toString()} : ${balances[1].toString()}`);

        commit('setEndStep', true);
    }
};

const mutations = {

    setAmountValue(state, value) {
        state.amountValue = value;
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
