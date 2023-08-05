describe('template spec', () => {
  beforeEach(() => {
    // log in
    cy.visit('/login');

    cy.get('#username').type('testuser');
    cy.get('#password').type('testuser');

    cy.get('button[type="submit"]').click();
    
    cy.url().should("eq", Cypress.config().baseUrl + '/');;
  });

  it('publish a post', () => {
    cy.visit('/create');

    // create some title and content for the post
    const title = 'Some title'
    const content = 'Some content'
  
    // fill title and content, create button disabled as long as one of them is empty
    cy.get('input[type="submit"]').should('be.disabled');
    cy.get('input[type="text"]').type(title);
    cy.get('input[type="submit"]').should('be.disabled');
    cy.get('textarea').type(content);
    
    // title and content were filled- create button should be enabled
    cy.get('input[type="submit"]').should('be.enabled');

    cy.get('input[type="submit"]').click();

    cy.url().should("eq", Cypress.config().baseUrl + '/drafts');
  
    // filled data is visible on drafts page
    cy.get('div').contains(title).should('be.visible');
    cy.get('div').contains(content).should('be.visible');


    cy.get(".post").contains(title).first().click();

    cy.contains("Publish").click();

    cy.get(".post").first().contains(title).should('be.visible');
    cy.get(".post").first().contains(content).should('be.visible');

    cy.get('div').contains(title).click();
    cy.contains("Delete").click();
    cy.contains(title).should("not.exist");
    cy.contains(content).should("not.exist");
  });
});
