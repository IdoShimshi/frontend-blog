// cypress/support/index.d.ts

declare namespace Cypress {
    interface Chainable {
      fillSignUpForm: (formData: {
        name: string;
        email: string;
        username: string;
        password: string;
      }) => Chainable<Element>;
  
      clickSignUpButton: () => Chainable<Element>;
    }
  }