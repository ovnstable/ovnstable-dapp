import fs from "fs";
import {ethers} from "ethers";
import BN from "bn.js";

import Pool from "../../../contracts/abi/ERC4626LinearPool.json";
import USDPlus from "../../../contracts/abi/UsdPlusToken.json";
import Vault from "../../../contracts/abi/VaultBalancer.json";
import StaticUsdPlus from "../../../contracts/abi/StaticUsdPlusToken.json";
import StaticATokenLM from "../../../contracts/abi/StaticATokenLM.json";
import ERC20 from "../../../contracts/abi/ERC20.json"

const state = {

    amountValueUsdc: null,
    amountValueUsdPlus: null,


    steps: {
        prepareStep: false,
        approveLp: false,
        swapLpToUsdc: false,
        swapLpToStaticUsdPlus: false,
        convertStatioUsdPlusToUsdPlus: false,
        endStep: false,
    },

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

    steps(state) {
        return state.steps;
    },

};

const actions = {

    async discardSteps({commit, dispatch, getters, rootState}) {

        let steps = {
            prepareStep: false,
                approveLp: false,
                swapLpToUsdc: false,
                swapLpToStaticUsdPlus: false,
                convertStatioUsdPlusToUsdPlus: false,
                endStep: false,
        }

        commit('setSteps', steps);
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

        console.log('Input: usdPlus ' + getters.amountValueUsdPlus);
        console.log('Input: USDC ' + getters.amountValueUsdc);

        let amountUsdc = new BN(10).pow(new BN(6)).muln(Number.parseInt(getters.amountValueUsdc)).toString();
        let amountUsdPlus = new BN(10).pow(new BN(6)).muln(Number.parseInt(getters.amountValueUsdPlus)).toString();

        await (await pool.approve(vault.address, await pool.balanceOf(account))).wait();


        let steps = getters.steps;
        steps.approveLp = true;
        commit('setSteps', steps);

        await (await vault.swap(
            {
                poolId: await pool.getPoolId(),
                kind: 1,
                assetIn: poolAddress,
                assetOut: usdc.address,
                amount: amountUsdc ,
                userData: "0x",
            },
            {
                sender: account,
                fromInternalBalance: false,
                recipient: account,
                toInternalBalance: false,
            },
            new BN(10).pow(new BN(27)).toString(),
            new BN(10).pow(new BN(27)).toString()
        )).wait();


        steps.swapLpToUsdc = true;
        commit('setSteps', steps);
        await dispatch('updateBalances', signer);


        await(await vault.swap(
            {
                poolId: await pool.getPoolId(),
                kind: 1,
                assetIn: poolAddress,
                assetOut: staticUsdPlus.address,
                amount: amountUsdPlus,
                userData: "0x",
            },
            {
                sender: account,
                fromInternalBalance: false,
                recipient: account,
                toInternalBalance: false,
            },
            new BN(10).pow(new BN(27)).toString(),
            new BN(10).pow(new BN(27)).toString()
        )).wait();

        steps.swapLpToStaticUsdPlus = true;
        commit('setSteps', steps);

        await dispatch('updateBalances', signer);

        (await staticUsdPlus.redeem(await staticUsdPlus.balanceOf(account), account, account)).wait();


        steps.convertStatioUsdPlusToUsdPlus = true;
        commit('setSteps', steps);

        await dispatch('updateBalances', signer);

        steps.endStep = true;
        commit('setSteps', steps);
    }
};

const mutations = {

    setBalances(state, value) {
        state.balances = value;
    },


    setSteps(state, value) {
        state.steps = value;
    },


    setAmountValueUsdPlus(state, value) {
        state.amountValueUsdPlus = value;
    },

    setAmountValueUsdc(state, value) {
        state.amountValueUsdc = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
