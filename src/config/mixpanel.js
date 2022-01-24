import mixpanel from 'mixpanel-browser';
mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN, {
	debug: true,
	ignore_dnt: true
});

let env_check = process.env.NODE_ENV === 'production';
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
	track_links: (element, description, props={}) => {
		if (env_check) mixpanel.track_links(element, description, props)
	},
	people: {
		set: (props) => {
			if (env_check) mixpanel.people.set(props);
		},
		setOnce: (props) => {
			if (env_check) mixpanel.people.set_once(props)
		},
		increment: (name) => {
			if (env_check) mixpanel.people.increment(name)
		}
	}
};

export let Mixpanel = actions;