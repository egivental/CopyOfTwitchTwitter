const request = require("supertest");
const express = require("express");
const mongoose = require("../mongo/index");
const main = require("../main.js");

let app;
beforeAll(async (done) => {
  // Reset the database before running tests
  const conn = mongoose.connection;
  conn.once("open", async () => {
    await mongoose.connection.db.dropDatabase();
    done();
  });
});

beforeEach(async () => {
  app = express();
  main(app);
});

afterAll(() => mongoose.connection.close());

test("POST /user requires a body", async () =>
  request(app).post("/user").expect(400));

test("POST /user requires a complex password", async () =>
  request(app)
    .post("/user")
    .send({
      username: "billgates",
      password: "simplepassword",
    })
    .expect(400));

test("POST /user creates a user", async () =>
  request(app)
    .post("/user")
    .send({
      username: "billgates",
      password: "AComplexPassword123",
    })
    .expect(201));

test("POST /user doesn't allow duplicate usernames", async () =>
  request(app)
    .post("/user")
    .send({
      username: "billgates",
      password: "AComplexPassword123",
    })
    .expect(409));

test("POST /session should not allow logins for non-existent user", async () =>
  request(app)
    .post("/session")
    .send({
      username: "non-existent-user",
      password: "password",
    })
    .expect(401));

test("POST /session should not allow logins with the wrong password", async () =>
  request(app)
    .post("/session")
    .send({
      username: "billgates",
      password: "password",
    })
    .expect(401));

test("POST /session should allow logins with the correct password", async () =>
  request(app)
    .post("/session")
    .send({
      username: "billgates",
      password: "AComplexPassword123",
    })
    .expect(201));

test("GET /session should return 401 without being logged in", async () =>
  request(app).get("/session").expect(401));

test("GET /session should return 200 after login", async () => {
  let cookies;
  await request(app)
    .post("/session")
    .send({
      username: "billgates",
      password: "AComplexPassword123",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [cookies] = firstCookie.split(";");
    });
  await request(app).get("/session").set("Cookie", [cookies]).expect(200, {
    username: "billgates",
  });
});

test("GET /session should return 200 after signup", async () => {
  let cookies;
  await request(app)
    .post("/user")
    .send({
      username: "warrenbuffet",
      password: "AComplexPassword123",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [cookies] = firstCookie.split(";");
    });
  await request(app).get("/session").set("Cookie", [cookies]).expect(200, {
    username: "warrenbuffet",
  });
});

test("GET /users/billgates should return 200 after login", async () => {
  let cookies;
  await request(app)
    .post("/session")
    .send({
      username: "billgates",
      password: "AComplexPassword123",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [cookies] = firstCookie.split(";");
    });
  await request(app)
    .get("/users/billgates")
    .set("Cookie", [cookies])
    .expect(200)
    .then(async (res) =>
      expect(Object.keys(res.body)).toEqual(
        expect.arrayContaining([
          "username",
          "registration_date",
          "photo",
          "failed_login_attempts",
          "last_failed_login_attempt_date",
          "is_livestreaming",
          "livestream_date",
          "deactivated",
          "blocked",
          "suggested",
        ])
      )
    );
});

test("GET /users/warrenbuffet should return 401 after logging in as billgates", async () => {
  let cookies;
  await request(app)
    .post("/session")
    .send({
      username: "billgates",
      password: "AComplexPassword123",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [cookies] = firstCookie.split(";");
    });
  return request(app)
    .get("/users/warrenbuffet")
    .set("Cookie", [cookies])
    .expect(401);
});

test("GET /users should list other users after login", async () => {
  let cookies;
  await request(app)
    .post("/session")
    .send({
      username: "billgates",
      password: "AComplexPassword123",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [cookies] = firstCookie.split(";");
    });
  return request(app)
    .get("/users")
    .set("Cookie", [cookies])
    .expect(200)
    .then((res) => {
      expect(res.body.length).toEqual(1);
      return expect(res.body[0].username).toEqual("warrenbuffet");
    });
});

test("GET /users should list blocked users", async () => {
  let cookies;
  await request(app)
    .post("/session")
    .send({
      username: "billgates",
      password: "AComplexPassword123",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [cookies] = firstCookie.split(";");
    });
  await request(app)
    .delete("/users/warrenbuffet")
    .set("Cookie", [cookies])
    .expect(200);
  await request(app)
    .get("/users")
    .set("Cookie", [cookies])
    .expect(200)
    .then((res) => {
      expect(res.body.length).toEqual(1);
      expect(res.body[0].blocked).toEqual(true);
      return expect(res.body[0].username).toEqual("warrenbuffet");
    });
  await request(app)
    .delete("/users/warrenbuffet")
    .set("Cookie", [cookies])
    .expect(200);
  return request(app)
    .get("/users")
    .set("Cookie", [cookies])
    .expect(200)
    .then((res) => {
      expect(res.body.length).toEqual(1);
      expect(res.body[0].blocked).toEqual(false);
      return expect(res.body[0].username).toEqual("warrenbuffet");
    });
});

test("GET /users should not list users who have blocked the logged in user", async () => {
  let billcookies;
  let warrencookies;
  await request(app)
    .post("/session")
    .send({
      username: "billgates",
      password: "AComplexPassword123",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [billcookies] = firstCookie.split(";");
    });
  await request(app)
    .post("/session")
    .send({
      username: "warrenbuffet",
      password: "AComplexPassword123",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [warrencookies] = firstCookie.split(";");
    });
  await request(app)
    .delete("/users/billgates")
    .set("Cookie", [warrencookies])
    .expect(200);
  await request(app)
    .get("/users")
    .set("Cookie", [billcookies])
    .expect(200)
    .then((res) => expect(res.body.length).toEqual(0));
  await request(app)
    .delete("/users/billgates")
    .set("Cookie", [warrencookies])
    .expect(200);
  return request(app)
    .get("/users")
    .set("Cookie", [billcookies])
    .expect(200)
    .then((res) => {
      expect(res.body.length).toEqual(1);
      expect(res.body[0].blocked).toEqual(false);
      return expect(res.body[0].username).toEqual("warrenbuffet");
    });
});

test("GET /users/billgates/followees should list users followed", async () => {
  let cookies;
  await request(app)
    .post("/session")
    .send({
      username: "billgates",
      password: "AComplexPassword123",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [cookies] = firstCookie.split(";");
    });
  await request(app)
    .put("/users/billgates/followees/warrenbuffet")
    .set("Cookie", [cookies])
    .expect(200);
  await request(app)
    .get("/users")
    .set("Cookie", [cookies])
    .expect(200)
    .then((res) => expect(res.body.length).toEqual(0));
  await request(app)
    .get("/users/billgates/followees")
    .set("Cookie", [cookies])
    .expect(200)
    .then((res) => {
      expect(res.body.length).toEqual(1);
      return expect(res.body[0].username).toEqual("warrenbuffet");
    });
  await request(app)
    .delete("/users/billgates/followees/warrenbuffet")
    .set("Cookie", [cookies])
    .expect(200);
  await request(app)
    .get("/users")
    .set("Cookie", [cookies])
    .expect(200)
    .then((res) => {
      expect(res.body.length).toEqual(1);
      return expect(res.body[0].username).toEqual("warrenbuffet");
    });
  await request(app)
    .get("/users/billgates/followees")
    .set("Cookie", [cookies])
    .expect(200)
    .then((res) => expect(res.body.length).toEqual(0));
});

test("GET /users/billgates/followers should list followers", async () => {
  let billcookies;
  let warrencookies;
  await request(app)
    .post("/session")
    .send({
      username: "billgates",
      password: "AComplexPassword123",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [billcookies] = firstCookie.split(";");
    });
  await request(app)
    .post("/session")
    .send({
      username: "warrenbuffet",
      password: "AComplexPassword123",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [warrencookies] = firstCookie.split(";");
    });
  await request(app)
    .put("/users/warrenbuffet/followees/billgates")
    .set("Cookie", [warrencookies])
    .expect(200);
  await request(app)
    .get("/users")
    .set("Cookie", [billcookies])
    .expect(200)
    .then((res) => expect(res.body.length).toEqual(0));
  await request(app)
    .get("/users/billgates/followers")
    .set("Cookie", [billcookies])
    .expect(200)
    .then((res) => {
      expect(res.body.length).toEqual(1);
      return expect(res.body[0].username).toEqual("warrenbuffet");
    });
  await request(app)
    .delete("/users/warrenbuffet/followees/billgates")
    .set("Cookie", [warrencookies])
    .expect(200);
  await request(app)
    .get("/users")
    .set("Cookie", [billcookies])
    .expect(200)
    .then((res) => {
      expect(res.body.length).toEqual(1);
      return expect(res.body[0].username).toEqual("warrenbuffet");
    });
  await request(app)
    .get("/users/billgates/followers")
    .set("Cookie", [billcookies])
    .expect(200)
    .then((res) => expect(res.body.length).toEqual(0));
});

test("DELETE /session should return 401 without being logged in", async () =>
  request(app).delete("/session").expect(401));

test("DELETE /session should return 200 after login", async () => {
  let cookies;
  await request(app)
    .post("/session")
    .send({
      username: "billgates",
      password: "AComplexPassword123",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [cookies] = firstCookie.split(";");
    });
  await request(app).delete("/session").set("Cookie", [cookies]).expect(200);
  // Confirm the logout worked
  await request(app).get("/session").expect(401);
});

test("PUT /users/billgates should update a user profile", async () => {
  let cookies;
  await request(app)
    .post("/session")
    .send({
      username: "billgates",
      password: "AComplexPassword123",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [cookies] = firstCookie.split(";");
    });
  await request(app)
    .put("/users/billgates")
    .set("Cookie", [cookies])
    .send({
      photo:
        "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
      photo_mime_type: "image/png",
    })
    .expect(200);
  await request(app)
    .put("/users/billgates")
    .set("Cookie", [cookies])
    .send({
      password: "simplepassword",
      photo:
        "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
      photo_mime_type: "image/png",
    })
    .expect(400);
  await request(app)
    .put("/users/billgates")
    .set("Cookie", [cookies])
    .send({
      password: "AComplexPassword1234",
      photo:
        "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
      photo_mime_type: "image/png",
    })
    .expect(200);
  await request(app)
    .post("/session")
    .send({
      username: "billgates",
      password: "AComplexPassword1234",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [cookies] = firstCookie.split(";");
    });
  await request(app)
    .get("/users/billgates")
    .set("Cookie", [cookies])
    .expect(200)
    .then(async (res) => {
      expect(res.body.photo).toBeTruthy();
      expect(Object.keys(res.body)).toEqual(
        expect.arrayContaining([
          "username",
          "registration_date",
          "photo",
          "failed_login_attempts",
          "last_failed_login_attempt_date",
          "is_livestreaming",
          "livestream_date",
          "deactivated",
          "blocked",
          "suggested",
        ])
      );
    });
});

test("POST /session should more than 10 failed login attempts in a row", async () => {
  for (let i = 0; i < 10; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await request(app)
      .post("/session")
      .send({
        username: "billgates",
        password: "password",
      })
      .expect(401);
  }
  await request(app)
    .post("/session")
    .send({
      username: "billgates",
      password: "AComplexPassword1234",
    })
    .expect(429);
});

test("DELETE /user/warrenbuffet deactivates the account", async () => {
  let cookies;
  await request(app)
    .post("/session")
    .send({
      username: "warrenbuffet",
      password: "AComplexPassword123",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [cookies] = firstCookie.split(";");
    });
  await request(app)
    .delete("/users/warrenbuffet")
    .set("Cookie", [cookies])
    .expect(200);
  await request(app)
    .post("/session")
    .send({
      username: "warrenbuffet",
      password: "AComplexPassword123",
    })
    .expect(401);
});
