// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import 'cypress-localstorage-commands';
import 'cypress-data-session';
import 'cypress-plugin-stripe-elements';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import calendar from 'dayjs/plugin/calendar';

import dayjs from 'dayjs';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(calendar);
dayjs.tz.setDefault('Europe/London');

Cypress.dayjs = dayjs;

// Alternatively you can use CommonJS syntax:
// require('./commands')
Cypress.on('uncaught:exception', (err, runnable, promise) => {
	// when the exception originated from an unhandled promise
	// rejection, the promise is provided as a third argument
	// you can turn off failing the test in this case
	if (promise) {
		return false;
	}
	// we still want to ensure there are no other unexpected
	// errors, so we let them fail the test
});
