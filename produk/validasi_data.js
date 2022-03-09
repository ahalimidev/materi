const {
    check
} = require('express-validator');

module.exports.data = [
    check('nama_produk')
        .isString().withMessage('nama_produk harus berupa string')
        .exists().withMessage('nama_produk harus ada'),
    check('id_sub_kategori')
        .isNumeric().withMessage('id_sub_kategori harus berupa nomor')
        .exists().withMessage('id_sub_kategori harus ada'),
    check('harga')
        .isNumeric().withMessage('harga harus berupa nomor')
        .exists().withMessage('harga harus ada'),
    check('berat')
        .isNumeric().withMessage('berat harus berupa nomor')
        .exists().withMessage('berat harus ada'),
    check('stok')
        .isNumeric().withMessage('stok harus berupa nomor')
        .exists().withMessage('stok harus ada'),
    check('keterangan')
        .isString().withMessage('keterangan harus berupa string')
        .exists().withMessage('keterangan harus ada'),
]
