const database = require("../config/database");
const config = require("../config/auth");
const validasi_data = require("./validasi_data");
const verfikasi_validasi_data = require("../middleware/verfikasi_validasi_data");
const verfikasi_token = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

router.post("/daftar", validasi_data.daftar, verfikasi_validasi_data, async (req, res, next) => {
    const data = req.body;

    try {

        const isEmail = await database("user").where('email', data.email);
        if (isEmail) return res.status(400).json({
            status: 0,
            message: "Email sudah ada"
        });

        const isTelepon = await database("user").where('telepon', data.telepon);
        if (isTelepon) return res.status(400).json({
            status: 0,
            message: "Telepon sudah ada"
        });

        const isUsername = await database("user").where('username', data.username);
        if (isUsername) return res.status(400).json({
            status: 0,
            message: "Username sudah ada"
        });

        const createUser = {
            ...data,
            password: bcrypt.hashSync(data.password, 12)
        };

        const simpan = await database('user').insert(createUser);
        return res.status(200).json({
            status: 1,
            message: "Berhasil",
            result: {
                id_user: simpan[0],
                ...createUser
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }

});

router.post("/login", validasi_data.login, verfikasi_validasi_data, async (req, res, next) => {
    const data = req.body;

    try {

        const login = await database("user").where('email', data.email);
        if (login.length > 0) {
            if (bcrypt.compare(data.password, login[0].password)) {
                const id_user = login[0].id_user
                const nama = login[0].nama
                const email = login[0].email

                const access_token = jwt.sign({
                    id_user,
                    nama,
                    email
                }, config.ACCESS_TOKEN_SECRET, {
                    expiresIn: '30s'
                })

                const refresh_token = jwt.sign({
                    id_user,
                    nama,
                    email
                }, config.REFRESH_TOKEN_SECRET, {
                    expiresIn: '7d'
                })

                res.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000
                })
                
                await database("user").update('refresh_token',refresh_token).where('id_user',id_user); 

                return res.status(200).json({
                    status: 1,
                    message: "Berhasil",
                    result: access_token
                });

            } else {
                return res.status(400).json({
                    status: 0,
                    message: "Password tidak ditemukan",
                });
            }
        } else {
            return res.status(400).json({
                status: 0,
                message: "Username tidak ditemukan",
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
});
router.post("/verfikasi/email",validasi_data.email,verfikasi_validasi_data, async (req, res, next) => {
    const data = req.body;
    const ramdom = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
    try {
        const update =  await database("user").update('verfikasi_code',ramdom).where('email',data.email); 
        if(update){
            return res.status(200).json({
                status: 1,
                message: "Berhasil",
            });
        }else{
            return res.status(400).json({
                status: 0,
                message: "Tidak memperoleh kode verfikasi",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
});

router.post("/verfikasi/code",validasi_data.code,verfikasi_validasi_data, async (req, res, next) => {
    const data = req.body;
    try {
        const code = await database("user").where('verfikasi_code', data.verfikasi_code);
        if(code.length > 0){
            return res.status(200).json({
                status: 1,
                message: "Verfikasi Berhasil",
                result : {
                    id_user : code[0].id_user,
                    email : code[0].email
                }
            });
        }else{
            return res.status(400).json({
                status: 0,
                message: "Verfikasi Gagal",
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
});

router.get("/profil/:id_user",verfikasi_token, async (req, res, next) => {
    try {
        const profil = await database("user").where('id_user', req.params.id_user);
        return res.status(200).json({
            status: 1,
            message: "Berhasil",
            result: profil[0]
        });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
});


router.put("/profil/password/:id_user",verfikasi_token, validasi_data.password,verfikasi_validasi_data, async (req, res, next) => {
    const data = req.body;
    try {
        if(data.baru_password != data.verfikasi_password){
            return res.status(400).json({
                status: 0,
                message: "Password tidak sama",
            });
        }else{
            const update =  await database("user").update('password',bcrypt.hashSync(data.verfikasi_password, 12)).where('id_user',req.params.id_user); 
            if(update){
                return res.status(200).json({
                    status: 1,
                    message: "Berhasil",
                });
            }else{
                return res.status(400).json({
                    status: 0,
                    message: "Password tidak bisa update",
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

router.get("/refresh_token", async (req, res, next) => {
    try {
        let refresh_token = req.cookies.refresh_token
        if (!refresh_token) {
            return res.status(404).json({
                status: 0,
                message: "Tidak ada token"
            });
        }
        const users = await database("user").where('refresh_token', refresh_token);
        if (!users[0]) {
            return res.status(400).json({
                status: 0,
                message: "Sesuatu yang salah"
            });
        }
        jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
            if (err) {
                return res.status(400).json({
                    status: 0,
                    message: "Sesuatu yang salah"
                });
            }

            const id_user = login[0].id_user
            const nama = login[0].nama
            const email = login[0].email

            const access_token = jwt.sign({
                id_user,
                nama,
                email
            }, config.ACCESS_TOKEN_SECRET, {
                expiresIn: '30s'
            })

            const refresh_token = jwt.sign({
                id_user,
                nama,
                email
            }, config.REFRESH_TOKEN_SECRET, {
                expiresIn: '7d'
            })

            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })

            return res.status(200).json({
                status: 1,
                message: "Berhasil",
                result: access_token
            });
        })
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
});

module.exports = router;