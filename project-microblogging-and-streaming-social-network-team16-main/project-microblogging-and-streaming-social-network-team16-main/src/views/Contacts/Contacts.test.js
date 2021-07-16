import React from "react";
import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import store from "../../store/index";
import Contacts from "./Contacts";

test("renders page", () => {
  const { getByText } = render(
    <Provider store={store}>
      <Contacts />
    </Provider>
  );

  expect(getByText(/Contacts/i)).toBeInTheDocument();
});

// snapshot testing
test("Contacts matches snapshot", () => {
  const component = renderer.create(
    <Provider store={store}>
      <Contacts />
    </Provider>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
