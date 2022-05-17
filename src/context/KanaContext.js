import React, { useEffect, useState } from 'react';
import { KanaContext } from './index';
import { useSelector } from 'react-redux';
import { KanaUserClient } from '@usekana/client-kana-js'

const KANA_PUBLIC_KEY = process.env.REACT_APP_KANA_PUBLIC_KEY

const KanaProvider = ({ children }) => {
	const [kanaClient, setKanaClient] = useState(null);
	const [features, setFeatures] = useState(null);
	const [errors, setErrors] = useState(null);
	const { email } = useSelector(state => state['currentUser'].user);

	useEffect(() => {
		console.log(features)
	}, [features])

	useEffect(() => {
		(async () => {
			if(email){
				console.log(email)
				const client = new KanaUserClient({
					apiKey: "pub_live_9ab99b923e5a1845413ddbfb00988b88",
					userId: "ola@useseconds.com"
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
	}, [])

	return <KanaContext.Provider value={{ kanaClient, features, errors }}>{children}</KanaContext.Provider>;
};

export default KanaProvider;