/// <reference types="cypress" />
const env = Cypress.env('ENV');
const apiURL = Cypress.env('API_URL');
const serverURL = Cypress.env('SERVER_URL');
const apiKey = Cypress.env('API_KEY');
const adminKey = Cypress.env('ADMIN_ACCESS_KEY');
const adminPassword = Cypress.env('ADMIN_PASSWORD')
const loginURL = `${Cypress.config().baseUrl}/login`;
const createPage = `${Cypress.config().baseUrl}/create`;
const driverId = Cypress.env('DRIVER_ID');
const DELAY = Number(Cypress.env('DELAY'));
const THREE_SECONDS = 3000;
const ONE_SECOND = 1000;

describe.skip('Analyse orders', function () {
	before(() => {
		cy.fixture(`users/${env}.json`).as('validUser');
		cy.visit(loginURL);
		cy.url().should('include', '/login');
		cy.get('#login-form').within(function () {
			cy.get('#login-email').type(this.validUser.email);
			cy.get('#login-password').type(this.validUser.password);
			cy.root().submit().wait(10000).url().should('include', '/home');
		});
		cy.get('#sidebar-orders').click();
		cy.url().should('include', '/orders');
	});

	it('Fetch first order', function () {
		cy.get('.orders-table').should('be.visible');
		cy.get('[data-rowindex="0"]')
			.invoke('attr', 'data-id')
			.then($orderNumber => {
				cy.log($orderNumber);
				cy.request({
					method: 'DELETE',
					url: `${apiURL}/api/v1/jobs/${$orderNumber}`,
					headers: {
						'X-SECONDS-API-KEY': apiKey
					}
				}).then(resp => cy.log(resp));
			});
		cy.saveLocalStorage();
	});
});

describe('Assign Orders to Drivers', function () {
	before(() => {
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
		cy.get('.orders-table').should('be.visible');
		cy.get('[data-rowindex="0"]')
			.invoke('attr', 'data-id')
			.then($orderNumber => {
				cy.log($orderNumber);
				cy.request({
					method: 'DELETE',
					url: `${apiURL}/api/v1/jobs/${$orderNumber}`,
					headers: {
						'X-SECONDS-API-KEY': apiKey
					}
				}).then(resp => cy.log(resp));
			});
	});

	after(function () {
		cy.fixture(`users/${env}.json`).then(validUser => {
			cy.log(validUser);
			// call endpoint to delete all cancelled orders for the current customer
			cy.request({
				headers: {
					Authorization: adminKey
				},
				method: 'DELETE',
				url: `${serverURL}/server/admin/orders/remove-cancelled`,
				qs: {
					email: validUser.email
				}
			}).then(resp => cy.log(resp));
		});
	});

	it('On-Demand Delivery', function () {
		cy.get('#create-order-form').within(function () {
			cy.createOnDemandOrder(this.customer, 'MTB');
			cy.get('#assign-driver').click().wait(THREE_SECONDS);
		});
		cy.get(`#${driverId}`).should('be.visible').click().wait(ONE_SECOND).end();
		cy.get('#confirm-provider-button').should('be.visible').click().wait(THREE_SECONDS);
		cy.get('#new-delivery-modal').should('be.visible').get('.btn-close').click();
		cy.saveLocalStorage();
	});

	it('Scheduled Delivery', function () {
		cy.restoreLocalStorage();
		cy.visit(createPage);
		const pickupTime = Cypress.dayjs().add(1, 'h').format('YYYY-MM-DDTHH:mm');
		const dropoffTime = Cypress.dayjs().add(3, 'h').format('YYYY-MM-DDTHH:mm');
		cy.get('#create-order-form').within(function () {
			cy.createScheduledOrder(this.customer, pickupTime, dropoffTime, 'MTB');
			cy.get('#assign-driver').click().wait(THREE_SECONDS);
		});
		cy.get(`#${driverId}`).should('be.visible').click().wait(ONE_SECOND);
		cy.get('#confirm-provider-button').should('be.visible').click().wait(THREE_SECONDS).end();
		cy.get('#new-delivery-modal').should('be.visible').get('.btn-close').click();
		cy.saveLocalStorage();
	});
});
