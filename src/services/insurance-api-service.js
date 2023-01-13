import {apiService} from '../services/api-service'
import {getErrorObject} from '../utils/errors'

class InsuranceApiService {

    getAvgApyInfo(apiUrl, type) {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": apiUrl
            }
        };

        return new Promise((resolve, reject) => {
            apiService.get(apiUrl + '/insurance/avg-apy-info/' + type, fetchOptions)
            .then(data => {
                resolve(data)
            })
            .catch(e => {
                reject(getErrorObject(e))
            })
        })
    }
}
export const insuranceApiService = new InsuranceApiService()