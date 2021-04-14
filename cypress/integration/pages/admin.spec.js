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

    it('displays correct number of applications', () => {
      cy.get('[data-testid=table-row]').should('have.length', 5);
    });
  });

  describe('filters', () => {
    it('displays correct name in the heading', () => {
      cy.get('[data-testid=basic-select]')
        .eq(0)
        .children()
        .should('have.length', 12);

      cy.get('[data-testid=basic-select]')
        .eq(1)
        .children()
        .should('have.length', 3);

      cy.get('[data-testid=basic-select]')
        .eq(2)
        .children()
        .should('have.length', 22);

      cy.get('[data-testid=basic-select]')
        .eq(3)
        .children()
        .should('have.length', 3);

      cy.get('[data-testid=basic-select]')
        .eq(4)
        .children()
        .should('have.length', 10);

      cy.get('[data-testid=basic-select]')
        .eq(5)
        .children()
        .should('have.length', 3);
    });
  });
});
