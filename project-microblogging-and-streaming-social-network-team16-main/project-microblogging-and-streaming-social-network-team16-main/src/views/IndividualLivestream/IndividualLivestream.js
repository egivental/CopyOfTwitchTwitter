import _ from "lodash";
import React, { useState, useEffect } from "react";
import Video from "twilio-video";
import { Button, Figure } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteLivestream,
  createLivestreamComment,
  updateLivestreamComment,
  deleteLivestreamComment,
} from "../../store/livestreamState";
import LivestreamVideo from "../../components/LivestreamVideo/LivestreamVideo";
import Comments from "../../components/Comments/Comments";

/**
 * @returns {IndividualLivestream} A IndividualLivestream React component.
 */
function IndividualLivestream() {
  // Setup
  const centered = { display: "flex", justifyContent: "center" };
  const dispatch = useDispatch();
  const history = useHistory();
  const { livestreamUser } = useParams();
  const userState = useSelector((state) => state.user);
  const livestreamState = useSelector((state) => state.livestream);
  const [retry, setRetry] = useState(Date.now());
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const { livestreams } = livestreamState;
  const liveStreamObject =
    livestreams &&
    livestreams.find((livestream) => livestream.room === livestreamUser);
  const token =
    livestreamUser === userState.user.username
      ? userState.user.is_livestreaming
      : liveStreamObject && liveStreamObject.grant;

  // Connect to Twilio Video
  useEffect(() => {
    if (typeof token !== "string") return () => {};

    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    Video.connect(token, {
      name: livestreamUser,
      audio: livestreamUser === userState.user.username,
      video: livestreamUser === userState.user.username,
    }).then((connectedRoom) => {
      setRoom(connectedRoom);
      connectedRoom.on("participantConnected", participantConnected);
      connectedRoom.on("participantDisconnected", participantDisconnected);
      connectedRoom.participants.forEach(participantConnected);
    });

    return () => {
      setRoom((currentRoom) => {
        if (currentRoom && currentRoom.localParticipant.state === "connected") {
          currentRoom.localParticipant.tracks.forEach((trackPublication) => {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        }
        return currentRoom;
      });
    };
  }, [livestreamUser, userState.user.username, token]);

  // Make sure the livestream exists, otherwise navigate away
  if (
    livestreamUser === userState.user.username &&
    userState.user.is_livestreaming === false
  ) {
    history.push("/streams");
    return null;
  }
  if (!liveStreamObject) {
    history.push("/streams");
    return null;
  }

  // Handle end livestream
  const handleEnd = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await dispatch(deleteLivestream(userState.user.username));
    history.push("/streams");
    window.location.reload();
  };

  // Find which video partipant to show the video for
  let participant = null;
  if (room) {
    participant =
      livestreamUser === userState.user.username
        ? room.localParticipant
        : _.shuffle(
            participants
              .sort(
                (p1, p2) =>
                  parseInt(p1.identity.split(";;;")[0], 10) <
                  parseInt(p2.identity.split(";;;")[0], 10)
              )
              .filter((p) => p.videoTracks.size > 0)
          )[0];
  }

  // Render
  return (
    <div>
      <h1>Livestream by @{livestreamUser}</h1>

      {livestreamUser === userState.user.username ? (
        <div className="mb-4" style={centered}>
          <Button variant="danger" onClick={handleEnd}>
            Stop Livestreaming
          </Button>
        </div>
      ) : null}

      <div style={centered}>
        <Figure>
          {participant ? (
            <LivestreamVideo key={participant.sid} participant={participant} />
          ) : (
            "No video currently available."
          )}
          <Figure.Caption className="text-center">
            {_.uniq(participants.map((p) => p.identity.split(";;;")[0])).length}{" "}
            watching <br />
            <small key={retry}>
              Video not working?{" "}
              <Button
                variant="link"
                onClick={() => setRetry(Date.now())}
                style={{ fontSize: "12px" }}
              >
                Reconnect
              </Button>
            </small>
          </Figure.Caption>
        </Figure>
      </div>
      <Comments
        comments={liveStreamObject ? liveStreamObject.comments : []}
        parent={livestreamUser}
        createAction={createLivestreamComment}
        updateAction={updateLivestreamComment}
        deleteAction={deleteLivestreamComment}
      />
    </div>
  );
}

export default IndividualLivestream;
