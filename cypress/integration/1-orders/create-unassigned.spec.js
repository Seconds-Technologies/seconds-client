/// <reference types="cypress" />
const env = Cypress.env('ENV');
const apiKey = Cypress.env('API_KEY');
const adminPassword = Cypress.env('ADMIN_PASSWORD');
const loginURL = `${Cypress.config().baseUrl}/login`;
const createPage = `${Cypress.config().baseUrl}/create`;
const driverId = Cypress.env('DRIVER_ID');
const DELAY = Number(Cypress.env('DELAY'));
const THREE_SECONDS = 3000;

describe('Create Unassigned Orders', function(){
	before(function() {
		cy.fixture(`users/${env}.json`).then((validUser) => {
			cy.login(loginURL, validUser.email, adminPassword, DELAY)
			cy.get('#sidebar-create').click();
			cy.url().should('include', '/create');
			cy.saveLocalStorage();
		})
	});

	beforeEach(() => {
		cy.fixture('customer').as('customer');
	});

	it('On Demand Delivery', function(){
		cy.get('#create-order-form').within(function () {
			cy.createOnDemandOrder(this.customer, 'MTB');
			cy.get('#assign-driver').click().wait(THREE_SECONDS);
		});
		cy.get(`#create-unassigned`).should('be.visible').click().wait(THREE_SECONDS).end();
		cy.get('#new-delivery-modal').should('be.visible').get('.btn-close').click();
		cy.saveLocalStorage();
	})

	it('Scheduled Delivery', function () {
		cy.restoreLocalStorage();
		cy.visit(createPage);
		const pickupTime = Cypress.dayjs().add(1, 'h').format('YYYY-MM-DDTHH:mm');
		const dropoffTime = Cypress.dayjs().add(3, 'h').format('YYYY-MM-DDTHH:mm');
		cy.get('#create-order-form').within(function () {
			cy.createScheduledOrder(this.customer, pickupTime, dropoffTime, 'MTB');
			cy.get('#assign-driver').click().wait(THREE_SECONDS);
		});
		cy.get(`#create-unassigned`).should('be.visible').click().wait(THREE_SECONDS);
		cy.get('#new-delivery-modal').should('be.visible').get('.btn-close').click();
		cy.saveLocalStorage();
	});
})