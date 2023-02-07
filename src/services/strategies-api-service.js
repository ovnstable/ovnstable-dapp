import {apiService} from '../services/api-service'
import {getErrorObject} from '../utils/errors'

class StrategiesApiService {

    getStrategies(apiUrl) {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": apiUrl
            }
        };

        return new Promise((resolve, reject) => {
            apiService.get(apiUrl + '/dapp/strategies', fetchOptions)
            .then(data => {
                resolve(data)
            })
            .catch(e => {
                reject(getErrorObject(e))
            })
        })
    }

    getHedgeStrategies(apiUrl, contractAddress) {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": apiUrl
            }
        };

        return new Promise((resolve, reject) => {
            apiService.get(apiUrl + '/hedge-strategies/' + contractAddress, fetchOptions)
            .then(data => {
                resolve(data)
            })
            .catch(e => {
                reject(getErrorObject(e))
            })
        })
    }

    getAvgApyHedgeStrategies(apiUrl, contractAddress, type) {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": apiUrl
            }
        };

        return new Promise((resolve, reject) => {
            apiService.get(apiUrl + '/hedge-strategies/' + contractAddress + '/avg-apy-info/' + type, fetchOptions)
            .then(data => {
                resolve(data)
            })
            .catch(e => {
                reject(getErrorObject(e))
            })
        })
    }

}
export const strategiesApiService = new StrategiesApiService()
