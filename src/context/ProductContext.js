import React, { useReducer } from 'react';

export const ProductContext = React.createContext(null);

const productReducer = (state, action) => {
	switch (action.type) {
		case 'setProductKey':
			localStorage.setItem("productKey", action.key)
			return action.key;
		default:
			return state;
	}
};

const ProductContextProvider = (props) => {
	const [product, setProduct] = useReducer(productReducer, localStorage.getItem("productKey"));
	return (
		<ProductContext.Provider value={{ key: product, dispatch: setProduct }}>
			{props.children}
		</ProductContext.Provider>
	);
}

export default ProductContextProvider;