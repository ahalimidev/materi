const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.options('*', cors());

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/",require("./router/index"));

app.use('/file/kategori', express.static(path.join(__dirname, './kategori/foto')));
app.use('/file/kategori/sub', express.static(path.join(__dirname, './sub_kategori/foto')));
app.use('/file/kategori/sub/produk', express.static(path.join(__dirname, './produk/foto')));
app.use('/file/transaksi/bukti_pembayaran', express.static(path.join(__dirname, './transaksi/foto')));

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: error.message,
    });
});

app.listen(PORT, ()=>{
    console.log(`Server running in http://localhost:${PORT}`);
})