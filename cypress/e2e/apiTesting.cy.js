import user from "../fixtures/user.json"

Cypress.Commands.add('registerUser', (user) => {
  cy.request({
  method: 'POST',
  url: '/register',
  body: {
    email: 'lacuna2@gmail.com',
    password: 'Playgames2505!',
  },
}).then((response) => {
  cy.request({
    method: 'POST',
    status: 200,
    headers: { Authorization: 'Bearer ' + resp.body.token },
    body: user,
  })
  
  })
})



it(`Get all posts`, () => {
  cy.request('GET', '/posts').then( response => {
    expect(response.status).to.be.eq(200);
    
  })
})

// it(`Get pet by id ${pet.id}`, () => {
//   cy.request('GET', `/pet/${pet.id}`).then( response => {
//     expect(response.status).to.be.eq(200);
//     expect(response.body.id).to.be.eq(pet.id);
//     expect(response.body.name).to.be.eq(pet.name);
//     expect(response.body.category.id).to.be.eq(pet.category.id);
//     expect(response.body.category.name).to.be.eql(pet.category.name);
//   })
// })