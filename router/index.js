const express = require("express");
const router = express.Router();

router.use("/wilayah/indonesia/",require("../wilayah/indonesia"));
router.use("/user/",require("../user/user"));
router.use("/admin/",require("../admin/admin"));

module.exports = router;