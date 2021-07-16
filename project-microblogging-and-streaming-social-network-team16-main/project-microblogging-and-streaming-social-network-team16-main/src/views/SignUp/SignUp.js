import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { createUser } from "../../store/userState";

/**
 * @returns {SignUp} A SignUp React component.
 */
function SignUp() {
  const dispatch = useDispatch();
  const history = useHistory();
  const userState = useSelector((state) => state.user);
  if (userState.isUserLoggedIn) {
    history.push("/profile");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    const formData = Object.fromEntries(new FormData(form).entries());
    dispatch(createUser(formData.username, formData.password));
  };

  return (
    <div>
      <div id="title" style={{ marginBottom: "40px" }}>
        <h1>Sign Up</h1>
      </div>

      <Form style={{ width: "50%" }} onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control name="username" placeholder="Enter username" />
          <Form.Text className="text-muted">
            The username you wish to have. This will be your @username handle.
            No spaces allowed.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter password"
          />
          <Form.Text className="text-muted">
            The password for your account.
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>
    </div>
  );
}

export default SignUp;
