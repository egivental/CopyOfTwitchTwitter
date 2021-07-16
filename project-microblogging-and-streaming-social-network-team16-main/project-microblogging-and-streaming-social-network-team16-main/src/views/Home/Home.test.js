import React from "react";
import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import store from "../../store/index";
import Home from "./Home";

test("renders page", () => {
  const { getByText } = render(
    <Provider store={store}>
      <Home />
    </Provider>
  );

  expect(
    getByText(/To get started making posts to share, just sign up or sign in!/i)
  ).toBeInTheDocument();
});

// snapshot testing
test("Home matches snapshot", () => {
  const component = renderer.create(
    <Provider store={store}>
      <Home />
    </Provider>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
