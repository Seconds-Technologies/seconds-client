import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN, {
	debug: process.env.NODE_ENV !== 'production',
	ignore_dnt: true
});

let env_check = process.env.NODE_ENV === 'production';
console.log(env_check);

let actions = {
	identify: id => {
		if (env_check) mixpanel.identify(id);
	},
	alias: id => {
		if (env_check) mixpanel.alias(id);
	},
	track: (name, props) => {
		if (env_check) mixpanel.track(name, props);
	},
	track_forms: (element, event, props) => {
		if (env_check) mixpanel.track_forms(element, event, props);
	},
	track_links: (element, description, props = {}) => {
		if (env_check) mixpanel.track_links(element, description, props);
	},
	people: {
		set: props => {
			if (env_check) mixpanel.people.set(props);
		},
		setOnce: props => {
			if (env_check) mixpanel.people.set_once(props);
		},
		increment: name => {
			if (env_check) mixpanel.people.increment(name);
		}
	}
};

export let Events = {
	REGISTRATION: 'Registration',
	LOGIN: 'Login',
	ADD_PAYMENT_METHOD: 'Add Payment Method',
	NEW_SUBSCRIPTION: 'New Subscription',
	CANCEL_SUBSCRIPTION: 'Cancel Subscription',
	UPDATE_PROFILE: 'Update Profile',
	UPLOAD_PROFILE_IMAGE: 'Upload Profile Image',
	FORGOT_PASSWORD: 'Forgot Password',
	PASSWORD_RESET: 'Password Reset',
	ASSIGN_DRIVER_JOB: 'Assign Driver Job',
	OUTSOURCE_COURIER_JOB: 'Outsource Courier Job',
	DISPATCH_UNASSIGNED_JOB: 'Dispatch Unassigned Job',
	ROUTE_OPTIMIZATION: 'Route Optimization',
	FETCH_COURIER_QUOTES: 'Fetch Courier Quotes',
	UPDATE_JOB: 'Update Job'
}

export let Types = {
	COMPLETE: 'COMPLETE',
	INCOMPLETE: 'INCOMPLETE',
	SUCCESS: 'SUCCESS',
	FAILURE: 'FAILURE'
}

export let Mixpanel = actions;