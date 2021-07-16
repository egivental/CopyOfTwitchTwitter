const bcrypt = require("bcrypt");
const User = require("../model/User.js");
const Blocks = require("../model/Blocks.js");
const Follows = require("../model/Follows.js");
const Hides = require("../model/Hides.js");
const Posts = require("../model/Posts.js");
const Message = require("../model/Message.js");
const Comment = require("../model/Comment.js");
const LivestreamComment = require("../model/LivestreamComment.js");

const createUser = async (username, password) => {
  const newUser = new User({
    username,
    password: await bcrypt.hash(password, 10),
    registration_date: Date.now(),
    photo: null,
    failed_login_attempts: 0,
    last_failed_login_attempt_date: 0,
    is_livestreaming: false,
    livestream_date: 0,
    deactivated: false,
  });
  await newUser.save();
  return newUser;
};

const getOtherUsers = async (loggedInUsername) => {
  const otherUsers = [];
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
    const otherUserFollowsUser = await Follows.findOne({
      followee: loggedInUsername,
      follower: user.username,
    });
    // Only return the other user if they haven't blocked the logged in user,
    // are not a follower, are not a followee
    if (
      loggedInUsername !== user.username &&
      !otherUserBlockedUser &&
      !userFollowsOtherUser &&
      !otherUserFollowsUser
    ) {
      otherUsers.push({
        username: user.username,
        registration_date: user.registration_date,
        photo: user.photo,
        failed_login_attempts: user.failed_login_attempts,
        last_failed_login_attempt_date: user.last_failed_login_attempt_date,
        is_livestreaming: user.is_livestreaming,
        livestream_date: user.livestream_date,
        deactivated: user.deactivated,
        blocked: !!userBlockedOtherUser,
        suggested: false,
      });
    }
  }

  // Suggestion algorithm, suggests 3 users
  const mixed = otherUsers.sort(() => 0.5 - Math.random());
  const suggested = mixed.slice(0, 3);
  suggested.forEach((otherUser) => {
    otherUser.suggested = true;
  });

  return otherUsers;
};

const blockUser = async (loggedInUsername, otherUsername) => {
  const userBlockedOtherUser = await Blocks.findOne({
    user: loggedInUsername,
    blocked_user: otherUsername,
  });
  if (userBlockedOtherUser) {
    // unblock
    await userBlockedOtherUser.remove();
  } else {
    // block
    const userFollowsOtherUser = await Follows.findOne({
      followee: otherUsername,
      follower: loggedInUsername,
    });
    const otherUserFollowsUser = await Follows.findOne({
      followee: loggedInUsername,
      follower: otherUsername,
    });
    if (userFollowsOtherUser) {
      await userFollowsOtherUser.remove();
    }
    if (otherUserFollowsUser) {
      await otherUserFollowsUser.remove();
    }
    const newBlock = new Blocks({
      user: loggedInUsername,
      blocked_user: otherUsername,
    });
    await newBlock.save();
  }
};

const getFollowers = async (loggedInUsername) => {
  const followers = [];
  for await (const user of User.find()) {
    const otherUserFollowsUser = await Follows.findOne({
      followee: loggedInUsername,
      follower: user.username,
    });
    if (otherUserFollowsUser) {
      followers.push({
        username: user.username,
        registration_date: user.registration_date,
        photo: user.photo,
        failed_login_attempts: user.failed_login_attempts,
        last_failed_login_attempt_date: user.last_failed_login_attempt_date,
        is_livestreaming: user.is_livestreaming,
        livestream_date: user.livestream_date,
        deactivated: user.deactivated,
        blocked: false,
        suggested: false,
      });
    }
  }
  return followers;
};

const getFollowees = async (loggedInUsername) => {
  const followees = [];
  for await (const user of User.find()) {
    const otherUserFollowsUser = await Follows.findOne({
      followee: user.username,
      follower: loggedInUsername,
    });
    if (otherUserFollowsUser) {
      followees.push({
        username: user.username,
        registration_date: user.registration_date,
        photo: user.photo,
        failed_login_attempts: user.failed_login_attempts,
        last_failed_login_attempt_date: user.last_failed_login_attempt_date,
        is_livestreaming: user.is_livestreaming,
        livestream_date: user.livestream_date,
        deactivated: user.deactivated,
        blocked: false,
        suggested: false,
      });
    }
  }
  return followees;
};

const followUser = async (loggedInUsername, otherUsername) => {
  const userFollowsOtherUser = await Follows.findOne({
    follower: loggedInUsername,
    followee: otherUsername,
  });
  if (!userFollowsOtherUser) {
    const newFollow = new Follows({
      follower: loggedInUsername,
      followee: otherUsername,
    });
    await newFollow.save();
  }
};

const unfollowUser = async (loggedInUsername, otherUsername) => {
  const userFollowsOtherUser = await Follows.findOne({
    follower: loggedInUsername,
    followee: otherUsername,
  });
  if (userFollowsOtherUser) {
    await userFollowsOtherUser.remove();
  }
};

const deactivateUser = async (loggedInUsername) => {
  for await (const follow of Follows.find()) {
    if (
      follow.followee === loggedInUsername ||
      follow.follower === loggedInUsername
    ) {
      await follow.remove();
    }
  }
  for await (const block of Blocks.find()) {
    if (
      block.user === loggedInUsername ||
      block.blocked_user === loggedInUsername
    ) {
      await block.remove();
    }
  }
  for await (const hide of Hides.find()) {
    if (hide.user === loggedInUsername) {
      await hide.remove();
    }
  }
  for await (const message of Message.find()) {
    if (
      message.from_user === loggedInUsername ||
      message.to_user === loggedInUsername
    ) {
      await message.remove();
    }
  }
  for await (const post of Posts.find()) {
    if (post.user === loggedInUsername) {
      await post.remove();
    }
  }
  for await (const comment of Comment.find()) {
    if (comment.user === loggedInUsername) {
      await comment.remove();
    }
  }
  for await (const livestreamComment of LivestreamComment.find()) {
    if (livestreamComment.user === loggedInUsername) {
      await livestreamComment.remove();
    }
  }
};

module.exports = {
  createUser,
  getOtherUsers,
  blockUser,
  getFollowers,
  getFollowees,
  followUser,
  unfollowUser,
  deactivateUser,
};
