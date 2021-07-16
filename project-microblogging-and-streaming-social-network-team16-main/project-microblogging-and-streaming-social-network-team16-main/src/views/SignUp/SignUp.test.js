import React from "react";
import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import store from "../../store/index";
import SignUp from "./SignUp";

test("renders page", () => {
  const { getByText } = render(
    <Provider store={store}>
      <SignUp />
    </Provider>
  );

  expect(
    getByText(
      /The username you wish to have. This will be your @username handle./i
    )
  ).toBeInTheDocument();
});

// snapshot testing
test("SignUp matches snapshot", () => {
  const component = renderer.create(
    <Provider store={store}>
      <SignUp />
    </Provider>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
