const LivestreamComment = require("../model/LivestreamComment.js");

const createLivestreamComment = async (livestreamUser, user, message) => {
  const newLivestreamComment = new LivestreamComment({
    livestream_user: livestreamUser,
    user,
    date: Date.now(),
    message,
  });
  await newLivestreamComment.save();
};

const getLivestreamComment = async (id) => LivestreamComment.findById(id);

const deleteLivestreamComment = async (id) => {
  const livestreamComment = await LivestreamComment.findById(id);
  await livestreamComment.remove();
};

module.exports = {
  createLivestreamComment,
  getLivestreamComment,
  deleteLivestreamComment,
};
