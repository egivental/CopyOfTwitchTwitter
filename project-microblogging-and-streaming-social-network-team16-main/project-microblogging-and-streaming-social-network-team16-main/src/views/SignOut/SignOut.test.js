import React from "react";
import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import store from "../../store/index";
import SignOut from "./SignOut";

test("renders page", () => {
  const { getByText } = render(
    <Provider store={store}>
      <SignOut />
    </Provider>
  );

  expect(getByText(/Signing out/i)).toBeInTheDocument();
});

// snapshot testing
test("SignOut matches snapshot", () => {
  const component = renderer.create(
    <Provider store={store}>
      <SignOut />
    </Provider>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
