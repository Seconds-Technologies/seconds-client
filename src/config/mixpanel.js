import mixpanel from 'mixpanel-browser';
mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN, {
	debug: true,
	ignore_dnt: true
});

let env_check = process.env.REACT_APP_MIXPANEL_ENV === 'production' || process.env.REACT_APP_MIXPANEL_ENV === 'staging';
console.log(env_check)

let actions = {
	identify: (id) => {
		if (env_check) mixpanel.identify(id);
	},
	alias: (id) => {
		if (env_check) mixpanel.alias(id);
	},
	track: (name, props) => {
		if (env_check) mixpanel.track(name, props);
	},
	people: {
		set: (props) => {
			if (env_check) mixpanel.people.set(props);
		},
		increment: (props) => {
			if (env_check) mixpanel.people.increment(props)
		}
	}
};

export let Mixpanel = actions;