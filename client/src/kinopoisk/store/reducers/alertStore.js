import { alertTypes } from '../constants';

const initialState = {
    open: false,
    type: null,
    message: null
};

export default function alert(state = initialState, action) {

    switch (action.type) {
        case alertTypes.ALERT_HIDE:
            return { ...state, 
                type: null,
                open: false,
                message: null
            }
        case alertTypes.ALERT_SHOW:
            let message = action.payload.message;
            return { ...state, 
                type: action.payload.type || "info",
                open: true,
                message: (Array.isArray(message) ? message : [message]) || null
            }
        default:
            return state;
    }
}