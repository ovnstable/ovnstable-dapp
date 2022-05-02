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

    amountValueUsdt: null,
    amountValueAUsdt: null,


    steps: {
        prepareStep: false,
        approveUsdt: false,
        swapUsdtToStatic: false,
        swapStaticToLp: false,
        approveUsdtLp: false,
        swapUsdtToLp: false,
        endStep: false,
    },

    balances: {
        usdt: null,
        amUsdt: null,
        staticAmUsdt: null,
        lpToken: null,
    }
};

const getters = {

    amountValueUsdt(state) {
        return state.amountValueUsdt;
    },

    amountValueAUsdt(state) {
        return state.amountValueAUsdt;
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
            swapUsdtToStatic: false,
            swapStaticToLp: false,
            approveUsdtLp: false,
            swapUsdtToLp: false,
            endStep: false,
        }

        commit('setSteps', steps);
    },


    async updateBalances({commit, dispatch, getters, rootState}, signer){

        let poolAddress = "0x8A819a4caBD6EfCb4E5504fE8679A1aBD831Dd8f";

        let account = await signer.getAddress();

        let usdt = await new ethers.Contract("0xc2132d05d31c914a87c6611c10748aeb04b58e8f", ERC20, signer);
        let staticAmUsdt = await new ethers.Contract("0x548571A302D354B190AE6E9107552aB4F7FD9DC5", StaticATokenLM, signer);
        let amUsdt= await new ethers.Contract("0x60D55F02A771d515e077c9C2403a1ef324885CeC", ERC20, signer);
        let pool = await new ethers.Contract(poolAddress, Pool , signer);

        let vault = await new ethers.Contract("0xba12222222228d8ba445958a75a0704d566bf2c8" ,Vault , signer);


        let targets = await pool.getTargets();
        let balancesVault = await vault.getPoolTokens(await pool.getPoolId());

        console.log(`Targets: lower: ${targets[0].toString()} upper: ${targets[1].toString()}`);
        console.log(`Balances: ${balancesVault[0].toString()} : ${balancesVault[1].toString()}`);

        let balances = {
            usdt: await usdt.balanceOf(account) / 1e6,
            amUsdt: await amUsdt.balanceOf(account) / 1e6,
            staticAmUsdt: await staticAmUsdt.balanceOf(account) / 1e6,
            lpToken: await pool.balanceOf(account) / 1e18,
        };

        commit('setBalances', balances);
    },

    async startProcess({commit, dispatch, getters, rootState}) {

        await dispatch('discardSteps');

        let poolAddress = "0x8A819a4caBD6EfCb4E5504fE8679A1aBD831Dd8f";

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        console.log('Provider: ' + provider.connection.url);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        let account = await signer.getAddress();
        console.log("Account:", account);


        let usdt = await new ethers.Contract("0xc2132d05d31c914a87c6611c10748aeb04b58e8f", ERC20, signer);
        let staticAmUsdt = await new ethers.Contract("0x548571A302D354B190AE6E9107552aB4F7FD9DC5", StaticATokenLM, signer);
        let amUsdt= await new ethers.Contract("0x60D55F02A771d515e077c9C2403a1ef324885CeC", ERC20, signer);
        let pool = await new ethers.Contract(poolAddress, Pool , signer);

        let vault = await new ethers.Contract("0xba12222222228d8ba445958a75a0704d566bf2c8" ,Vault , signer);

        await dispatch('updateBalances', signer);

        console.log('Input: USDT ' + getters.amountValueUsdt);
        console.log('Input: amUsdt ' + getters.amountValueAUsdt);

        let amountUsdt = new BN(10).pow(new BN(6)).muln(Number.parseInt(getters.amountValueUsdt)).toString();
        let amountAmUsdt = new BN(10).pow(new BN(6)).muln(Number.parseInt(getters.amountValueAUsdt)).toString();


        let steps = getters.steps;
        steps.prepareStep = true;
        commit('setSteps', steps);

        await (await usdt.approve(staticAmUsdt.address, amountAmUsdt)).wait();

        steps.approveUsdt = true;
        commit('setSteps', steps);

        await (await staticAmUsdt.deposit(account, amountAmUsdt, 0, true)).wait();

        await dispatch('updateBalances', signer);

        steps.swapUsdtToStatic = true;
        commit('setSteps', steps);

        await swap(staticAmUsdt, pool, await staticAmUsdt.balanceOf(account), await pool.getPoolId());

        steps.swapStaticToLp = true;
        commit('setSteps', steps);

        await dispatch('updateBalances', signer);

        await (await usdt.approve(pool.address, amountUsdt)).wait();

        steps.approveUsdtLp = true;
        commit('setSteps', steps);

        await swap(usdt, pool, amountUsdt, await pool.getPoolId());

        steps.swapUsdtToLp = true;
        commit('setSteps', steps);

        await dispatch('updateBalances', signer);

        steps.endStep = true;
        commit('setSteps', steps);

        async function swap(tokenIn, tokenOut, amount, poolId) {

            await (await tokenIn.approve(vault.address, amount)).wait();

            await (await vault.swap(
                {
                    poolId: poolId,
                    kind: 0,
                    assetIn: tokenIn.address,
                    assetOut: tokenOut.address,
                    amount: amount,
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


    setAmountValueUsdt(state, value) {
        state.amountValueUsdt = value;
    },

    setAmountValueAUsdt(state, value) {
        state.amountValueAUsdt = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
