import {apiService} from '../services/api-service'
import {getErrorObject} from '../utils/errors'

const ROOT_API = 'https://api.overnight.fi/root'

class ProductInfoApiService {

    getAllProducts() {
        let fetchOptions = {
            headers: {
                "Access-Control-Allow-Origin": ROOT_API
            }
        };

        return new Promise((resolve, reject) => {
            apiService.get(ROOT_API + '/product/ets/all', fetchOptions)
                .then(data => {
                    resolve(data)
                })
                .catch(e => {
                    reject(getErrorObject(e))
                })
        })
    }

    getAllProducts_old(apiUrl) {
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
