import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { AmplifyContext } from './index';

const AmplifyContextProvider = (props) => {
	const [ credentials, setCredentials ] = useState({ identityId: '' });

	useEffect(() => {
		Auth.currentCredentials().then((creds) => setCredentials(creds)).catch(err => console.error(err))
	}, [])

	return (
		<AmplifyContext.Provider value={credentials}>
			{props.children}
		</AmplifyContext.Provider>
	);
}

export default AmplifyContextProvider;