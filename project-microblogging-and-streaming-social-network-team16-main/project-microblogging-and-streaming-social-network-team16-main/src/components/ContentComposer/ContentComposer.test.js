import React from "react";
import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import store from "../../store/index";
import ContentComposer from "./ContentComposer";

test("renders page", () => {
  const { getByText } = render(
    <Provider store={store}>
      <ContentComposer
        action="Post"
        title="The title"
        createAction={() => {}}
      />
    </Provider>
  );

  expect(getByText(/Post/i)).toBeInTheDocument();
  expect(getByText(/The title/i)).toBeInTheDocument();
});

// snapshot testing
test("ContentComposer matches snapshot", () => {
  const component = renderer.create(
    <Provider store={store}>
      <ContentComposer
        action="Post"
        title="The title"
        createAction={() => {}}
      />
    </Provider>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
