import ERC20 from "@/contracts/ERC20.json";
import contract from "@truffle/contract";

const state = {};

const getters = {};

const actions = {
    async initContracts({commit, dispatch, getters, rootState}) {

        let network = rootState.network.networkName;

        const Exchange = require(`@/contracts/${network}/Exchange.json`)
        const OvnToken = require(`@/contracts/${network}/OvnToken.json`)
        const OvnGovernor = require(`@/contracts/${network}/OvnGovernor.json`)
        const PortfolioManager = require(`@/contracts/${network}/PortfolioManager.json`)
        const TimelockController = require(`@/contracts/${network}/OvnTimelockController.json`)
        const UsdPlusToken = require(`@/contracts/${network}/UsdPlusToken.json`)
        const M2M = require(`@/contracts/${network}/Mark2Market.json`)

        let Market;
        let WrappedUsdPlusToken;

        if (network !== "avalanche" && network !== "bsc") {
            Market = require(`@/contracts/${network}/Market.json`)
            WrappedUsdPlusToken = require(`@/contracts/${network}/WrappedUsdPlusToken.json`)
        }

        let web3 = rootState.web3.web3;

        let contracts = {};

        switch (network) {
            case "avalanche":
                contracts.asset = _load(ERC20, web3, '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E');
                break;
            case "polygon":
            case "polygon_dev":
                contracts.asset = _load(ERC20, web3, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174');
                break;
            case "optimism":
                contracts.asset = _load(ERC20, web3, '0x7F5c764cBc14f9669B88837ca1490cCa17c31607');
                break;
            case "bsc":
                contracts.asset = _load(ERC20, web3, '0xe9e7cea3dedca5984780bafc599bd69add087d56');
                break;
        }

        let etsNames = [
            { network: 'polygon', name: 'qs_alpha_wmatic_usdc' },
            { network: 'polygon', name: 'qs_beta_wmatic_usdc' },
            { network: 'polygon', name: 'qs_gamma_weth_usdc' },
            { network: 'polygon', name: 'qs_delta_weth_usdc' },
            { network: 'polygon', name: 'wmatic_usd_plus' },
            { network: 'bsc', name: 'wbnb_busd' },
            { network: 'optimism', name: 'ruby' },
            { network: 'optimism', name: 'night_ov_ar' },
        ];

        for (let i = 0; i < etsNames.length; i++) {
            if (network === etsNames[i].network) {
                let ExchangerContract = require(`@/contracts/${etsNames[i].network}/ets/${etsNames[i].name}/exchanger.json`);
                let TokenContract = require(`@/contracts/${etsNames[i].network}/ets/${etsNames[i].name}/token.json`);

                contracts['ets_' + etsNames[i].name + '_exchanger'] = _load(ExchangerContract, web3);
                contracts['ets_' + etsNames[i].name + '_token'] = _load(TokenContract, web3);
            }
        }

        contracts.exchange = _load(Exchange, web3);
        contracts.govToken = _load(OvnToken, web3);
        contracts.governor = _load(OvnGovernor, web3);
        contracts.pm = _load(PortfolioManager, web3);
        contracts.timelockController = _load(TimelockController, web3);
        contracts.usdPlus = _load(UsdPlusToken, web3);
        contracts.m2m = _load(M2M, web3);

        if (network !== "avalanche" && network !== "bsc") {
            contracts.market = _load(Market, web3);
            contracts.wUsdPlus = _load(WrappedUsdPlusToken, web3);
        }

        commit('web3/setContracts', contracts, {root: true})
    },
};

const mutations = {};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};


function _load(file, web3, address) {

    let contractConfig = contract(file);
    const {abi} = contractConfig

    if (!address) {
        address = file.address;
    }

    return new web3.eth.Contract(abi, address);
}
