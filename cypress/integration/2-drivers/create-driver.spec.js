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
		cy.fixture(`drivers.json`).as('driver')
		cy.fixture(`users/${env}.json`).then(validUser => {
			cy.login(loginURL, validUser.email, adminPassword, DELAY)
			cy.get('#sidebar-drivers').click();
			cy.url().should('include', '/drivers');
			cy.saveLocalStorage();
		})
	});

	afterEach(() => {
		cy.get('[data-rowindex="0"] > [data-field="action"] > div > #delete-driver').click().wait(DELAY);
		cy.get('.modal-content').should('be.visible').get('#confirm-delete').click()
	});

	it('Create Driver', function(){
		cy.get('#new-driver-button').click().get('#driver-details-form').should('be.visible').end()
		cy.createNewDriver(this.driver, DELAY);
		cy.get('.drivers-table').should('be.visible');
		cy.get('[data-rowindex="0"] > [data-field="phone"]').then($cell => cy.wrap($cell.text()).should('eq', this.driver.phone))
	})

	it('Update Driver', function(){
		cy.get('#new-driver-button').click().get('#driver-details-form').should('be.visible').end()
		cy.updateDriver(this.driver, DELAY);
		cy.get('.drivers-table').should('be.visible');
		cy.get('[data-rowindex="0"] > [data-field="phone"]').then($cell => cy.wrap($cell.text()).should('eq', this.driver.phone))
	})
})