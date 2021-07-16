import React from "react";
import moment from "moment";
import { Button, Card, Row, Col, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createLivestream, getLivestreams } from "../../store/livestreamState";
import { getMediaUrl } from "../../store/userState";

/**
 * @returns {Livestreams} A Livestreams React component.
 */
function Livestreams() {
  const dispatch = useDispatch();
  const history = useHistory();
  const userState = useSelector((state) => state.user);
  const livestreamState = useSelector((state) => state.livestream);
  let { livestreams } = livestreamState;
  const isLivestreaming = userState.user && userState.user.is_livestreaming;

  if (livestreams === null) {
    dispatch(getLivestreams());
    livestreams = [];
  }

  const handleStart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isLivestreaming) {
      dispatch(createLivestream());
    }
    history.push(`/streams/${userState.user.username}`);
  };

  const currentLivestreams = livestreams.map((livestream) => (
    <div
      key={livestream.room}
      style={{ cursor: "pointer" }}
      onClick={() => history.push(`/streams/${livestream.room}`)}
    >
      <Card className="mb-4">
        <Row>
          <Col md="auto">
            <Image
              width={80}
              height={80}
              alt="80x80"
              src={
                livestream.photo
                  ? getMediaUrl(livestream.photo)
                  : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              }
            />
          </Col>
          <Col>
            <Card.Body>
              <Card.Text>
                Livestream by <b>@{livestream.room}</b>
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
        <Card.Footer className="text-muted">
          <Row>
            <Col>{moment.unix(livestream.date / 1000).fromNow()}</Col>
          </Row>
        </Card.Footer>
      </Card>
    </div>
  ));

  return (
    <div>
      <h1>Livestreams</h1>
      <div
        className="mb-4"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Button variant="primary" onClick={handleStart}>
          {isLivestreaming ? "Go to your Livestream" : "Start a Livestream"}
        </Button>
      </div>
      <div>
        {currentLivestreams}
        {currentLivestreams.length === 0 ? "No livestreams." : null}
      </div>
    </div>
  );
}

export default Livestreams;
