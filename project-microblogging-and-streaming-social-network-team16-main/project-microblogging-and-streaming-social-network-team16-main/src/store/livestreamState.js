import { createSlice } from "@reduxjs/toolkit";
import { apiBaseUrl } from "../constants/constants";
import { pushError } from "./errorState";
import { getSession } from "./userState";

const livestreamState = createSlice({
  name: "livestream",
  initialState: {
    livestreams: null,
  },
  reducers: {
    updateLivestreams: (state, action) => {
      state.livestreams = action.payload;
    },
  },
});

export const { updateLivestreams } = livestreamState.actions;

export const createLivestream = () => async (dispatch) => {
  const response = await fetch(`${apiBaseUrl}/livestream`, {
    method: "POST",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 201) {
    await dispatch(getLivestreams());
  } else {
    const data = await response.json();
    await dispatch(pushError(data.message));
  }
};

export const getLivestreams = () => async (dispatch) => {
  const response = await fetch(`${apiBaseUrl}/livestreams`, {
    method: "GET",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (response.status === 200) {
    await dispatch(updateLivestreams(data));
    await dispatch(getSession());
  } else {
    await dispatch(pushError(data.message));
  }
};

export const deleteLivestream = (room) => async (dispatch) => {
  const response = await fetch(`${apiBaseUrl}/livestreams/${room}`, {
    method: "DELETE",
    credentials: "include",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 200) {
    await dispatch(getLivestreams());
  } else {
    const data = await response.json();
    await dispatch(pushError(data.message));
  }
};

export const createLivestreamComment = (room, message) => async (dispatch) => {
  const response = await fetch(`${apiBaseUrl}/livestreams/${room}/comment`, {
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
    await dispatch(getLivestreams());
  } else {
    const data = await response.json();
    await dispatch(pushError(data.message));
  }
};

export const updateLivestreamComment = (room, commentId, message) => async (
  dispatch
) => {
  const response = await fetch(
    `${apiBaseUrl}/livestreams/${room}/comments/${commentId}`,
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
    await dispatch(getLivestreams());
  } else {
    const data = await response.json();
    await dispatch(pushError(data.message));
  }
};

export const deleteLivestreamComment = (room, commentId) => async (
  dispatch
) => {
  const response = await fetch(
    `${apiBaseUrl}/livestreams/${room}/comments/${commentId}`,
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
    await dispatch(getLivestreams());
  } else {
    const data = await response.json();
    await dispatch(pushError(data.message));
  }
};

export default livestreamState;
