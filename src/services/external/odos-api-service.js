import {apiService} from '../api-service'
import {getErrorObject} from '../../utils/errors'

const API_URL = "https://api.odos.xyz"

class OdosApiService {
    loadChains() {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": API_URL
            }
        };

        return new Promise((resolve, reject) => {
            apiService.get(API_URL + '', fetchOptions)
            .then(data => {
                resolve(data)
            })
            .catch(e => {
                reject(getErrorObject(e))
            })
        })
    }
}
export const odosApiService = new OdosApiService()
