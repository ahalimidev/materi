const {
    check
} = require('express-validator');

module.exports.data = [
    check('asal')
        .isNumeric().withMessage('asal harus berupa nomor')
        .exists().withMessage('asal harus ada'),
    check('tujuan')
        .isNumeric().withMessage('tujuan harus berupa nomor')
        .exists().withMessage('tujuan harus ada'),
    check('alamat_kirim')
        .isString().withMessage('alamat_kirim harus berupa string')
        .exists().withMessage('alamat_kirim harus ada'),
    check('nomor_telepon')
        .isNumeric().withMessage('nomor_telepon harus berupa nomor')
        .exists().withMessage('nomor_telepon harus ada'),
    check('kurir')
        .isString().withMessage('kurir harus berupa string')
        .exists().withMessage('kurir harus ada'),
    check('ongkos_kirim')
        .isNumeric().withMessage('ongkos_kirim harus berupa nomor')
        .exists().withMessage('ongkos_kirim harus ada'),
    check('waktu_kirim')
        .isString().withMessage('waktu_kirim harus berupa string')
        .exists().withMessage('waktu_kirim harus ada'),
    check('total_transaksi')
        .isNumeric().withMessage('total_transaksi harus berupa nomor')
        .exists().withMessage('total_transaksi  harus ada'),
    check('produk')
        .isArray().withMessage('produk harus berupa array')
        .exists().withMessage('produk harus ada'),
]
