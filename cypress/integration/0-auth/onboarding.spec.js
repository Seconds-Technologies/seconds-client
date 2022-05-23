/// <reference types="cypress"/>
import 'cypress-localstorage-commands';

const signupURL = `${Cypress.config().baseUrl}/signup`;
const signupURL1 = `${Cypress.config().baseUrl}/signup/1`;
const landingPageURL = Cypress.env('LANDING_PAGE_URL');
const serverURL = Cypress.env('SERVER_URL');
const cardNumber = Cypress.env('CARD_NUMBER');
const cardExpiry = Cypress.env('CARD_EXPIRY');
const cardCvc = Cypress.env('CARD_CVC');
const delay = Cypress.env('DELAY');

function cleanup() {
	cy.restoreLocalStorage();
	const email = this.user.email;
	cy.getLocalStorage('jwt_token').then(function(jwtToken){
		cy.log(jwtToken);
		cy.request({
			method: 'DELETE',
			url: `${serverURL}/server/auth/delete`,
			qs: {
				"email": email
			},
			headers: { Authorization: 'Bearer ' + jwtToken },
			body: null
		}).then((response) => {
			cy.log(response);
		});
	});
	cy.get('#sidebar-dropdown').click().get('#menu-item-logout').click();
}

describe('Onboarding flow', () => {
	before(function() {
		cy.visit(landingPageURL);
	});

	beforeEach(function () {
		cy.fixture('users/valid.json').then($users => {
			const index = Math.floor(Math.random() * $users.length);
			cy.log($users[index]).wrap($users[index]).as('user');
		});
	})

	after(cleanup);

	it('Successful onboarding', function() {
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
			cy.root().submit().wait(delay).url().should('contain', signupURL);
			cy.saveLocalStorage();
		});
		cy.get('#signup-form').within(function() {
			cy.get('#signup-password').type(this.user.password);
			cy.get('[type="checkbox"]').check();
			cy.root().submit().wait(delay).url().should('include', '/1');
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


