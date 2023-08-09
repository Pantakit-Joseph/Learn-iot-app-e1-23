const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const knex = require("knex");
const dotenv = require("dotenv");
const multer = require("multer");
const uniqueSlug = require("unique-slug");
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads");
  },
  filename: function (req, file, callback) {
    console.log(file);
    const fileExtension = file.originalname.split(".").slice(-1);
    callback(null, uniqueSlug() + "." + fileExtension);
  },
});
const upload = multer({ storage });
dotenv.config();
const app = express();

const db = knex({
  client: "mysql",
  connection: {
    host: process.env.EX02_MYSQL_HOST || "127.0.0.1",
    port: process.env.EX02_MYSQL_PORT || 3306,
    user: process.env.EX02_MYSQL_USER || "root",
    password: process.env.EX02_MYSQL_PASS || "root",
    database: process.env.EX02_MYSQL_DB || "iote1-5-2566",
    supportBigNumber: true,
    timezone: "+7:00",
    dateStrings: true,
    charset: "utf8mb4_unicode_ci",
  },
});

app.use(cors());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  console.log("test api");
  res.send({ ok: 1 });
});

app.post("/test/upload", upload.array("files", 20), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
  console.log(req.files);
  const files = [...req.files];
  // remove buffer
  for (const file of files) {
    file.buffer = null;
  }
  res.send({
    files,
    ok: 1,
  });
});

// app.get("/list", async (req, res) => {
//   const data = await db("users_student").where("major_id", 98);
//   res.send({
//     data: data,
//     status: 1,
//   });
// });

app.get("/list", async (req, res) => {
  const data = await db("member");
  res.send({
    data: data,
    ok: 1,
  });
});

app.get("/member", async (req, res) => {
  const id = req.query.id;
  const data = await db("member").where("id", id).first();
  res.send({
    data: data,
    ok: 1,
  });
});

app.get("/insert", async (req, res) => {
  if (!req.query.name || !req.query.password || !req.query.dep) {
    res.send({
      ok: 0,
      error: "validate failed",
    });
  }
  let ids;
  try {
    ids = await db("member").insert({
      username: req.query.name,
      password: req.query.password,
      dep: req.query.dep,
    });
    res.send({
      ok: 1,
      ids: ids[0],
    });
  } catch (error) {
    res.send({
      ok: 0,
      error: error.message,
    });
  }
});

app.post("/add", async (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.dep) {
    return res.send({
      ok: 0,
      error: "validate failed",
    });
  }
  let ids;
  try {
    ids = await db("member").insert({
      username: req.body.username,
      password: req.body.password,
      dep: req.body.dep,
    });
    res.send({
      ok: 1,
      ids: ids[0],
    });
  } catch (error) {
    res.send({
      ok: 0,
      error: error.message,
    });
  }
});

app.get("/update", async (req, res) => {
  if (
    !req.query.id ||
    !req.query.username ||
    !req.query.password ||
    !req.query.dep
  ) {
    res.send({
      ok: 0,
      error: "validate failed",
    });
  }
  let result;
  try {
    result = await db("member").where("id", req.query.id).update({
      username: req.query.username,
      password: req.query.password,
      dep: req.query.dep,
    });
    res.send({
      ok: 1,
      result,
    });
  } catch (error) {
    console.log(error);
    res.send({
      ok: 0,
      error: error.message,
      code: error?.code,
    });
  }
});

app.post("/edit", async (req, res) => {
  if (
    !req.body.id ||
    !req.body.username ||
    !req.body.password ||
    !req.body.dep
  ) {
    res.send({
      ok: 0,
      error: "validate failed",
    });
  }
  let result;
  try {
    result = await db("member").where("id", req.body.id).update({
      username: req.body.username,
      password: req.body.password,
      dep: req.body.dep,
    });
    res.send({
      ok: 1,
      result,
    });
  } catch (error) {
    console.log(error);
    res.send({
      ok: 0,
      error: error.message,
      code: error?.code,
    });
  }
});

// app.post("/edit", async (req, res) => {
//   try {
//     console.log(req.body);
//     let row = await db("member").where("id", "=", req.body.id).update({
//       username: req.body.username,
//       password: req.body.password,
//       dep: req.body.dep,
//     });
//     console.log("row=", row);
//     res.send({
//       ok: 1,
//       data: row,
//     });
//   } catch (e) {
//     console.log(e.message);
//     res.send({
//       ok: 0,
//       error: e.message,
//     });
//   }
// });

app.get("/delete", async (req, res) => {
  if (!req.query.id) {
    res.send({
      ok: 0,
      error: "validate failed",
    });
  }
  let ids;
  try {
    ids = await db("member").where("id", req.query.id).del();
    res.send({
      ok: 1,
      ids: ids[0],
    });
  } catch (error) {
    console.log(error);
    res.send({
      ok: 0,
      error: error.message,
      code: error?.code,
    });
  }
});

app.listen(7001, () => {
  console.log("ready:candle:7001");
});
