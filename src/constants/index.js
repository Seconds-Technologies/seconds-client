export const PATHS = {
	SIGNUP: '/signup',
	LOGIN: '/login',
	FORGOT: '/forgot',
	RESET: '/reset',
	HOME: '/home',
	ORDERS: '/orders',
	DRIVERS: '/drivers',
	ANALYTICS: '/analytics',
	VIEW_ORDER: '/order',
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
};

export const SUBSCRIPTION_PLANS = {
	STARTER: {
		name: 'starter',
		description: 'Ideal for small businesses with small delivery volume who want to outsource their deliveries.',
		price: 0,
		priceLabel: 'Free',
		features: [
			'Access third-party delivery services',
			'Connect your online stores',
			'Automated order creation',
			'Automated dispatch',
			'Automated orchestration',
			'Manual instant order creation',
			'Manual scheduled order creation',
			'Track and manage all deliveries',
			'Real-time location tracking',
			'Keep customers notified',
			'Build business workflows',
			'Delivery reports',
			'Live support'
		]
	},
	GROWTH: {
		name: 'growth',
		description: 'Great for small businesses with mild delivery volume and manage their own team.',
		price: 99,
		priceLabel: '£99',
		features: [
			'Everything in Starter',
			'Add and manage internal drivers',
			'Automated driver dispatch',
			'Driver application',
			'Manual route batching',
			'Manual route optimization',
			'SMS notifications to customers',
			'Live customer ETA',
			'Proof of delivery'
		]
	},
	PRO: {
		name: 'pro',
		description: 'Designed for small to medium-sized businesses with high delivery volume requirements.',
		price: 140,
		priceLabel: '£140',
		features: [
			'Everything in Growth',
			'API integration',
			'Automated route batching',
			'Automated route optimization',
			'Manage internal fleet payroll',
			'Branded delivery tracking for customers with live ETA',
			'Customized Live customer ETA'
		]
	},
	ENTERPRISE: {
		name: 'enterprise',
		description: 'Built for large organisations looking for the most advanced technology to manage their entire last mile.',
		price: 'Contact Us',
		priceLabel: 'Contact Us',
		features: ['Everything in Pro', 'Fully customised for your organisation', 'Best support SLA', 'Dedicated onboarding']
	}
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
	OFFLINE: 'OFFLINE'
};

export const PLACE_TYPES = {
	ESTABLISHMENT: 'establishment',
	SUB_PREMISE: 'subpremise',
	PREMISE: 'premise',
	STREET_NUMBER: 'street_number',
	STREET_ADDRESS: 'route',
	CITY: 'postal_town',
	POSTCODE: 'postal_code',
	POSTCODE_PREFIX: 'postal_code_prefix',
	INTERSECTION: 'intersection'
};

export const SUBMISSION_TYPES = {
	ASSIGN_DRIVER: 'assign',
	GET_QUOTE: 'quote',
	CREATE_UNASSIGNED: 'unassigned'
};

export const PROVIDER_TYPES = {
	COURIER: 'courier',
	DRIVER: 'driver'
};

export const VEHICLE_CODES = ['BIC', 'MTB', 'CGB', 'CAR', 'VAN'];

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
	ADDISON_LEE: 'addison_lee',
	ABSOLUTELY: 'absolutely',
	HERE_NOW: 'here_now',
	PRIVATE: 'private',
	UNASSIGNED: 'unassigned',
};

export const FLEET_PROVIDERS = ['stuart', 'gophr', 'street_stream', 'ecofleet', 'addison_lee']

export const DELIVERY_TYPES = {
	ON_DEMAND: 'ON_DEMAND',
	SAME_DAY: 'SAME_DAY',
	NEXT_DAY: 'NEXT_DAY',
	MULTI_DROP: 'MULTI_DROP'
};

export const DISPATCH_MODES = {
	AUTO: 'AUTO',
	MANUAL: 'MANUAL'
};

export const DISPATCH_TYPES = {
	DRIVER: 'DRIVER',
	COURIER: 'COURIER'
};

export const BATCH_TYPES = {
	INCREMENTAL: 'INCREMENTAL',
	DAILY: 'DAILY'
};

export const PLATFORMS = {
	SHOPIFY: 'shopify',
	WOOCOMMERCE: 'woocommerce',
	SQUARESPACE: 'squarespace',
	SQUARE: 'square',
	HUBRISE: 'hubrise',
	SECONDS: 'seconds'
}

export const DELIVERY_STRATEGIES = {
	ETA: 'eta',
	PRICE: 'price',
	RATING: 'rating'
};

export const OPTIMIZATION_OBJECTIVES = {
	DURATION: 'less_duration',
	MILEAGE: 'less_mileage',
	COST: 'minimize_cost'
};

export const PERIOD_TYPE = {
	CURRENT: 'current',
	PREVIOUS: 'previous',
}

export const INTEGRATIONS = {
	SHOPIFY: 'shopify',
	WOOCOMMERCE: 'woocommerce',
	SQUARE: 'square',
	SQUARESPACE: 'squarespace',
	HUBRISE: 'hubrise',
	MAGENTO: 'magento',
	FLIPDISH: 'flipdish',
}

export const HUBRISE_ORDER_STATUSES = {
	NEW: 'new',
	RECEIVED: 'received',
	ACCEPTED: 'accepted',
	IN_PREPARATION: 'in_preparation',
	AWAITING_SHIPMENT: 'awaiting_shipment',
	AWAITING_COLLECTION: 'awaiting_collection',
	IN_DELIVERY: 'in_delivery',
	COMPLETED: 'completed',
	REJECTED: 'rejected',
	CANCELLED: 'cancelled',
	DELIVERY_FAILED: 'delivery_failed'
}
