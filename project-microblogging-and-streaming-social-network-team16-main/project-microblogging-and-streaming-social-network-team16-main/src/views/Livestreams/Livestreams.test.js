import React from "react";
import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import store from "../../store/index";
import Livestreams from "./Livestreams";

test("renders page", () => {
  const { getByText } = render(
    <Provider store={store}>
      <Livestreams />
    </Provider>
  );

  expect(getByText(/Start a Livestream/i)).toBeInTheDocument();
});

// snapshot testing
test("Livestreams matches snapshot", () => {
  const component = renderer.create(
    <Provider store={store}>
      <Livestreams />
    </Provider>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
