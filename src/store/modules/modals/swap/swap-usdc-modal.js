const state = {
  isMintView: true,

  show: false,

  assetUsdcApproved: false,
  usdcPlusApproved: false
};

const getters = {
  isMintView(state) {
    return state.isMintView;
  },

  show(state) {
    return state.show;
  },

  assetUsdcApproved(state) {
    return state.assetUsdcApproved;
  },

  usdcPlusApproved(state) {
    return state.usdcPlusApproved;
  }
};

const actions = {
  showUsdcSwapModal({ commit, dispatch, getters }) {
    commit("setUsdcShow", true);
  },

  closeUsdcSwapModal({ commit, dispatch, getters }) {
    commit("setUsdcShow", false);
  },

  async showUsdcRedeemView({ commit, dispatch, getters, rootState }) {
    commit("setIsUsdcMintView", false);
  },

  async showUsdcMintView({ commit, dispatch, getters, rootState }) {
    commit("setIsUsdcMintView", true);
  },

  approveAsset({ commit, dispatch, getters }) {
    commit("setAssetUsdcApproved", true);
  },

  disapproveAsset({ commit, dispatch, getters }) {
    commit("setAssetUsdcApproved", false);
  },

  approveUsdcPlus({ commit, dispatch, getters }) {
    commit("setUsdcPlusApproved", true);
  },

  disapproveUsdcPlus({ commit, dispatch, getters }) {
    commit("setUsdcPlusApproved", false);
  }
};

const mutations = {
  setIsUsdcMintView(state, value) {
    state.isMintView = value;
  },

  setUsdcShow(state, show) {
    state.show = show;
  },

  setAssetUsdcApproved(state, assetUsdcApproved) {
    state.assetUsdcApproved = assetUsdcApproved;
  },

  setUsdcPlusApproved(state, usdcPlusApproved) {
    state.usdcPlusApproved = usdcPlusApproved;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
