const request = require("supertest");
const express = require("express");
const mongoose = require("../mongo/index");
const main = require("../main.js");
const controller = require("../controller/index.js");

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

test("GET /media/nonexistentid returns 404", async () =>
  request(app).get("/media/nonexistentid").expect(404));

test("GET /media/:id returns a valid file", async () => {
  const newMediaId = await controller.media.createMedia(
    "image/png",
    "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
  );
  return request(app)
    .get(`/media/${newMediaId}`)
    .responseType("blob")
    .expect(200)
    .expect("content-type", "image/png")
    .then((res) => {
      expect(res.body.length).toEqual(85);
    });
});
