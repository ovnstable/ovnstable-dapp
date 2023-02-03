import {apiService} from '../services/api-service'
import {getErrorObject} from '../utils/errors'

class PoolApiService {
    getAllPools(apiUrl) {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": apiUrl
            }
        };

        return new Promise((resolve, reject) => {
            apiService.get(apiUrl + '/pools/all', fetchOptions)
            .then(data => {
                resolve(data)
            })
            .catch(e => {
                reject(getErrorObject(e))
            })
        })
    }
}
export const poolApiService = new PoolApiService()
