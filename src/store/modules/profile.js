import moment from "moment";

let accounting = require("accounting-js")
import {axios} from "../../plugins/http-axios";

let accountingConfig = {
    symbol: "",
    precision: 6,
    thousand: " ",
};


const state = {

    currentTotalData: null,
    loadingCurrentTotalData: true,

    totalUsdPlus: {
        totalMint: 0,
        totalBurn: 0,
        totalSupply: 0,
    },

    loadingTotalUsdPlus: true,

    balance: {
        usdPlus: 0,
        usdc: 0,
    },
    loadingBalance: true,

    transactionLogs: [],
    transactionLogsLoader: false,
    payouts: [],
    loadingPayouts: true,

    payoutsApyData: [],
    payoutsTvlData: [],
    totalUsdPlusValue: null,
};

const getters = {

    balance(state) {
        return state.balance;
    },

    loadingBalance(state) {
        return state.loadingBalance;
    },

    currentTotalData(state) {
        return state.currentTotalData;
    },

    loadingCurrentTotalData(state) {
        return state.loadingCurrentTotalData;
    },

    gasPrice(state) {
        return state.gasPrice;
    },

    totalUsdPlus(state) {
        return state.totalUsdPlus;
    },

    loadingTotalUsdPlus(state) {
        return state.loadingTotalUsdPlus;
    },

    transactionLogs(state) {
        return state.transactionLogs;
    },

    payouts(state) {
        return state.payouts;
    },

    payoutsApyData(state) {
        return state.payoutsApyData;
    },

    payoutsTvlData(state) {
        return state.payoutsTvlData;
    },

    totalUsdPlusValue(state) {
        return state.totalUsdPlusValue;
    },

    loadingPayouts(state) {
        return state.loadingPayouts;
    },

    transactionLogsLoader(state) {
        return state.transactionLogsLoader;
    },

};

const actions = {

    async refreshBalance({commit, dispatch, getters, rootState}) {

        commit('setLoadingBalance', true)
        let web3 = rootState.web3;

        let usdPlus;
        let usdc;
        try {
            usdc = await web3.contracts.usdc.methods.balanceOf(web3.account).call();
        } catch (e) {
            console.log('ERROR: ' + e)
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                usdc = await web3.contracts.usdc.methods.balanceOf(web3.account).call();
            } catch (e) {
                console.log('ERROR: ' + e)
                await new Promise(resolve => setTimeout(resolve, 2000));
                usdc = await web3.contracts.usdc.methods.balanceOf(web3.account).call();
            }
        }

        try {
            usdPlus = await web3.contracts.usdPlus.methods.balanceOf(web3.account).call();
        } catch (e) {
            console.log('ERROR: ' + e)
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                usdPlus = await web3.contracts.usdPlus.methods.balanceOf(web3.account).call();
            } catch (e) {
                console.log('ERROR: ' + e)
                await new Promise(resolve => setTimeout(resolve, 2000));
                usdPlus = await web3.contracts.usdPlus.methods.balanceOf(web3.account).call();
            }
        }

        usdPlus = usdPlus / 10 ** 6;
        usdc = usdc / 10 ** 6;
        commit('setBalance', {
            usdPlus: usdPlus,
            usdc: usdc
        })

        commit('setLoadingBalance', false)
    },

    async resetUserData({commit, dispatch, getters}) {
        commit('setBalance', {
            usdPlus: 0,
            usdc: 0
        });

        commit('setTransactionLogs', [])
    },

    async refreshUserData({commit, dispatch, getters}) {
        dispatch('refreshBalance')
        dispatch('refreshTransactionLogs')
    },

    async refreshAfterMintRedeem({commit, dispatch, getters}) {
        dispatch('refreshBalance')
        dispatch('refreshTransactionLogs')
        dispatch('refreshCurrentTotalData')
        dispatch('refreshTotalUsdPlus')
    },

    async refreshNotUserData({commit, dispatch, getters}) {
        dispatch('refreshPayouts')
        dispatch('refreshCurrentTotalData')
        dispatch('refreshTotalUsdPlus')
    },

    async refreshPayouts({commit, dispatch, getters, rootState}) {
        commit('setLoadingPayouts', true);

        axios.get(`/dapp/payouts`)
            .then(value => {
                commit('setPayouts', value.data);

                let clientData = value.data;

                let widgetDataDict = {};
                let widgetData = {
                    labels: [],
                    datasets: [
                        {
                            fill: false,
                            borderColor: '#69a5fd',
                            data: [],
                        }
                    ]
                };

                [...clientData].reverse().forEach(item => {
                    widgetDataDict[moment(item.payableDate).format('DD.MM.YYYY')] = item.annualizedYield;
                });

                for(let key in widgetDataDict) {
                    widgetData.labels.push(key);
                    widgetData.datasets[0].data.push(widgetDataDict[key]);
                }

                commit('setPayoutsApyData', widgetData);

                let widgetDataDictTvl = {};
                let widgetDataTvl = {
                    labels: [],
                    datasets: [
                        {
                            fill: false,
                            borderColor: '#69a5fd',
                            data: [],
                        }
                    ]
                };

                [...clientData].reverse().forEach(item => {
                    widgetDataDictTvl[moment(item.payableDate).format('DD.MM.YYYY')] = item.totalUsdPlus;
                });

                for(let key in widgetDataDictTvl) {
                    widgetDataTvl.labels.push(key);
                    widgetDataTvl.datasets[0].data.push(widgetDataDictTvl[key]);
                }

                commit('setPayoutsTvlData', widgetDataTvl);
                commit('setLoadingPayouts', false);
            })
    },


    async refreshTransactionLogs({commit, dispatch, getters, rootState}) {

        commit('setTransactionLogsLoader', true)
        let exchange = rootState.web3.contracts.exchange.options.address.toLowerCase();
        let usdPlus = rootState.web3.contracts.usdPlus.options.address.toLowerCase();
        let usdc = rootState.web3.contracts.usdc.options.address.toLowerCase();
        let account = rootState.web3.account.toLowerCase();
        let token = 'YZPR4G2H7JSIIPXI5NTWN5G1HDX43GSUCR';
        let rewarder = '0x5cb01385d3097b6a189d1ac8ba3364d900666445'.toLowerCase();

        let response = await axios.get(`https://api.polygonscan.com/api?module=account&action=tokentx&address=${account}&startblock=0&endblock=19999999999&sort=desc&apikey=${token}`);
        let result = response.data.result;

        let logs = [];
        let id = 1;
        for (let i = 0; i < result.length; i++) {
            let item = result[i];

            let log = {
                date: new Date(item.timeStamp * 1000),
                id: id,
            }

            if (item.from === exchange && item.contractAddress === usdc) {
                let sum = item.value / 10 ** 6;
                log.name = `USD+ Redeemed for ${sum} ${item.tokenSymbol}`;
                log.sum = sum;
                logs.push(log);
                id++;
            } else if (item.from === account && item.to === exchange && item.contractAddress === usdc) {
                let sum = item.value / 10 ** 6;
                log.name = `${item.tokenSymbol} Minting for ${sum} USD+`;
                log.sum = sum;
                logs.push(log);
                id++;
            } else if (item.from === '0x0000000000000000000000000000000000000000' && item.to === account && item.contractAddress === usdPlus) {

                try {
                    let transaction = await rootState.web3.web3.eth.getTransactionReceipt(item.hash);
                    if (transaction.from === rewarder) {
                        let sum = item.value / 10 ** 6;
                        log.name = `Rewarding ${sum} USD+`;
                        log.sum = sum;
                        logs.push(log);
                        id++;
                    }

                } catch (e) {
                    console.log(e)
                }
            }
        }

        commit('setTransactionLogs', logs)
        commit('setTransactionLogsLoader', false)
    },


    async refreshTotalUsdPlus({commit, dispatch, getters, rootState}) {
        commit('setLoadingTotalUsdPlus', true);

        let value = await rootState.web3.contracts.usdPlus.methods.totalSupply().call();
        let data = {
            totalSupply: value
        }
        commit('setTotalUsdPlus', data);

        let usdPlusValue = (await axios('/dapp/getTotalUsdPlusValue')).data;
        commit('setTotalUsdPlusValue', usdPlusValue);
    },


    async refreshCurrentTotalData({commit, dispatch, getters, rootState}) {
        commit('setLoadingCurrentTotalData', true)

        let assets = await rootState.web3.contracts.mark2market.methods.strategyAssets().call();
        let strategiesMapping = (await axios('/dapp/strategies')).data;

        let data = [];

        for (let i = 0; i < assets.length; i++) {
            let asset = assets[i];

            let element = {};

            let strategy = strategiesMapping.find(value => value.address === asset[0]);
            let name = "not defined";

            if (strategy) {
                name = strategy.name;
            }


            if (asset[1] == 0) {
                continue;
            }

            element.label = name;
            element.value = asset[1] / 10 ** 6;
            element.liquidationValue = asset[2] / 10 ** 6;
            element.link = asset[0] ? 'https://polygonscan.com/address/' + asset[0] : '';

            data.push(element);
        }

        let colors = [
            "#FCCA46",
            "#FE7F2D",
            "#3D8DFF",
            "#22ABAC",
            "#B22174",
            "#2775CA",
            "#26A17B",
            "#23DD00",
        ];

        data = data.sort((a,b) => (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0));
        data = data.filter(item => item.value != 0);

        for (let i = 0; i < data.length; i++) {
            data[i].color = colors[i];
        }

        commit('setCurrentTotalData', data)
        commit('setLoadingCurrentTotalData', false)
    }
};

const mutations = {

    setCurrentTotalData(state, currentTotalData) {
        state.currentTotalData = currentTotalData;
    },

    setLoadingCurrentTotalData(state, value) {
        state.loadingCurrentTotalData = value;
    },


    setBalance(state, balance) {
        state.balance = balance;
    },

    setLoadingBalance(state, value) {
        state.loadingBalance = value;
    },

    setGasPrice(state, price) {
        state.gasPrice = price;
    },

    setTotalUsdPlus(state, value) {
        state.totalUsdPlus = value;
    },

    setTransactionLogs(state, transactionLogs) {
        state.transactionLogs = transactionLogs;
    },

    setPayouts(state, payouts) {
        state.payouts = payouts;
    },

    setPayoutsApyData(state, payoutsApyData) {
        state.payoutsApyData = payoutsApyData;
    },

    setPayoutsTvlData(state, payoutsTvlData) {
        state.payoutsTvlData = payoutsTvlData;
    },

    setTotalUsdPlusValue(state, totalUsdPlusValue) {
        state.totalUsdPlusValue = totalUsdPlusValue;
    },

    setTransactionLogsLoader(state, transactionLogsLoader) {
        state.transactionLogsLoader = transactionLogsLoader;
    },

    setLoadingTotalUsdPlus(state, value) {
        state.loadingTotalUsdPlus = value;
    },

    setLoadingPayouts(state, value) {
        state.loadingPayouts = value;
    },

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
