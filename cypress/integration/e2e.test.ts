import 'cypress-file-upload';

describe('Middle promotion e2e', () => {
    it('Login start at the beginning', () => {
        cy.visit('/');
        cy.contains('Welcome back');
    });

    it('Should successfully login the user', () => {
        cy.get('#login')
            .type('valentine.zozuliuk@gmail.com')
            .should('have.value', 'valentine.zozuliuk@gmail.com');
        cy.get('#password')
            .type('11111111')
            .should('have.value', '11111111');
        cy.get('form').submit();

        cy.location('pathname', { timeout: 10000 }).should('eq', '/user-console/articles');
    });

    it('Should add new article', () => {
        cy.get('.add-article-button').click();
        cy.location('pathname', { timeout: 1000 }).should('eq', '/user-console/articles/new');

        cy.get('#title').type('e2e title')
            .should('have.value', 'e2e title');
        cy.get('#description').type('description')
            .should('have.value', 'description');

        cy.get('.article-type-dropdown').click();
        cy.get('.type-menu-edit').first().click();

        cy.fixture('article-pricture.jpeg').then(fileContent => {
            cy.get('input[type="file"]').attachFile({
                fileContent: fileContent.toString(),
                fileName: 'testPicture.png',
                mimeType: 'image/jpeg'
            }).then(() => {
                cy.get('.uploaded-name').should('have.text', ' testPicture.png ');
                cy.get('form').submit();
            });
        });
    });

    it('Should filter article', () => {
        cy.get('.search-articles-input').type('e2e title');
        cy.get('.show-button').click();
        cy.get('.type-filter-menu').first().click();

        cy.get('.article-in-list').should('have.length', 1);
    });

    it('Should edit article', () => {
        cy.get('.article-more-icon').click();

        cy.get('.edit-item').click();

        cy.get('#description').type(' two')
            .should('have.value', 'description two');

        cy.get('form').submit();

        cy.location('pathname', { timeout: 10000 }).should('eq', '/user-console/articles');

        cy.get('.mid-desc p').should('have.text', ' description two ');
    });

    it('Should delete article', () => {
        cy.get('.article-more-icon').click();
        cy.get('.delete-item').click();

        cy.get('.article-in-list').should('have.length', 0);


        cy.get('.search-articles-input').clear()
            .should('have.value', '');
    });
});
