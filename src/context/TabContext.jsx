import React, { useReducer } from 'react';
import { TabContext } from './index';

const indexReducer = (state, action) => {
	switch (action.type) {
		case 'setIndex':
			return action.index;
		default:
			return state;
	}
};

const TabContextProvider = ({ children }) => {
	const [val, setVal] = useReducer(indexReducer, 0, () => 0);

	return <TabContext.Provider value={{ index: val, dispatch: setVal }}>{children}</TabContext.Provider>;
};

export default TabContextProvider;