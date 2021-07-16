import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const LivestreamVideo = ({ participant }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks2) => [...videoTracks2, track]);
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks2) => [...audioTracks2, track]);
      }
    };

    const trackUnsubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks2) =>
          videoTracks2.filter((v) => v !== track)
        );
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks2) =>
          audioTracks2.filter((a) => a !== track)
        );
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
    return undefined;
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
    return undefined;
  }, [audioTracks]);

  return (
    <div className="participant">
      <video ref={videoRef} autoPlay />
      <audio ref={audioRef} autoPlay muted />
    </div>
  );
};

export default LivestreamVideo;

LivestreamVideo.propTypes = {
  participant: PropTypes.shape({
    videoTracks: PropTypes.object.isRequired,
    audioTracks: PropTypes.object.isRequired,
    on: PropTypes.func.isRequired,
    removeAllListeners: PropTypes.func.isRequired,
    identity: PropTypes.object.isRequired,
  }).isRequired,
};
