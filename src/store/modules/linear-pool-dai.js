import fs from "fs";
import {ethers} from "ethers";
import BN from "bn.js";

import Pool from "../../contracts/abi/ERC4626LinearPool.json";
import USDPlus from "../../contracts/abi/UsdPlusToken.json";
import Vault from "../../contracts/abi/VaultBalancer.json";
import StaticUsdPlus from "../../contracts/abi/StaticUsdPlusToken.json";
import ERC20 from "../../contracts/abi/ERC20.json";

const state = {

    amountValueDai: null,
    amountValueADai: null,


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

    amountValueDai(state) {
        return state.amountValueDai;
    },

    amountValueADai(state) {
        return state.amountValueADai;
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

        let poolAddress = "0x0503Dd6b2D3Dd463c9BeF67fB5156870Af63393E";

        let account = await signer.getAddress();

        let dai = await new ethers.Contract("0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", ERC20, signer);
        let staticADai = await new ethers.Contract("0xa84B5B903f62ea61dfAac3f88123cC6B21Bb81ab", ERC20, signer);
        let aDAI = await new ethers.Contract("0x27F8D03b3a2196956ED754baDc28D73be8830A6e", ERC20, signer);
        let pool = await new ethers.Contract(poolAddress, Pool , signer);

        let vault = await new ethers.Contract("0xba12222222228d8ba445958a75a0704d566bf2c8" ,Vault , signer);

        let daiBalance = await dai.balanceOf(account) / 1e18;
        let staticIDaiBalance= await staticADai.balanceOf(account) / 1e18;
        let aDaiBalance = await aDAI.balanceOf(account) / 1e18;
        let poolBalance = await pool.balanceOf(account) / 1e18;

        let targets = await pool.getTargets();
        let balancesVault = await vault.getPoolTokens(await pool.getPoolId());

        console.log(`Targets: lower: ${targets[0].toString()} upper: ${targets[1].toString()}`);
        console.log(`Balances: ${balancesVault[0].toString()} : ${balancesVault[1].toString()}`);

        let balances = {
            dai: daiBalance,
            aDai: aDaiBalance,
            staticADai: staticIDaiBalance,
            lpToken: poolBalance,
        };

        commit('setBalances', balances);
    },

    async startProcess({commit, dispatch, getters, rootState}) {

        await dispatch('discardSteps');

        let poolAddress = "0x0503Dd6b2D3Dd463c9BeF67fB5156870Af63393E";

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        console.log('Provider: ' + provider.connection.url);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        let account = await signer.getAddress();
        console.log("Account:", account);


        let dai = await new ethers.Contract("0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", ERC20, signer);
        let staticADai = await new ethers.Contract("0xa84B5B903f62ea61dfAac3f88123cC6B21Bb81ab", ERC20, signer);
        let aDAI = await new ethers.Contract("0x27F8D03b3a2196956ED754baDc28D73be8830A6e", ERC20, signer);
        let pool = await new ethers.Contract(poolAddress, Pool , signer);

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


    setAmountValueDai(state, value) {
        state.amountValueDai = value;
    },

    setAmountValueADai(state, value) {
        state.amountValueADai = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
