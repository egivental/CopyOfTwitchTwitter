import React from "react";
import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import store from "../../store/index";
import SignIn from "./SignIn";

test("renders page", () => {
  const { getByText } = render(
    <Provider store={store}>
      <SignIn />
    </Provider>
  );

  expect(getByText(/Your username/i)).toBeInTheDocument();
  expect(getByText(/Your password/i)).toBeInTheDocument();
});

// snapshot testing
test("SignIn matches snapshot", () => {
  const component = renderer.create(
    <Provider store={store}>
      <SignIn />
    </Provider>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
