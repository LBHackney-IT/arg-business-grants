/// <reference types="cypress" />

context('Admin application', () => {
  before(() => {
    cy.setHackneyCookie(true);
    cy.intercept('GET', `/api/applications/1**`, {
      fixture: 'applications/1',
    });
    cy.intercept('GET', `/api/applications/1/comments`, {
      fixture: 'applications/comments/1',
    });
    cy.visit('/admin/applications/1');
  });
  describe('page content', () => {
    it('displays correct application information', () => {
      cy.get('[data-testid=application-view-business-name]').should(
        'contain',
        'Business One'
      );

      cy.get('[data-testid=application-view-business-email]').should(
        'contain',
        'Email: email@address.com'
      );
      cy.get('[data-testid=application-view-business-phone]').should(
        'contain',
        'Phone: 0123456789'
      );
      cy.get('[data-testid=application-view-previuos-application]').should(
        'contain',
        'Previous Application: 2'
      );

      cy.get('[data-testid=form-select-tag]')
        .should('have.length', 1)
        .and('contain', 'EXPORTED');
    });
  });
});
