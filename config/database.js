const knex = require("knex")({
    client: 'mysql2',
    connection: {
      host:'localhost',
      user: 'root',
      password: '',
      database: 'x'
    }
});
module.exports = knex;
//module.exports mengekspos fungsi, object atau variabel sebagai model di node js yang bisa di akses di luar file ini.

