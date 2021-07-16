const Message = require("../model/Message.js");
const Blocks = require("../model/Blocks.js");
const User = require("../model/User.js");
const Media = require("./media.js");

const createMessage = async (
  userFrom,
  userTo,
  message,
  attachment,
  attachmentType
) => {
  const mediaId = await Media.createMedia(attachmentType, attachment);
  const newMessage = new Message({
    date: Date.now(),
    from_user: userFrom,
    to_user: userTo,
    read_date: 0,
    delivered_date: 0,
    message,
    attachment: mediaId,
    attachment_mime_type: attachmentType,
  });

  await newMessage.save();
};

const getMessages = async (userName, otherUser) => {
  const blocks = await Blocks.find({
    user: userName,
    blocked_user: otherUser,
  });
  if (blocks !== undefined && blocks.length !== 0) {
    return [];
  }
  const blocked = await Blocks.find({
    user: otherUser,
    blocked_user: userName,
  });
  if (blocked !== undefined && blocked.length !== 0) {
    return [];
  }
  const toUser = await Message.find({
    from_user: otherUser,
    to_user: userName,
  });

  const toUserMessages = await Promise.all(
    toUser.map(async (element) => {
      if (element.read_date === 0 && element.delivered_date === 0) {
        element.read_date = Date.now();
        element.delivered_date = Date.now();
        await element.save();
      }
      return element;
    })
  );

  const fromUserMessages = await Message.find({
    from_user: userName,
    to_user: otherUser,
  });
  const total = await Promise.all(
    toUserMessages.concat(fromUserMessages).map(async (message) => {
      const fromUser = await User.findOne({ username: message.from_user });
      return {
        id: message.id,
        date: message.date,
        from_user: message.from_user,
        photo: fromUser.photo,
        to_user: message.to_user,
        read_date: message.read_date,
        delivered_date: message.delivered_date,
        message: message.message,
        attachment: message.attachment,
        attachment_type: message.attachment_mime_type,
      };
    })
  );
  return total.sort((a, b) => (a.date < b.date ? 1 : -1));
};

module.exports = {
  createMessage,
  getMessages,
};
