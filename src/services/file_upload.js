// const fs = require("fs");
// const multer = require("multer");
// const path = require("path");
// const crypto = require("crypto");

// const storage = multer.diskStorage({
//   destination: "../../file_uploads",
//   filename(req, file, callback) {
//     crypto.pseudoRandomBytes(16, (err, raw) => {
//       if (err) return callback(err);

//       callback(null, raw.toString("hex") + path.extname(file.originalname));
//     });
//   },
// });

// const uploadFile = (request, response) => new Promise((resolve, reject) => {
//   const upload = multer({ storage }).single("file");

//   upload(request, response, (err) => {
//     if (!request.file) {
//       reject("No File");
//     } else if (err instanceof multer.MulterError) {
//       reject(err);
//     } else if (err) {
//       reject(err);
//     }

//     resolve("Uploaded");
//   });
// });

// export default uploadFile;
