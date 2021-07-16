import _ from "lodash";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import moment from "moment";
import { createMessage, getMessages } from "../../store/messageState";
import { getFollowers, getFollowees, getMediaUrl } from "../../store/userState";

import ContentComposer from "../../components/ContentComposer/ContentComposer";

/**
 * @returns {Messages} A Messages React component.
 */
function Messages() {
  const dispatch = useDispatch();
  const messageState = useSelector((state) => state.message);
  const userState = useSelector((state) => state.user);
  const [initialContactsFetched, setInitialContactsFetched] = useState(false);
  const [otherUser, setOtherUser] = useState(null);

  // Fetch contacts
  if (!initialContactsFetched) {
    if (userState.user) {
      setInitialContactsFetched(true);
      dispatch(getFollowers(userState.user.username));
      dispatch(getFollowees(userState.user.username));
    }
  }

  // Get contacts
  const contacts = _.uniq(
    userState.followers
      .map((u) => u.username)
      .concat(userState.followees.map((u) => u.username))
  );

  // Periodically update messages
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(getMessages(otherUser));
    }, 1500);
    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, otherUser]);

  let { messages } = messageState;

  // Only fetch messages if messages haven't been fetched yet (prevents an infinite loop)
  if (messages === null) {
    dispatch(getMessages(otherUser));
    messages = [];
  }

  // Render messages
  const displayMessages = messages.map((message) => (
    <Card className="mb-4" key={message.id}>
      <Row>
        <Col md="auto">
          <Image
            width={80}
            height={80}
            alt="80x80"
            className="m-3"
            src={
              message.photo
                ? getMediaUrl(message.photo)
                : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
            }
          />
        </Col>
        <Col>
          <Card.Body>
            <Card.Title>@{message.from_user}</Card.Title>
            <div>
              <Card.Text>{message.message}</Card.Text>
            </div>
            {message.attachment_type && (
              <Row>
                <Col
                  style={{
                    marginTop: "20px",
                    textAlign: "center",
                  }}
                >
                  {message.attachment_type &&
                  message.attachment_type.startsWith("image") ? (
                    <img
                      src={getMediaUrl(message.attachment)}
                      alt={message.message}
                      style={{ maxWidth: "60%" }}
                    />
                  ) : null}
                  {message.attachment_type &&
                  message.attachment_type.startsWith("video") ? (
                    <video
                      src={getMediaUrl(message.attachment)}
                      style={{ maxWidth: "60%" }}
                      controls
                      autoPlay
                      loop
                    />
                  ) : null}
                  {message.attachment_type &&
                  message.attachment_type.startsWith("audio") ? (
                    <audio
                      src={getMediaUrl(message.attachment)}
                      style={{ maxWidth: "60%" }}
                      controls
                      loop
                    />
                  ) : null}
                </Col>
              </Row>
            )}
          </Card.Body>
        </Col>
      </Row>
      <Card.Footer className="text-muted">
        <Row>
          <Col>{moment.unix(message.date / 1000).fromNow()}</Col>
          <Col md="auto">
            {userState.user.username === message.from_user ? (
              <span>
                <b>Delivered Date: </b>
                {message.delivered_date === 0
                  ? "TBD"
                  : moment.unix(message.delivered_date / 1000).fromNow()}{" "}
                <b style={{ marginLeft: "15px" }}>Read Date: </b>
                {message.read_date === 0
                  ? "TBD"
                  : moment.unix(message.read_date / 1000).fromNow()}
              </span>
            ) : null}
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  ));

  // Render
  return (
    <div>
      <div id="title" style={{ marginBottom: "40px" }}>
        <h1>Messages</h1>
      </div>
      Select a contact to direct message:{" "}
      <Dropdown
        style={{ marginBottom: "20px" }}
        onSelect={(e) => setOtherUser(e)}
      >
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          {otherUser || "None"}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {contacts.map((c) => (
            <Dropdown.Item key={`dropdown-${c}`} eventKey={c}>
              @{c}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {otherUser ? (
        <div>
          <ContentComposer
            action="Send Message"
            title={`Send a direct message to @${otherUser}...`}
            createAction={(message, attachment, attachmentType) =>
              createMessage(otherUser, message, attachment, attachmentType)
            }
          />
          <h5>Messages between you and {`@${otherUser}`}</h5>
          <hr />
          <div>{displayMessages}</div>
          {displayMessages.length === 0 ? "No messages." : null}
        </div>
      ) : (
        <div>
          <hr />
          No user selected to message with.
        </div>
      )}
    </div>
  );
}

export default Messages;
