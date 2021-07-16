import store from "./index";

import {
  getPosts,
  createPost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
} from "./postState";

// Mock the backend
beforeAll(() => jest.spyOn(global, "fetch"));

beforeEach(() =>
  global.fetch.mockImplementation((url, options) => {
    // Mock create post endpoint
    if (url.endsWith("/post") && options.method === "POST") {
      return Promise.resolve({
        status: 201,
      });
    }
    // Mock get posts
    if (url.endsWith("/posts") && options.method === "GET") {
      return Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve([
            {
              id: "1e265a87-0260-4f53-ac30-2fa3fd3bc07c",
              user: "billgates",
              photo: "1e265a87-0260-4f53-ac30-2fa3fd3bc07c",
              data: 1614885848983,
              message: "Hello.",
              attachment: "1e265a87-0260-4f53-ac30-2fa3fd3bc07c",
              attachment_type: "image",
              comments: [
                {
                  id: "1e265a87-0260-4f53-ac30-2fa3fd3bc07c",
                  post_id: "1e265a87-0260-4f53-ac30-2fa3fd3bc07c",
                  user: "billgates",
                  photo: "1e265a87-0260-4f53-ac30-2fa3fd3bc07c",
                  data: 1614885848983,
                  message: "Hello.",
                },
              ],
              analytics: {
                commented: 1,
                hid: 1,
              },
            },
          ]),
      });
    }
    if (url.endsWith("/posts/10") && options.method === "DELETE") {
      return Promise.resolve({
        status: 200,
      });
    }
    if (url.endsWith("/posts/10/comment") && options.method === "POST") {
      return Promise.resolve({
        status: 201,
      });
    }
    if (url.endsWith("/posts/10/comments/100") && options.method === "PUT") {
      return Promise.resolve({
        status: 200,
      });
    }
    if (url.endsWith("/posts/10/comments/100") && options.method === "DELETE") {
      return Promise.resolve({
        status: 200,
      });
    }
    return Promise.resolve({
      status: 404,
      json: () =>
        Promise.resolve({
          message: "Endpoint not found.",
        }),
    });
  })
);

test("getPosts - React Redux Action Test", async () => {
  await store.dispatch(getPosts());
  const state = store.getState().post;
  expect(state.posts[0]).toBeTruthy();
  expect(state.posts[0]).toHaveProperty("message");
  expect(state.posts[0].message).toBe("Hello.");
});

test("createPost - React Redux Action Test", async () => {
  await store.dispatch(createPost("hello", null, null));
  const state = store.getState().post;
  expect(state.posts[0]).toBeTruthy();
  expect(state.posts[0]).toHaveProperty("message");
  expect(state.posts[0].message).toBe("Hello.");
});

test("deletePost - React Redux Action Test", async () => {
  await store.dispatch(deletePost(10));
  const state = store.getState().post;
  expect(state.posts[0]).toBeTruthy();
  expect(state.posts[0]).toHaveProperty("message");
  expect(state.posts[0].message).toBe("Hello.");
});

test("deletePost - Error", async () => {
  await store.dispatch(deletePost(11));
  const state = store.getState().post;
  expect(state.posts[0]).toBeTruthy();
  expect(state.posts[0]).toHaveProperty("message");
  expect(state.posts[0].message).toBe("Hello.");
});

test("createComment - React Redux Action Test", async () => {
  await store.dispatch(createComment(10, "Hello"));
  const state = store.getState().post;
  expect(state.posts[0]).toBeTruthy();
  expect(state.posts[0]).toHaveProperty("message");
  expect(state.posts[0].message).toBe("Hello.");
});

test("createComment - Error", async () => {
  await store.dispatch(createComment(11, "Goodbye"));
  const state = store.getState().post;
  expect(state.posts[0]).toBeTruthy();
  expect(state.posts[0]).toHaveProperty("message");
  expect(state.posts[0].message).toBe("Hello.");
});

test("updateComment - React Redux Action Test", async () => {
  await store.dispatch(updateComment(10, 100, "Hello."));
  const state = store.getState().post;
  expect(state.posts[0]).toBeTruthy();
  expect(state.posts[0]).toHaveProperty("message");
  expect(state.posts[0].message).toBe("Hello.");
});

test("updateComment - Error", async () => {
  await store.dispatch(updateComment());
  const state = store.getState().post;
  expect(state.posts[0]).toBeTruthy();
  expect(state.posts[0]).toHaveProperty("message");
  expect(state.posts[0].message).toBe("Hello.");
});

test("deleteComment - React Redux Action Test", async () => {
  await store.dispatch(deleteComment(10, 100));
  const state = store.getState().post;
  expect(state.posts[0]).toBeTruthy();
  expect(state.posts[0]).toHaveProperty("message");
  expect(state.posts[0].message).toBe("Hello.");
});

test("deleteComment - Error", async () => {
  await store.dispatch(deleteComment());
  const state = store.getState().post;
  expect(state.posts[0]).toBeTruthy();
  expect(state.posts[0]).toHaveProperty("message");
  expect(state.posts[0].message).toBe("Hello.");
});
