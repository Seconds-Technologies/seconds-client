/// <reference types="cypress" />
const loginURL = `${Cypress.config().baseUrl}/login`;
const env = Cypress.env('ENV');

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
	});

	beforeEach(() => {
		cy.fixture('customer').as('customer');
		cy.restoreLocalStorage();
	});

	afterEach(() => {
		cy.saveLocalStorage();
	});

	it('Visit Create Page', function () {
		cy.get('#sidebar-create').click();
		cy.url().should('include', '/create');
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
			cy.get('#assign-driver').click().wait(10000)
		});
	});

	it('Scheduled Delivery', function () {
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
			cy.get('#assign-driver').click().wait(10000)
		});
	});
});
