/// <reference types="cypress"/>
const loginURL = `${Cypress.config().baseUrl}/login`;

describe('Failed Login', () => {
	beforeEach(() => {
		cy.visit(loginURL);
		cy.fixture('users').as('users');
	});

	it('Invalid Email / Password', function () {
		// access the users property
		const user = this.users[0];
		cy.location('href').should('include', '/login');
		cy.get('#login-form').within(function () {
			cy.get('#login-email').type(user.email);
			cy.get('#login-password').type(user.password);
			cy.root().submit().wait(3000).url().should('include', '/login');
		});
	});
});