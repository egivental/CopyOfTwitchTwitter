import store from "./index";
import {
  createUser,
  getUsers,
  updateUserProfile,
  deleteUser,
  getFollowers,
  getFollowees,
  followUser,
  unfollowUser,
  createSession,
  deleteSession,
} from "./userState";

// Mock the backend
beforeAll(() => jest.spyOn(global, "fetch"));
beforeEach(() =>
  global.fetch.mockImplementation((url, options) => {
    // Mock create user endpoints
    if (
      url.endsWith("/user") &&
      options.method === "POST" &&
      JSON.parse(options.body).username === "billgates"
    ) {
      return Promise.resolve({
        status: 201,
      });
    }
    if (
      url.endsWith("/user") &&
      options.method === "POST" &&
      JSON.parse(options.body).username === "warrenbuffet"
    ) {
      return Promise.resolve({
        status: 400,
        json: () =>
          Promise.resolve({
            message: "This is an error message.",
          }),
      });
    }

    // Mock get user endpoints
    if (url.endsWith("/users/billgates") && options.method === "GET") {
      return Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            username: "billgates",
            registration_date: 1614885848983,
            photo: "1e265a87-0260-4f53-ac30-2fa3fd3bc07c",
            failed_login_attempts: 0,
            last_failed_login_attempt_date: 1614885848983,
            is_livestreaming: true,
            livestream_date: 1614885848983,
            deactivated: false,
            blocked: false,
            suggested: false,
          }),
      });
    }
    if (url.endsWith("/users") && options.method === "GET") {
      return Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve([
            {
              username: "billgates",
              registration_date: 1614885848983,
              photo: "1e265a87-0260-4f53-ac30-2fa3fd3bc07c",
              failed_login_attempts: 0,
              last_failed_login_attempt_date: 1614885848983,
              is_livestreaming: true,
              livestream_date: 1614885848983,
              deactivated: false,
              blocked: false,
              suggested: false,
            },
          ]),
      });
    }
    if (url.endsWith("/users") && options.method === "GET") {
      return Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve([
            {
              username: "billgates",
              registration_date: 1614885848983,
              photo: "1e265a87-0260-4f53-ac30-2fa3fd3bc07c",
              failed_login_attempts: 0,
              last_failed_login_attempt_date: 1614885848983,
              is_livestreaming: true,
              livestream_date: 1614885848983,
              deactivated: false,
              blocked: false,
              suggested: false,
            },
          ]),
      });
    }
    if (
      url.endsWith("/users/billgates/followers") &&
      options.method === "GET"
    ) {
      return Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve([
            {
              username: "billgates",
              registration_date: 1614885848983,
              photo: "1e265a87-0260-4f53-ac30-2fa3fd3bc07c",
              failed_login_attempts: 0,
              last_failed_login_attempt_date: 1614885848983,
              is_livestreaming: true,
              livestream_date: 1614885848983,
              deactivated: false,
              blocked: false,
              suggested: false,
            },
          ]),
      });
    }
    if (
      url.endsWith("/users/billgates/followees") &&
      options.method === "GET"
    ) {
      return Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve([
            {
              username: "billgates",
              registration_date: 1614885848983,
              photo: "1e265a87-0260-4f53-ac30-2fa3fd3bc07c",
              failed_login_attempts: 0,
              last_failed_login_attempt_date: 1614885848983,
              is_livestreaming: true,
              livestream_date: 1614885848983,
              deactivated: false,
              blocked: false,
              suggested: false,
            },
          ]),
      });
    }
    if (
      url.endsWith("/users/billgates/followees/warrenbuffet") &&
      options.method === "PUT"
    ) {
      return Promise.resolve({
        status: 200,
      });
    }
    if (
      url.endsWith("/users/billgates/followees/warrenbuffet") &&
      options.method === "DELETE"
    ) {
      return Promise.resolve({
        status: 200,
      });
    }

    // Mock get session endpoint
    if (url.endsWith("/session") && options.method === "GET") {
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ username: "billgates" }),
      });
    }

    // Mock post session endpoint
    if (url.endsWith("/session") && options.method === "POST") {
      return Promise.resolve({
        status: 201,
      });
    }

    // Mock delete session endpoint
    if (url.endsWith("/session") && options.method === "DELETE") {
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

test("createUser - React Redux Action Test", async () => {
  let state = store.getState().user;
  await store.dispatch(createUser("billgates", "password"));
  state = store.getState().user;
  expect(state.user).toBeTruthy();
  expect(state.user).toHaveProperty("username");
  expect(state.user).toHaveProperty("registration_date");
  expect(state.isUserLoggedIn).toBe(true);
});

test("getUsers - React Redux Action Test", async () => {
  let state = store.getState().user;
  await store.dispatch(getUsers());
  state = store.getState().user;
  expect(state.otherUsers).toBeTruthy();
  expect(state.otherUsers[0]).toHaveProperty("username");
  expect(state.otherUsers[0]).toHaveProperty("registration_date");
});

test("updateUserProfile - React Redux Action Test", async () => {
  let state = store.getState().user;
  await store.dispatch(updateUserProfile());
  state = store.getState().user;
  expect(state.user).toBeTruthy();
  expect(state.user).toHaveProperty("username");
  expect(state.user).toHaveProperty("registration_date");
});

test("deleteUser - React Redux Action Test", async () => {
  await store.dispatch(deleteUser());
});

test("getFollowers - React Redux Action Test", async () => {
  let state = store.getState().user;
  await store.dispatch(getFollowers("billgates"));
  state = store.getState().user;
  expect(state.followers).toBeTruthy();
  expect(state.followers[0]).toHaveProperty("username");
  expect(state.followers[0]).toHaveProperty("registration_date");
});

test("getFollowees - React Redux Action Test", async () => {
  let state = store.getState().user;
  await store.dispatch(getFollowees("billgates"));
  state = store.getState().user;
  expect(state.followees).toBeTruthy();
  expect(state.followees[0]).toHaveProperty("username");
  expect(state.followees[0]).toHaveProperty("registration_date");
});

test("followUser - React Redux Action Test", async () => {
  let state = store.getState().user;
  await store.dispatch(followUser("billgates", "warrenbuffet"));
  state = store.getState().user;
  expect(state.followees).toBeTruthy();
  expect(state.followees[0]).toHaveProperty("username");
  expect(state.followees[0]).toHaveProperty("registration_date");
});

test("unfollowUser - React Redux Action Test", async () => {
  let state = store.getState().user;
  await store.dispatch(unfollowUser("billgates", "warrenbuffet"));
  state = store.getState().user;
  expect(state.followees).toBeTruthy();
  expect(state.followees[0]).toHaveProperty("username");
  expect(state.followees[0]).toHaveProperty("registration_date");
});

test("createSession - React Redux Action Test", async () => {
  let state = store.getState().user;
  await store.dispatch(createSession("billgates", "password"));
  state = store.getState().user;
  expect(state.user).toBeTruthy();
  expect(state.user).toHaveProperty("username");
  expect(state.user).toHaveProperty("registration_date");
  expect(state.isUserLoggedIn).toBe(true);
});

test("deleteSession - React Redux Action Test", async () => {
  await store.dispatch(deleteSession());
});
