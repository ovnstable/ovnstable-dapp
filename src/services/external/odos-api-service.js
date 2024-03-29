import { apiService } from "../api-service";
import { getErrorObject } from "@/utils/errors";

const API_URL = "https://api.overnight.fi/root/odos";

class OdosApiService {
  loadChains() {
    let fetchOptions = {
      headers: {
        "Access-Control-Allow-Origin": API_URL
      }
    };

    return new Promise((resolve, reject) => {
      apiService
        .get(API_URL + "/info/chains", fetchOptions)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }

  loadTokens() {
    let fetchOptions = {
      headers: {
        "Access-Control-Allow-Origin": API_URL
      }
    };

    return new Promise((resolve, reject) => {
      apiService
        .get(API_URL + "/info/tokens", fetchOptions)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }

  loadContractData(chainId) {
    let fetchOptions = {
      headers: {
        "Access-Control-Allow-Origin": API_URL
      }
    };
    return new Promise((resolve, reject) => {
      apiService
        .get(API_URL + "/info/contract-info/v2/" + chainId, fetchOptions)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }

  loadPrices(chainId) {
    let fetchOptions = {
      headers: {
        "Access-Control-Allow-Origin": API_URL
      }
    };

    return new Promise((resolve, reject) => {
      apiService
        .get(API_URL + "/pricing/token/" + chainId, fetchOptions)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }

  getActualGasPrice(chainId) {
    let fetchOptions = {
      headers: {
        "Access-Control-Allow-Origin": API_URL
      }
    };
    return new Promise((resolve, reject) => {
      apiService
        .get(API_URL + "/gas/price/" + chainId, fetchOptions)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }

  quoteRequest(requestData) {
    let fetchOptions = {
      headers: {
        "Access-Control-Allow-Origin": API_URL
      }
    };

    return new Promise((resolve, reject) => {
      apiService
        .postJson(API_URL + "/sor/quote/v2", requestData, fetchOptions)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }

  assembleRequest(requestData) {
    let fetchOptions = {
      headers: {
        "Access-Control-Allow-Origin": API_URL
      }
    };

    return new Promise((resolve, reject) => {
      apiService
        .postJson(API_URL + "/sor/assemble", requestData, fetchOptions)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }

  swapRequest(requestData) {
    let fetchOptions = {
      headers: {
        "Access-Control-Allow-Origin": API_URL
      }
    };

    console.log(JSON.stringify(requestData), "requestData");

    return new Promise((resolve, reject) => {
      apiService
        .postJson(API_URL + "/sor/swap", requestData, fetchOptions)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }
}
export const odosApiService = new OdosApiService();
