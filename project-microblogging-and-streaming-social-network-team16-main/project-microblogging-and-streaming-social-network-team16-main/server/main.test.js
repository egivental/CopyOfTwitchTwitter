const request = require("supertest");
const express = require("express");
const mongoose = require("./mongo/index");
const main = require("./main.js");

let app;
beforeEach(async () => {
  app = express();
  main(app);
});

afterAll(() => mongoose.connection.close());

test("The API Server Starts", (done) => {
  request(app)
    .get("/healthcheck")
    .expect(200, "Hello World! The server is fine and healthy.", done);
});
