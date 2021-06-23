import { applyMiddleware, compose, createStore } from "redux";
import { persistStore } from "redux-persist";
import logger from "redux-logger";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const middlewares = [logger, thunk];

export const store = createStore(
	rootReducer,
	compose(
		applyMiddleware(...middlewares)
	)
);

export const persistor = persistStore(store);

export default {store, persistor}