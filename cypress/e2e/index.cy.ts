describe('Main Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('main page content', () => {
    // Public Feed h1
    cy.contains('h1', 'Public Feed');
    // there are exacly 10 posts
    cy.get('.post').should('have.length', 10);
  });


describe("navigation", () => {
  it("navigation to /login when 'Log in' is clicked", () => {

    cy.contains("Log in").click();

    cy.url().should("include", "/login");
  });

  it("navigation to /signup when 'Sign up' is clicked", () => {

    cy.contains("Sign up").click();

    cy.url().should("include", "/signup");
  });

  it("navigation to /p/[something] when the first post is clicked", () => {

    cy.get(".post").first().click();

    cy.url().should("match", /\/p\/.+$/);
  });
});

  it("logged in user navigation", () => {

  cy.visit('/login');

  cy.get('#username').type('User1');
  cy.get('#password').type('user1pass');

  cy.get('button[type="submit"]').click();

  cy.url().should("eq", Cypress.config().baseUrl + '/');

  cy.contains("New post").click();

  cy.url().should("include", "/create");

  cy.contains("My drafts").click();

  cy.url().should("include", "/drafts");

  cy.contains("My profile").click();

  cy.url().should("include", "/profile");

  cy.contains("Log out").click();

  cy.url().should("include", "/");

  cy.contains("My drafts").should("not.exist");
  })



  describe("Pagination functionality", () => {
    it("next page button navigation and posts amount check", () => {
  
      cy.contains("»").click();
  
      cy.url().should("eq", Cypress.config().baseUrl + "/?page=2");
  
      cy.get(".post").should("have.length", 10);
  
      cy.contains("»").click();
  
      cy.url().should("eq", Cypress.config().baseUrl + "/?page=3");
  
      cy.get(".post").should("have.length", 10);

      cy.contains("«").click();
  
      cy.url().should("eq", Cypress.config().baseUrl + "/?page=2");
  
      cy.get(".post").should("have.length", 10);
  
      cy.contains("«").click();
  
      cy.url().should("eq", Cypress.config().baseUrl + "/?page=1");
  
      cy.get(".post").should("have.length", 10);
    });
  });
});