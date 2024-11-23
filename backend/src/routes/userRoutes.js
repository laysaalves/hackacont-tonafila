const express = require("express");
const router = express.Router();
const {
  addUserToQueue,
  removeUserFromQueue,
} = require("../controllers/userController");

router.post("/:queueId/users", addUserToQueue);
router.delete("/:queueId/users/:uid", removeUserFromQueue);

module.exports = router;
