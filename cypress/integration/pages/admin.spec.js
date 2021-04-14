/// <reference types="cypress" />

context('Admin', () => {
  before(() => {
    cy.setHackneyCookie(true);
    cy.intercept('GET', `/api/applications**`, {
      fixture: 'applications',
    });
    cy.intercept('GET', `/api/grant-officers`, {
      fixture: 'grant-officers',
    });
    cy.visit('/admin');
  });
  describe('page content', () => {
    it('displays correct name in the heading', () => {
      cy.get('[data-testid=admin-page-heading]').should(
        'contain',
        'Hello Name from the token'
      );
    });

    it('displays correct applications', () => {
      cy.get('[data-testid=table-row]').should('have.length', 5);
    });
  });
});
