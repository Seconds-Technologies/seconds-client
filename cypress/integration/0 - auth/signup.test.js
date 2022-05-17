/// <reference types="cypress"/>

describe('Visit Signup Page', () => {
	it('Signup Page', () => {
		cy.visit("http://localhost:3000/signup")
	})
})

describe.only('User signup flow', () => {
	beforeEach(() => {
		cy.visit("http://localhost:3000/signup")
		cy.fixture('users').as('users')
	})

	it('Enter user information', function() {
		// access the users property
		const user = this.users[0]
		cy.location('href').should('equal', 'http://localhost:3000/signup')
		cy.get('#signup-form').within(() => {
			cy.get('#signup-firstname').type(user.firstname)
			cy.get('#signup-lastname').type(user.lastname)
			cy.get('#signup-email').type(user.email)
			cy.get('#signup-company').type(user.company)
			cy.get('#signup-phone').type(user.phone)
			cy.get('#signup-password').type(user.password)
			cy.get('[type="checkbox"]').check()
			cy.get('#signup-button').click()
		})
	})
})