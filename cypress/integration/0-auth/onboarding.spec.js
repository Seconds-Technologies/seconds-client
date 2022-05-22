/// <reference types="cypress"/>
import 'cypress-localstorage-commands';

const signupURL = `${Cypress.config().baseUrl}/signup`;
const landingPageURL = Cypress.env('LANDING_PAGE_URL');
const serverURL = Cypress.env('SERVER_URL');
const cardNumber = Cypress.env('CARD_NUMBER');
const cardExpiry = Cypress.env('CARD_EXPIRY');
const cardCvc = Cypress.env('CARD_CVC');

function cleanup() {
	cy.restoreLocalStorage();
	const email = this.user.email;
	cy.getLocalStorage('jwt_token').then(jwtToken => {
		cy.log(jwtToken);
		cy.request({
			method: 'DELETE',
			url: `${serverURL}/server/auth/delete`,
			qs: { email: email },
			headers: { Authorization: 'Bearer ' + jwtToken },
			body: null
		}).then((response) => {
			cy.log(response);
		});
	});
	cy.get('#sidebar-dropdown').click().get('#menu-item-logout').click();
}

describe('Visit Auth Pages', () => {
	it('Navigation links', () => {
		cy.visit(signupURL).url().wait(1000).should('equal', signupURL);
		cy.get('#login-link').click().wait(1000).url().should('include', '/login');
		cy.get('#forgot-password-link').click().wait(1000).url().should('include', '/forgot-password');
	});
});

describe('Failed User Signups', () => {
	beforeEach(() => {
		cy.visit(signupURL);
		cy.fixture('users/invalid.json').as('invalidUsers');
	});

	it('Password too short', function() {
		// access the users property
		const user = this.invalidUsers[0];
		cy.location('href').should('equal', signupURL);
		cy.get('#signup-form').within(function() {
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

	it('Missing email', function() {
		// access the users property
		const user = this.invalidUsers[0];
		cy.location('href').should('equal', signupURL);
		cy.get('#signup-form').within(function() {
			cy.get('#signup-firstname').type(user.firstname);
			cy.get('#signup-lastname').type(user.lastname);
			cy.get('#signup-company').type(user.company);
			cy.get('#signup-phone').type(user.phone);
			cy.get('#signup-password').type(user.password);
			cy.get('[type="checkbox"]').check();
			cy.root().submit().wait(1000).location('href').should('equal', signupURL);
		});
	});

	it('Missing Company', function() {
		// access the users property
		const user = this.invalidUsers[0];
		cy.location('href').should('equal', signupURL);
		cy.get('#signup-form').within(function() {
			cy.get('#signup-firstname').type(user.firstname);
			cy.get('#signup-lastname').type(user.lastname);
			cy.get('#signup-email').type(user.email);
			cy.get('#signup-phone').type(user.phone);
			cy.get('#signup-password').type(user.password);
			cy.get('[type="checkbox"]').check();
			cy.root().submit().wait(1000).location('href').should('equal', signupURL);
		});
	});

	it('Missing phone', function() {
		// access the users property
		const user = this.invalidUsers[0];
		cy.location('href').should('equal', signupURL);
		cy.get('#signup-form').within(function() {
			cy.get('#signup-firstname').type(user.firstname);
			cy.get('#signup-lastname').type(user.lastname);
			cy.get('#signup-email').type(user.email);
			cy.get('#signup-company').type(user.company);
			cy.get('#signup-password').type(user.password);
			cy.get('[type="checkbox"]').check();
			cy.root().submit().wait(1000).location('href').should('equal', signupURL);
		});
	});

	it('Missing password', function() {
		// access the users property
		const user = this.invalidUsers[0];
		cy.location('href').should('equal', signupURL);
		cy.get('#signup-form').within(function() {
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

describe('Successful User Signup', () => {
	beforeEach(function() {
		cy.visit(signupURL);
		cy.fixture('users/valid.json').then($users => {
			const index = Math.floor(Math.random() * $users.length);
			cy.log($users[index]).wrap($users[index]).as('user');
		});
	});

	after(cleanup);

	it('Successful Form submission', function() {
		// access the users property
		// grab a random user from fixture
		cy.url().should('include', '/signup');
		cy.get('#signup-form').within(function() {
			cy.get('#signup-firstname').type(this.user.firstname);
			cy.get('#signup-lastname').type(this.user.lastname);
			cy.get('#signup-email').type(this.user.email);
			cy.get('#signup-company').type(this.user.company);
			cy.get('#signup-phone').type(this.user.phone);
			cy.get('#signup-password').type(this.user.password);
			cy.get('[type="checkbox"]').check();
			cy.root().submit().wait(10000).url().should('include', '/1');
			cy.saveLocalStorage();
		});
		cy.get('#signup-product-plans').within(function() {
			cy.get('#growth').click();
			cy.url().should('include', '/2');
		});
		cy.get('#payment-form').within(function() {
			cy.get('#card-holder-name').type(`${this.user.firstname} ${this.user.lastname}`);
			cy.get('#card-holder-email').type(this.user.email);
			cy.fillElementsInput('cardNumber', cardNumber);
			cy.fillElementsInput('cardExpiry', cardExpiry); // MMYY
			cy.fillElementsInput('cardCvc', cardCvc);
			cy.fillElementsInput('postalCode', 'RM10 8EH');
			cy.root().submit().wait(10000).url().should('include', '/home');
		});
		cy.get('#create-location-form').within(function() {
			cy.get('#location-name').type('Seconds HQ');
			cy.get('#business-name').type(this.user.company);
			cy.get('#street-address').type(this.user.streetName);
			cy.get('#street-number').type(this.user.streetNumber);
			cy.get('#city').type(this.user.city);
			cy.get('#postcode').type(this.user.postcode);
			cy.root().submit().wait(5000).get('#create-location-form').should('not.exist');
		});
	});
});

describe('Successful Onboarding flow', () => {
	beforeEach(function() {
		cy.visit(landingPageURL);
		cy.fixture('users/valid.json').then($users => {
			const index = Math.floor(Math.random() * $users.length);
			cy.log($users[index]).wrap($users[index]).as('user');
		});
	});

	after(cleanup);

	it('Getting-started form complete', function() {
		// access the users property
		// grab a random user from fixture
		// check correct URL
		cy.url().should('include', landingPageURL);
		cy.get('#getting-started-button').click().wait(500).get('#getting-started-form').should('be.visible');
		cy.get('#getting-started-form').within(function() {
			cy.get('#first-name').type(this.user.firstname);
			cy.get('#last-name').type(this.user.lastname);
			cy.get('#email-address').type(this.user.email);
			cy.get('#phone-number').type(this.user.phone);
			cy.get('#company').type(this.user.company);
			cy.get('#business-type').select('Restaurant');
			cy.get('#business-role').type('Owner');
			cy.get('#average-deliveries-per-week').type('100');
			cy.root().submit().wait(10000).url().should('include', signupURL);
			cy.saveLocalStorage();
		});
		cy.get('#signup-form').within(function() {
			cy.get('#signup-password').type(this.user.password);
			cy.get('[type="checkbox"]').check();
			cy.root().submit().wait(10000).url().should('include', '/1');
		});
		cy.get('#signup-product-plans').within(function() {
			cy.get('#growth').click();
			cy.url().should('include', '/2');
		});
		cy.get('#payment-form').within(function() {
			cy.get('#card-holder-name').type(`${this.user.firstname} ${this.user.lastname}`);
			cy.get('#card-holder-email').type(this.user.email);
			cy.fillElementsInput('cardNumber', cardNumber);
			cy.fillElementsInput('cardExpiry', cardExpiry); // MMYY
			cy.fillElementsInput('cardCvc', cardCvc);
			cy.fillElementsInput('postalCode', 'RM10 8EH');
			cy.root().submit().wait(10000).url().should('include', '/home');
		});
		cy.get('#create-location-form').within(function() {
			cy.get('#location-name').type('Seconds HQ');
			cy.get('#business-name').type(this.user.company);
			cy.get('#street-address').type(this.user.streetName);
			cy.get('#street-number').type(this.user.streetNumber);
			cy.get('#city').type(this.user.city);
			cy.get('#postcode').type(this.user.postcode);
			cy.root().submit().wait(5000).get('#create-location-form').should('not.exist');
		});
	});
});

