describe('Sign Up Page', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });


  it('should not allow sign-up with missing fields', () => {
    cy.clickSignUpButton();

    cy.contains('Username must not remain empty').should('be.visible');
    cy.contains('Password must not remain empty').should('be.visible');
    cy.contains('Email must not remain empty').should('be.visible');
    cy.contains('Name must not remain empty').should('be.visible');

    cy.fillSignUpForm({
      name: 'testuser',
      email: 'bademail@form',
      username: 'testuser',
      password: 'strongPassword',
    });

    cy.clickSignUpButton();

    cy.contains('Invalid mail format').should('be.visible');

  });

  it('sign up with User1 username- expect duplicated username', () => {
    cy.fillSignUpForm({
      name: 'User1',
      email: 'user1@example.com',
      username: 'User1',
      password: 'user1pass',
    });

    cy.clickSignUpButton();

    cy.contains('User with this username already exists').should('be.visible');
  });


  it('should sign up successfully', () => {
    const currentDate = new Date()

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear().toString();
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");

    const currentDateNumberFormat = `${day}${month}${year}${hours}${minutes}${seconds}`;

    const password = 'strongPassword'

    console.log(currentDateNumberFormat)

    console.log(currentDate)
    cy.fillSignUpForm({
      name: 'Metahnet Kaze',
      email: currentDateNumberFormat + '@testmail.com',
      username: currentDateNumberFormat,
      password: password,
    });

    cy.clickSignUpButton();

    cy.url().should('include', '/login');

    cy.get('#username').type(currentDateNumberFormat);
    cy.get('#password').type(password);

    cy.get('button[type="submit"]').click();

    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});