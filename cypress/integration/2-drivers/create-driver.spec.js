/// <reference types="cypress" />
const env = Cypress.env('ENV');
const apiKey = Cypress.env('API_KEY');
const loginURL = `${Cypress.config().baseUrl}/login`;
const adminPassword = Cypress.env('ADMIN_PASSWORD');
const driversPage = `${Cypress.config().baseUrl}/drivers`;
const driverId = Cypress.env('DRIVER_ID');
const DELAY = Number(Cypress.env('DELAY'));

describe('', function(){
	beforeEach(() => {
		cy.fixture(`users/${env}.json`).then((validUser) => {
			cy.login(loginURL, validUser.email, adminPassword, DELAY)
			cy.get('#sidebar-drivers').click();
			cy.url().should('include', '/drivers');
			cy.saveLocalStorage();
		})
	});

	it('Create Driver', function(){
		cy.get('#new-driver-button').click().get('#driver-details-form').should('be.visible').end()
		/*cy.get('#driver-details-form').within(() => {

		})*/
	})
})