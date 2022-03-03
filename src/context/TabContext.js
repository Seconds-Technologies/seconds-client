import React from 'react';

const TabContext = React.createContext(null);

export const indexReducer = (state, action) => {
	switch (action.type) {
		case 'setIndex':
			return action.index;
		default:
			return state;
	}
};

export default TabContext