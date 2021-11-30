import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import shopifyProducts from "./shopifyProducts";
import shopifyOrders from "./shopifyOrders";
import shopifyStore from "./shopifyStore";
import squareStore from './squareStore';
import currentUser from "./currentUser";
import errors from "./errors";
import deliveryJobs from './deliveryJobs';
import addressHistory from './addressHistory';
import { setAuthorizationToken } from '../actions/auth';
import { LOGOUT_USER } from '../actionTypes';

const persistConfig = {
    key: "root",
    storage
};

const appReducer = combineReducers({
    shopifyProducts,
    shopifyOrders,
    currentUser,
    shopifyStore,
    squareStore,
    deliveryJobs,
    addressHistory,
    errors
});

const rootReducer = (state, action) => {
    if (action.type === LOGOUT_USER) {
        localStorage.removeItem('jwt_token');
        setAuthorizationToken(false);
        // for all keys defined in your persistConfig(s)
        storage.removeItem('persist:root')
        // storage.removeItem('persist:otherKey')
        state = undefined;
    }
    return appReducer(state, action);
};

export default persistReducer(persistConfig, rootReducer);