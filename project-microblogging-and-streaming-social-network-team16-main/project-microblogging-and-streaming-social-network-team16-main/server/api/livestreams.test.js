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

// post livestream tests

test("POST /livestream creates a livestream", async () => {
  // user must be logged in
  await request(app).post("/livestream").expect(401);

  await request(app)
    .post("/user")
    .send({
      username: "billgates",
      password: "AComplexPassword123",
    })
    .expect(201);

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
  await request(app).post("/livestream").set("Cookie", [cookies]).expect(201);
});

test("POST /livestream doesn't allow duplicate streams", async () => {
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
  return request(app).post("/livestream").set("Cookie", [cookies]).expect(409);
});

// // post livestream comment tests

test("POST /livestreams/:livestream_user/comment returns 201", async () => {
  // user must be logged in
  await request(app).post("/livestreams/billgates/comment").expect(401);
  await request(app)
    .post("/user")
    .send({
      username: "warrenbuffet",
      password: "AComplexPassword123",
    })
    .expect(201);

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

  // require a message
  await request(app)
    .post("/livestreams/billgates/comment")
    .set("Cookie", [cookies])
    .expect(400);

  return request(app)
    .post("/livestreams/billgates/comment")
    .set("Cookie", [cookies])
    .send({
      message: "Hello",
    })
    .expect(201);
});

// get livestreams tests

test("GET /livestreams returns a list of livestreams", async () => {
  // user must be logged in
  await request(app).get("/livestreams").expect(401);
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
    .put("/users/warrenbuffet/followees/billgates")
    .set("Cookie", [cookies])
    .expect(200);
  return request(app)
    .get("/livestreams")
    .set("Cookie", [cookies])
    .expect(200)
    .then(async (res) => {
      expect(Object.keys(res.body[0])).toEqual(
        expect.arrayContaining(["room", "photo", "grant", "comments"])
      );
    });
});

// // put livestream comment tests

test("PUT /livestreams/:livestream_user/comments/:commentId requires a message", async () => {
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
  return request(app)
    .put("/livestreams/billgates/comments/1")
    .set("Cookie", [cookies])
    .expect(400);
});

test("PUT /livestreams/:livestream_user/comments/:nonexisting comment returns an error", async () => {
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
  return request(app)
    .post("/livestreams/billgates/comments/nonexisting")
    .set("Cookie", [cookies])
    .send({
      message: "hai",
    })
    .expect(404);
});

// // delete livestream comment tests

test("DELETE /livestreams/:livestream_user/comments/:nonexisting comment returns an error", async () => {
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
  return request(app)
    .delete("/livestreams/billgates/comments/nonexisting")
    .set("Cookie", [cookies])
    .expect(404);
});

// edit and delete comment tests

test("PUT updates comments and DELETE removes them", async () => {
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
    .put("/users/billgates/followees/warrenbuffet")
    .set("Cookie", [billcookies])
    .expect(200);

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

  let commentID;
  await request(app)
    .get("/livestreams")
    .set("Cookie", [warrencookies])
    .expect(200)
    .then(async (res) => {
      commentID = res.body[0].comments[0].id;
    });

  await request(app)
    .put(`/livestreams/billgates/comments/${commentID}`)
    .set("Cookie", [warrencookies])
    .send({
      message: "Hi",
    })
    .expect(200);

  // you cannot edit a comment that is not your own
  await request(app)
    .put(`/livestreams/billgates/comments/${commentID}`)
    .set("Cookie", [billcookies])
    .send({
      message: "Hey",
    })
    .expect(401);

  // you cannot delete a comment that is not your own
  await request(app)
    .delete(`/livestreams/billgates/comments/${commentID}`)
    .set("Cookie", [billcookies])
    .expect(401);

  return request(app)
    .delete(`/livestreams/billgates/comments/${commentID}`)
    .set("Cookie", [warrencookies])
    .expect(200);
});

// // delete livestream tests

test("DELETE /livestreams/:id requires auth", async () => {
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
  return request(app)
    .delete("/livestreams/billgates")
    .set("Cookie", [cookies])
    .expect(401);
});

test("DELETE /livestreams/:id works", async () => {
  // user must be logged in
  await request(app).delete("/livestreams/billgates").expect(401);

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
    .delete("/livestreams/billgates")
    .set("Cookie", [cookies])
    .expect(200);
});
