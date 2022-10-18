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

        let ExchangerUsdPlusWmatic = require(`@/contracts/polygon/HedgeExchangerUsdPlusWmatic.json`);
        let UsdPlusWmaticToken = require(`@/contracts/polygon/RebaseTokenUsdPlusWmatic.json`);

        let ExchangerWmaticUsdc = require(`@/contracts/polygon/HedgeExchangerWmaticUsdc.json`);
        let WmaticUsdcToken = require(`@/contracts/polygon/EtsWmaticUsdc.json`);

        let EtsExchangerMoonstone = require(`@/contracts/polygon/HedgeExchangerQsWmaticUsdc.json`);
        let EtsMoonstoneToken = require(`@/contracts/polygon/EtsQsWmaticUsdc.json`);

        let ExchangerUsdPlusWbnb = require(`@/contracts/bsc/HedgeExchangerUsdPlusWbnb.json`);
        let UsdPlusWbnbToken = require(`@/contracts/bsc/RebaseTokenUsdPlusWbnb.json`);

        let ExchangerBusdWbnb = require(`@/contracts/bsc/HedgeExchangerBusdWbnb.json`)
        let BusdWbnbToken = require(`@/contracts/bsc/RebaseTokenBusdWbnb.json`);

        let EtsExchangerRuby = require(`@/contracts/optimism/HedgeExchangerWethUsdc.json`);
        let EtsRubyToken = require(`@/contracts/optimism/RebaseTokenWethUsdc.json`);

        let EtsExchangerGarnet = require(`@/contracts/optimism/HedgeExchangerOpUsdc.json`);
        let EtsGarnetToken = require(`@/contracts/optimism/EtsOpUsdc.json`);

        let EtsExchangerWethUsdcUniV3 = require(`@/contracts/polygon/HedgeExchangerUniV3WethUsdc.json`);
        let EtsWethUsdcUniV3Token = require(`@/contracts/polygon/RebaseTokenUniV3WethUsdc.json`);


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
        contracts.m2m = _load(M2M, web3);

        if (network !== "avalanche" && network !== "bsc") {
            contracts.market = _load(Market, web3);
            contracts.wUsdPlus = _load(WrappedUsdPlusToken, web3);
        }

        contracts.exchangerUsdPlusWmatic = _load(ExchangerUsdPlusWmatic, web3);
        contracts.usdPlusWmatic = _load(UsdPlusWmaticToken, web3);

        contracts.exchangerWmaticUsdc = _load(ExchangerWmaticUsdc, web3);
        contracts.wmaticUsdc = _load(WmaticUsdcToken, web3);

        contracts.etsExchangerMoonstone = _load(EtsExchangerMoonstone, web3);
        contracts.etsMoonstoneToken = _load(EtsMoonstoneToken, web3);

        contracts.exchangerUsdPlusWbnb = _load(ExchangerUsdPlusWbnb, web3);
        contracts.usdPlusWbnb = _load(UsdPlusWbnbToken, web3);

        contracts.exchangerBusdWbnb = _load(ExchangerBusdWbnb, web3);
        contracts.busdWbnb = _load(BusdWbnbToken, web3);

        contracts.etsExchangerRuby = _load(EtsExchangerRuby, web3);
        contracts.etsRubyToken = _load(EtsRubyToken, web3);

        contracts.etsExchangerGarnet = _load(EtsExchangerGarnet, web3);
        contracts.etsGarnetToken = _load(EtsGarnetToken, web3);

        contracts.etsExchangerWethUsdcUniV3 = _load(EtsExchangerWethUsdcUniV3, web3);
        contracts.etsWethUsdcUniV3Token = _load(EtsWethUsdcUniV3Token, web3);

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
