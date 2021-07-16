const bcrypt = require("bcrypt");
const passport = require("passport");
const controller = require("../controller/index.js");
const authenticatedOnly = require("../authentication/authenticated-only.js");

module.exports = (app) => {
  app.post("/user", async (req, res) => {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        message: "Incomplete request.",
      });
    }
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(req.body.password)) {
      return res.status(400).json({
        message:
          "Your password must have 6-20 characters, a numeric digit, and uppercase character, and a lowercase character.",
      });
    }
    let user;
    try {
      user = await controller.user.createUser(
        req.body.username,
        req.body.password
      );
    } catch (e) {
      return res.status(409).json({
        message: "The username has already been taken.",
      });
    }
    return req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res.status(500).json({
          message: "Internal server error.",
        });
      }
      return res.status(201).json(null);
    });
  });

  app.get("/users", authenticatedOnly, async (req, res) =>
    res.status(200).json(await controller.user.getOtherUsers(req.user.username))
  );

  app.get("/users/:username", authenticatedOnly, async (req, res) => {
    if (req.user.username === req.params.username) {
      return res.status(200).json({
        username: req.user.username,
        registration_date: req.user.registration_date,
        photo: req.user.photo,
        failed_login_attempts: req.user.failed_login_attempts,
        last_failed_login_attempt_date: req.user.last_failed_login_attempt_date,
        is_livestreaming: req.user.is_livestreaming,
        livestream_date: req.user.livestream_date,
        deactivated: req.user.deactivated,
        blocked: false,
        suggested: false,
      });
    }
    return res.status(401).json({
      message: "You are unauthorized to access this endpoint.",
    });
  });

  app.put("/users/:username", authenticatedOnly, async (req, res) => {
    if (req.user.username === req.params.username) {
      let passwordUpdated = false;
      if (req.body.password) {
        passwordUpdated = true;
      }
      if (passwordUpdated) {
        if (
          !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(req.body.password)
        ) {
          return res.status(400).json({
            message:
              "Your password must have 6-20 characters, a numeric digit, and uppercase character, and a lowercase character.",
          });
        }
        req.user.password = await bcrypt.hash(req.body.password, 10);
      }
      if (req.body.photo && req.body.photo_mime_type) {
        req.user.photo = await controller.media.createMedia(
          req.body.photo_mime_type,
          req.body.photo
        );
      }
      await req.user.save();
      return res.status(200).json(null);
    }
    return res.status(401).json({
      message: "You are unauthorized to access this endpoint.",
    });
  });

  app.delete("/users/:username", authenticatedOnly, async (req, res) => {
    if (req.user.username === req.params.username) {
      // de-activate the logged in user
      req.user.deactivated = true;
      await req.user.save();
      await controller.user.deactivateUser(req.user.username);
      await req.logout();
      return req.session.destroy(() => {
        res.clearCookie("connect.sid");
        return res.status(200).json(null);
      });
    }
    await controller.user.blockUser(req.user.username, req.params.username);
    return res.status(200).json(null);
  });

  app.get("/session", authenticatedOnly, async (req, res) =>
    res.status(200).json({
      username: req.user.username,
    })
  );

  app.get("/users/:username/followers", authenticatedOnly, async (req, res) => {
    if (req.user.username === req.params.username) {
      return res
        .status(200)
        .json(await controller.user.getFollowers(req.user.username));
    }
    return res.status(401).json({
      message: "You are unauthorized to access this endpoint.",
    });
  });

  app.get("/users/:username/followees", authenticatedOnly, async (req, res) => {
    if (req.user.username === req.params.username) {
      return res
        .status(200)
        .json(await controller.user.getFollowees(req.user.username));
    }
    return res.status(401).json({
      message: "You are unauthorized to access this endpoint.",
    });
  });

  app.put(
    "/users/:username/followees/:followeeUsername",
    authenticatedOnly,
    async (req, res) => {
      if (req.user.username === req.params.username) {
        await controller.user.followUser(
          req.user.username,
          req.params.followeeUsername
        );
        return res.status(200).json(null);
      }
      return res.status(401).json({
        message: "You are unauthorized to access this endpoint.",
      });
    }
  );

  app.delete(
    "/users/:username/followees/:followeeUsername",
    authenticatedOnly,
    async (req, res) => {
      if (req.user.username === req.params.username) {
        await controller.user.unfollowUser(
          req.user.username,
          req.params.followeeUsername
        );
        return res.status(200).json(null);
      }
      return res.status(401).json({
        message: "You are unauthorized to access this endpoint.",
      });
    }
  );

  app.post(
    "/session",
    (req, res, next) => {
      passport.authenticate("local", (err, user) => {
        if (err) {
          return res.status(429).json({
            message: err.message,
          });
        }
        if (!user) {
          return res.status(401).json({
            message: "You are unauthorized to access this endpoint.",
          });
        }
        return req.logIn(user, (loginErr) => {
          if (loginErr) {
            return next(loginErr);
          }
          return next(null);
        });
      })(req, res, next);
    },
    async (req, res) => res.status(201).json(null)
  );

  app.delete("/session", authenticatedOnly, async (req, res) => {
    await req.logout();
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      return res.status(200).json(null);
    });
  });
};
