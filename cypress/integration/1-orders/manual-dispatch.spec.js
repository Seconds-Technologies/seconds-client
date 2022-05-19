/// <reference types="cypress" />
const loginURL = `${Cypress.config().baseUrl}/login`;
const env = Cypress.env('ENV');

describe('', function() {
	before(() => {
		cy.visit(loginURL);
		cy.fixture(`users/${env}.json`).as('validUser');
		cy.url().should('include', '/login');
		cy.get('#login-form').within(function() {
			cy.get('#login-email').type(this.validUser.email);
			cy.get('#login-password').type(this.validUser.password);
			cy.root().submit().wait(10000).url().should('include', '/home');
		});
	})

	beforeEach(() => {
		cy.fixture(`users/${env}.json`).as('validUser');
	});

	it('Visit Create Page', function() {
		const user = this.validUser;
		cy.get('#sidebar-create').click()
		cy.url().should('include', '/create')
	});

	it('Create On-Demand Delivery', function() {
		const user = this.validUser;
		const pickupTime = ""
		cy.get('#create-order-form').within(function() {
			cy.get('#on-demand-delivery').check();
			cy.get('#pickup-datetime').type("");
			cy.get('#dropoff-firstname')
		});
	});
});
