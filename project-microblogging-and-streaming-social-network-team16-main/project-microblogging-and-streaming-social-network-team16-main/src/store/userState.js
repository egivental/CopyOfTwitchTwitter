import { createSlice } from "@reduxjs/toolkit";
import { apiBaseUrl } from "../constants/constants";
import { pushError } from "./errorState";

const userState = createSlice({
  name: "user",
  initialState: {
    isUserLoggedIn: null,
    user: null,
    followers: [],
    followees: [],
    otherUsers: [],
  },
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
      if (state.user === null) {
        state.isUserLoggedIn = false;
        state.followers = [];
        state.followees = [];
        state.otherUsers = [];
      } else {
        state.isUserLoggedIn = true;
      }
    },
    updateFollowers: (state, action) => {
      state.followers = action.payload;
    },
    updateFollowees: (state, action) => {
      state.followees = action.payload;
    },
    updateOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
  },
});

export const {
  updateUser,
  updateFollowers,
  updateFollowees,
  updateOtherUsers,
} = userState.actions;

export const createUser = (username, password) => async (dispatch) => {
  const response = await fetch(`${apiBaseUrl}/user`, {
    method: "POST",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      photo: null,
      photo_mime_type: null,
    }),
  });
  if (response.status === 201) {
    await dispatch(getSession());
  } else {
    const data = await response.json();
    await dispatch(pushError(data.message));
  }
};

export const getUsers = () => async (dispatch) => {
  const response = await fetch(`${apiBaseUrl}/users`, {
    method: "GET",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (response.status === 200) {
    await dispatch(updateOtherUsers(data));
  } else {
    await dispatch(pushError(data.message));
  }
};

export const getUser = (username) => async (dispatch) => {
  const response = await fetch(`${apiBaseUrl}/users/${username}`, {
    method: "GET",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (response.status === 200) {
    await dispatch(updateUser(data));
  } else {
    await dispatch(pushError(data.message));
    await dispatch(updateUser(null));
  }
};

export const updateUserProfile = (
  username,
  password,
  photo,
  photoMimeType
) => async (dispatch) => {
  const response = await fetch(`${apiBaseUrl}/users/${username}`, {
    method: "PUT",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password,
      photo,
      photo_mime_type: photoMimeType,
    }),
  });
  const data = await response.json();
  if (response.status === 200) {
    await dispatch(getUser(username));
    alert("User profile successfully updated!");
  } else {
    await dispatch(pushError(data.message));
  }
};

export const deleteUser = (username) => async (dispatch, getState) => {
  const state = getState();
  const loggedInUsername = state.user.user.username;
  const response = await fetch(`${apiBaseUrl}/users/${username}`, {
    method: "DELETE",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (response.status === 200) {
    if (username === loggedInUsername) {
      // Deactivated own account
      await dispatch(deleteSession());
    } else {
      // Blocked another user, refresh followers, followees, and other users
      await dispatch(getUsers());
      await dispatch(getFollowers(username));
      await dispatch(getFollowees(username));
    }
  } else {
    await dispatch(pushError(data.message));
  }
};

export const getFollowers = (username) => async (dispatch) => {
  const response = await fetch(`${apiBaseUrl}/users/${username}/followers`, {
    method: "GET",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (response.status === 200) {
    await dispatch(updateFollowers(data));
  } else {
    await dispatch(pushError(data.message));
  }
};

export const getFollowees = (username) => async (dispatch) => {
  const response = await fetch(`${apiBaseUrl}/users/${username}/followees`, {
    method: "GET",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (response.status === 200) {
    await dispatch(updateFollowees(data));
  } else {
    await dispatch(pushError(data.message));
  }
};

export const followUser = (username, followeeUsername) => async (dispatch) => {
  const response = await fetch(
    `${apiBaseUrl}/users/${username}/followees/${followeeUsername}`,
    {
      method: "PUT",
      credentials: "include",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status === 200) {
    await dispatch(getFollowees(username));
    await dispatch(getUsers());
  } else {
    const data = await response.json();
    await dispatch(pushError(data.message));
  }
};

export const unfollowUser = (username, followeeUsername) => async (
  dispatch
) => {
  const response = await fetch(
    `${apiBaseUrl}/users/${username}/followees/${followeeUsername}`,
    {
      method: "DELETE",
      credentials: "include",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status === 200) {
    await dispatch(getFollowees(username));
    await dispatch(getUsers());
  } else {
    const data = await response.json();
    await dispatch(pushError(data.message));
  }
};

export const getSession = () => async (dispatch) => {
  const response = await fetch(`${apiBaseUrl}/session`, {
    method: "GET",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (response.status === 200) {
    await dispatch(getUser(data.username));
  } else {
    await dispatch(updateUser(null));
  }
};

export const createSession = (username, password) => async (dispatch) => {
  const response = await fetch(`${apiBaseUrl}/session`, {
    method: "POST",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  if (response.status === 201) {
    await dispatch(getUser(username));
  } else {
    const data = await response.json();
    await dispatch(pushError(data.message));
  }
};

export const deleteSession = () => async (dispatch) => {
  await fetch(`${apiBaseUrl}/session`, {
    method: "DELETE",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
  await dispatch(getSession());
};

export const getMediaUrl = (id) => `${apiBaseUrl}/media/${id}`;

export default userState;
