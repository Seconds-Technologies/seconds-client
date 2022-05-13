import React, { useEffect, useState } from 'react';
import { KanaContext } from './index';
import { useSelector } from 'react-redux';
import { KanaUserClient } from '@usekana/client-kana-js'

const KANA_PUBLIC_KEY = process.env.REACT_APP_KANA_PUBLIC_KEY

const KanaProvider = ({ children }) => {
	const [kanaClient, setKanaClient] = useState(null);
	const [features, setFeatures] = useState(null);
	const [errors, setErrors] = useState(null);
	const { kanaAccessToken } = useSelector(state => state['currentUser'].user);

	useEffect(() => {
		console.log(features)
	}, [features])

	useEffect(() => {
		(async () => {
			if(kanaAccessToken){
				const client = new KanaUserClient({
					apiKey: KANA_PUBLIC_KEY,
					userId:
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
					setErrors(prevState => ({
						additionalDrivers: additionalDrivers.error,
						routeOptimization: routeOptimization.error,
						apiIntegration: apiIntegration.error
					}))
				}
			}
		})()
	}, [kanaAccessToken])

	return <KanaContext.Provider value={{ kanaClient, features, errors }}>{children}</KanaContext.Provider>;
};

export default KanaProvider;