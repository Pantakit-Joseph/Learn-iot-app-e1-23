const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const uniqueSlug = require("unique-slug");
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads");
  },
  filename: function (req, file, callback) {
    const fileExtension = file.originalname.split(".").slice(-1);
    callback(null, uniqueSlug() + "." + fileExtension);
  },
});
const upload = multer({ storage });
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/photo", function (req, res, next) {
  const uploadFun = upload.array("files", 20);
  uploadFun(req, res, function (err) {
    console.log(req.body);
    console.log(req.files);
    if (err) {
      return res.end("Error uploading file.");
    }
    res.end("File is uploaded");
  });
});

app.listen(7002, () => {
  console.log("ready:candle:7002");
});
