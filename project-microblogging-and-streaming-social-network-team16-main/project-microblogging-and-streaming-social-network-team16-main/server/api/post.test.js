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

test("POST /post requires a session", async () =>
  request(app).post("/post").expect(401));

test("Post /post requires a body", async () => {
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

  await request(app)
    .post("/user")
    .send({
      username: "IBlockedBillGates",
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
    .put("/users/billgates/followees/warrenbuffet")
    .set("Cookie", [cookies])
    .expect(200);

  await request(app).post("/post").set("Cookie", [cookies]).expect(400);
});

test("POST /post creates a post", async () => {
  // fake login
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
    .post("/post")
    .set("Cookie", [cookies])
    .send({
      user: "billgates",
      message: "This is Bill Gates' Post!",
      photo: 200,
      attachment: 19,
      attachment_type: 1,
    })
    .expect(201);

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
    .post("/post")
    .set("Cookie", [cookies])
    .send({
      user: "warrenbuffet",
      message: "This is Buffet's Post",
      photo: 200,
      attachment: 19,
      attachment_type: 1,
    })
    .expect(201);
});

test("make fake user and block billgates", async () => {
  // log in as fake user and block billgates and make a post
  let cookies;
  await request(app)
    .post("/session")
    .send({
      username: "IBlockedBillGates",
      password: "AComplexPassword123",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [cookies] = firstCookie.split(";");
    });

  await request(app)
    .delete("/users/billgates")
    .set("Cookie", [cookies])
    .expect(200);

  await request(app)
    .post("/post")
    .set("Cookie", [cookies])
    .send({
      message: "Bill Gates can't see this",
      photo: 200,
      attachment: 19,
      attachment_type: 1,
    })
    .expect(201);

  // log in as bill and follow this user and get posts and not see theirs
  let billCookies;
  await request(app)
    .post("/session")
    .send({
      username: "billgates",
      password: "AComplexPassword123",
    })
    .expect(201)
    .then((res) => {
      const [firstCookie] = res.headers["set-cookie"];
      [billCookies] = firstCookie.split(";");
    });

  await request(app)
    .put("/users/billgates/followees/IBlockedBillGates")
    .set("Cookie", [billCookies])
    .expect(200);

  await request(app)
    .get("/posts")
    .set("Cookie", [billCookies])
    .expect(200)
    .then((res) => {
      expect(res.body.length).toBe(2);
    });
});

test("GET /posts should return a post", async () => {
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
    .get("/posts")
    .set("Cookie", [cookies])
    .expect(200)
    .then((res) => {
      expect(res.body.length).toEqual(2);
      expect(res.body[0].message).toBe("This is Buffet's Post");
    });
});

test("POST /posts/:id/comment creating comment", async () => {
  // fake login
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
  let posts;
  await request(app)
    .get("/posts")
    .set("Cookie", [cookies])
    .then((res) => {
      posts = res.body;
    });
  const postToConsider = posts[0];
  const Id = postToConsider.id;
  await request(app)
    .post(`/posts/${Id}/comment`)
    .set("Cookie", [cookies])
    .send({
      photo_id: 0,
      message: "Hello, this is Bill Gates' Comment!",
    })
    .expect(201);

  await request(app)
    .get("/posts")
    .set("Cookie", [cookies])
    .then((res) => {
      expect(res.body[0].comments.length).toEqual(1);
    });
});

test("failing to make a post for wrong body or no login", async () => {
  let cookies;
  await request(app)
    .post("/post")
    .set("Cookie", [cookies])
    .send({
      user: "warrenbuffet",
      message: "This is Buffet's Post",
      photo: 200,
      attachment: 19,
      attachment_type: 1,
    })
    .expect(401);

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
    .post("/post")
    .set("Cookie", [cookies])
    .send({
      user: "warrenbuffet",
      photo: 200,
      attachment: 19,
      attachment_type: 1,
    })
    .expect(400);
});

test("failing to make a comment for wrong body or no login", async () => {
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
  let posts;

  await request(app)
    .get("/posts")
    .set("Cookie", [cookies])
    .expect(200)
    .then((res) => {
      posts = res.body;
    });

  const postToCommentOnId = posts[0].id;

  await request(app)
    .post(`/posts/${postToCommentOnId}/comment`)
    .set("Cookie", [cookies])
    .send({
      photo_id: 200,
    })
    .expect(400);

  await request(app)
    .post(`/posts/${postToCommentOnId}/comment`)
    .send({
      photo_id: 0,
      message: "Hello, this is Bill Gates' Comment!",
    })
    .expect(401);
});

test("Try to update a comment that is not yours", async () => {
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
  let posts;
  await request(app)
    .get("/posts")
    .set("Cookie", [cookies])
    .then((res) => {
      posts = res.body;
    });
  const postToConsider = posts[0];
  const Id = postToConsider.id;
  const commentId = postToConsider.comments[0].id;

  // failing by not having message
  await request(app)
    .put(`/posts/${Id}/comments/${commentId}`)
    .set("Cookie", [cookies])
    .expect(400);

  // then login as warren buffet
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
    .put(`/posts/${Id}/comments/${commentId}`)
    .send({
      message: "This shouldn't work",
    })
    .expect(401);
});

test("update a comment and then deleting a post", async () => {
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
  let posts;
  await request(app)
    .get("/posts")
    .set("Cookie", [cookies])
    .then((res) => {
      posts = res.body;
    });
  const postToConsider = posts[0];
  const Id = postToConsider.id;
  const commentId = postToConsider.comments[0].id;

  await request(app)
    .put(`/posts/${Id}/comments/${commentId}`)
    .set("Cookie", [cookies])
    .send({
      message: "This is the updated content",
    })
    .expect(200);

  await request(app)
    .get("/posts")
    .set("Cookie", [cookies])
    .then((res) => {
      posts = res.body;
      expect(res.body[0].comments[0].message).toBe(
        "This is the updated content"
      );
    });

  await request(app)
    .delete(`/posts/${Id}/comments/${commentId}`)
    .set("Cookie", [cookies])
    .expect(200);

  await request(app)
    .get("/posts")
    .set("Cookie", [cookies])
    .then((res) => {
      expect(res.body[0].comments.length).toBe(0);
    });
});

test("DELETE /post/:id", async () => {
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

  let posts;
  await request(app)
    .get("/posts")
    .set("Cookie", [cookies])
    .expect(200)
    .then((res) => {
      posts = res.body;
    });
  const postToConsider = posts[0];
  const Id = postToConsider.id;
  // billgates deletes his own post
  await request(app)
    .delete(`/posts/${Id}`)
    .set("Cookie", [cookies])
    .expect(200);

  await request(app)
    .get("/posts")
    .set("Cookie", [cookies])
    .expect(200)
    .then((res) => {
      posts = res.body;
      expect(res.body.length).toBe(1);
    });
  const warrenPostId = posts[0].id;

  // bill gates hides warren's post
  await request(app)
    .delete(`/posts/${warrenPostId}`)
    .set("Cookie", [cookies])
    .expect(200);

  await request(app)
    .get("/posts")
    .set("Cookie", [cookies])
    .expect(200)
    .then((res) => {
      posts = res.body;
      expect(res.body.length).toBe(0);
    });
});
