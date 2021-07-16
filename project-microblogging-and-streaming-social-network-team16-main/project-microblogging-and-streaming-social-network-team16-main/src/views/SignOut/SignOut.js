import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deleteSession } from "../../store/userState";

/**
 * @returns {SignOut} A SignOut React component.
 */
function SignOut() {
  const dispatch = useDispatch();
  const history = useHistory();
  const userState = useSelector((state) => state.user);
  if (userState.isUserLoggedIn) {
    dispatch(deleteSession());
    history.push("/signin");
  }

  return (
    <div>
      <div id="title" style={{ marginBottom: "40px" }}>
        <h1>Sign Out</h1>
      </div>
      <p>Signing out...</p>
    </div>
  );
}

export default SignOut;
