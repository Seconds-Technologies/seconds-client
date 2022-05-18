/// <reference types="cypress"/>

const signupURL = `${Cypress.config().baseUrl}/signup`;
const cardNumber = Cypress.env('CARD_NUMBER');
const cardExpiry = Cypress.env('CARD_EXPIRY');
const cardCvc = Cypress.env('CARD_CVC');

describe('Visit Auth Pages', () => {
	it('Navigation links', () => {
		cy.visit(signupURL).url().should('equal', signupURL);
		cy.get('#login-link').click().url().should('include', '/login');
		cy.get('#forgot-password-link').click().url().should('include', '/forgot-password');
	});
});

describe('Failed User Signups', () => {
	beforeEach(() => {
		cy.visit(signupURL);
		cy.fixture('users/invalid.json').as('invalidUsers')
	});

	it('Password too short', function () {
		// access the users property
		const user = this.invalidUsers[0];
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
		const user = this.invalidUsers[0];
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
		const user = this.invalidUsers[0];
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
		const user = this.invalidUsers[0];
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
		const user = this.invalidUsers[0];
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
	beforeEach(() => {
		cy.visit(signupURL);
		cy.fixture('users/valid.json').as('validUsers')
	});

	it('Successful Form submission', function () {
		// access the users property
		// grab a random user from fixture
		const user = this.validUsers[Math.floor(Math.random() * this.validUsers.length)];
		cy.url().should('include', '/signup');
		cy.get('#signup-form').within(function () {
			cy.get('#signup-firstname').type(user.firstname);
			cy.get('#signup-lastname').type(user.lastname);
			cy.get('#signup-email').type(user.email);
			cy.get('#signup-company').type(user.company);
			cy.get('#signup-phone').type(user.phone);
			cy.get('#signup-password').type(user.password);
			cy.get('[type="checkbox"]').check();
			cy.root().submit().wait(10000).url().should('include', '/1');
		});
		cy.get('#signup-product-plans').within(function () {
			cy.get('#connect').click();
			cy.url().should('include', '/2');
		});
		cy.get('#payment-form').within(function() {
			cy.get('#card-holder-name').type(`${user.firstname} ${user.lastname}`);
			cy.get('#card-holder-email').type(user.email);
			cy.fillElementsInput('cardNumber', cardNumber)
			cy.fillElementsInput('cardExpiry', cardExpiry); // MMYY
			cy.fillElementsInput('cardCvc', cardCvc);
			cy.fillElementsInput('postalCode', "RM10 8EH");
			cy.root().submit().wait(10000).url().should('include', '/home')
		})
	});
});
