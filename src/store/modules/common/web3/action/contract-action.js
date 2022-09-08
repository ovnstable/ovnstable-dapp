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

        let Market;
        let WrappedUsdPlusToken;

        if (network !== "avalanche" && network !== "bsc") {
            Market = require(`@/contracts/${network}/Market.json`)
            WrappedUsdPlusToken = require(`@/contracts/${network}/WrappedUsdPlusToken.json`)
        }

        let ExchangerUsdPlusWmatic = require(`@/contracts/polygon/HedgeExchangerUsdPlusWmatic.json`);
        let UsdPlusWmaticToken = require(`@/contracts/polygon/RebaseTokenUsdPlusWmatic.json`);

        let ExchangerUsdPlusWbnb = require(`@/contracts/bsc/HedgeExchangerUsdPlusWbnb.json`);
        let UsdPlusWbnbToken = require(`@/contracts/bsc/RebaseTokenUsdPlusWbnb.json`);

        let ExchangerBusdWbnb = require(`@/contracts/bsc/HedgeExchangerBusdWbnb.json`)
        let BusdWbnbToken = require(`@/contracts/bsc/RebaseTokenBusdWbnb.json`)


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

        contracts.exchange = _load(Exchange, web3);
        contracts.govToken = _load(OvnToken, web3);
        contracts.governor = _load(OvnGovernor, web3);
        contracts.pm = _load(PortfolioManager, web3);
        contracts.timelockController = _load(TimelockController, web3);
        contracts.usdPlus = _load(UsdPlusToken, web3);

        if (network !== "avalanche" && network !== "bsc") {
            contracts.market = _load(Market, web3);
            contracts.wUsdPlus = _load(WrappedUsdPlusToken, web3);
        }

        contracts.exchangerUsdPlusWmatic = _load(ExchangerUsdPlusWmatic, web3);
        contracts.usdPlusWmatic = _load(UsdPlusWmaticToken, web3);

        contracts.exchangerUsdPlusWbnb = _load(ExchangerUsdPlusWbnb, web3);
        contracts.usdPlusWbnb = _load(UsdPlusWbnbToken, web3);

        contracts.exchangerBusdWbnb = _load(ExchangerBusdWbnb, web3);
        contracts.busdWbnb = _load(BusdWbnbToken, web3);

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
