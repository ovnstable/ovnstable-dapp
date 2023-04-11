import loadJSON from '@/utils/http-utils.js'

const state = {};

const getters = {};

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
            zksync: '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4',
            bsc: '0x55d398326f99059ff775485246999027b3197955',
        };

        let networkAssetTwoMap = {
            bsc: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        };

        let networkDaiMap = {
            polygon: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
            arbitrum: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
            optimism: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
        };

        let networkUsdtMap = {
            bsc: '0x55d398326f99059fF775485246999027B3197955',
        };

        [
            contracts.exchange,
            contracts.daiExchange,
            contracts.usdtExchange,
            contracts.govToken,
            contracts.governor,
            contracts.pm,
            contracts.daiPm,
            contracts.usdtPm,
            contracts.timelockController,
            contracts.usdPlus,
            contracts.daiPlus,
            contracts.usdtPlus,
            contracts.m2m,
            contracts.daiM2m,
            contracts.usdtM2m,
            contracts.market,
            contracts.wUsdPlus,
            contracts.asset,
            contracts.asset_two,
            contracts.dai,
            contracts.usdt,
        ] = await Promise.all([
            _load(await loadJSON(`/contracts/${network}/Exchange.json`), web3),
            (network === "optimism") || network === "arbitrum" ? _load(await loadJSON(`/contracts/${network}/DaiExchange.json`), web3) : _load_empty(),
            (network === "bsc") ? _load(await loadJSON(`/contracts/${network}/UsdtExchange.json`), web3) : _load_empty(),
            (network !== 'zksync') ? _load(await loadJSON(`/contracts/${network}/OvnToken.json`), web3) : _load_empty(),
            (network !== 'zksync') ?_load(await loadJSON(`/contracts/${network}/OvnGovernor.json`), web3) : _load_empty(),
            _load(await loadJSON(`/contracts/${network}/PortfolioManager.json`), web3),
            (network === "optimism") || network === "arbitrum" ? _load(await loadJSON(`/contracts/${network}/DaiPortfolioManager.json`), web3) : _load_empty(),
            network === "bsc" ? _load(await loadJSON(`/contracts/${network}/UsdtPortfolioManager.json`), web3) : _load_empty(),
            (network !== 'zksync') ?_load(await loadJSON(`/contracts/${network}/OvnTimelockController.json`), web3) : _load_empty(),
            _load(await loadJSON(`/contracts/${network}/UsdPlusToken.json`), web3),
            (network === "optimism") || network === "arbitrum" ? _load(await loadJSON(`/contracts/${network}/DaiPlusToken.json`), web3) : _load_empty(),
            (network === "bsc") ? _load(await loadJSON(`/contracts/${network}/UsdtPlusToken.json`), web3) : _load_empty(),
            _load(await loadJSON(`/contracts/${network}/Mark2Market.json`), web3),
            (network === "optimism") || network === "arbitrum" ? _load(await loadJSON(`/contracts/${network}/DaiMark2Market.json`), web3) : _load_empty(),
            network === "bsc" ? _load(await loadJSON(`/contracts/${network}/UsdtMark2Market.json`), web3) : _load_empty(),
            (network !== "bsc" && network !== 'zksync') ? _load(await loadJSON(`/contracts/${network}/Market.json`), web3) : _load_empty(),
            (network !== "bsc" && network !== 'zksync') ? _load(await loadJSON(`/contracts/${network}/WrappedUsdPlusToken.json`), web3) : _load_empty(),
            networkAssetMap[network] ? _load(ERC20, web3, networkAssetMap[network]) : _load_empty(),
            networkAssetTwoMap[network] ? _load(ERC20, web3, networkAssetTwoMap[network]) : _load_empty(),
            networkDaiMap[network] ? _load(ERC20, web3, networkDaiMap[network]) : _load_empty(),
            networkUsdtMap[network] ? _load(ERC20, web3, networkUsdtMap[network]) : _load_empty(),
        ]);

        let etsesByNetwork = await loadJSON(`https://api.overnight.fi/${network}/usd+/design_ets/list`);

        await Promise.all(
            etsesByNetwork.map(async ets => {
                await _load_ets(network, ets, contracts, web3);
            })
        );

        let insurances = [
            { network: 'polygon' },
        ];

        for (let i = 0; i < insurances.length; i++) {
            if (network === insurances[i].network) {
                let ExchangerContract = await loadJSON(`/contracts/${insurances[i].network}/insurance/exchanger.json`);
                let TokenContract = await loadJSON(`/contracts/${insurances[i].network}/insurance/token.json`);
                let M2MContract = await loadJSON(`/contracts/${insurances[i].network}/insurance/m2m.json`);

                contracts.insurance = {};

                contracts.insurance[insurances[i].network + '_exchanger'] = _load(ExchangerContract, web3);
                contracts.insurance[insurances[i].network + '_token'] = _load(TokenContract, web3);
                contracts.insurance[insurances[i].network + '_m2m'] = _load(M2MContract, web3);
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

async function _load_ets(network, etsParams, contracts, web3) {

    let exchangerContract;
    let tokenContract;

    try {
        exchangerContract = _load(await loadJSON('/contracts/abi/ets/exchanger.json'), web3, etsParams.address);
        tokenContract = _load(await loadJSON('/contracts/abi/ets/token.json'), web3, etsParams.tokenAddress);
    } catch (e) {
        exchangerContract = _load(await loadJSON(`/contracts/${network}/ets/${etsParams.name}/exchanger.json`), web3);
        tokenContract = _load(await loadJSON(`/contracts/${network}/ets/${etsParams.name}/token.json`), web3);
    }

    contracts['ets_' + etsParams.name + '_exchanger'] = exchangerContract;
    contracts['ets_' + etsParams.name + '_token'] = tokenContract;
}

function _load_empty() {
    return null;
}

