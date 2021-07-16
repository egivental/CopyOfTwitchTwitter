const twilio = require("twilio");
const { AccessToken } = require("twilio").jwt;

const { VideoGrant } = AccessToken;

// Used when generating any kind of Access Token
const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = "AC0f7371afafd709cc9a7bad190eb6e087";
const twilioApiKey = "SK762d099aef8eb5ba49cada54e0bae98f";
const twilioApiSecret = "S0JMfAIdR6iqBrDtBWa9TZjzuyPvlltj";

const createRoomGrant = (username, livestreamUser) => {
  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
    {
      ttl: MAX_ALLOWED_SESSION_DURATION,
    }
  );
  token.identity = `${username};;;${Date.now()}`;

  // Create a Video grant which enables a client to use Video
  // and limits access to the specified Room
  const videoGrant = new VideoGrant({
    room: livestreamUser,
  });

  // Add the grant to the token
  token.addGrant(videoGrant);

  return token.toJwt();
};

const deleteRoom = async (livestreamUser, token) => {
  const client = twilio(twilioAccountSid, token);
  await client.video.rooms(livestreamUser).update({ status: "completed" });
};

module.exports = {
  createRoomGrant,
  deleteRoom,
};
