const state = {

    totalSupply: {
        usdPlusWmatic: 0,
        wmaticUsdc: 0,
        etsMoonstone: 0,
        usdPlusWbnb: 0,
        busdWbnb: 0,
        etsRuby: 0,
    },

    maxUsdPlusWmaticSupply: 275000.00,
    maxWmaticUsdcSupply: 500000.00,
    maxEtsMoonstoneSupply: 500000.00,
    maxEtsRubySupply: 500000.00,
    maxUsdPlusWbnbSupply: 500000.00,
    maxBusdWbnbSupply: 500000.00,
};

const getters = {

    totalSupply(state) {
        return state.totalSupply;
    },

    maxUsdPlusWmaticSupply(state) {
        return state.maxUsdPlusWmaticSupply;
    },

    maxWmaticUsdcSupply(state) {
        return state.maxWmaticUsdcSupply;
    },

    maxEtsMoonstoneSupply(state) {
        return state.maxEtsMoonstoneSupply;
    },

    maxUsdPlusWbnbSupply(state) {
        return state.maxUsdPlusWbnbSupply;
    },

    maxBusdWbnbSupply(state) {
        return state.maxBusdWbnbSupply;
    },

    maxEtsRubySupply(state) {
        return state.maxEtsRubySupply;
    },
};

const actions = {

    async resetSupply({commit, dispatch, getters}) {

        console.debug('Supply: resetSupply');

        commit('setTotalSupply', {
            usdPlusWmatic: 0,
            wmaticUsdc: 0,
            etsMoonstone: 0,
            usdPlusWbnb: 0,
            busdWbnb: 0,
            etsRuby: 0,
        });

    },

    async refreshSupply({commit, dispatch, getters, rootState}) {

        console.debug('Supply: refreshSupply');

        let web3 = rootState.web3;
        let usdPlusWmatic;
        let wmaticUsdc;
        let etsMoonstone;
        let usdPlusWbnb;
        let busdWbnb;
        let etsRuby;

        try {
            usdPlusWmatic = await web3.contracts.usdPlusWmatic.methods.totalSupply().call();
        } catch (e) {
            usdPlusWmatic = null;
        }

        try {
            wmaticUsdc = await web3.contracts.wmaticUsdc.methods.totalSupply().call();
        } catch (e) {
            wmaticUsdc = null;
        }

        try {
            etsMoonstone = await web3.contracts.etsMoonstoneToken.methods.totalSupply().call();
        } catch (e) {
            etsMoonstone = null;
        }

        try {
            usdPlusWbnb = await web3.contracts.usdPlusWbnb.methods.totalSupply().call();
        } catch (e) {
            usdPlusWbnb = null;
        }

        try {
            busdWbnb = await web3.contracts.busdWbnb.methods.totalSupply().call();
        } catch (e) {
            busdWbnb = null;
        }

        try {
            etsRuby = await web3.contracts.etsRubyToken.methods.totalSupply().call();
        } catch (e) {
            etsRuby = null;
        }


        try {
            if (usdPlusWmatic) {
                usdPlusWmatic = web3.web3.utils.fromWei(usdPlusWmatic, 'mwei');
            } else {
                usdPlusWmatic = rootState.marketData.wmaticStrategyData.tvl;
            }
        } catch (e) {
        }

        try {
            if (wmaticUsdc) {
                wmaticUsdc = web3.web3.utils.fromWei(wmaticUsdc, 'mwei');
            } else {
                wmaticUsdc = rootState.marketData.wmaticUsdcStrategyData.tvl;
            }
        } catch (e) {
        }

        try {
            if (etsMoonstone) {
                etsMoonstone = web3.web3.utils.fromWei(etsMoonstone, 'mwei');
            } else {
                etsMoonstone = rootState.marketData.etsMoonstoneStrategyData.tvl;
            }
        } catch (e) {
        }

        try {
            if (usdPlusWbnb) {
                usdPlusWbnb = web3.web3.utils.fromWei(usdPlusWbnb, 'mwei');
            } else {
                usdPlusWbnb = rootState.marketData.usdPlusWbnbStrategyData.tvl;
            }
        } catch (e) {
        }

        try {
            if (busdWbnb) {
                busdWbnb = web3.web3.utils.fromWei(busdWbnb, 'mwei');
            } else {
                busdWbnb = rootState.marketData.busdWbnbStrategyData.tvl;
            }
        } catch (e) {
        }

        try {
            if (etsRuby) {
                etsRuby = web3.web3.utils.fromWei(etsRuby, 'mwei');
            } else {
                etsRuby = rootState.marketData.etsRubyStrategyData.tvl;
            }
        } catch (e) {
        }

        commit('setTotalSupply', {
            usdPlusWmatic: usdPlusWmatic,
            wmaticUsdc: wmaticUsdc,
            etsMoonstone: etsMoonstone,
            usdPlusWbnb: usdPlusWbnb,
            busdWbnb: busdWbnb,
            etsRuby: etsRuby,
        })
    },
};

const mutations = {

    setTotalSupply(state, totalSupply) {
        state.totalSupply = totalSupply;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
