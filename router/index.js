const express = require("express");
const router = express.Router();

router.use("/wilayah/indonesia/",require("../wilayah/indonesia"));
router.use("/user/",require("../user/user"));

module.exports = router;