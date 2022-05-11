import React, { useEffect, useState } from 'react';

const useKana = kana => {
	const [features, setFeatures] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		(async () => {
			if (kana) {
				const additionalDrivers = await kana.canUseFeature('additional-drivers');
				const routeOptimization = await kana.canUseFeature('route-optimization');
				if (additionalDrivers.data && routeOptimization.data) {
					setFeatures(prevState => ({
						additionalDrivers: additionalDrivers.data.access,
						routeOptimization: routeOptimization.data.access
					}));
				} else {
					setError(additionalDrivers.error)
				}
			}
		})();
	}, [kana]);

	return [features, error];
};

export default useKana;