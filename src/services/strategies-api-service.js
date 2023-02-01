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
}
export const strategiesApiService = new StrategiesApiService()
