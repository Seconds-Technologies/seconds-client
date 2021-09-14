import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import shopifyProducts from "./shopifyProducts";
import shopifyOrders from "./shopifyOrders";
import shopifyStore from "./shopifyStore";
import currentUser from "./currentUser";
import errors from "./errors";

const persistConfig = {
    key: "root",
    storage
};

const rootReducer = combineReducers({
    shopifyProducts,
    shopifyOrders,
    currentUser,
    shopifyStore,
    errors
});

export default persistReducer(persistConfig, rootReducer);