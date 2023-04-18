import {apiService} from '../services/api-service'
import {getErrorObject} from '../utils/errors'

class ProductInfoApiService {

    getAllProducts(apiUrl) {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": apiUrl
            }
        };

        return new Promise((resolve, reject) => {
            apiService.get(apiUrl + '/product/all', fetchOptions)
            .then(data => {
                resolve(data)
            })
            .catch(e => {
                reject(getErrorObject(e))
            })
        })
    }

    getAllArchivedProducts(apiUrl) {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": apiUrl
            }
        };

        return new Promise((resolve, reject) => {
            apiService.get(apiUrl + '/product/all/archived', fetchOptions)
                .then(data => {
                    resolve(data)
                })
                .catch(e => {
                    reject(getErrorObject(e))
                })
        })
    }
}
export const productInfoApiService = new ProductInfoApiService()
