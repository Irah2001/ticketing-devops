describe('Submission Form', () => {
    it('should submit the form and display the submission', () => {
        cy.visit('/');
        cy.get('#name').type('John Doe');
        cy.get('#email').type('john.doe@example.com');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/submissions');
        cy.contains('John Doe');
    });
});