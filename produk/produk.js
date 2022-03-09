const database = require("../config/database");
const validasi_data = require("./validasi_data");
const verfikasi_validasi_data = require("../middleware/verfikasi_validasi_data");
const verfikasi_token = require("../middleware/auth");
const express = require("express");
const router = express.Router();




router.get('/all',verfikasi_token, async (req, res, next) => {
    try {
        const result = await database("produk")
        .leftOuterJoin("sub_kategori","produk.id_sub_kategori",'sub_kategori.id_sub_kategori')
        .leftOuterJoin("kategori","sub_kategori.id_kategori",'kategori.id_kategori')
        .leftOuterJoin("foto_produk","foto_produk.id_produk",'produk.id_produk')
        .select("produk.*",
        "sub_kategori.nama as nama_sub_kategori","sub_kategori.foto as foto_sub_kategori",
        "kategori.nama as nama_kategori","kategori.foto as foto_kategori","foto_produk.foto as foto_produk").groupBy('foto_produk.id_produk');
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

router.get('/one/:id_produk',verfikasi_token, async (req, res, next) => {
    try {
        const result = await database("produk")
        .leftOuterJoin("sub_kategori","produk.id_sub_kategori",'sub_kategori.id_sub_kategori')
        .leftOuterJoin("kategori","sub_kategori.id_kategori",'kategori.id_kategori')
        .select("produk.*",
        "sub_kategori.nama as nama_sub_kategori","sub_kategori.foto as foto_sub_kategori",
        "kategori.nama as nama_kategori","kategori.foto as foto_kategori")
        .where('produk.status','Y').andWhere('sub_kategori.status',"Y").andWhere('kategori.status','Y').andWhere('produk.id_produk',req.params.id_produk).first();
        if (result) {
            const x = await database.select("*").from("foto_produk").where('id_produk',req.params.id_produk)
            return res.status(200).json({
                status: 1,
                message: "Berhasil",
                result: {
                    result,
                    berkas : x
                }
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

router.get('/all/by/kategori/:id_kategori',verfikasi_token, async (req, res, next) => {
    try {
        const result = await database("produk")
        .leftOuterJoin("sub_kategori","produk.id_sub_kategori",'sub_kategori.id_sub_kategori')
        .leftOuterJoin("kategori","sub_kategori.id_kategori",'kategori.id_kategori')
        .leftOuterJoin("foto_produk","foto_produk.id_produk",'produk.id_produk')
        .select("produk.*",
        "sub_kategori.nama as nama_sub_kategori","sub_kategori.foto as foto_sub_kategori",
        "kategori.nama as nama_kategori","kategori.foto as foto_kategori","foto_produk.foto as foto_produk")
        .where('produk.status','Y').andWhere('sub_kategori.status',"Y").andWhere('kategori.status','Y').andWhere('kategori.id_kategori',req.params.id_kategori)
        .groupBy('foto_produk.id_produk');
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

router.get('/all/by/kategori/sub/:id_sub_kategori',verfikasi_token, async (req, res, next) => {
    try {
        const result = await database("produk")
        .leftOuterJoin("sub_kategori","produk.id_sub_kategori",'sub_kategori.id_sub_kategori')
        .leftOuterJoin("kategori","sub_kategori.id_kategori",'kategori.id_kategori')
        .leftOuterJoin("foto_produk","foto_produk.id_produk",'produk.id_produk')
        .select("produk.*",
        "sub_kategori.nama as nama_sub_kategori","sub_kategori.foto as foto_sub_kategori",
        "kategori.nama as nama_kategori","kategori.foto as foto_kategori","foto_produk.foto as foto_produk")
        .where('produk.status','Y').andWhere('sub_kategori.status',"Y").andWhere('kategori.status','Y').andWhere('sub_kategori.id_sub_kategori',req.params.id_sub_kategori)
        .groupBy('foto_produk.id_produk');
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

router.post('/simpan',verfikasi_token, validasi_data.data,verfikasi_validasi_data, async (req, res, next) => {
    const data = req.body;
    try {
        const simpan = await database('produk').insert(data);
        return res.status(200).json({
            status: 1,
            message: "Berhasil",
            result: {
                id_produk: simpan[0],
                ...data
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
});

router.put('/edit/:id_produk',verfikasi_token, validasi_data.data,verfikasi_validasi_data, async (req, res, next) => {
    const data = req.body;
    try {
        const update = await database('produk').update(data).where('id_produk',req.params.id_produk);
        if (update) {
            return res.status(200).json({
                status: 1,
                message: "Berhasil",
                result: {
                    id_produk: req.params.id_produk,
                    ...data
                }
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
        })
    }
});

router.delete('/hapus/:id_produk',verfikasi_token,async (req, res, next) => {
    try {
        const update = await database("produk").update('status',"N").where('id_produk', req.params.id_produk);
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