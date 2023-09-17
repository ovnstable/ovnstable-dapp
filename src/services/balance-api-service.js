import {apiService} from '../services/api-service'
import {getErrorObject} from '../utils/errors'

class BalanceApiService {
    checkHistoryBalance(apiUrl, address) {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": apiUrl
            }
        };

        return new Promise((resolve, reject) => {
            apiService.get(apiUrl + '/client/balance/check/history/' + address, fetchOptions)
            .then(data => {
                resolve(data)
            })
            .catch(e => {
                reject(getErrorObject(e))
            })
        })
    }

    checkCurrentBalance(apiUrl, address) {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": apiUrl
            }
        };

        return new Promise((resolve, reject) => {
            apiService.get(apiUrl + '/client/balance/check/current/' + address, fetchOptions)
            .then(data => {
                resolve(data)
            })
            .catch(e => {
                reject(getErrorObject(e))
            })
        })
    }

    checkBaseBalanceWithNft(apiUrl, address) {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": apiUrl
            }
        };

        return new Promise((resolve, reject) => {
            apiService.get(apiUrl + '/client/balance/base/get/' + address, fetchOptions)
                .then(data => {
                    resolve(data)
                })
                .catch(e => {
                    reject(getErrorObject(e))
                })
        })
    }
}
export const balanceApiService = new BalanceApiService()
