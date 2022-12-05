const express = require("express");
const router = express.Router();
const {
  CREATE_USER,
  GET_USERS,
  GET_USER,
  USER_LOGIN,
} = require("../controllers/user");

router.post("/createUser", CREATE_USER);
router.get("/getUser", GET_USERS);
router.get("/getUser/:id", GET_USER);
router.get("/login", USER_LOGIN);

module.exports = router;
