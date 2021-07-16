const request = require("supertest");
const express = require("express");
const mongoose = require("../mongo/index");
const main = require("../main.js");

// from ajay
let app;
beforeAll(async (done) => {
  // Reset the database before running tests
  const conn = mongoose.connection;
  conn.once("open", async () => {
    await mongoose.connection.db.dropDatabase();
    done();
  });
});

// from ajay
beforeEach(async () => {
  app = express();
  main(app);
});

// from ajay
afterAll(() => mongoose.connection.close());

test("Bill gates messages Warren Buffet", async () => {
  await request(app)
    .post("/user")
    .send({
      username: "billgates",
      password: "AComplexPassword123",
    })
    .expect(201);

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
      username: "billgates",
      password: "AComplexPassword123",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [cookies] = firstCookie.split(";");
    });

  await request(app)
    .post("/messages/warrenbuffet")
    .set("Cookie", [cookies])
    .send({
      message: "Hello Warren!",
      attachment: "asdf",
      attachment_mime_type: "jpeg",
    })
    .expect(201);

  await request(app)
    .get("/messages/warrenbuffet")
    .set("Cookie", [cookies])
    .expect(200)
    .then((res) => {
      expect(res.body.length).toBe(1);
    });
});

test("warrenbuffet reads messages that bill sent him", async () => {
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
    .get("/messages/billgates")
    .set("Cookie", [cookies])
    .expect(200)
    .then((res) => {
      expect(res.body.length).toBe(1);
    });

  await request(app)
    .get("/messages/billgates")
    .set("Cookie", [cookies])
    .expect(200)
    .then((res) => {
      expect(res.body.length).toBe(1);
    });
});

test("Some blocked messages", async () => {
  // log in as bill gates
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

  // block warren
  await request(app)
    .delete("/users/warrenbuffet")
    .set("Cookie", [cookies])
    .expect(200);

  await request(app)
    .get("/messages/warrenbuffet")
    .set("Cookie", [cookies])
    .expect(200)
    .then((res) => {
      expect(res.body.length).toBe(0);
    });

  // unblock warren
  await request(app)
    .delete("/users/warrenbuffet")
    .set("Cookie", [cookies])
    .expect(200);

  // now have warren block bill
  let warrenCookies;
  await request(app)
    .post("/session")
    .send({
      username: "warrenbuffet",
      password: "AComplexPassword123",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [warrenCookies] = firstCookie.split(";");
    });

  await request(app)
    .delete("/users/billgates")
    .set("Cookie", [warrenCookies])
    .expect(200);

  // now log in as bill again and test
  await request(app)
    .get("/messages/warrenbuffet")
    .set("Cookie", [cookies])
    .expect(200)
    .then((res) => {
      expect(res.body.length).toBe(0);
    });
});

test("improper message and  subsequest 400 responses", async () => {
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
    .post("/messages/warrenbuffet")
    .set("Cookie", [cookies])
    .send({
      message: null,
      attachment_mime_type: "jpeg",
    })
    .expect(400);
});
