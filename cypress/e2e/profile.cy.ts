describe('Profile Page', () => {
  it('should allow the user to change their name and email', () => {
    cy.visit('/login');

    cy.get('#username').type('User1');
    cy.get('#password').type('user1pass');

    cy.get('button[type="submit"]').click();
    cy.url().should("eq", Cypress.config().baseUrl + '/');

    cy.visit('/profile');

    cy.get('label').contains('Username:').should('be.visible');
    cy.get('label').contains('Name:').should('be.visible');
    cy.get('label').contains('Email:').should('be.visible');

    cy.get('input#email').should('have.attr', 'readonly');
    cy.get('input#username').should('have.attr', 'readonly');

    cy.get('input#name').clear().type('examplename');

    cy.get('button[data-testid="save-button"]').click();

    cy.url().should('include', '/profile');

    
    cy.contains('User1').should('be.visible');
    cy.contains('examplename').should('be.visible');

    cy.contains('user1@example.com').should('be.visible');

    cy.get('input#name').clear().type('User1');

    cy.get('button[data-testid="save-button"]').click();

    cy.url().should('include', '/profile');

    cy.contains('User1').should('be.visible');

  });
});