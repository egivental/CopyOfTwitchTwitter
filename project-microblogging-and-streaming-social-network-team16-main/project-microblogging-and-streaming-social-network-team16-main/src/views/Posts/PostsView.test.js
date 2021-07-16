import React from "react";
import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import store from "../../store/index";
import PostsView from "./PostsView";

test("renders page", () => {
  const { getByText } = render(
    <Provider store={store}>
      <PostsView />
    </Provider>
  );

  expect(getByText(/What is on your mind?/i)).toBeInTheDocument();
  expect(getByText(/Filter by #/i)).toBeInTheDocument();
});

// snapshot testing
test("PostsView matches snapshot", () => {
  const component = renderer.create(
    <Provider store={store}>
      <PostsView />
    </Provider>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
