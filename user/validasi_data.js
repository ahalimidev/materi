const {
    body,
    param
} = require('express-validator');

module.exports.daftar = [
    body('nama')
        .isString().withMessage('nama harus berupa string')
        .exists().withMessage('nama harus ada'),
    body('id_provinsi')
        .isNumeric().withMessage('id_provinsi harus berupa nomor')
        .exists().withMessage('id_provinsi harus ada'),
    body('id_kabupaten')
        .isNumeric().withMessage('id_kabupaten harus berupa nomor')
        .exists().withMessage('id_kabupaten harus ada'),
    body('id_kecamatan')
        .isNumeric().withMessage('id_kecamatan harus berupa nomor')
        .exists().withMessage('id_kecamatan harus ada'),
    body('id_desa')
        .isNumeric().withMessage('id_desa harus berupa nomor')
        .exists().withMessage('id_desa harus ada'),
    body('alamat')
        .isString().withMessage('alamat harus berupa string')
        .exists().withMessage('alamat harus ada'),
    body('telepon')
        .isNumeric().withMessage('telepon harus berupa nomor')
        .exists().withMessage('telepon harus ada')
        .isLength({ min: 5, max : 15}),
    body('email')
        .isString().withMessage('email harus berupa string')
        .exists().withMessage('email harus ada')
        .isEmail().withMessage('email tidak valid'),
    body('password')
        .isString().withMessage('password harus berupa string')
        .exists().withMessage('password harus ada')
        .isLength({ min: 5})
]

module.exports.login = [
    body('email')
        .isString().withMessage('email harus berupa string')
        .exists().withMessage('email harus ada')
        .isEmail().withMessage('email tidak valid'),
    body('password')
        .isString().withMessage('password harus berupa string')
        .exists().withMessage('password harus ada')
        .isLength({ min: 5})
]


module.exports.password = [
    body('baru_password')
        .isString().withMessage('baru_password harus berupa string')
        .exists().withMessage('baru_password harus ada')
        .isLength({ min: 5}),
    body('verfikasi_password')
        .isString().withMessage('verfikasi_password harus berupa string')
        .exists().withMessage('verfikasi_password harus ada')
        .isLength({ min: 5})
]

module.exports.email = [
    body('email')
        .isString().withMessage('email harus berupa string')
        .exists().withMessage('email harus ada')
        .isEmail().withMessage('email tidak valid'),
]
module.exports.code = [
    body('verfikasi_code')
    .isNumeric().withMessage('verfikasi_code harus berupa nomor')
    .exists().withMessage('verfikasi_code harus ada')
    .isLength({ min: 5, max : 6}),
]