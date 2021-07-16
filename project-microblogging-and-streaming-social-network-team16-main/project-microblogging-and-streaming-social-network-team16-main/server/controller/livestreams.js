const User = require("../model/User.js");
const Blocks = require("../model/Blocks.js");
const Follows = require("../model/Follows.js");
const LivestreamComment = require("../model/LivestreamComment.js");
const twillio = require("../twilio/index.js");

const getLivestreamingUsers = async (loggedInUsername) => {
  const livestreamingUsers = [];
  for await (const user of User.find()) {
    if (user.deactivated) continue;

    const userBlockedOtherUser = await Blocks.findOne({
      user: loggedInUsername,
      blocked_user: user.username,
    });
    const otherUserBlockedUser = await Blocks.findOne({
      user: user.username,
      blocked_user: loggedInUsername,
    });
    const userFollowsOtherUser = await Follows.findOne({
      followee: user.username,
      follower: loggedInUsername,
    });

    const livestreamComments = [];

    for await (const comment of LivestreamComment.find({
      livestream_user: user.username,
    })) {
      // Only include the comment if the loggedInUser is not blocking or
      // is not blocked by the comment author

      const userBlockedCommentAuthor = await Blocks.findOne({
        user: loggedInUsername,
        blocked_user: comment.user,
      });
      const commentAuthorBlockedUser = await Blocks.findOne({
        user: comment.user,
        blocked_user: loggedInUsername,
      });

      if (!userBlockedCommentAuthor && !commentAuthorBlockedUser) {
        const commentUser = await User.findOne({ username: comment.user });
        livestreamComments.push({
          id: comment.id,
          livestream_user: comment.livestream_user,
          user: comment.user,
          photo: commentUser.photo,
          date: comment.date,
          message: comment.message,
        });
      }
    }

    // Only return the livestreaming user if they are streaming, they haven't blocked
    // the logged in user, and the user follows them
    if (
      !otherUserBlockedUser &&
      !userBlockedOtherUser &&
      (userFollowsOtherUser || loggedInUsername === user.username) &&
      user.is_livestreaming
    ) {
      let roomGrant = null;
      if (loggedInUsername !== user.username) {
        roomGrant = await twillio.createRoomGrant(
          loggedInUsername,
          user.username
        );
      }

      livestreamingUsers.push({
        room: user.username,
        photo: user.photo,
        grant: roomGrant,
        date: user.livestream_date,
        comments: livestreamComments,
      });
    }
  }
  return livestreamingUsers;
};

module.exports = {
  getLivestreamingUsers,
};
