const express = require('express')
const router = express.Router()
const axios = require('axios')

axios.defaults.baseURL = 'https://pro.rajaongkir.com/api';
axios.defaults.headers.common['key'] = '0f5bc4f275fbc61ad918e465ed73f1f9';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

router.get('/provinsi', async (req, res, next) => {
    await axios.get('/province')
        .then(response => res.json(response.data))
        .catch(err => res.json({
            message: err.message,
        }))
});

router.get('/kota/:provId', async (req, res, next) => {

    const id = req.params.provId
    await axios.get(`/city?province=${id}`)
        .then(response => res.json(response.data))
        .catch(err => res.json({
            message: err.message,
        }))
});

router.get('/kecamatan/:cityId', async (req, res, next) => {

    const id = req.params.cityId
    await axios.get(`/subdistrict?city=${id}`)
        .then(response => res.json(response.data))
        .catch(err => res.json({
            message: err.message,
        }))

});

router.get('/ongkos/:asal/:asal_type/:tujuan/:tujuan_type/:berat/:kurir', async (req, res, next) => {
    const param = req.params
    await axios.post('/cost', {
            origin: param.asal,
            destination: param.tujuan,
            weight: param.berat,
            courier: param.kurir,
            originType: param.asal_type,
            destinationType: param.tujuan_type
        })
        .then(response => res.json(response.data))
        .catch(err => res.json({
            message: err.message,
        }))
});

router.get('/tracking/:resi/:kurir', (req, res, next) => {
    const param = req.params
    axios.post('/waybill', {
            waybill: param.resi,
            courier: param.kurir
        })
        .then(response => res.json(response.data))
        .catch(err => res.json({
            message: err.message,
        }))
});

module.exports = router