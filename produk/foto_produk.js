const database = require("../config/database");
const verfikasi_token = require("../middleware/auth");
const multer = require("./multer");
const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

router.post('/upload/add',verfikasi_token, multer.upload.array('foto',5), async (req, res, next) => {
    const data = {
        id_produk: req.body.id_produk,
        foto: req.files,
    };
    try {
        req.files.forEach(async x => {
            await database('foto_produk').insert({
                foto : x.filename,
                id_produk : req.body.id_produk
            });
        });
        return res.status(200).json({
            status: 1,
            message: "berhasil",
        });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
});

router.post('/upload/edit',verfikasi_token, multer.upload.single("foto"), async (req, res, next) => {
    try {
        const result = await database.select("*").from("foto_produk").where('id_foto_produk', req.params.foto_produk).first();
        if (result) {
            if (!req.file) {
                const data = {
                    id_produk: req.body.id_produk,
                };

                await database.from("foto_produk").update(data).where('id_foto_produk', req.body.id_foto_produk);
                return res.status(200).json({
                    status: 1,
                    message: "Berhasil",
                });
            }
            const data = {
                id_produk: req.body.id_produk,
                foto: req.file.filename,
            };

            await database.from("foto_produk").update(data).where('id_foto_produk', req.body.id_foto_produk);

            fs.unlink(path.join(__dirname + '/foto/') + result.foto, (err) => {
                if (err) {
                    return res.status(200).json({
                        status: 1,
                        message: "Berhasil",
                    });
                } else {
                    return res.status(200).json({
                        status: 1,
                        message: "Berhasil",
                    });
                }
            });
        } else {
            return res.status(400).json({
                status: 0,
                message: "Tidak ditemukan"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
});

router.delete('/upload/delete/:id_foto_produk',verfikasi_token, async (req, res, next) => {
    try {
        const result = await database.select("*").from("foto_produk").where('id_foto_produk', req.params.id_foto_produk).first();
        if (result) {
            await database.from("foto_produk").where('id_foto_produk', req.body.id_foto_produk).delete();
            fs.unlink(path.join(__dirname + '/foto/') + result.foto, (err) => {
                if (err) {
                    return res.status(200).json({
                        status: 1,
                        message: "Berhasil",
                    });
                } else {
                    return res.status(200).json({
                        status: 1,
                        message: "Berhasil",
                    });
                }
            });
        } else {
            return res.status(400).json({
                status: 0,
                message: "Tidak ditemukan"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
});
module.exports = router;