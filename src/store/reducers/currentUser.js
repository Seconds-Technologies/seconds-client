import { SET_API_KEY, SET_CURRENT_USER } from '../actionTypes';

const DEFAULT_STATE = {
    isAuthenticated: false, //be true when user logged in
    user: {
        firstname: "",
        lastname: "",
        company: "",
        email: "",
        apiKey: "",
    }//all user info when logged in
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                isAuthenticated: Object.keys(action.user).length > 0,
                user: action.user,
            };
        case SET_API_KEY:
            return {
                ...state,
                user: { ...state.user, apiKey: action.apiKey}
            }
        default:
            return state;
    }
};