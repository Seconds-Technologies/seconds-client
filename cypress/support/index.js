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
import './commands'
import "cypress-localstorage-commands";
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

Cypress.dayjs = dayjs

Cypress.Commands.add('createOnDemandOrder', function(customer, vehicleCode) {
	cy.get('#on-demand-delivery').check();
	cy.get('#items-count').type('5');
	cy.get('#vehicle-type').type(`${vehicleCode}{enter}`);
	cy.get('#dropoff-first-name').type(customer.firstname);
	cy.get('#dropoff-last-name').type(customer.lastname);
	cy.get('#dropoff-email-address').type(customer.email);
	cy.get('#dropoff-phone-number').type(customer.phone);
	cy.get('#dropoff-address-line-1').type(customer.addressLine1);
	cy.get('#dropoff-city').type(customer.city);
	cy.get('#dropoff-postcode').type(customer.postcode);
	cy.get('#dropoff-instructions').type('Ring door bell');
})

Cypress.Commands.add('createScheduledOrder', function(customer, pickupTime, dropoffTime, vehicleCode) {
	cy.get('#scheduled-same-day').check();
	cy.get('#pickup-datetime').type(pickupTime);
	cy.get('#items-count').type('5');
	cy.get('#vehicle-type').type(`${vehicleCode}{enter}`);
	cy.get('#dropoff-first-name').type(customer.firstname);
	cy.get('#dropoff-last-name').type(customer.lastname);
	cy.get('#dropoff-email-address').type(customer.email);
	cy.get('#dropoff-phone-number').type(customer.phone);
	cy.get('#dropoff-address-line-1').type(customer.addressLine1);
	cy.get('#dropoff-city').type(customer.city);
	cy.get('#dropoff-postcode').type(customer.postcode);
	cy.get('#dropoff-datetime').type(dropoffTime);
	cy.get('#dropoff-instructions').type('Ring door bell');
})
// Alternatively you can use CommonJS syntax:
// require('./commands')
Cypress.on('uncaught:exception', (err, runnable, promise) => {
	// when the exception originated from an unhandled promise
	// rejection, the promise is provided as a third argument
	// you can turn off failing the test in this case
	if (promise) {
		return false
	}
	// we still want to ensure there are no other unexpected
	// errors, so we let them fail the test
})
