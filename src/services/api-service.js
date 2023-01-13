import axios from 'axios';

function cloneObject(src) {
    return Object.assign({}, src);
}

let baseHeaders = {};

let notification = function(type, message, ttl) {
    console.error('Unhandled ', type, ': ', message, 'ttl', ttl);
};

let onSuccess = function (callback) {
    return function(data) {
        if (callback) {
            callback(data.data);
        }
    }
};

let onError = function (errorCallback) {
    let defaultErrorHandler = function (data) {
        if (data.code) {
            notification('warning', data.message, 5000);
        } else if (data.errors) {
            // default spring error handling
            notification('warning', data.errors[0]["default_message"], 5000);
        } else {
            notification('error', 'Unknown error', 5000);
        }
    };

    return function (data) {
        data = data.response.data;

        if (!errorCallback) {
            defaultErrorHandler(data);
            return;
        }

        errorCallback(data, function(){defaultErrorHandler(data)});
    }
};

let wrapPromise = function(promise) {
    return new Promise((resolve, reject) => {
        promise
            .then(onSuccess(resolve))
            .catch(onError(reject));
    });
};

let getHeaders = function (contentType) {
    let headers = cloneObject(baseHeaders);
    if (contentType) headers['Content-Type'] = contentType;
    return headers;
};


let transformRequest = function (obj) {
    let str = [];
    for (let p in obj) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
    return str.join("&");
};

class ApiService {

    get(url) {
        return wrapPromise(axios.get(url));
    }

    postJson(url, data) {
        let options = {headers: getHeaders('application/json')};
        return wrapPromise(axios.post(url, data, options));
    }

    putJson(url, data) {
        return wrapPromise(axios.put(url, data, {headers: getHeaders('application/json')}));
    }

    delete(url, data) {
        let options = {headers: getHeaders('application/x-www-form-urlencoded')};
        let responseFuture = axios.delete(data ? this.uri(url, data) : url, options);

        return wrapPromise(responseFuture);
    }

    uri(path, paramsObject) {
        let params = transformRequest(paramsObject);
        return path + '?' + params;
    }

    postMultipart(url, formData) {
      let options = {headers: getHeaders('multipart/form-data')};
      return wrapPromise(axios.post(url, formData, options));
    }

}

export const apiService = new ApiService();
