const express = require("express");
const Message = require("../models/message");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

const router = express.Router();

/** GET /:id - get detail of message. */
router.get("/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    const message = await Message.get(req.params.id);
    if (
      req.user.username === message.from_user.username ||
      req.user.username === message.to_user.username
    ) {
      return res.json({ message });
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }
  } catch (err) {
    return next(err);
  }
});

/** POST / - post message. */
router.post("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const { to_username, body } = req.body;
    const from_username = req.user.username;
    const message = await Message.create({ from_username, to_username, body });
    return res.status(201).json({ message });
  } catch (err) {
    return next(err);
  }
});

/** POST /:id/read - mark message as read */
router.post("/:id/read", ensureLoggedIn, async (req, res, next) => {
  try {
    const message = await Message.markAsRead(req.params.id);
    if (req.user.username === message.to_user.username) {
      return res.json({ message });
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
