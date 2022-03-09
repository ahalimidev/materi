const database = require("../config/database");
const config = require("../config/auth");
const validasi_data = require("./validasi_data");
const verfikasi_validasi_data = require("../middleware/verfikasi_validasi_data");
const verfikasi_token = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth : {
        user : 'ahalimidev2017@gmail.com',
        pass : 'h4l1m1f0lds'
    },
})


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
    const ramdom = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);

    try {

        const login = await database("user").where('email', data.email).first();
        if (login) {
            if (bcrypt.compare(data.password, login.password)) {
                const mailOptions = {
                    from: 'halimisasaki@gmail.com', // Sender address
                    to: login.email, // List of recipients
                    subject: 'Verfikasi Kode', // Subject line
                    text: 'kode verfikasi '+ramdom, 
               };
               
               transporter.sendMail(mailOptions, function(err, info) {
                   if (err) {
                    return res.status(400).json({
                        status: 0,
                        message: "Tidak memperoleh kode verfikasi",
                        error : err
                    });
                   } else {
                        database("user").update('verfikasi_code',ramdom).where('email',data.email);
                        return res.status(200).json({
                            status: 1,
                            message: "Berhasil",
                            result : info
                        });
                   }
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
                message: "Email tidak ditemukan",
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
        const result =  await database("user").where('email',data.email).first(); 
        if(result){
            const mailOptions = {
                from: 'halimisasaki@gmail.com', // Sender address
                to: result.email, // List of recipients
                subject: 'Verfikasi Kode', // Subject line
                text: 'kode verfikasi '+ramdom, 
           };
           
           transporter.sendMail(mailOptions, function(err, info) {
               if (err) {
                return res.status(400).json({
                    status: 0,
                    message: "Tidak memperoleh kode verfikasi",
                    error : err
                });
               } else {
                    database("user").update('verfikasi_code',ramdom).where('email',data.email);
                    return res.status(200).json({
                        status: 1,
                        message: "Berhasil",
                        result : info
                    });
               }
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
        const code = await database("user").where('verfikasi_code', data.verfikasi_code).first();
        if(code){

            const id_user = code.id_user
            const nama = code.nama
            const email = code.email

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

router.get("/profil/:id_user", async (req, res, next) => {
    try {
        const profil = await database("user")
        .leftOuterJoin("provinsi","user.id_provinsi",'provinsi.id')
        .leftOuterJoin("kabupaten","user.id_kabupaten",'kabupaten.id')
        .leftOuterJoin("kecamatan","user.id_kecamatan",'kecamatan.id')
        .leftOuterJoin("desa","user.id_desa",'desa.id')
        .select("user.id_user","user.nama","provinsi.name as nama_provinsi","kabupaten.name as nama_kabupaten","kecamatan.name as nama_kecamatan","desa.name as nama_desa","user.alamat","user.telepon")
        .where("user.id_user",req.params.id_user);
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

router.put("/profil/edit/:id_user", validasi_data.daftar, verfikasi_validasi_data, async (req, res, next) => {
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


        await database('user').update(data).where('id_user',req.params.id_user);
        return res.status(200).json({
            status: 1,
            message: "Berhasil",
            result: {
                id_user: id_user,
                ...data
            }
        });

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