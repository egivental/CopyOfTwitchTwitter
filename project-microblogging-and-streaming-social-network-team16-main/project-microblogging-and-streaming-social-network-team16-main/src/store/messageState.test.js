import store from "./index";

import {
  createMessage,
  // TODO
  getMessages,
} from "./messageState";

// Mock the backend
beforeAll(() => jest.spyOn(global, "fetch"));

beforeEach(() =>
  global.fetch.mockImplementation((url, options) => {
    // Mock create post endpoint
    if (url.endsWith("/messages/billgates") && options.method === "GET") {
      return Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve([
            {
              id: "1e265a87-0260-4f53-ac30-2fa3fd3bc07c",
              date: 1614885848983,
              from_user: "billgates",
              to_user: "warrenbuffet",
              read_date: 1614885848983,
              delivered_date: 1614885848983,
              message: "Hello.",
              attachment: "1e265a87-0260-4f53-ac30-2fa3fd3bc07c",
              attachment_type: "image",
            },
          ]),
      });
    }
    if (url.endsWith("/messages/billgates") && options.method === "POST") {
      return Promise.resolve({
        status: 201,
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
  await store.dispatch(getMessages("billgates"));
  const state = store.getState().message;
  expect(state.messages[0]).toBeTruthy();
  expect(state.messages[0]).toHaveProperty("message");
  expect(state.messages[0].message).toBe("Hello.");
});

test("getMessages - Error", async () => {
  await store.dispatch(getMessages("hello"));
  const state = store.getState().message;
  expect(state.messages[0]).toBeTruthy();
  expect(state.messages[0]).toHaveProperty("message");
  expect(state.messages[0].message).toBe("Hello.");
});

test("createMessage - React Redux Action Test", async () => {
  await store.dispatch(createMessage("billgates"));
  const state = store.getState().message;
  expect(state.messages[0]).toBeTruthy();
  expect(state.messages[0]).toHaveProperty("message");
  expect(state.messages[0].message).toBe("Hello.");
});
test("createMessage - Error", async () => {
  await store.dispatch(createMessage("warrenBuffet"));
  const state = store.getState().message;
  expect(state.messages[0]).toBeTruthy();
  expect(state.messages[0]).toHaveProperty("message");
  expect(state.messages[0].message).toBe("Hello.");
});
