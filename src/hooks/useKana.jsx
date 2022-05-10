import React, { useEffect, useState } from 'react';

const useKana = kana => {
	const [features, setFeatures] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		(async () => {
			if (kana) {
				const { data, error } = await kana.canUseFeature('additional-drivers');
				if (data) {
					setFeatures(prevState => ({
						additionalDrivers: data.access
					}));
				} else {
					setError(error)
				}
			}
		})();
	}, []);

	return [features, error];
};

export default useKana;