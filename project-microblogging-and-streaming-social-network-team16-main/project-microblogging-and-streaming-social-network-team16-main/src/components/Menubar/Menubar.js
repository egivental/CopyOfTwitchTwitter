import React from "react";
import { useSelector } from "react-redux";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

/**
 * @returns {Menubar} A Menubar React component.
 */
function Menubar() {
  const userState = useSelector((state) => state.user);
  let navLinks = (
    <Nav className="ml-auto">
      <Nav.Link href="/signup">Sign Up</Nav.Link>
      <Nav.Link href="/signin">Sign In</Nav.Link>
    </Nav>
  );
  if (userState.isUserLoggedIn) {
    navLinks = (
      <Nav className="ml-auto">
        <Nav.Link href="/feed">Posts</Nav.Link>
        <Nav.Link href="/streams">Livestreams</Nav.Link>
        <Nav.Link href="/contacts">Contacts</Nav.Link>
        <Nav.Link href="/inbox">Messages</Nav.Link>
        <Nav.Link href="/profile">Profile</Nav.Link>
        <Nav.Link href="/signout">Sign Out</Nav.Link>
      </Nav>
    );
  }

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/home">
        <strong>ABE Twitter</strong>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse id="basic-navbar-nav">{navLinks}</Navbar.Collapse>
    </Navbar>
  );
}

export default Menubar;
