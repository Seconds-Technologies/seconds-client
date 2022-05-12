import React, { useEffect, useState } from 'react';
import { KanaContext } from './index';
import { useSelector } from 'react-redux';
import { KanaUserClient } from '@usekana/client-kana-js'

const KanaProvider = ({ children }) => {
	const [kanaClient, setKanaClient] = useState(null);
	const [features, setFeatures] = useState(null);
	const [error, setError] = useState(null);
	const { kanaAccessToken } = useSelector(state => state['currentUser'].user);

	useEffect(() => {
		console.log(features)
	}, [features])

	useEffect(() => {
		(async () => {
			if(kanaAccessToken){
				const client = new KanaUserClient({
					userToken: kanaAccessToken
				})
				await client.resetCache()
				setKanaClient(client)
				const additionalDrivers = await client.canUseFeature('additional-drivers');
				const routeOptimization = await client.canUseFeature('route-optimization');
				const apiIntegration = await client.canUseFeature('api-integration');
				if (additionalDrivers.data && routeOptimization.data && apiIntegration.data) {
					setFeatures(prevState => ({
						additionalDrivers: additionalDrivers.data.access,
						routeOptimization: routeOptimization.data.access,
						apiIntegration: apiIntegration.data.access
					}));
				} else {
					setError(additionalDrivers.error)
				}
			}
		})()
	}, [kanaAccessToken])

	return <KanaContext.Provider value={{ kanaClient, features, error }}>{children}</KanaContext.Provider>;
};

export default KanaProvider;