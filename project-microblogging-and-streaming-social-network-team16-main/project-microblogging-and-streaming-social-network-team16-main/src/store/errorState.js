import { createSlice } from "@reduxjs/toolkit";

const errorState = createSlice({
  name: "error",
  initialState: {
    errors: [],
  },
  reducers: {
    pushError: (state, action) => {
      state.errors.push(action.payload);
    },
    popError: (state) => {
      state.errors.shift();
    },
  },
});

export const { pushError, popError } = errorState.actions;

export default errorState;
