import { createSlice } from "@reduxjs/toolkit";
import { apiBaseUrl } from "../constants/constants";
import { pushError } from "./errorState";

const postState = createSlice({
  name: "post",
  initialState: {
    posts: null,
  },
  reducers: {
    updatePosts: (state, action) => {
      state.posts = action.payload;
    },
  },
});

export const { updatePosts } = postState.actions;

export const getPosts = () => async (dispatch) => {
  const response = await fetch(`${apiBaseUrl}/posts`, {
    method: "GET",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (response.status === 200) {
    await dispatch(updatePosts(data));
  } else {
    await dispatch(pushError(data.message));
  }
};

export const createPost = (message, attachment, attachmentMimeType) => async (
  dispatch
) => {
  const response = await fetch(`${apiBaseUrl}/post`, {
    method: "POST",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      attachment,
      attachment_mime_type: attachmentMimeType,
    }),
  });
  if (response.status === 201) {
    await dispatch(getPosts());
  } else {
    const data = await response.json();
    await dispatch(pushError(data.message));
  }
};

export const deletePost = (postId) => async (dispatch) => {
  const response = await fetch(`${apiBaseUrl}/posts/${postId}`, {
    method: "DELETE",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 200) {
    await dispatch(getPosts());
  } else {
    const data = await response.json();
    await dispatch(pushError(data.message));
  }
};

export const createComment = (postId, message) => async (dispatch) => {
  const response = await fetch(`${apiBaseUrl}/posts/${postId}/comment`, {
    method: "POST",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });
  if (response.status === 201) {
    await dispatch(getPosts());
  } else {
    const data = await response.json();
    await dispatch(pushError(data.message));
  }
};

export const updateComment = (postId, commentId, message) => async (
  dispatch
) => {
  const response = await fetch(
    `${apiBaseUrl}/posts/${postId}/comments/${commentId}`,
    {
      method: "PUT",
      credentials: "include",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    }
  );
  if (response.status === 200) {
    await dispatch(getPosts());
  } else {
    const data = await response.json();
    await dispatch(pushError(data.message));
  }
};

export const deleteComment = (postId, commentId) => async (dispatch) => {
  const response = await fetch(
    `${apiBaseUrl}/posts/${postId}/comments/${commentId}`,
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
    await dispatch(getPosts());
  } else {
    const data = await response.json();
    await dispatch(pushError(data.message));
  }
};

export default postState;
