export const PATHS = {
	SIGNUP: '/signup',
	LOGIN: '/login',
	FORGOT: '/forgot',
	RESET: '/reset',
	HOME: '/home',
	ORDERS: '/orders',
	VIEW_ORDER: '/view-orders',
	CREATE: '/create',
	MULTI: '/create/multi',
	TRACK: '/track',
	INTEGRATE: '/integrate',
	SHOPIFY: '/integrate/shopify',
	SQUARE: '/integrate/square',
	WOOCOMMERCE: '/integrate/woocommerce',
	SQUARESPACE: '/integrate/squarespace',
	MAGENTO: '/integrate/magento',
	HUBRISE: '/integrate/hubrise',
	HUBRISE_CATALOG: '/integrate/hubrise/catalog',
	API_KEY: '/integrate/api',
	PROFILE: '/profile',
	SETTINGS: '/settings',
	HELP: '/help',
	PAYMENT: '/payment',
	SUBSCRIPTION: '/subscription',
	COURIERS: '/couriers',
	DELIVERY_TIMES: '/delivery-times',
	SIGNUP_1: '/signup/1',
	SIGNUP_2: '/signup/2',
	SIGNUP_3: '/signup/3',
	DRIVERS: '/drivers'
};

export const STATUS_COLOURS = {
	NEW: '#F44336',
	PENDING: '#9933CC',
	DISPATCHING: '#FF7A00',
	EN_ROUTE: '#4285F4',
	COMPLETED: '#00FF19',
	CANCELLED: '#565656',
	UNKNOWN: '#795548'
};

export const BACKGROUND = {
	NEW: 'rgba(244,67, 54, 0.25)',
	PENDING: 'rgba(153, 51, 204, 0.25)',
	DISPATCHING: 'rgba(255, 122, 0, 0.25)',
	EN_ROUTE: 'rgba(66, 133, 244, 0.25)',
	COMPLETED: 'rgba(0, 255, 25, 0.25)',
	CANCELLED: 'rgba(86, 86, 86, 0.25)',
	UNKNOWN: 'rgba(121, 85, 72, 0.25)'
};

export const STATUS = {
	NEW: 'NEW',
	PENDING: 'PENDING',
	DISPATCHING: 'DISPATCHING',
	EN_ROUTE: 'EN-ROUTE',
	COMPLETED: 'COMPLETED',
	CANCELLED: 'CANCELLED'
};

export const DRIVER_STATUS = {
	AVAILABLE: 'AVAILABLE',
	BUSY: 'BUSY',
	ASSIGNED: 'ASSIGNED',
	OFFLINE: 'OFFLINE',
}

export const PLACE_TYPES = {
	ESTABLISHMENT: 'establishment',
	SUB_PREMISE: 'subpremise',
	PREMISE: 'premise',
	STREET_NUMBER: 'street_number',
	STREET_ADDRESS: 'route',
	CITY: 'postal_town',
	POSTCODE: 'postal_code',
	POSTCODE_PREFIX: 'postal_code_prefix'
};

export const SUBMISSION_TYPES = {
	ASSIGN_DRIVER: 'assign',
	GET_QUOTE: 'quote'
};

export const PROVIDER_TYPES = {
	COURIER: 'courier',
	DRIVER: 'driver'
}

export const VEHICLE_TYPES = [
	{
		value: 'BIC',
		label: 'Bicycle',
		description: '40(W) x 20(H) x 15(D) - Up to 8kg'
	},
	{
		value: 'MTB',
		label: 'Motorbike',
		description: '40(W) x 30(H) x 30(D) - Up to 12kg'
	},
	{
		value: 'CGB',
		label: 'CargoBike',
		description: '60(W) x 50(H) x 50(D) - Up to 65kg'
	},
	{
		value: 'CAR',
		label: 'Car',
		description: '60(W) x 40(H) x 40(D) - Up to 25kg'
	},
	{
		value: 'VAN',
		label: 'Van',
		description: '150(W) x 120(H) x 90(D) - Up to 200kg'
	}
];

export const PROVIDERS = {
	STUART: 'stuart',
	GOPHR: 'gophr',
	STREET_STREAM: 'street_stream',
	ECOFLEET: 'ecofleet',
	PRIVATE: 'private'
};

export const DELIVERY_TYPES = {
	ON_DEMAND: 'ON_DEMAND',
	SAME_DAY: 'SAME_DAY',
	MULTI_DROP: 'MULTI_DROP'
};

export const DELIVERY_STRATEGIES = {
	price: 'Lowest Price',
	eta: 'Fastest Delivery Time',
	rating: 'Best Driver Rating'
};