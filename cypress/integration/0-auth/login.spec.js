/// <reference types="cypress"/>
const loginURL = `${Cypress.config().baseUrl}/login`;
const env = Cypress.env('ENV');
const adminPassword = Cypress.env('ADMIN_PASSWORD')

describe('Failed Login', () => {
	beforeEach(() => {
		cy.visit(loginURL);
		cy.fixture('users/invalid.json').as('invalidUsers');
		cy.fixture(`users/${env}.json`).as('validUser');
	});

	it('Invalid Email / Password', function () {
		// access the users property
		const user = this.invalidUsers[0];
		cy.url().should('include', '/login');
		cy.get('#login-form').within(function () {
			cy.get('#login-email').type(user.email);
			cy.get('#login-password').type(user.password);
			cy.root().submit().wait(3000).url().should('include', '/login');
		});
	});

	it('Successful Login', function () {
		// access the users property
		const user = this.validUser;
		cy.url().should('include', '/login');
		cy.get('#login-form').within(function () {
			cy.get('#login-email').type(user.email);
			cy.get('#login-password').type(adminPassword);
			cy.root().submit().wait(10000).url().should('include', '/home');
		});
	});
});