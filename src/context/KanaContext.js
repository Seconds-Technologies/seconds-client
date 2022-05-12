import React, { useEffect, useState } from 'react';
import { KanaContext } from './index';
import { useSelector } from 'react-redux';
import { KanaUserClient } from '@usekana/client-kana-js'

const KanaProvider = ({ children }) => {
	const [kanaClient, setKanaClient] = useState(null);
	const { kanaAccessToken } = useSelector(state => state['currentUser'].user);

	useEffect(() => {
		(async () => {
			if(kanaAccessToken){
				const client = new KanaUserClient({
					userToken: kanaAccessToken
				})
				await client.resetCache()
				console.log(client)
				setKanaClient(client)
			}
		})()
	}, [kanaAccessToken])

	return <KanaContext.Provider value={kanaClient}>{children}</KanaContext.Provider>;
};

export default KanaProvider;