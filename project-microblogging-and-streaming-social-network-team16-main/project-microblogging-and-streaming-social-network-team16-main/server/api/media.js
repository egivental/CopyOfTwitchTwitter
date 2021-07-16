const controller = require("../controller/index.js");

module.exports = (app) => {
  app.get("/media/:id", async (req, res) => {
    let media = null;
    try {
      media = await controller.media.getMedia(req.params.id);
    } catch (e) {
      // Ignore
    }
    if (media) {
      const dataBuffer = Buffer.from(media.data, "base64");
      res.writeHead(200, { "content-type": media.mime_type });
      return res.end(dataBuffer, "binary");
    }
    return res.status(404).json({ message: "Media not found." });
  });
};
