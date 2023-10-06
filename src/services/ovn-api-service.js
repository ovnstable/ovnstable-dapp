import {apiService} from '../services/api-service'
import {getErrorObject} from '../utils/errors'

class OvnApiService {
    getOvnPrice(apiUrl) {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": apiUrl
            }
        };

        return new Promise((resolve, reject) => {
            apiService.get(apiUrl + '/price/ovn', fetchOptions)
            .then(data => {
                resolve(data)
            })
            .catch(e => {
                reject(getErrorObject(e))
            })
        })
    }
}
export const ovnApiService = new OvnApiService()
