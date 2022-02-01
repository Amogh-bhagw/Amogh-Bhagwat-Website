/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/

const mysql = require("mysql");

const dbCon = mysql.createConnection({
    host: "us-cdbr-east-03.cleardb.com",
    user: "b084717972b47a",               // replace with the database user provided to you
    password: "69f09248",                  // replace with the database password provided to you
    database: "heroku_ba8710f68fd386d",           // replace with the database user provided to you
    port: 3306
});

console.log("Attempting database connection");
dbCon.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log("Connected to database!");

    const sql = `CREATE TABLE tbl_contacts (
        contact_id   INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name         VARCHAR(30),
        category     VARCHAR(40),
        location     VARCHAR(300),
        contact_info VARCHAR(200),
        email        VARCHAR(30),
        website      VARCHAR(300),
        website_url  VARCHAR(300)
    )`;

    console.log("Attempting to create table: tbl_contacts");
    dbCon.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        console.log("Table tbl_accounts created");
    });

    dbCon.end();
});
