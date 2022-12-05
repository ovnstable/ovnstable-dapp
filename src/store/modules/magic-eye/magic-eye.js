const state = {
  dataHidden: false
};

const getters = {

  dataHidden(state) {
    return state.dataHidden;
  }
};

const actions = {

  async switchEye({ commit, dispatch, getters }) {
    let isHidden;

    if (getters.dataHidden === null || getters.dataHidden === undefined) {
      isHidden = false;
    } else {
      isHidden = !getters.dataHidden;
    }

    await commit("setDataHidden", isHidden);
  }
};

const mutations = {

  setDataHidden(state, value) {
    state.dataHidden = value;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};