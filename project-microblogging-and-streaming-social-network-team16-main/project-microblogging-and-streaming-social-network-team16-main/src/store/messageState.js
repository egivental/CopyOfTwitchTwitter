import { createSlice } from "@reduxjs/toolkit";
import { apiBaseUrl } from "../constants/constants";
import { pushError } from "./errorState";

const messageState = createSlice({
  name: "message",
  initialState: {
    messages: null,
  },
  reducers: {
    updateMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const { updateMessages } = messageState.actions;

export const getMessages = (username) => async (dispatch) => {
  const response = await fetch(`${apiBaseUrl}/messages/${username}`, {
    method: "GET",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (response.status === 200) {
    await dispatch(updateMessages(data));
  } else {
    await dispatch(pushError(data.message));
  }
};

export const createMessage = (
  username,
  message,
  attachment,
  attachmentMimeType
) => async (dispatch) => {
  const response = await fetch(`${apiBaseUrl}/messages/${username}`, {
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
    await dispatch(getMessages(username));
  } else {
    const data = await response.json();
    await dispatch(pushError(data.message));
  }
};

export default messageState;
