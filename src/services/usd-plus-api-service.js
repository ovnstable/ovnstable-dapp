import {apiService} from '../services/api-service'
import {getErrorObject} from '../utils/errors'

class UsdPlusApiService {

    getTotalUsdPlus(apiUrl) {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": apiUrl
            }
        };

        return new Promise((resolve, reject) => {
            apiService.get(apiUrl + '/dapp/getTotalUsdPlusValue', fetchOptions)
            .then(data => {
                resolve(data)
            })
            .catch(e => {
                reject(getErrorObject(e))
            })
        })
    }

    refreshTotalUsdPlusProfit(apiUrl) {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": apiUrl
            }
        };

        return new Promise((resolve, reject) => {
            apiService.get(apiUrl + '/dapp/getTotalUsdPlusProfit', fetchOptions)
            .then(data => {
                resolve(data)
            })
            .catch(e => {
                reject(getErrorObject(e))
            })
        })
    }
}
export const usdPlusApiService = new UsdPlusApiService()
