describe('проверяем доступность приложения', function() {

  // перед каждым тестом
  beforeEach( function() {
    cy.setCookie('accessToken','12345')
    cy.intercept('GET','api/ingredients', { fixture : 'ingredients.json'})
    cy.intercept('GET','api/auth/user', { fixture : 'getuser.json'})
    cy.intercept('POST','api/orders', { fixture : 'afterorder.json'})
    cy.intercept('POST','api/auth/login', { fixture : 'loginuser.json'})
    
    cy.visit('http://localhost:4000'); 
  });

  afterEach( function() {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('добавление ингредиента из списка в конструктор', function() {
      cy.get('[data-cy=ingredient-1]').contains('Добавить').click();
      // есть булка и сверху и снизу
      cy.get('[data-cy=constructor-bun-top]').contains('Булка N1').should('exist');
      cy.get('[data-cy=constructor-bun-bottom]').contains('Булка N1').should('exist');
      cy.get('[data-cy=ingredient-2]').contains('Добавить').click();
      cy.get('[data-cy=ingredient-2]').contains('Добавить').click();
      // что есть оба добавленных инградиента
      cy.get('[data-cy=constructor-ingredients] > li').then((lis) => {
        expect(lis, '2 items').to.have.length(2);
        expect(lis.eq(0), 'first item').to.contain('Биокотлета из марсианской Магнолии');
        expect(lis.eq(1), 'second item').to.contain('Биокотлета из марсианской Магнолии');
      });
  });

  it(' работа модальных окон', function() {
    cy.get('[data-cy=IngredientDetailsUI]').should('not.exist');
    cy.get('[data-cy=ingredient-1] > a').click();
    cy.get('[data-cy=modalUI]').should('exist'); // модальное окно появилось
    cy.get('[data-cy=ingredient-name]').should('have.text','Булка N1'); // открылось то что нужно
    cy.get('[data-cy=modal-close-button]').click();
    cy.get('[data-cy=modalUI]').should('not.exist'); // модальное окно закрылось по крестику
    cy.get('[data-cy=ingredient-1] > a').click(); // опять открываем модальное окно
    cy.get('[data-cy=modalUI]').should('exist');
    cy.get('[data-cy=modal-overlay]').click({force: true}); // принудительно кликаем, несмотря на ругань о перекрытии
    cy.get('[data-cy=modalUI]').should('not.exist'); // модальное окно закрылось поклику на оверлей
  });  

  it('функционал создания заказа', function() {
      cy.get('[data-cy=ingredient-1]').contains('Добавить').click();
      cy.get('[data-cy=ingredient-2]').contains('Добавить').click();
      cy.get('[data-cy=ingredient-2]').contains('Добавить').click();
      cy.get('[data-cy=order-register-button]').contains('Оформить заказ').click();
      cy.get('[data-cy=modalUI]').should('exist'); // модальное окно появилось
      cy.get('[data-cy=order-number]').should('have.text', '42216'); // и содержит № заказа
      cy.get('[data-cy=modal-close-button]').click(); // закрываем модальное окно
      cy.get('[data-cy=modalUI]').should('not.exist'); // проверяем что нет такого
      // проверяем, что пуст конструктор
      cy.get('[data-cy=choose-bun-top]').should('have.text', 'Выберите булки');
      cy.get('[data-cy=choose-bun-bottom]').should('have.text', 'Выберите булки');
      cy.get('[data-cy=choose-ingredients]').should('have.text', 'Выберите начинку');
    });

});

