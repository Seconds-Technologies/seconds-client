/// <reference types="cypress" />
const env = Cypress.env('ENV');
const apiURL = Cypress.env('API_URL')
const apiKey = Cypress.env('API_KEY')
const loginURL = `${Cypress.config().baseUrl}/login`;
const createPage = `${Cypress.config().baseUrl}/create`;
const adminPassword = Cypress.env('ADMIN_PASSWORD')
const driverId = Cypress.env('DRIVER_ID');
const DELAY = Number(Cypress.env('DELAY'));
const TEN_SECONDS = 10000
const FIVE_SECONDS = 5000

describe('Outsource Orders to Couriers', function () {
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

	afterEach(() => {
		cy.get('#sidebar-orders').click().get('.orders-table').should('be.visible');
		cy.get('.orders-table').should('be.visible')
		cy.get('[data-rowindex="0"]').invoke('attr', 'data-id').then($orderNumber => {
			cy.log($orderNumber)
			cy.request({
				method: 'DELETE',
				url: `${apiURL}/api/v1/jobs/${$orderNumber}`,
				headers: {
					'X-SECONDS-API-KEY': apiKey,
				}
			}).then(resp => cy.log(resp))
		})
	});

	it('On-Demand Delivery', function () {
		cy.get('#create-order-form').within(function () {
			cy.createOnDemandOrder(this.customer, "MTB")
			cy.get('#outsource-courier').click().wait(TEN_SECONDS).end()
		});
		cy.get('#select-quote-0').click().get('#confirm-provider-button').should('be.visible').click().wait(TEN_SECONDS)
		cy.get('#new-delivery-modal').should('be.visible').get('.btn-close').click()
		cy.saveLocalStorage();
	});

	it('Scheduled Delivery', function () {
		cy.restoreLocalStorage();
		cy.visit(createPage)
		const pickupTime = Cypress.dayjs().add(1, 'd').set("h", 8).format('YYYY-MM-DDTHH:mm');
		const dropoffTime = Cypress.dayjs().add(1, 'd').set('h', 16).format('YYYY-MM-DDTHH:mm');
		cy.get('#create-order-form').within(function () {
			cy.createScheduledOrder(this.customer, pickupTime, dropoffTime, "MTB")
			cy.get('#outsource-courier').click().wait(TEN_SECONDS).end()
		});
		cy.get('#select-quote-0').click().get('#confirm-provider-button').should('be.visible').click().wait(TEN_SECONDS)
		cy.get('#new-delivery-modal').should('be.visible').get('.btn-close').click()
		cy.saveLocalStorage();
	});
});
