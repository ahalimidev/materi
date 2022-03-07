const database = require("../config/database");
const express = require("express");
const router = express.Router();

router.get('/provinsi', async(req, res, next) =>{
   try {
       const result = await database.select("*").from("provinsi");
       return res.status(200).json({
           status : 1,
           message : "Berhasil",
           result : result
       })
   } catch (error) {
       return res.status(500).json({
           status : 0,
           message : error.message
        })
   }
});

router.get('/kabupaten/:province_id', async(req, res, next) =>{
    try {
        const result = await database.select("*").from("kabupaten").where('province_id',req.params.province_id);
        return res.status(200).json({
            status : 1,
            message : "Berhasil",
            result : result
        })
    } catch (error) {
        return res.status(500).json({
            status : 0,
            message : error.message
        })
    }

});

router.get('/kecamatan/:regency_id', async(req, res, next) =>{
    try {
        const result = await database.select("*").from("kecamatan").where('regency_id',req.params.regency_id);
        return res.status(200).json({
            status : 1,
            message : "Berhasil",
            result : result
        })
    } catch (error) {
        return res.status(500).json({
            status : 0,
            message : error.message
        })
    }

});

router.get('/desa/:district_id', async(req, res, next) =>{
    try {
        const result = await database.select("*").from("desa").where('district_id',req.params.district_id);
        return res.status(200).json({
            status : 1,
            message : "Berhasil",
            result : result
        })
    } catch (error) {
        return res.status(500).json({
            status : 0,
            message : error.message
        })
    }

});

module.exports = router;