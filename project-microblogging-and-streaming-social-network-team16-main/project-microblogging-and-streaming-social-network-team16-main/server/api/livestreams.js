const controller = require("../controller/index.js");
const twillio = require("../twilio/index.js");
const authenticatedOnly = require("../authentication/authenticated-only.js");

module.exports = (app) => {
  app.post("/livestream", authenticatedOnly, async (req, res) => {
    if (req.user.is_livestreaming) {
      return res.status(409).json({
        message: "This user is already livestreaming.",
      });
    }

    const roomGrant = await twillio.createRoomGrant(
      req.user.username,
      req.user.username
    );
    req.user.is_livestreaming = roomGrant;
    req.user.livestream_date = Date.now();
    await req.user.save();
    return res.status(201).json(null);
  });

  app.get("/livestreams", authenticatedOnly, async (req, res) =>
    res
      .status(200)
      .json(
        await controller.livestreams.getLivestreamingUsers(req.user.username)
      )
  );

  app.delete("/livestreams/:id", authenticatedOnly, async (req, res) => {
    if (req.user.username === req.params.id) {
      try {
        if (req.user.is_livestreaming) {
          await twillio.deleteRoom(
            req.user.username,
            req.user.is_livestreaming
          );
        }
      } catch (e) {
        if (typeof jest === "undefined") {
          // eslint-disable-next-line no-console
          console.error(
            "Could not delete room",
            req.user.username,
            req.user.is_livestreaming,
            e.message,
            e.stack
          );
        }
      }
      req.user.is_livestreaming = false;
      await req.user.save();
      return res.status(200).json(null);
    }
    return res.status(401).json({
      message: "You are unauthorized to access this endpoint.",
    });
  });

  app.post(
    "/livestreams/:livestream_user/comment",
    authenticatedOnly,
    async (req, res) => {
      if (!req.body.message) {
        return res.status(400).json({
          message: "Incomplete request.",
        });
      }

      await controller.livestreamComment.createLivestreamComment(
        req.params.livestream_user,
        req.user.username,
        req.body.message
      );
      return res.status(201).json(null);
    }
  );

  app.put(
    "/livestreams/:livestream_user/comments/:commentId",
    authenticatedOnly,
    async (req, res) => {
      if (!req.body.message) {
        return res.status(400).json({
          message: "Incomplete request.",
        });
      }

      let livestreamComment = null;
      livestreamComment = await controller.livestreamComment.getLivestreamComment(
        req.params.commentId
      );

      if (!livestreamComment) {
        return res.status(404).json({
          message: "This comment does not exist.",
        });
      }

      if (livestreamComment.user === req.user.username) {
        livestreamComment.message = req.body.message;
        await livestreamComment.save();
        return res.status(200).json(null);
      }

      return res.status(401).json({
        message: "You are unauthorized to access this endpoint.",
      });
    }
  );

  app.delete(
    "/livestreams/:livestream_user/comments/:commentId",
    authenticatedOnly,
    async (req, res) => {
      let livestreamComment = null;
      try {
        livestreamComment = await controller.livestreamComment.getLivestreamComment(
          req.params.commentId
        );
      } catch (e) {
        // Ignore
      }

      if (livestreamComment) {
        if (livestreamComment.user === req.user.username) {
          await controller.livestreamComment.deleteLivestreamComment(
            req.params.commentId
          );
          return res.status(200).json(null);
        }
        return res.status(401).json({
          message: "You are unauthorized to access this endpoint.",
        });
      }
      return res.status(404).json({ message: "Livestream comment not found." });
    }
  );
};
