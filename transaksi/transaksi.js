const database = require("../config/database");
const validasi_data = require("./validasi_data");
const verfikasi_validasi_data = require("../middleware/verfikasi_validasi_data");
const verfikasi_token = require("../middleware/auth");
const multer = require("./multer");
const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

router.get('/all/admin',verfikasi_token, async(req,res,next) =>{
    try {
      const result = await database("transaksi")
      .leftOuterJoin('user','user.id_user','transaksi.id_user')
      .select("transaksi.*","user.nama as nama_user")
      .orderBy('transaksi.id_transaksi', 'desc')
      if (result.length > 0) {
        return res.status(200).json({
            status: 1,
            message: "Berhasil",
            result: result
        });
    }else{
        return res.status(400).json({
            status: 0,
            message: "data tidak ditemukan",
        });
    }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
});

router.get('/one/admin/:id_transaksi',verfikasi_token, async(req,res,next) =>{
    try {
        const result_master = await database("transaksi").where('id_transaksi',req.params.id_transaksi).first();
        const result_detail = await database("transaksi_detail")
        .leftOuterJoin("produk","produk.id_produk",'transaksi_detail.id_produk')
        .leftOuterJoin("sub_kategori","produk.id_sub_kategori",'sub_kategori.id_sub_kategori')
        .leftOuterJoin("kategori","sub_kategori.id_kategori",'kategori.id_kategori')
        .leftOuterJoin("foto_produk","foto_produk.id_produk",'produk.id_produk')
        .select("transaksi_detail.id_transaksi_detail","produk.nama_produk", 
        "sub_kategori.nama as nama_sub_kategori","kategori.nama as nama_kategori","foto_produk.foto as foto_produk","transaksi_detail.jumlah","transaksi_detail.harga","transaksi_detail.berat")
        .where('transaksi_detail.id_transaksi',req.params.id_transaksi)
        .groupBy('foto_produk.id_produk');
        return res.status(200).json({
            status: 1,
            message: "Berhasil",
            result: {
                master : result_master,
                detail : result_detail
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
});

router.get('/all/user/:id_user',verfikasi_token, async(req,res,next) =>{
    try {
        const result = await database("transaksi").where('id_user',req.params.id_user).orderBy('id_transaksi','DESC');
        if (result.length > 0) {
            return res.status(200).json({
                status: 1,
                message: "Berhasil",
                result: result
            });
        }else{
            return res.status(400).json({
                status: 0,
                message: "data tidak ditemukan",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
});

router.get('/one/user/:id_transaksi',verfikasi_token, async(req,res,next) =>{
    try {
        const result_master = await database("transaksi").where('id_transaksi',req.params.id_transaksi).first();
        const result_detail = await database("transaksi_detail")
        .leftOuterJoin("produk","produk.id_produk",'transaksi_detail.id_produk')
        .leftOuterJoin("sub_kategori","produk.id_sub_kategori",'sub_kategori.id_sub_kategori')
        .leftOuterJoin("kategori","sub_kategori.id_kategori",'kategori.id_kategori')
        .leftOuterJoin("foto_produk","foto_produk.id_produk",'produk.id_produk')
        .select("transaksi_detail.id_transaksi_detail","produk.nama_produk", 
        "sub_kategori.nama as nama_sub_kategori","kategori.nama as nama_kategori","foto_produk.foto as foto_produk","transaksi_detail.jumlah","transaksi_detail.harga","transaksi_detail.berat")
        .where('transaksi_detail.id_transaksi',req.params.id_transaksi)
        .groupBy('foto_produk.id_produk');
        return res.status(200).json({
            status: 1,
            message: "Berhasil",
            result: {
                master : result_master,
                detail : result_detail
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
});

router.post('/upload/user/bukti_pembayaran',verfikasi_token, multer.upload.single("bukti_pembayaran"), async(req,res,next) =>{
    try {
        const result = await database.select("*").from("transaksi").where('id_transaksi', req.body.id_transaksi).first();
        if (result) {
            if (!req.file) {
                return res.status(200).json({
                    status: 0,
                    message: "File Kosong",
                });
            }
            const data = {
                bukti_pembayaran: req.file.filename,
            };

            await database.from("transaksi").update(data).where('id_transaksi',  req.body.id_transaksi);

            fs.unlink(path.join(__dirname + '/foto/') + result.bukti_pembayaran, (err) => {
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

router.put('/edit/admin/:id_transaksi',verfikasi_token, validasi_data.data,verfikasi_validasi_data, async(req,res,next) =>{
    const data = req.body;
    try {
        const result = await database.select("*").from("transaksi").where('id_transaksi', req.params.id_transaksi).first();
        if (result) {
            await database.from("transaksi").where('id_transaksi',req.params.id_transaksi).update(data);
                return res.status(200).json({
                    status: 1,
                    message: "Berhasil",
                });
        }else{
            return res.status(400).json({
                status: 00,
                message: "data tidak ditemukan",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
});

router.put('/konfrimasi/user/:id_transaksi',verfikasi_token, async(req,res,next) =>{
    try {
        const result = await database.select("*").from("transaksi").where('id_transaksi', req.params.id_transaksi).first();
        if (result) {
            await database.from("transaksi").where('id_transaksi',req.params.id_transaksi).update({status_transaksi : req.body.konfrimasi});
                return res.status(200).json({
                    status: 1,
                    message: "Berhasil",
                });
        }else{
            return res.status(400).json({
                status: 00,
                message: "data tidak ditemukan",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
});

router.delete('/delete/admin/transaksi/:id_transaksi',verfikasi_token, async(req,res,next) =>{
    try {
        await database.from("transaksi").where('id_transaksi',req.params.id_transaksi).delete();
        await database.from("transaksi_detail").where('id_transaksi',req.params.id_transaksi).delete();
        return res.status(200).json({
            status: 1,
            message: "Berhasil",
        });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
});

module.exports = router;