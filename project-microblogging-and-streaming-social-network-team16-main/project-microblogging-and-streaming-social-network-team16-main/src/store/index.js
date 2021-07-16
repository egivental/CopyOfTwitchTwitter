import { configureStore } from "@reduxjs/toolkit";
import errorState from "./errorState";
import messageState from "./messageState";
import postState from "./postState";
import userState from "./userState";
import livestreamState from "./livestreamState";

export default configureStore({
  reducer: {
    error: errorState.reducer,
    user: userState.reducer,
    post: postState.reducer,
    message: messageState.reducer,
    livestream: livestreamState.reducer,
  },
});
