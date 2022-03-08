const database = require("../config/database");
const verfikasi_token = require("../middleware/auth");
const multer = require("./multer");
const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();


router.get('/all',verfikasi_token, async (req, res, next) => {
    try {
        const result = await database.select("*").from("kategori");
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

router.get('/:nama',verfikasi_token, async (req, res, next) => {
    try {
        const result = await database.select("*").from("kategori").where('nama', 'like', '%' + req.params.nama + '%');
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

router.post('/simpan',verfikasi_token, multer.upload.single("foto"), async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(422).json({
                status: 0,
                message: "File Kosong"
            });
        }
        const data = {
            nama: req.body.nama,
            foto: req.file.filename,
            status: "Y"
        };
        const simpan = await database("kategori").insert(data);
        return res.status(200).json({
            status: 1,
            message: "Berhasil",
            result: {
                id_kategori: simpan[0],
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

router.post('/edit',verfikasi_token, multer.upload.single("foto"), async (req, res, next) => {
    try {
        const result = await database("kategori").select("*").where('id_kategori', req.body.id_kategori).first();
        if (result) {
            if (!req.file) {
                res.status(422).json({
                    status: 0,
                    message: "File Kosong"
                });
            }
            const data = {
                nama: req.body.nama,
                foto: req.file.filename,
                status: req.body.status
            };

            await database.from("kategori").update(data).where('id_kategori', req.body.id_kategori);
            fs.unlink(path.join(__dirname + '/foto/') + result.foto, (err) => {
                if (err) {
                    return res.status(200).json({
                        status: 1,
                        message: "Berhasil",
                        result: {
                            id_kategori: req.body.id_kategori,
                            ...data
                        },
                        error: err
                    });
                } else {
                    return res.status(200).json({
                        status: 1,
                        message: "Berhasil",
                        result: {
                            id_kategori: req.body.id_kategori,
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

router.delete('/delete/:id_kategori',verfikasi_token, async (req, res, next) => {
    try {
        const update = await database("kategori").update('status',"N").where('id_kategori', req.params.id_kategori);
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