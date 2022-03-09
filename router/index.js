const express = require("express");
const router = express.Router();

router.use("/wilayah/indonesia/",require("../wilayah/indonesia"));
router.use("/user/",require("../user/user"));
router.use("/admin/",require("../admin/admin"));
router.use("/kategori/",require("../kategori/kategori"));
router.use("/kategori/sub/",require("../sub_kategori/sub_kategori"));
router.use("/produk/",require("../produk/produk"));
router.use("/produk/foto/",require("../produk/foto_produk"));
router.use("/keranjang/",require("../keranjang/keranjang"));
router.use("/rajaongkir/",require("../rajaongkir/rajaongkir"));

module.exports = router;