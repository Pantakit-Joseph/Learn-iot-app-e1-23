const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const knex = require("knex");
const app = express();
const multer = require("multer");

const db = knex({
  client: "mysql",
  connection: {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASS || "root_1234",
    database: process.env.MYSQL_DB || "iote1-5-2566",
    supportBigNumber: true,
    timezone: "+7:00",
    dateStrings: true,
    charset: "utf8mb4_unicode_ci",
  },
});

app.use(cors());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send({ ok: 1 });
});

app.get("/list", async (req, res) => {
  const data = await db("users_student").where("major_id", 98);
  res.send({
    data: data,
    status: 1,
  });
});

app.listen(7001, () => {
  console.log("ready:candle:7001");
});
