import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { createSession } from "../../store/userState";

/**
 * @returns {SignIn} A SignIn React component.
 */
function SignIn() {
  const dispatch = useDispatch();
  const history = useHistory();
  const userState = useSelector((state) => state.user);
  if (userState.isUserLoggedIn) {
    history.push("/feed");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    const formData = Object.fromEntries(new FormData(form).entries());
    dispatch(createSession(formData.username, formData.password));
  };

  return (
    <div>
      <div id="title" style={{ marginBottom: "40px" }}>
        <h1>Sign In</h1>
      </div>

      <Form style={{ width: "50%" }} onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control name="username" placeholder="Enter username" />
          <Form.Text className="text-muted">Your username.</Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter password"
          />
          <Form.Text className="text-muted">Your password.</Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Sign In
        </Button>
      </Form>
    </div>
  );
}

export default SignIn;
