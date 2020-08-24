// const express = require("express");
// const fs = require("fs");
// const multer = require("multer");
// const path = require("path");
// const crypto = require("crypto");

// const router = express.Router();
// const passport = require("passport");
// const cv = require("opencv4nodejs");
// // Database Models

// // Multer Configurations - File Upload

// let storedFileName = "";
// const storage = multer.diskStorage({
//   destination(req, file, callback) {
//     // Path resolving start from the place where you place the index.js
//     callback(null, path.resolve("../file_uploads/signatures"));
//   },
//   filename(req, file, callback) {
//     // callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
//     crypto.pseudoRandomBytes(16, (err, raw) => {
//       if (err) return callback(err);

//       storedFileName = raw.toString("hex") + path.extname(file.originalname);
//       console.log("StoreFileName: ", storedFileName);
//       callback(null, storedFileName);
//     });
//   },
// });
// const upload = multer({
//   storage,
// }).single("file_");

// require("../../config/passport_config");

// module.exports = (app) => {
//   app.use("/signature", router);

//   // Handle errors
//   app.use((err, req, res, next) => {
//     res.status(err.status || 500);
//     res.json({ error: err });
//   });

//   // ----------------------------------------------------------------------------------------
//   //                               Route Endpoints
//   // ----------------------------------------------------------------------------------------

//   // File Uploader
//   router.post("/upload", async (req, res) => {
//     upload(req, res, (err) => {
//       if (err) {
//         console.log(err);
//         return res.end("Something went wrong!");
//       }

//       //   Process Image
//       const image = cv.imread(path.resolve(`../../../Project/server/file_uploads/signatures/${storedFileName}`));
//       console.log(path.resolve(`../../../Project/server/file_uploads/signatures/${storedFileName}`));
//       let tempImg = image.rescale(0.25);
//       tempImg = tempImg.bgrToGray();
//       tempImg = tempImg.threshold(127, 255, cv.THRESH_BINARY);

//       //   cv.imshowWait("Test", tempImg);
//       const outBase64 = cv.imencode(".jpg", tempImg).toString("base64"); // Perform base64 encoding
//       return res.json({ base64_image: `data:image/jpeg;base64, ${outBase64}` });
//     });

//   //
//   });
// };
