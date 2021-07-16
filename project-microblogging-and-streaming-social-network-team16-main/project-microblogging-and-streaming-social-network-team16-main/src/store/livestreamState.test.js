import store from "./index";
import {
  createLivestream,
  getLivestreams,
  deleteLivestream,
  createLivestreamComment,
  updateLivestreamComment,
  deleteLivestreamComment,
} from "./livestreamState";

// Mock the backend
beforeAll(() => jest.spyOn(global, "fetch"));
beforeEach(() =>
  global.fetch.mockImplementation((url, options) => {
    // Mock create livestream endpoints
    if (url.endsWith("/livestream") && options.method === "POST") {
      return Promise.resolve({
        status: 201,
      });
    }

    // Mock get livestream endpoints
    if (url.endsWith("/livestreams") && options.method === "GET") {
      return Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve([
            {
              room: "billgates",
              photo: "1e265a87-0260-4f53-ac30-2fa3fd3bc07c",
              grant: "twilio_video_grant_token",
              comments: [
                {
                  name: "1e265a87-0260-4f53-ac30-2fa3fd3bc07c",
                  livestream_user: "billgates",
                  user: "billgates",
                  photo: "1e265a87-0260-4f53-ac30-2fa3fd3bc07c",
                  date: 1614885848983,
                  message: "Hello.",
                },
              ],
            },
          ]),
      });
    }

    // Mock delete livestream endpoint
    if (
      url.endsWith("/livestreams/warrenbuffet") &&
      options.method === "DELETE"
    ) {
      return Promise.resolve({
        status: 200,
      });
    }

    // Mock create livestream comment endpoint
    if (
      url.endsWith("/livestreams/warrenbuffet/comment") &&
      options.method === "POST"
    ) {
      return Promise.resolve({
        status: 201,
      });
    }

    // Mock update livestream comment endpoint
    if (
      url.endsWith("/livestreams/warrenbuffet/comments/1") &&
      options.method === "PUT"
    ) {
      return Promise.resolve({
        status: 200,
      });
    }

    // Mock delete livestream comment endpoint
    if (
      url.endsWith("/livestreams/warrenbuffet/comments/1") &&
      options.method === "DELETE"
    ) {
      return Promise.resolve({
        status: 200,
      });
    }

    // Else
    return Promise.resolve({
      status: 404,
      json: () =>
        Promise.resolve({
          message: "Endpoint not found.",
        }),
    });
  })
);

test("createLivestream - React Redux Action Test", async () => {
  let state = store.getState().livestream;
  await store.dispatch(createLivestream());
  state = store.getState().livestream;
  expect(state.livestreams[0]).toBeTruthy();
  expect(state.livestreams[0]).toHaveProperty("room");
  expect(state.livestreams[0].room).toBe("billgates");
});

test("getLivestreams - React Redux Action Test", async () => {
  let state = store.getState().livestream;
  await store.dispatch(getLivestreams());
  state = store.getState().livestream;
  expect(state.livestreams[0]).toBeTruthy();
  expect(state.livestreams[0]).toHaveProperty("room");
  expect(state.livestreams[0].room).toBe("billgates");
});

test("deleteLivestream - React Redux Action Test", async () => {
  let state = store.getState().livestream;
  await store.dispatch(deleteLivestream("warrenbuffet"));
  state = store.getState().livestream;
  expect(state.livestreams[0]).toBeTruthy();
  expect(state.livestreams[0]).toHaveProperty("room");
  expect(state.livestreams[0].room).toBe("billgates");
});

test("createLivestreamComment - React Redux Action Test", async () => {
  let state = store.getState().livestream;
  await store.dispatch(createLivestreamComment("warrenbuffet", "hello"));
  state = store.getState().livestream;
  expect(state.livestreams[0]).toBeTruthy();
  expect(state.livestreams[0]).toHaveProperty("room");
  expect(state.livestreams[0].room).toBe("billgates");
});

test("updateLivestreamComment - React Redux Action Test", async () => {
  let state = store.getState().livestream;
  await store.dispatch(updateLivestreamComment("warrenbuffet", 1));
  state = store.getState().livestream;
  expect(state.livestreams).toBeTruthy();
  expect(state.livestreams[0]).toHaveProperty("room");
  expect(state.livestreams[0].room).toBe("billgates");
});

test("deleteLivestreamComment - React Redux Action Test", async () => {
  let state = store.getState().livestream;
  await store.dispatch(deleteLivestreamComment("warrenbuffet", 1));
  state = store.getState().livestream;
  expect(state.livestreams).toBeTruthy();
  expect(state.livestreams[0]).toHaveProperty("room");
  expect(state.livestreams[0].room).toBe("billgates");
});
