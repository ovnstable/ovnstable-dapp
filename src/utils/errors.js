export const codeErrorMap = {};

export function getErrorMessage(e) {
    let errorMessage = codeErrorMap[e.code];
    return errorMessage || e.message || 'Unknown error with code: ' + e.code;
}

export function getErrorObject(e) {
    if (e.code) {
        return {code: e.code, message: getErrorMessage(e)};
    }

    if (e.status) {
        return {code: e.status, message: getErrorMessage({code: e.status, message: e.message})};
    }

    console.error('Unknown api error: ', e);

    if (e.message) {
        return {code: 0, message: e.message};
    }

    return {code: 0, message: 'Unknown error'};
}
