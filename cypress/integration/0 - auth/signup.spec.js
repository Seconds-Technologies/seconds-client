/// <reference types="cypress"/>

const signupURL = `${Cypress.config().baseUrl}/signup`;
const loginURL = `${Cypress.config().baseUrl}/login`;
console.log(signupURL, loginURL);

describe.only('Visit Auth Pages', () => {
	it('Navigation links', () => {
		cy.visit(signupURL).url().should('equal', signupURL);
		cy.get('#login-link').click().url().should('include', '/login');
		cy.get('#forgot-password-link').click().url().should('include', '/forgot-password');
	});
});

describe('Failed User Signups', () => {
	beforeEach(() => {
		cy.visit(signupURL);
		cy.fixture('users').as('users');
	});

	it('Password too short', function () {
		// access the users property
		const user = this.users[1];
		cy.location('href').should('equal', signupURL);
		cy.get('#signup-form').within(function () {
			cy.get('#signup-firstname').type(user.firstname);
			cy.get('#signup-lastname').type(user.lastname);
			cy.get('#signup-email').type(user.email);
			cy.get('#signup-company').type(user.company);
			cy.get('#signup-phone').type(user.phone);
			cy.get('#signup-password').type(user.password);
			cy.get('[type="checkbox"]').check();
			cy.root().submit().wait(1000).location('href').should('equal', signupURL);
		});
	});

	it('Missing email', function () {
		// access the users property
		const user = this.users[1];
		cy.location('href').should('equal', signupURL);
		cy.get('#signup-form').within(function () {
			cy.get('#signup-firstname').type(user.firstname);
			cy.get('#signup-lastname').type(user.lastname);
			cy.get('#signup-company').type(user.company);
			cy.get('#signup-phone').type(user.phone);
			cy.get('#signup-password').type(user.password);
			cy.get('[type="checkbox"]').check();
			cy.root().submit().wait(1000).location('href').should('equal', signupURL);
		});
	});

	it('Missing Company', function () {
		// access the users property
		const user = this.users[1];
		cy.location('href').should('equal', signupURL);
		cy.get('#signup-form').within(function () {
			cy.get('#signup-firstname').type(user.firstname);
			cy.get('#signup-lastname').type(user.lastname);
			cy.get('#signup-email').type(user.email);
			cy.get('#signup-phone').type(user.phone);
			cy.get('#signup-password').type(user.password);
			cy.get('[type="checkbox"]').check();
			cy.root().submit().wait(1000).location('href').should('equal', signupURL);
		});
	});

	it('Missing phone', function () {
		// access the users property
		const user = this.users[1];
		cy.location('href').should('equal', signupURL);
		cy.get('#signup-form').within(function () {
			cy.get('#signup-firstname').type(user.firstname);
			cy.get('#signup-lastname').type(user.lastname);
			cy.get('#signup-email').type(user.email);
			cy.get('#signup-company').type(user.company);
			cy.get('#signup-password').type(user.password);
			cy.get('[type="checkbox"]').check();
			cy.root().submit().wait(1000).location('href').should('equal', signupURL);
		});
	});

	it('Missing password', function () {
		// access the users property
		const user = this.users[1];
		cy.location('href').should('equal', signupURL);
		cy.get('#signup-form').within(function () {
			cy.get('#signup-firstname').type(user.firstname);
			cy.get('#signup-lastname').type(user.lastname);
			cy.get('#signup-email').type(user.email);
			cy.get('#signup-company').type(user.company);
			cy.get('#signup-phone').type(user.phone);
			cy.get('[type="checkbox"]').check();
			cy.root().submit().wait(1000).location('href').should('equal', signupURL);
		});
	});
});

describe('Successful signup flow', () => {
	before(() => {
		cy.fixture('users').as('users');
	});

	beforeEach(() => {
		cy.visit(signupURL);
	});

	it('Successful Form submission', function () {
		// access the users property
		const user = this.users[0];
		cy.location('href').should('equal', signupURL);
		cy.get('#signup-form').within(function () {
			cy.get('#signup-firstname').type(user.firstname);
			cy.get('#signup-lastname').type(user.lastname);
			cy.get('#signup-email').type(user.email);
			cy.get('#signup-company').type(user.company);
			cy.get('#signup-phone').type(user.phone);
			cy.get('#signup-password').type(user.password);
			cy.get('[type="checkbox"]').check();
			cy.root().submit().wait(3000).url().should('include', '/1');
		});
		cy.get('#signup-product-plans').within(function () {
			cy.get('#connect').click();
			cy.url().should('include', '/2');
		});
	});
});

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
