const Media = require("../model/Media.js");

const createMedia = async (mimeType, data) => {
  if (!mimeType || !data) {
    return null;
  }
  const newMedia = new Media({
    mime_type: mimeType,
    data,
  });
  await newMedia.save();
  return newMedia.id;
};

const getMedia = async (id) => Media.findById(id);

module.exports = {
  createMedia,
  getMedia,
};
