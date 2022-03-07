const {
    body,
    param
} = require('express-validator');

module.exports.daftar = [
    body('username')
        .isString().withMessage('username harus berupa string')
        .exists().withMessage('username harus ada'),
    body('password')
        .isString().withMessage('password harus berupa string')
        .exists().withMessage('password harus ada')
        .isLength({ min: 5})
]

module.exports.login = [
    body('username')
        .isString().withMessage('username harus berupa string')
        .exists().withMessage('username harus ada'),
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