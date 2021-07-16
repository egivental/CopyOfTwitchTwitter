import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form, Card, CardDeck, Badge } from "react-bootstrap";
import {
  deleteUser,
  followUser,
  unfollowUser,
  getUsers,
  getFollowers,
  getFollowees,
} from "../../store/userState";

/**
 * @returns {Contacts} A Contact React component.
 */
function Contacts() {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [search, setSearch] = useState("");

  if (!initialDataFetched) {
    if (userState.user) {
      setInitialDataFetched(true);
      dispatch(getUsers());
      dispatch(getFollowers(userState.user.username));
      dispatch(getFollowees(userState.user.username));
    }
  }

  return (
    <div>
      <h1>Contacts</h1>
      <CardDeck>
        <Card>
          <Card.Body>
            <Card.Title>Followers</Card.Title>
            {userState.followers.length === 0 ? "No followers." : null}
            {userState.followers.map((user) => {
              const isFollowing = userState.followees
                .map((user2) => user2.username)
                .includes(user.username);
              return (
                <Form className="mb-3" key={`followers-${user.username}`}>
                  <Form.Group className="mb-1">
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue={`@${user.username}`}
                    />
                  </Form.Group>
                  {isFollowing ? (
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() =>
                        dispatch(
                          unfollowUser(userState.user.username, user.username)
                        )
                      }
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() =>
                        dispatch(
                          followUser(userState.user.username, user.username)
                        )
                      }
                    >
                      Follow
                    </Button>
                  )}{" "}
                  <Button
                    variant="danger"
                    type="submit"
                    onClick={() => dispatch(deleteUser(user.username))}
                  >
                    {user.blocked ? "Unblock" : "Block"}
                  </Button>
                </Form>
              );
            })}
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Following</Card.Title>
            {userState.followees.length === 0 ? "Not following anyone." : null}
            {userState.followees.map((user) => (
              <Form className="mb-3" key={`followees-${user.username}`}>
                <Form.Group className="mb-1">
                  <Form.Control
                    plaintext
                    readOnly
                    defaultValue={`@${user.username}`}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="button"
                  onClick={() =>
                    dispatch(
                      unfollowUser(userState.user.username, user.username)
                    )
                  }
                >
                  Unfollow
                </Button>{" "}
                <Button
                  variant="danger"
                  type="submit"
                  onClick={() => dispatch(deleteUser(user.username))}
                >
                  {user.blocked ? "Unblock" : "Block"}
                </Button>
              </Form>
            ))}
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Other Users</Card.Title>

            <Form.Group controlId="searchUsers">
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Form.Text className="text-muted">
                Filter users by searching.
              </Form.Text>
            </Form.Group>
            {userState.otherUsers.length === 0 ? "No other users." : null}
            {userState.otherUsers
              .filter((user) => {
                if (search.trim().length === 0) {
                  return true;
                }
                return user.username.includes(search);
              })
              .map((user) => (
                <Form className="mb-3" key={`otherUsers-${user.username}`}>
                  <Form.Group className="mb-1">
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue={`@${user.username}`}
                    />
                    {user.suggested ? (
                      <Badge variant="secondary" style={{ display: "inline" }}>
                        SUGGESTED
                      </Badge>
                    ) : null}
                  </Form.Group>
                  {!user.blocked ? (
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() =>
                        dispatch(
                          followUser(userState.user.username, user.username)
                        )
                      }
                    >
                      Follow
                    </Button>
                  ) : null}{" "}
                  <Button
                    variant="danger"
                    type="submit"
                    onClick={() => dispatch(deleteUser(user.username))}
                  >
                    {user.blocked ? "Unblock" : "Block"}
                  </Button>
                </Form>
              ))}
          </Card.Body>
        </Card>
      </CardDeck>
    </div>
  );
}

export default Contacts;
