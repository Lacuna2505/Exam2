import user from "../fixtures/user.json";


//let userId;

// before(() => {
//   cy.request({
//     method: "POST",
//     url: "/register",
//     body: {
//       email: user.user.email,
//       password: user.user.password,
//     },
//     failOnStatusCode: false,
//   }).then((response) => {
//     userId = response.body.user.id;
//   });
// });

// after(() => {
//   cy.request({
//     method: "DELETE",
//     url: "/users/" + userId,
//     failOnStatusCode: false,
//   });
// });

it(`Get all posts`, () => {
  cy.request("GET", "/posts").then((response) => {
    expect(response.status).to.be.eq(200);

    expect(response.headers["content-type"]).to.contain("application/json");
  });
});

it(`Get 10 posts`, () => {
  cy.request("GET", "/posts?_start=0&_end=10").then((response) => {
    expect(response.status).to.be.eq(200);

    expect(response.body).to.have.length(10);

    expect(response.body.at(0).id).to.be.eq(1);

    expect(response.body.at(-1).id).to.be.eq(10);
  });
});

it(`Get posts of 55 & 60 ids`, () => {
  cy.request("GET", "/posts?id=55&id=60").then((response) => {
    expect(response.status).to.be.eq(200);

    expect(response.body).to.have.length(2);

    expect(response.body.at(0).id).to.be.eq(55);

    expect(response.body.at(1).id).to.be.eq(60);
  });
});

it(`Create a post. Verify HTTP response status code.`, () => {
  cy.request({ method: "PUT", url: "/664/posts/", failOnStatusCode: false }).then((response) => {
    expect(response.status).to.be.eq(401);
  });
});

it(`Create post with adding access token in header. Verify HTTP response status code. Verify post is created.`, () => {
  cy.request({
    method: "POST",
    url: "/login",
    body: {
      email: user.user.email,
      password: user.user.password,
    },
    failOnStatusCode: false,
  }).then((response) => {
    const token = response.body.accessToken;

    cy.request({
      method: "POST",
      url: "/664/posts/",
      body: {
        title: "Test",
        body: "testtesttest",
      },
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "text/plain",
      },
    }).then((response) => {
      expect(response.status).to.be.eq(201);
      expect(response.statusText).to.be.eq("Created");
    });
  });
});


it(`Create post entity and verify that the entity is created. Verify HTTP response status code. Use JSON in body`, () => {
  cy.request({
    method: "POST",
    url: "/posts",
    body: JSON.stringify({
      title: "Test",
      body: "testtesttest",
    }),
  }).then((response) => {
    expect(response.status).to.be.eq(201);
    expect(response.statusText).to.be.eq("Created");
  });
});

it(`Update non-existing entity. Verify HTTP response status code.`, () => {
  cy.request({
    method: "PUT",
    url: "/posts/3000",
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.be.eq(404);
  });
});

it(`Create post entity and update the created entity. Verify HTTP response status code and verify that the entity is updated`, () => {
  cy.request({
    method: "POST",
    url: "/posts",
    failOnStatusCode: false,
    body: {
      title: "Test",
      body: "testtesttest",
    },
  }).then((response) => {
    expect(response.status).to.be.eq(201);
    expect(response.statusText).to.be.eq("Created");
    expect(response.body.title).to.be.eq("Test");
    expect(response.body.body).to.be.eq("testtesttest");

    const uid = response.body.id;
    cy.request({
      method: "PUT",
      url: "/posts/" + uid,
      failOnStatusCode: false,
      body: {
        title: "Test2",
        body: "testtesttest2",
      },
    }).then((response) => {
      expect(response.status).to.be.eq(200);
      expect(response.statusText).to.be.eq("OK");
      expect(response.body.title).to.be.eq("Test2");
      expect(response.body.body).to.be.eq("testtesttest2");

      const uid = response.body.id;
    });
  });
});

it(`Delete non-existing post entity. Verify HTTP response status code`, () => {
  cy.request({
    method: "DELETE",
    url: "/posts/3000",
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.be.eq(404);
  });
});

it(`Create post entity, update the created entity, and delete the entity. Verify HTTP response status code and verify that the entity is deleted`, () => {
  cy.request({
    method: "POST",
    url: "/posts",
    failOnStatusCode: false,
    body: {
      title: "Test",
      body: "testtesttest",
    },
  }).then((response) => {
    expect(response.status).to.be.eq(201);
    expect(response.statusText).to.be.eq("Created");
    expect(response.body.title).to.be.eq("Test");
    expect(response.body.body).to.be.eq("testtesttest");

    const uid = response.body.id;
    cy.request({
      method: "DELETE",
      url: "/posts/" + uid,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.eq(200);
      expect(response.statusText).to.be.eq("OK");
    });
  });
});
