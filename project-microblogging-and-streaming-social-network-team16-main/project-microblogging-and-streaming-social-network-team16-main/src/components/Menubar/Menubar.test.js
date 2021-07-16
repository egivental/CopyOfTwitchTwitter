import React from "react";
import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import store from "../../store/index";
import Menubar from "./Menubar";

test("renders page", () => {
  const { getByText } = render(
    <Provider store={store}>
      <Menubar />
    </Provider>
  );

  expect(getByText(/ABE Twitter/i)).toBeInTheDocument();
  expect(getByText(/Sign In/i)).toBeInTheDocument();
  expect(getByText(/Sign Up/i)).toBeInTheDocument();
});

// snapshot testing
test("Menubar matches snapshot", () => {
  const component = renderer.create(
    <Provider store={store}>
      <Menubar />
    </Provider>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
