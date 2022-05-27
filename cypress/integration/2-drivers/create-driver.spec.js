/// <reference types="cypress" />
const env = Cypress.env('ENV');
const apiKey = Cypress.env('API_KEY');
const loginURL = `${Cypress.config().baseUrl}/login`;
const driversPage = `${Cypress.config().baseUrl}/drivers`;
const driverId = Cypress.env('DRIVER_ID');
const DELAY = Number(Cypress.env('DELAY'));
const THREE_SECONDS = 3000;

describe('', function(){
	beforeEach(() => {
		cy.fixture(`users/${env}.json`).as('validUser');
		cy.visit(loginURL);
		cy.url().should('include', '/login');
		cy.get('#login-form').within(function () {
			cy.get('#login-email').type(this.validUser.email);
			cy.get('#login-password').type(this.validUser.password);
			cy.root().submit().wait(THREE_SECONDS).url().should('include', '/home');
		});
		cy.get('#sidebar-drivers').click();
		cy.url().should('include', '/orders');
	});

	it('Create Driver', function(){
		cy.get('#new-driver-button').click().get('#driver-details-form').should('be.visible').end()
		cy.get('#driver-details-form').within(() => {

		})
	})
})