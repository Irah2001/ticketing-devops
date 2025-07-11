describe('Ticket Submission and Viewing', () => {
    beforeEach(() => {
        // Ensure the database is seeded before each test
        cy.exec('node fixtures/seed.js', { env: { DB_HOST: Cypress.env('DB_HOST'), DB_USER: Cypress.env('DB_USER'), DB_PASSWORD: Cypress.env('DB_PASSWORD'), DB_NAME: Cypress.env('DB_NAME') } });
    });

    it('should submit a ticket and display it on the tickets page', () => {
        cy.visit('/login');
        cy.get('#username').type(Cypress.env('ADMIN_USER'));
        cy.get('#password').type(Cypress.env('ADMIN_PASSWORD'));
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/tickets'); // Ensure we are on the tickets page after login

        cy.visit('/'); // Go to the submission page
        cy.get('#type_id').select('1'); // Select bug (ID 1)
        cy.get('#email').type('test@example.com');
        cy.get('#message').type('This is a test bug report.');
        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/tickets');
        cy.contains('td', 'test@example.com') // Find the cell containing the email
            .parent('tr') // Get the parent row
            .within(() => {
                cy.contains('td', 'bug'); // Assert the type within this row
                cy.contains('td', 'This is a test bug report.'); // Assert the message within this row
            });
    });

    it('should require login to access /tickets', () => {
        cy.visit('/tickets');
        cy.url().should('include', '/login');
    });

    it('should allow logging out from the tickets page', () => {
        // First, log in to access the tickets page
        cy.visit('/login');
        cy.get('#username').type(Cypress.env('ADMIN_USER'));
        cy.get('#password').type(Cypress.env('ADMIN_PASSWORD'));
        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/tickets');

        // Click the logout link
        cy.contains('Logout').click();

        // Verify that the user is logged out (e.g., redirected to a page requiring authentication)
        cy.url().should('not.include', '/tickets');
    });

    it('should paginate tickets', () => {
        // Seed with more data for pagination test
        for (let i = 0; i < 15; i++) {
            cy.request('POST', 'http://localhost:3000/submit', { type_id: 1, email: `test${i}@example.com`, message: `Test ticket ${i}` });
        }
        cy.wait(1000); // Give the server some time to process the requests

        cy.visit('/login');
        cy.get('#username').type(Cypress.env('ADMIN_USER'));
        cy.get('#password').type(Cypress.env('ADMIN_PASSWORD'));
        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/tickets');
        cy.get('.tickets-table tbody tr').should('have.length', 5);
        cy.get('.pagination a').contains('3').click();
        cy.get('.tickets-table tbody tr').should('have.length.lessThan', 6);
    });
});
