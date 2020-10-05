// const express = require("express");
// const fs = require("fs");
// const multer = require("multer");
// const path = require("path");
// const crypto = require("crypto");
// const otpGenerator = require("otp-generator");
// // Bcrypt for Hashing Passwords
// const bcrypt = require("bcrypt");
// const axios = require("axios");

// const router = express.Router();
// const passport = require("passport");
// const cv = require("opencv4nodejs");
// // Database Models
// const { strict } = require("assert");
// const { Buffer } = require("buffer");
// const SignatureModel = require("../../models/signature_model");

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
//   router.post("/upload", (req, res) => {
//     upload(req, res, async (err) => {
//       if (err) {
//         console.log(err);
//         return res.end("Something went wrong!");
//       }

//       try {
//         const imagePath = path.resolve(`../../../Project/server/file_uploads/signatures/${storedFileName}`);
//         // Process Image
//         const image = await cv.imread(imagePath);
//         let tempImg = image.rescale(0.25);
//         tempImg = tempImg.bgrToGray();
//         tempImg = tempImg.threshold(127, 255, cv.THRESH_BINARY);
//         // v.imshowWait("Test", tempImg);

//         // Image Converted to  Base64 String
//         const outBase64 = await cv.imencode(".jpg", tempImg).toString("base64"); // Perform base64 encoding

//         // Database Operations
//         const buff = Buffer.from(imagePath, "utf-8");
//         const base64EncodedImageURL = buff.toString("base64");
//         // console.log(`"${imagePath}" converted to Base64 is "${base64EncodedImageURL}"`);
//         const result = await SignatureModel.addSignature("sdfsdfsdfsd", base64EncodedImageURL, `data:image/jpeg;base64, ${outBase64}`);
//         if (result.affectedRows === 1) {
//           console.log("Record Added to Signature Table");
//         } else {
//           console.log("Databse Operation Failed");
//         }
//         // Send Response
//         return res.json({ base64_image: `data:image/jpeg;base64, ${outBase64}` });
//       } catch (error) {
//         console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee ", error);
//       }
//     });

//   //
//   });

//   // OTP Sender
//   router.post("/generate_otp", async (req, res) => {
//     // Validations
//     if (req.body.user_id !== "" && req.body.mobile_no !== "") {
//       const signature = await SignatureModel.getSignatureByUserId(req.body.user_id, 0);
//       console.log(">>>>>>>>>>>>>>>>", signature);
//       if (signature !== undefined) {
//         // Generate OTP
//         const otp = otpGenerator.generate(6, {
//           upperCase: true, specialChars: false, digits: true, alphabets: true,
//         });
//         /*
//             generate(length, options)
//             Arguments

//             length - length of password. Optional if options is optional. default length is 10.
//             options - optional
//             digits - Default: true true value includes digits in OTP
//             alphabets - Default: true true value includes alphabets in OTP
//             upperCase - Default: true true value includes uppercase alphabets in OTP
//             specialChars - Default: true true value includes special Characters in OTP
//         */
//         console.log("OTP: ", otp);
//         // Store the OTP in the OTP table
//         const hashedOTP = await bcrypt.hash(otp, 10);
//         const otpResult = await SignatureModel.addOTP(req.body.user_id, hashedOTP);
//         if (otpResult.affectedRows === 1) {
//           console.log("Record Added to Signature_OTP Table");

//           // TODO #11 - Set CRON Job for auto delete OTP after 5 mins

//           // Send OTP to Client Side
//           const textIT = {
//             accountID: "94775072201",
//             accountPassword: "7834",
//           };
//           const message = `Your OTP is ${otp}`;
//           const textITres = await axios.get(`http://www.textit.biz/sendmsg?id=${textIT.accountID}&pw=${textIT.accountPassword}&to=${req.body.mobile_no}&text=${message}`);
//           if (textITres.data.split(":")[0] === "OK") {
//             res.json("Success");
//           } else {
//             res.json({
//               error: {
//                 code: "",
//                 message: "",
//                 decription: "",
//               },
//             });
//           }
//           console.log("TextIT Res: ", textITres, "==============================", textITres.data.split(":")[0]);
//         } else {
//           console.log("Databse Operation Failed");
//         }
//       } else {
//         //   Handle Error - Empty Result
//       }
//     }
//   //
//   });
// };
