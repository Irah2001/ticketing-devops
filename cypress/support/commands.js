Cypress.Commands.add('login', () => {
    const username = Cypress.env('ADMIN_USER');
    const password = Cypress.env('ADMIN_PASSWORD');
    cy.request({
        method: 'GET',
        url: '/tickets',
        auth: {
            username,
            password,
        },
    });
});