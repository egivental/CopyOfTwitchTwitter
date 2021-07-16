import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../store/index";
import Profile from "./Profile";

test("renders page", () => {
  const { getByText } = render(
    <Provider store={store}>
      <Profile />
    </Provider>
  );

  expect(getByText(/Your username/i)).toBeInTheDocument();
  expect(getByText(/Change your password/i)).toBeInTheDocument();
  expect(getByText(/Upload a profile photo/i)).toBeInTheDocument();
  expect(getByText(/Update Profile/i)).toBeInTheDocument();
  expect(getByText(/Deactivate Account/i)).toBeInTheDocument();
});
