const controller = require("../controller/index.js");
const authenticatedOnly = require("../authentication/authenticated-only.js");

module.exports = (app) => {
  app.post("/post", authenticatedOnly, async (req, res) => {
    if (!req.body.message) {
      // do I also need to check for attachment?
      return res.status(400).json({
        message: "Incomplete request.",
      });
    }
    try {
      let attachment;
      let attachmentMimeType;
      if (!req.body.attachment) {
        attachment = null;
        attachmentMimeType = null;
      } else {
        attachment = req.body.attachment;
        attachmentMimeType = req.body.attachment_mime_type;
      }
      await controller.posts.createPost(
        req.user.username,
        req.body.message,
        attachment,
        attachmentMimeType
      );
      return res.status(201).json(null);
    } catch (e) {
      return res.status(401).json({
        message: "The post could not be created as requested.",
      });
    }
  });

  app.get("/posts", authenticatedOnly, async (req, res) => {
    if (!req.user.username) {
      return res.status(400).json({
        message: "Incomplete request.",
      });
    }
    const posts = await controller.posts.getPosts(req.user.username);
    return res.status(200).json(posts);
  });

  app.delete("/posts/:id", authenticatedOnly, async (req, res) => {
    try {
      await controller.posts.deletePost(req.params.id, req.user.username);
      return res.status(200).json(null);
    } catch (e) {
      return res.status(404).json({
        message: "Item does not exist.",
      });
    }
  });

  app.post("/posts/:id/comment", authenticatedOnly, async (req, res) => {
    if (!req.user.username || !req.body.message) {
      return res.status(400).json({
        message: "Incomplete request.",
      });
    }
    try {
      await controller.posts.createComment(
        req.params.id,
        req.user.username,
        req.body.message
      );
      return res.status(201).json(null);
    } catch (e) {
      return res.status(401).json({
        message: "An error occurred.",
      });
    }
  });

  app.put(
    "/posts/:id/comments/:commentId",
    authenticatedOnly,
    async (req, res) => {
      try {
        await controller.posts.updateComment(
          req.params.commentId,
          req.body.message
        );
        return res.status(200).json(null);
      } catch (e) {
        return res.status(400).json({
          message: "Incomplete request.",
        });
      }
    }
  );

  app.delete(
    "/posts/:id/comments/:commentId",
    authenticatedOnly,
    async (req, res) => {
      try {
        await controller.posts.deleteComment(req.params.commentId);
        return res.status(200).json(null);
      } catch (e) {
        return res.status(400).json({
          message: "An error occurred.",
        });
      }
    }
  );
};
