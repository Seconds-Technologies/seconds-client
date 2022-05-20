/// <reference types="cypress" />
const env = Cypress.env('ENV');
const apiURL = Cypress.env('API_URL')
const apiKey = Cypress.env('API_KEY')
const loginURL = `${Cypress.config().baseUrl}/login`;
const driverId = Cypress.env('DRIVER_ID');
const THREE_SECONDS = 3000
const ONE_SECOND = 1000

describe.only('Analyse orders', function() {
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

	it('Fetch first order', function() {
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
		cy.saveLocalStorage();
	})
})

describe('Assign Orders to Drivers', function () {
	before(() => {
		cy.fixture(`users/${env}.json`).as('validUser');
		cy.visit(loginURL);
		cy.url().should('include', '/login');
		cy.get('#login-form').within(function () {
			cy.get('#login-email').type(this.validUser.email);
			cy.get('#login-password').type(this.validUser.password);
			cy.root().submit().wait(10000).url().should('include', '/home');
		});
		cy.get('#sidebar-create').click();
		cy.url().should('include', '/create');
	});

	beforeEach(() => {
		cy.fixture('customer').as('customer');
		cy.restoreLocalStorage();
	});

	afterEach(() => {
		cy.get('.orders-table').should('be.visible')
		cy.get('[data-row-index="0"]').then($order => {
			const orderNumber = $order.attr('data-id')
			cy.log(orderNumber)
		})
		cy.saveLocalStorage();
	});

	it('On-Demand Delivery', function () {
		cy.get('#create-order-form').within(function () {
			cy.get('#on-demand-delivery').check();
			cy.get('#items-count').type('5');
			cy.get('#vehicle-type').type('BIC{enter}');
			cy.get('#dropoff-first-name').type(this.customer.firstname);
			cy.get('#dropoff-last-name').type(this.customer.lastname);
			cy.get('#dropoff-email-address').type(this.customer.email);
			cy.get('#dropoff-phone-number').type(this.customer.phone);
			cy.get('#dropoff-address-line-1').type(this.customer.addressLine1);
			cy.get('#dropoff-city').type(this.customer.city);
			cy.get('#dropoff-postcode').type(this.customer.postcode);
			cy.get('#dropoff-instructions').type('Ring door bell');
			cy.get('#assign-driver').click().wait(THREE_SECONDS)
		});
		cy.get(`#${driverId}`).should('be.visible').click().wait(ONE_SECOND)
		cy.get('#confirm-provider-button').should('be.visible').click().wait(THREE_SECONDS).end()
		cy.get('#new-delivery-modal').should('be.visible').click()
	});

	it.skip('Scheduled Delivery', function () {
		cy.reload()
		const pickupTime = Cypress.dayjs().add(1, 'h').format('YYYY-MM-DDTHH:mm');
		const dropoffTime = Cypress.dayjs().add(3, 'h').format('YYYY-MM-DDTHH:mm');
		cy.get('#create-order-form').within(function () {
			cy.get('#scheduled-same-day').check();
			cy.get('#pickup-datetime').type(pickupTime);
			cy.get('#items-count').type('5');
			cy.get('#vehicle-type').type('BIC{enter}');
			cy.get('#dropoff-first-name').type(this.customer.firstname);
			cy.get('#dropoff-last-name').type(this.customer.lastname);
			cy.get('#dropoff-email-address').type(this.customer.email);
			cy.get('#dropoff-phone-number').type(this.customer.phone);
			cy.get('#dropoff-address-line-1').type(this.customer.addressLine1);
			cy.get('#dropoff-address-line-2').type('');
			cy.get('#dropoff-city').type(this.customer.city);
			cy.get('#dropoff-postcode').type(this.customer.postcode);
			cy.get('#dropoff-datetime').type(dropoffTime);
			cy.get('#dropoff-instructions').type('Ring door bell');
			cy.get('#assign-driver').click().wait(THREE_SECONDS)
		});
		cy.get(`#${driverId}`).should('be.visible').click().wait(ONE_SECOND)
		cy.get('#confirm-provider-button').should('be.visible').click().wait(THREE_SECONDS).end()
		cy.get('#new-delivery-modal').should('be.visible')
	});
});
