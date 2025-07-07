describe('Ticket Submission and Viewing', () => {
    beforeEach(() => {
        // Ensure the database is seeded before each test
        cy.exec('node fixtures/seed.js', { env: { DB_HOST: Cypress.env('DB_HOST'), DB_USER: Cypress.env('DB_USER'), DB_PASSWORD: Cypress.env('DB_PASSWORD'), DB_NAME: Cypress.env('DB_NAME') } });
    });

    it('should submit a ticket and display it on the tickets page', () => {
        cy.visit('/');
        cy.get('#type_id').select('1'); // Select bug (ID 1)
        cy.get('#email').type('test@example.com');
        cy.get('#message').type('This is a test bug report.');
        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/tickets');
        // After submission, visit the tickets page with authentication to verify content
        cy.visit('/tickets', {
            auth: {
                username: Cypress.env('ADMIN_USER'),
                password: Cypress.env('ADMIN_PASSWORD'),
            },
        });
        cy.contains('Type: bug');
        cy.contains('Email: test@example.com');
        cy.contains('Message: This is a test bug report.');
    });

    it('should require HTTP Basic authentication to access /tickets', () => {
        cy.visit('/tickets', { failOnStatusCode: false });
        cy.contains('Authentication required.');
        cy.request({
            url: '/tickets',
            auth: {
                username: Cypress.env('ADMIN_USER'),
                password: Cypress.env('ADMIN_PASSWORD'),
            },
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.include('<h1>Tickets</h1>');
        });
    });

    it('should allow logging out from the tickets page', () => {
        // First, log in to access the tickets page
        cy.visit('/tickets', {
            auth: {
                username: Cypress.env('ADMIN_USER'),
                password: Cypress.env('ADMIN_PASSWORD'),
            },
        });
        cy.url().should('include', '/tickets');

        // Click the logout link
        cy.contains('Logout').click();

        // Verify that the user is logged out (e.g., redirected to a page requiring authentication)
        cy.url().should('include', '/logout');
        cy.contains('Logged out. Please close your browser or clear credentials.');
    });
});
