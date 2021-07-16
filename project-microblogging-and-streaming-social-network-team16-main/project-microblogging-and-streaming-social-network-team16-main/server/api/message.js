const controller = require("../controller/index.js");
const authenticatedOnly = require("../authentication/authenticated-only.js");

module.exports = (app) => {
  app.post("/messages/:id", authenticatedOnly, async (req, res) => {
    if (!req.body.message) {
      return res.status(400).json({
        message: "Incomplete request.",
      });
    }
    let attachment;
    let attachmentMimeType;
    if (!req.body.attachment) {
      attachment = null;
      attachmentMimeType = null;
    } else {
      attachment = req.body.attachment;
      attachmentMimeType = req.body.attachment_mime_type;
    }
    try {
      await controller.message.createMessage(
        req.user.username,
        req.params.id,
        req.body.message,
        attachment,
        attachmentMimeType
      );
    } catch (e) {
      return res.status(400).json({
        message: "The message could not be created as requested.",
      });
    }
    return res.status(201).json(null);
  });

  app.get("/messages/:id", authenticatedOnly, async (req, res) => {
    try {
      const messages = await controller.message.getMessages(
        req.user.username,
        req.params.id
      );
      return res.status(200).json(messages);
    } catch (e) {
      return res.status(400).json({
        message: "An error ocurred.",
      });
    }
  });
};
