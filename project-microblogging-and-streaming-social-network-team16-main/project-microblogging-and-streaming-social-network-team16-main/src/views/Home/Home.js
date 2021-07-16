import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Card from "react-bootstrap/Card";

/**
 * @returns {Home} A Home React component.
 */
function Home() {
  const history = useHistory();
  const userState = useSelector((state) => state.user);
  if (userState.isUserLoggedIn) {
    history.push("/feed");
  }

  return (
    <div>
      <div id="title" style={{ marginBottom: "40px" }}>
        <h1>Home</h1>
      </div>

      <Card border="secondary">
        <Card.Body>
          <Card.Title>Welcome</Card.Title>
          <Card.Text>
            To get started making posts to share, just sign up or sign in!
          </Card.Text>
          <a href="/signin" style={{ marginRight: "10px" }}>
            Sign In
          </a>
          <a href="/signup">Sign Up</a>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Home;
