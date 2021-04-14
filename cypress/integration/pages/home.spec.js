/// <reference types="cypress" />

context('Home', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays correct information on the page', () => {
    cy.get('[data-testid=home-page-heading]').should(
      'contain',
      'Apply for the COVID-19 Additional Restrictions Grant'
    );

    cy.get('[data-testid=arg-govuk-link]')
      .should('have.attr', 'href')
      .and(
        'match',
        /https:\/\/www.gov.uk\/guidance\/check-if-youre-eligible-for-the-coronavirus-additional-restrictions-grant/
      );

    cy.get('[data-testid=arg-hackney-link]')
      .should('have.attr', 'href')
      .and('match', /https:\/\/hackney.gov.uk\/business-grants/);
  });
});
