import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from "redux-persist";
import logger from "redux-logger";
import rootReducer from "./reducers";

/*const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;*/

export const store = configureStore({
	reducer: rootReducer,
	devTools: process.env.NODE_ENV !== 'production',
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
});

export const persistor = persistStore(store);

// eslint-disable-next-line import/no-anonymous-default-export
export default {store, persistor}