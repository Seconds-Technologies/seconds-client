import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import shopifyProducts from "./shopifyProducts";
import shopifyStore from "./shopifyStore";
import squareStore from './squareStore';
import wooCommerceStore from './wooCommerceStore';
import squarespaceStore from './squarespaceStore';
import hubriseStore from './hubriseStore';
import currentUser from "./currentUser";
import errors from "./errors";
import deliveryJobs from './deliveryJobs';
import addressHistory from './addressHistory';
import driversStore from './driversStore';
import { setAuthorizationToken } from '../actions/auth';
import { LOGOUT_USER } from '../actionTypes';

const persistConfig = {
    key: "root",
    storage
};

const appReducer = combineReducers({
    shopifyProducts,
    currentUser,
    shopifyStore,
    squareStore,
    wooCommerceStore,
    squarespaceStore,
    hubriseStore,
    deliveryJobs,
    addressHistory,
    driversStore,
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