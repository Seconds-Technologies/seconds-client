// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', function(loginURL, email, password, delay=3000) {
	cy.visit(loginURL);
	cy.url().should('include', '/login');
	cy.get('#login-form').within(function() {
		cy.get('#login-email').type(email);
		cy.get('#login-password').type(password);
		cy.root().submit().wait(delay).url().should('include', '/home');
	})
});

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
});

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
});

Cypress.Commands.add('createNewDriver', function(driver, delay) {
	cy.get('#driver-details-form').within(() => {
		cy.get('#driver-first-name').type(driver.firstname)
		cy.get('#driver-last-name').type(driver.lastname)
		cy.get('#driver-phone').type(driver.phone)
		cy.get('#driver-email').type(driver.email)
		cy.get('#driver-motorbike').click()
		cy.root().submit().wait(delay)
	})
})
