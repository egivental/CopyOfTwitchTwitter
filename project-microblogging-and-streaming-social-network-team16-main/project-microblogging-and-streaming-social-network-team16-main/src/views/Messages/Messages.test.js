import React from "react";
import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import store from "../../store/index";
import Messages from "./Messages";

test("renders page", () => {
  const { getByText } = render(
    <Provider store={store}>
      <Messages />
    </Provider>
  );

  expect(getByText(/Select a contact to direct message/i)).toBeInTheDocument();
  expect(getByText(/No user selected to message with/i)).toBeInTheDocument();
});

// snapshot testing
test("Messages matches snapshot", () => {
  const component = renderer.create(
    <Provider store={store}>
      <Messages />
    </Provider>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
