describe('Login Page', () => {
  beforeEach(() => {

    cy.visit('/login');
  });

  it('wrong password shows invalid username or password message', () => {

    cy.get('#username').type('testuser');
    cy.get('#password').type('badpassword');

    cy.get('button[type="submit"]').click();

    cy.contains('Invalid username or password').should('be.visible');
  });

  it('log in with test user, expect successfull login and redirection to home page', () => {

    cy.get('#username').type('testuser');
    cy.get('#password').type('testuser');

    cy.get('button[type="submit"]').click();

    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});