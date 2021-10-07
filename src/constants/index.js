export const PATHS = {
	HOME: "/home",
	ORDERS: "/orders",
	VIEW_ORDER: "/view-orders",
	CREATE: "/new-order",
	TRACK: "/track-order",
	INTEGRATE: "/integrate",
	SHOPIFY: "/integrate/shopify",
	API_KEY: "/integrate/api",
	DOCUMENTATION: "/documentation",
	PROFILE: "/profile",
	SETTINGS: "/settings",
	HELP: "/help",
	PAYMENT: "/payment",
	SUBSCRIPTION: "/subscription"
}

export const COLOURS = {
	NEW: "#F44336",
	PENDING: "#9933CC",
	DISPATCHING: "#FF7A00",
	EN_ROUTE: "#4285F4",
	COMPLETED: "#00FF19",
	CANCELLED: "#565656",
	UNKNOWN: "#795548"
}

export const STATUS = {
	NEW: "NEW",
	PENDING: "PENDING",
	DISPATCHING: "DISPATCHING",
	EN_ROUTE: "EN-ROUTE",
	COMPLETED: "COMPLETED",
	CANCELLED: "CANCELLED",
}

export const PLACE_TYPES = {
	STREET_NUMBER: "street_number",
	STREET_ADDRESS: "route",
	CITY: "postal_town",
	POSTCODE: "postal_code",
	POSTCODE_PREFIX: "postal_code_prefix"
}


export const STRIPE = {
	CHECKOUT_SESSION: "http://localhost:3001/api/v1/subscription/create-checkout-session",
	PORTAL_SESSION: "http://localhost:3001/api/v1/subscription/create-portal-session"
}