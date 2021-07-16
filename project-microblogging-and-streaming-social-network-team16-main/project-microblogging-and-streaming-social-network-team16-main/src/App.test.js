import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import store from "./store/index";
import App from "./App";

test("renders header", () => {
  const { getByText } = render(
    <Provider store={store}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Provider>
  );

  expect(getByText(/ABE Twitter/i)).toBeInTheDocument();
});
