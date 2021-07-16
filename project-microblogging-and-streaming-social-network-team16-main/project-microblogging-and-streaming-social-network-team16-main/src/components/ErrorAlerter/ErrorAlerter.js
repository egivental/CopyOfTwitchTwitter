import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { popError } from "../../store/errorState";

/**
 * @returns {ErrorAlerter} A ErrorAlerter React component.
 */
function ErrorAlerter() {
  const dispatch = useDispatch();
  const errorState = useSelector((state) => state.error);

  if (errorState.errors.length > 0) {
    alert(errorState.errors[0]);
    dispatch(popError());
  }

  return <span />;
}

export default ErrorAlerter;
