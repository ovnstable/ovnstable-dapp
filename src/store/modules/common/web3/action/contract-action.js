import loadJSON from '@/utils/http-utils.js'

const state = {};

const getters = {};

const actions = {
    async initContracts({commit, dispatch, getters, rootState}) {
        const ERC20 = await loadJSON('/contracts/ERC20.json');

        console.debug("contractAction/initContracts");

        let web3 = rootState.web3.web3;
        let network = rootState.network.networkName;
        let contracts = {};

        let networkAssetMap = {
            avalanche: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
            polygon: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
            polygon_dev: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
            optimism: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
            bsc: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        };

        let networkDaiMap = {
            polygon: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
            optimism: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
        };

        let etsNames = [
            { network: 'polygon', name: 'qs_alpha_wmatic_usdc' },
            { network: 'polygon', name: 'qs_beta_wmatic_usdc' },
            { network: 'polygon', name: 'qs_gamma_weth_usdc' },
            { network: 'polygon', name: 'qs_delta_weth_usdc' },
            { network: 'polygon', name: 'wmatic_usd_plus' },
            { network: 'polygon', name: 'qs_zeta_wbtc_usdc' },
            { network: 'polygon', name: 'qs_epsilon_weth_dai' },
            { network: 'polygon', name: 'uni_eta_wmatic_usdc' },

            { network: 'bsc', name: 'wbnb_busd' },
            { network: 'bsc', name: 'qs_alpha_wbnb_busd' },

            { network: 'optimism', name: 'uni_alpha_weth_usdc' },
            { network: 'optimism', name: 'uni_beta_weth_dai' },
            { network: 'optimism', name: 'ruby' },
            { network: 'optimism', name: 'night_ov_ar' },
        ];

        [
            contracts.exchange,
            contracts.govToken,
            contracts.governor,
            contracts.pm,
            contracts.timelockController,
            contracts.usdPlus,
            contracts.m2m,
            contracts.market,
            contracts.wUsdPlus,
            contracts.asset,
            contracts.dai,
        ] = await Promise.all([
            _load(await loadJSON(`/contracts/${network}/Exchange.json`), web3),
            _load(await loadJSON(`/contracts/${network}/OvnToken.json`), web3),
            _load(await loadJSON(`/contracts/${network}/OvnGovernor.json`), web3),
            _load(await loadJSON(`/contracts/${network}/PortfolioManager.json`), web3),
            _load(await loadJSON(`/contracts/${network}/OvnTimelockController.json`), web3),
            _load(await loadJSON(`/contracts/${network}/UsdPlusToken.json`), web3),
            _load(await loadJSON(`/contracts/${network}/Mark2Market.json`), web3),
            (network !== "avalanche" && network !== "bsc") ? _load(await loadJSON(`/contracts/${network}/Market.json`), web3) : _load_empty(),
            (network !== "avalanche" && network !== "bsc") ? _load(await loadJSON(`/contracts/${network}/WrappedUsdPlusToken.json`), web3) : _load_empty(),
            networkAssetMap[network] ? _load(ERC20, web3, networkAssetMap[network]) : _load_empty(),
            networkDaiMap[network] ? _load(ERC20, web3, networkDaiMap[network]) : _load_empty(),
        ]);

        await Promise.all(
            etsNames.map(async etsName => {
                if (network === etsName.network) {
                    _load_ets(etsName, contracts, web3);
                }
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

async function _load_ets(etsName, contracts, web3) {

    let etsParams = await loadJSON('/json/ets/' + etsName.name + '.json');

    let exchangerContract;
    let tokenContract;

    try {
        exchangerContract = _load(await loadJSON('/contracts/abi/ets/exchanger.json'), web3, etsParams.address);
        tokenContract = _load(await loadJSON('/contracts/abi/ets/token.json'), web3, etsParams.tokenAddress);
    } catch (e) {
        exchangerContract = _load(await loadJSON(`/contracts/${etsName.network}/ets/${etsName.name}/exchanger.json`), web3);
        tokenContract = _load(await loadJSON(`/contracts/${etsName.network}/ets/${etsName.name}/token.json`), web3);
    }

    contracts['ets_' + etsName.name + '_exchanger'] = exchangerContract;
    contracts['ets_' + etsName.name + '_token'] = tokenContract;
}

function _load_empty() {
    return null;
}

