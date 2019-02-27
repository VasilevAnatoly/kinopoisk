import { alertTypes } from '../constants';

export function alertShow(message, type) {
    return {
        type: alertTypes.ALERT_SHOW,
        payload: {
            message: message,
            type: type
        }
    }
}

export function alertHide() {
    return {
        type: alertTypes.ALERT_HIDE,
    }
}