const database = require("../config/database");
const validasi_data = require("./validasi_data");
const verfikasi_validasi_data = require("../middleware/verfikasi_validasi_data");
const verfikasi_token = require("../middleware/auth");
const moment = require('moment');
const express = require("express");
const router = express.Router();

router.get("/all/:id_user",verfikasi_token, async (req, res, next) => {
    try {
        const result = await database("keranjang")
        .leftOuterJoin("produk","produk.id_produk",'keranjang.id_produk')
        .leftOuterJoin("sub_kategori","produk.id_sub_kategori",'sub_kategori.id_sub_kategori')
        .leftOuterJoin("kategori","sub_kategori.id_kategori",'kategori.id_kategori')
        .leftOuterJoin("foto_produk","foto_produk.id_produk",'produk.id_produk')
        .select("keranjang.id_keranjang","produk.nama_produk", 
        "sub_kategori.nama as nama_sub_kategori","kategori.nama as nama_kategori","foto_produk.foto as foto_produk","keranjang.jumlah","keranjang.harga","keranjang.berat")
        .where('keranjang.id_user',req.params.id_user)
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
        });
    }

});

router.post("/tambah", verfikasi_token, async (req, res, next) => {
    const data = req.body;
    try {
        const simpan = await database('keranjang').insert(data);
        return res.status(200).json({
            status: 1,
            message: "Berhasil",
            result: {
                id_keranjang: simpan[0],
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

router.put("/stok/:id_keranjang",verfikasi_token, async (req, res, next) => {
    try {
        const result = await database.select("*").from("keranjang").where('id_keranjang', req.params.id_keranjang).first();
        if (result) {
            if(result.jumlah == 0){
                await database.from("keranjang").where('id_keranjang',req.params.id_keranjang).delete();
                return res.status(200).json({
                    status: 1,
                    message: "Berhasil",
                });
            }else{
                await database.from("keranjang").where('id_keranjang',req.params.id_keranjang).update({jumlah : req.body.jumlah });
                return res.status(200).json({
                    status: 1,
                    message: "Berhasil",
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }

});


router.post("/transaksi", validasi_data.data, verfikasi_validasi_data, async (req, res, next) => {
    const data = req.body;
    const today = moment().format('DDMMYYYY');
    try {
        const kode_transaksi = await database("transaksi").max("nomor_transaksi as last").where('nomor_transaksi','like',today+"%").first();
        const nomor_urut = kode_transaksi.last == null ? today+"1" :  today+(parseInt(kode_transaksi.last.substring(8))+1);

        const transaksi = {
            id_user : data.id_user,
            nomor_transaksi : nomor_urut,
            tanggal_transaksi : moment().format('YYYY-MM-DD h:mm:ss'),
            asal : data.asal,
            tujuan : data.tujuan,
            alamat_kirim : data.alamat_kirim,
            nomor_telepon : data.nomor_telepon,
            kurir : data.kurir,
            ongkos_kirim : data.ongkos_kirim,
            waktu_kirim : data.waktu_kirim,
            status_transaksi : "Belum Dibayar",
            total_transaksi : data.total_transaksi
        }
        const simpan = await database('transaksi').insert(transaksi);
        data.produk.forEach(async xdata => {
            const transaksi_detail = {
                id_transaksi : simpan[0],
                id_produk :xdata.id_produk,
                jumlah : xdata.jumlah,
                harga : xdata.harga,
                berat : xdata.berat,
            }
            await database('transaksi_detail').insert(transaksi_detail);
            await database("keranjang").where('id_produk',xdata.id_keranjang).delete();           
        });

        return res.status(200).json({
            status: 1,
            message: "Berhasil",
        });

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }

});

router.delete("/hapus/all/:id_user", verfikasi_token, async (req, res, next) => {
    try {
        const result = await database.select("*").from("keranjang").where('id_user', req.params.id_user);
        if (result.length > 0) {
            await database.from("keranjang").where('id_user',req.params.id_user).delete();
            return res.status(200).json({
                status: 1,
                message: "Berhasil",
            });
        }else{
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

router.delete("/hapus/one/:id_keranjang",verfikasi_token, async (req, res, next) => {
    try {
        const result = await database.select("*").from("keranjang").where('id_keranjang', req.params.id_keranjang).first();
        if (result) {
            await database.from("keranjang").where('id_keranjang',req.params.id_keranjang).delete();
            return res.status(200).json({
                status: 1,
                message: "Berhasil",
            });
        }else{
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