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

        const isUsername = await database("admin").where('username', data.username).first();
        if (isUsername) return res.status(400).json({
            status: 0,
            message: "Username sudah ada"
        });

        const createUser = {
            ...data,
            password: bcrypt.hashSync(data.password, 12)
        };

        const simpan = await database('admin').insert(createUser);
        return res.status(200).json({
            status: 1,
            message: "Berhasil",
            result: {
                id_admin: simpan[0],
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

        const login = await database("admin").where('username', data.username).first();
        if (login) {
            if (bcrypt.compare(data.password, login.password)) {
                const id_admin = login.id_admin
                const username = login.username
                const password = login.password

                const access_token = jwt.sign({
                    id_admin,
                    username,
                    password
                }, config.ACCESS_TOKEN_SECRET, {
                    expiresIn: '30s'
                })

                const refresh_token = jwt.sign({
                    id_admin,
                    username,
                    password
                }, config.REFRESH_TOKEN_SECRET, {
                    expiresIn: '7d'
                })

                res.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000
                })
                
                await database("admin").update('refresh_token',refresh_token).where('id_admin',id_admin); 

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

router.get("/all",verfikasi_token, async (req, res, next) => {
    try {
        const profil = await database("admin");
        return res.status(200).json({
            status: 1,
            message: "Berhasil",
            result: profil
        });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
});

router.put("/password/:id_admin",verfikasi_token, validasi_data.password,verfikasi_validasi_data, async (req, res, next) => {
    const data = req.body;
    try {
        if(data.baru_password != data.verfikasi_password){
            return res.status(400).json({
                status: 0,
                message: "Password tidak sama",
            });
        }else{
            const update =  await database("admin").update('password',bcrypt.hashSync(data.verfikasi_password, 12)).where('id_admin',req.params.id_admin); 
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

router.delete("/delete/:id_admin",verfikasi_token, async (req, res, next) => {
    try {
        const hapus = await database("admin").where('id_admin',req.params.id_admin).del();
        if(hapus){
            return res.status(200).json({
                status: 1,
                message: "Berhasil",
            });
        }else{
            return res.status(400).json({
                status: 0,
                message: "Gagal Hapus",
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