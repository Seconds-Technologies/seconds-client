import { apiCall, setTokenHeader } from "../../api";
import { SET_CURRENT_USER } from "../actionTypes";
import { addError, removeError } from "./errors";
import { clearAllOrders, clearAllProducts, setShopify } from "./shopify";

export const setCurrentUser = user => {
    return {
        type: SET_CURRENT_USER,
        user,
    };
};

export const setAuthorizationToken = token => {
    setTokenHeader(token);
};

export function logout() {
    return dispatch => {
        localStorage.removeItem("jwt_token");
        setAuthorizationToken(false);
        dispatch(setCurrentUser({}));
        dispatch(setShopify({}));
        dispatch(clearAllOrders());
        dispatch(clearAllProducts());
    };
}

export function authUser(type, userData) {
    return dispatch => {
        return new Promise((resolve, reject) => {
            console.log("User data:", userData);
            return apiCall("POST", `/api/auth/${type}`, userData)
                .then(({ token, ...user }) => {
                    console.log("Token:", token)
                    localStorage.setItem("jwt_token", token);
                    setAuthorizationToken(token)
                    dispatch(setCurrentUser(user));
                    apiCall("POST", `/api/shopify`, { email: user.email })
                        .then(({ baseURL, accessToken, shopId, domain, country, shopOwner }) => {
                            dispatch(setShopify({ baseURL, accessToken, shopId, domain, country, shopOwner }))
                            resolve({ baseURL, accessToken, shopId, domain, country, shopOwner })
                        })
                        .catch(err => reject(err))
                    dispatch(removeError());
                    resolve();
                })
                .catch(err => {
                    if (err) dispatch(addError(err.message));
                    else
                        dispatch(
                            addError("Api endpoint could not be accessed!")
                        );
                    reject(err);
                });
        });
    };
}