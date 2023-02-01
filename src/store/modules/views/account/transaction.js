import moment from "moment";

const state = {
    transactions: [],
};

const getters = {

    transactions(state) {
        return state.transactions;
    },
};

const actions = {

    async putTransaction({commit, dispatch, getters, rootState}, tx) {
        tx.date = moment.utc(new Date());
        tx.pending = true;
        tx.isError = false;
        tx.chain = rootState.network.networkId;

        getters.transactions.push(tx);
        commit('setTransactions', getters.transactions);
    },

    clearTransaction({commit, dispatch, getters, rootState}) {
        commit('setTransactions', [])
    },

    deleteTxFromHistory({commit, dispatch, getters, rootState}, hash) {
        let filteredTx = getters.transactions.filter(tx => tx.hash !== hash);
        commit('setTransactions', filteredTx);
    },

    loadTransaction({commit, dispatch, getters, rootState}) {

        console.log('Transaction: loadTransaction');

        for (let i = 0; i < getters.transactions.length; i++) {
            let transaction = getters.transactions[i];

            if (transaction == null || transaction.pending !== true) {
                continue;
            }

            const delay = t => new Promise(resolve => setTimeout(resolve, t));

            const transactionReceiptRetry = () => rootState.web3.web3.eth.getTransactionReceipt(transaction.hash)
                .then((receipt) => {
                  if (transaction.chain !== rootState.network.networkId) {
                    return delay(1000).then(transactionReceiptRetry);
                  }

                  if (receipt != null) {
                    receipt.cancel = false;
                    return receipt;
                  } else {
                    let minutes = moment.duration(moment.utc(new Date()).diff(transaction.date)).asMinutes();

                    if (minutes > 10) {
                      receipt = { transactionHash: transaction.hash, cancel: true };
                      return receipt;
                    } else {
                      return delay(1000).then(transactionReceiptRetry)
                    }
                  }
                });

            transactionReceiptRetry().then(receipt => {
                let filteredTx = getters.transactions.find(tx => tx.hash === receipt.transactionHash);
                filteredTx.pending = false;
                filteredTx.receipt = receipt;

                if (receipt && !receipt.cancel) {
                    filteredTx.isError = !receipt.status;
                    filteredTx.isCancelled = false;
                } else {
                    filteredTx.isError = false;
                    filteredTx.isCancelled = true;
                }

                commit('setTransactions', getters.transactions);
            })
        }
    }
};

const mutations = {

    setTransactions(state, transactions) {
        state.transactions = transactions;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
