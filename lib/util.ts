export const ERROR_CODE = {
    CUSTOM_ENDPOINT_UNAVAILABLE: 'CUSTOM_ENDPOINT_UNAVAILABLE',
    INVALID_URL: 'INVALID_URL',
    INVALID_CUSTOM_ENDPOINT: 'INVALID_CUSTOM_ENDPOINT',
    INVALID_EXPIRATION_DATE: 'INVALID_EXPIRATION_DATE',
}

export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url)
        return true
    } catch (err) {
        return false
    }
}

export const isValidCustomEndpoint = (customEndpoint: string): boolean => {
    const pattern = /^[a-zA-Z0-9_]*$/
    return pattern.test(customEndpoint)
}

export const isValidExpirationDate = (date: Date): boolean => {
    if (date) {
        return date >= new Date()
    }
    return true
}

export const constructErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
        case ERROR_CODE.CUSTOM_ENDPOINT_UNAVAILABLE:
            return 'Custom endpoint unavailable!'
        case ERROR_CODE.INVALID_URL:
            return 'URL is invalid!'
        case ERROR_CODE.INVALID_CUSTOM_ENDPOINT:
            return 'Custom endpoint should be alphanumeric or underscore only!'
        case ERROR_CODE.INVALID_EXPIRATION_DATE:
            return 'Expiration date should be in the future!'
        default:
            return ''
    }
}