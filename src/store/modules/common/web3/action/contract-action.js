import loadJSON from '@/utils/http-utils.js'

const state = {};

const getters = {};

const ROOT_API = 'https://api.overnight.fi/root'

const actions = {
    async initContracts({commit, dispatch, getters, rootState}) {
        const ERC20 = await loadJSON('/contracts/ERC20.json');

        console.log("contractAction/initContracts");

        let web3 = rootState.web3.web3;
        let network = rootState.network.networkName;
        let contracts = {};

        let networkAssetMap = {
            polygon: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
            polygon_dev: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
            optimism: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
            arbitrum: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
            base: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
            zksync: '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4',
            bsc: '0x55d398326f99059ff775485246999027b3197955',
            linea: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
        };

        let networkAssetTwoMap = {
            bsc: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // usdc
            arbitrum: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', // weth
        };

        let networkDaiMap = {
            polygon: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
            arbitrum: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
            optimism: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
            base: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
        };

        let networkUsdtMap = {
            bsc: '0x55d398326f99059fF775485246999027B3197955',
            linea: '0xA219439258ca9da29E9Cc4cE5596924745e12B93',
            arbitrum: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        };

        let networkEthMap = {
            arbitrum: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', // weth
        };

        let networkOvnTokenMap = {
            optimism: '0x3b08fcd15280e7B5A6e404c4abb87F7C774D1B2e',
            arbitrum: '0xA3d1a8DEB97B111454B294E2324EfAD13a9d8396',
            base: '0xA3d1a8DEB97B111454B294E2324EfAD13a9d8396',
        };

        [
            // exchange
            contracts.exchange,
            contracts.daiExchange,
            contracts.usdtExchange,
            contracts.wethExchange,

            // ovn
            contracts.govToken,
            contracts.governor,

            // pm
            contracts.pm,
            contracts.daiPm,
            contracts.usdtPm,
            contracts.wethPm,
            contracts.timelockController,

            // plus
            contracts.usdPlus,
            contracts.daiPlus,
            contracts.usdtPlus,
            contracts.ethPlus,

            // m2m
            contracts.m2m,
            contracts.daiM2m,
            contracts.usdtM2m,
            contracts.wethM2m,

            // market
            contracts.market,

            // wUsdPlus
            contracts.wUsdPlus,

            // assets
            contracts.asset,
            contracts.asset_two,
            contracts.dai,
            contracts.usdt,
            contracts.weth,
            contracts.ovn,
        ] = await Promise.all([

            // exchange
            _load(await loadJSON(`/contracts/${network}/Exchange.json`), web3),
            network === "optimism" || network === "arbitrum" || network === "base" ? _load(await loadJSON(`/contracts/${network}/DaiExchange.json`), web3) : _load_empty(),
            network === "bsc" || network === 'linea' || network === 'arbitrum' ? _load(await loadJSON(`/contracts/${network}/UsdtExchange.json`), web3) : _load_empty(),
            network === 'arbitrum' ? _load(await loadJSON(`/contracts/${network}/EthExchange.json`), web3) : _load_empty(),

            // ovn
            network !== 'linea' ? _load(await loadJSON(`/contracts/${network}/OvnToken.json`), web3) : _load_empty(),
            network !== 'linea' ?_load(await loadJSON(`/contracts/${network}/OvnGovernor.json`), web3) : _load_empty(),

            // pm
            _load(await loadJSON(`/contracts/${network}/PortfolioManager.json`), web3),
            network === "optimism" || network === "arbitrum"  || network === "base" ? _load(await loadJSON(`/contracts/${network}/DaiPortfolioManager.json`), web3) : _load_empty(),
            network === "bsc" || network === 'linea' || network === 'arbitrum' ? _load(await loadJSON(`/contracts/${network}/UsdtPortfolioManager.json`), web3) : _load_empty(),
            network === "arbitrum" ? _load(await loadJSON(`/contracts/${network}/EthPortfolioManager.json`), web3) : _load_empty(),
            network !== 'linea' ?_load(await loadJSON(`/contracts/${network}/OvnTimelockController.json`), web3) : _load_empty(),

            // plus
            _load(await loadJSON(`/contracts/${network}/UsdPlusToken.json`), web3),
            network === "optimism" || network === "arbitrum" || network === "base" ? _load(await loadJSON(`/contracts/${network}/DaiPlusToken.json`), web3) : _load_empty(),
            network === "bsc" || network === 'linea' || network === 'arbitrum' ? _load(await loadJSON(`/contracts/${network}/UsdtPlusToken.json`), web3) : _load_empty(),
            network === "arbitrum" ? _load(await loadJSON(`/contracts/${network}/EthPlusToken.json`), web3) : _load_empty(),

            // m2m
            _load(await loadJSON(`/contracts/${network}/Mark2Market.json`), web3),
            network === "optimism" || network === "arbitrum" || network === "base" ? _load(await loadJSON(`/contracts/${network}/DaiMark2Market.json`), web3) : _load_empty(),
            network === "bsc" || network === 'linea' || network === 'arbitrum' ? _load(await loadJSON(`/contracts/${network}/UsdtMark2Market.json`), web3) : _load_empty(),
            network === "arbitrum" ? _load(await loadJSON(`/contracts/${network}/EthMark2Market.json`), web3) : _load_empty(),

            // market
            network !== "bsc" && network !== 'zksync' && network !== 'linea' ? _load(await loadJSON(`/contracts/${network}/Market.json`), web3) : _load_empty(),

            // wUsdPlus
            network !== "bsc" && network !== 'zksync' && network !== 'linea' ? _load(await loadJSON(`/contracts/${network}/WrappedUsdPlusToken.json`), web3) : _load_empty(),

            // assets
            networkAssetMap[network] ? _load(ERC20, web3, networkAssetMap[network]) : _load_empty(),
            networkAssetTwoMap[network] ? _load(ERC20, web3, networkAssetTwoMap[network]) : _load_empty(),
            networkDaiMap[network] ? _load(ERC20, web3, networkDaiMap[network]) : _load_empty(),
            networkUsdtMap[network] ? _load(ERC20, web3, networkUsdtMap[network]) : _load_empty(),
            networkEthMap[network] ? _load(ERC20, web3, networkEthMap[network]) : _load_empty(),
            networkOvnTokenMap[network] ? _load(ERC20, web3, networkOvnTokenMap[network]) : _load_empty(),
        ]);

        let insurances = [
            // { network: 'polygon' },
            { network: 'optimism' },
        ];

        for (let i = 0; i < insurances.length; i++) {
            if (network === insurances[i].network) {
                let ExchangerContract = await loadJSON(`/contracts/${insurances[i].network}/insurance/exchanger.json`);
                let TokenContract = await loadJSON(`/contracts/${insurances[i].network}/insurance/token.json`);
                // let M2MContract = await loadJSON(`/contracts/${insurances[i].network}/insurance/m2m.json`);

                contracts.insurance = {};

                contracts.insurance[insurances[i].network + '_exchanger'] = _load(ExchangerContract, web3);
                contracts.insurance[insurances[i].network + '_token'] = _load(TokenContract, web3);
                // contracts.insurance[insurances[i].network + '_m2m'] = _load(M2MContract, web3);
            }
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
    if (!address) {
        address = file.address;
    }

    return new web3.eth.Contract(file.abi, address);
}

function _load_empty() {
    return null;
}

