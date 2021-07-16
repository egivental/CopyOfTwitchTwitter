const Post = require("../model/Posts.js");
const User = require("../model/User.js");
const Comment = require("../model/Comment.js");
const Followees = require("../model/Follows");
const Blocks = require("../model/Blocks.js");
const Hides = require("../model/Hides.js");
const Media = require("./media.js");

const createPost = async (user, message, attachment, attachmentType) => {
  try {
    const mediaId = await Media.createMedia(attachmentType, attachment);
    const newPost = new Post({
      user,
      date: Date.now(),
      message,
      attachment: mediaId,
      attachment_type: attachmentType,
    });
    await newPost.save();
  } catch (e) {
    throw Error("User Posting Does Not Exist");
  }
};

// TODO
// return all posts from users that this user is following
// have comments for each
// use user functions to get user-following
const getPosts = async (userName) => {
  const userNameFollowers = [];
  const users = await Followees.find({
    follower: userName,
  });
  userNameFollowers.push(userName);
  users.forEach((element) => {
    userNameFollowers.push(element.followee);
  });
  const blockedBy = await Blocks.find({
    blocked_user: userName,
  });
  const blockedByYou = await Blocks.find({
    user: userName,
  });
  const invisible = [];
  const hidden = [];

  const hides = await Hides.find({
    user: userName,
  });
  hides.forEach((element) => {
    hidden.push(element.post_id);
  });

  for (let i = 0; i < blockedBy.length; i += 1) {
    invisible.push(blockedBy[i].user);
  }
  for (let i = 0; i < blockedByYou.length; i += 1) {
    invisible.push(blockedByYou[i].blocked_user);
  }
  const userPosts = (
    await Post.find({
      user: {
        $in: userNameFollowers,
        $nin: invisible,
      },
      _id: {
        $nin: hidden,
      },
    })
  ).filter((p) => !hidden.includes(p.id));

  // collect comments and analytics
  const newArray = await Promise.all(
    userPosts.map(async (element) => {
      const unblockedComments = await Comment.find({
        user: {
          $nin: invisible,
        },
        post_id: element._id,
      });
      const replacement = element;
      replacement.comments = await Promise.all(
        unblockedComments.map(async (comment) => {
          const commentUser = await User.findOne({ username: comment.user });
          return {
            id: comment.id,
            post_id: comment.post_id,
            user: comment.user,
            photo: commentUser.photo,
            date: comment.date,
            message: comment.message,
          };
        })
      );
      const numComments = replacement.comments.length;
      // collect analytics
      const numHiders = (
        await Hides.find({
          post_id: element.id,
        })
      ).length;

      replacement.analytics = {
        comments: numComments,
        hides: numHiders,
      };

      const user = await User.findOne({
        username: element.user,
      });
      const { photo } = user;
      replacement.photo = photo;

      return {
        id: replacement.id,
        user: replacement.user,
        photo: replacement.photo,
        date: replacement.date,
        message: replacement.message,
        attachment: replacement.attachment,
        attachment_type: replacement.attachment_type,
        comments: replacement.comments,
        analytics: replacement.analytics,
      };
    })
  );
  return newArray.sort((a, b) => (a.date < b.date ? 1 : -1));
};

const createComment = async (postId, user, message) => {
  const newComment = new Comment({
    post_id: postId,
    user,
    date: Date.now(),
    message,
  });
  await newComment.save();
};

const deletePost = async (postId, userLogged) => {
  const postToRemove = await Post.findById(postId);
  if (postToRemove !== undefined) {
    if (postToRemove.user === userLogged) {
      await postToRemove.remove();
    } else {
      const hides = new Hides({
        user: userLogged,
        post_id: postId,
      });
      await hides.save();
    }
  }
};

const deleteComment = async (commentId) => {
  const commentToRemove = await Comment.findById(commentId);
  if (commentToRemove) {
    await commentToRemove.remove();
  }
};

const updateComment = async (commentId, message) => {
  const commentToUpdate = await Comment.findById(commentId);
  if (commentToUpdate) {
    commentToUpdate.message = message;
    await commentToUpdate.save();
  }
};

module.exports = {
  createPost,
  getPosts,
  createComment,
  deleteComment,
  deletePost,
  updateComment,
};
