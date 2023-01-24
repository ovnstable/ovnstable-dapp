import {apiService} from '../services/api-service'
import {getErrorObject} from '../utils/errors'

class DashboardApiService {

    getClientBalanceChanges(apiUrl, address, productId) {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": apiUrl
            }
        };

        let params = '?address=' + address;
        params += productId ? '&product=' + encodeURIComponent(productId) : '';

        return new Promise((resolve, reject) => {
            apiService.get(apiUrl + '/dapp/clientBalanceChanges' + params, fetchOptions)
            .then(data => {
                resolve(data)
            })
            .catch(e => {
                reject(getErrorObject(e))
            })
        })
    }

    getClientStrategies(apiUrl, address) {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": apiUrl
            }
        };

        let params = '?address=' + address;
        return new Promise((resolve, reject) => {
            apiService.get(apiUrl + '/dapp/clientStrategies' + params, fetchOptions)
                .then(data => {
                    resolve(data)
                })
                .catch(e => {
                    reject(getErrorObject(e))
                })
        })
    }
}
export const dashboardApiService = new DashboardApiService()
