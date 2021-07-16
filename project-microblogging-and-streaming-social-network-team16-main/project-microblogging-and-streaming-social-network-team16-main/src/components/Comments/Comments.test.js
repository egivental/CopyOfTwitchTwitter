import React from "react";
import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import store from "../../store/index";
import Comments from "./Comments";

test("renders page", () => {
  const { getByText } = render(
    <Provider store={store}>
      <Comments
        comments={[]}
        parent=""
        createAction={() => {}}
        updateAction={() => {}}
        deleteAction={() => {}}
      />
    </Provider>
  );

  expect(getByText(/Comments/i)).toBeInTheDocument();
  expect(getByText(/Create a new Comment/i)).toBeInTheDocument();
});

// snapshot testing
test("Comments matches snapshot", () => {
  const component = renderer.create(
    <Provider store={store}>
      <Comments
        comments={[]}
        parent=""
        createAction={() => {}}
        updateAction={() => {}}
        deleteAction={() => {}}
      />
    </Provider>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
