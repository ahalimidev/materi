const database = require("../config/database");
const verfikasi_token = require("../middleware/auth");
const multer = require("./multer");
const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();


router.get('/all/:id_kategori', async (req, res, next) => {
    try {
        const result = await database.select("*").from("sub_kategori").where('id_kategori',req.params.id_kategori);
        return res.status(200).json({
            status: 1,
            message: "Berhasil",
            result: result
        })
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
});

router.get('/:id_sub_kategori', async (req, res, next) => {
    try {
        const result = await database.select("*").from("sub_kategori").where('id_sub_kategori', req.params.id_sub_kategori).first();
        return res.status(200).json({
            status: 1,
            message: "Berhasil",
            result: result
        })
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
});

router.post('/simpan', multer.upload.single("foto"), async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(422).json({
                status: 0,
                message: "File Kosong"
            });
        }
        const data = {
            id_kategori: req.body.id_kategori,
            nama: req.body.nama,
            foto: req.file.filename,
            status: "Y"
        };
        const simpan = await database("sub_kategori").insert(data);
        return res.status(200).json({
            status: 1,
            message: "Berhasil",
            result: {
                id_sub_kategori: simpan[0],
                ...data
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }

});

router.post('/edit', multer.upload.single("foto"), async (req, res, next) => {
    try {
        const result = await database.select("*").from("sub_kategori").where('id_sub_kategori', req.params.id_sub_kategori).first();
        if (result) {
            if (!req.file) {
                res.status(422).json({
                    status: 0,
                    message: "File Kosong"
                });
            }
            const data = {
                id_kategori: req.body.id_kategori,
                nama: req.body.nama,
                foto: req.file.filename,
                status: req.body.status
            };

            await database.from("sub_kategori").update(data).where('id_sub_kategori', req.body.id_sub_kategori);
            fs.unlink(path.join(__dirname + '/foto/') + result.foto, (err) => {
                if (err) {
                    return res.status(200).json({
                        status: 1,
                        message: "Berhasil",
                        result: {
                            id_sub_kategori: req.body.id_sub_kategori,
                            ...data
                        },
                        error: err
                    });
                } else {
                    return res.status(200).json({
                        status: 1,
                        message: "Berhasil",
                        result: {
                            id_sub_kategori: req.body.id_sub_kategori,
                            ...data
                        }
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

router.delete('/delete/:id_sub_kategori', async (req, res, next) => {
    try {
        const update = await database("sub_kategori").update('status',"N").where('id_sub_kategori', req.params.id_sub_kategori);
        if (update) {
            return res.status(200).json({
                status: 1,
                message: "Berhasil",
            });
        } else {
            return res.status(400).json({
                status: 0,
                message: "Gagal",
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