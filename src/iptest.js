const cv = require("opencv4nodejs");
const path = require("path");

const image = cv.imread(path.resolve("../src/api/routes/img.jpg"));
console.log(path.resolve("../src/api/routes/img.jpg"));
let tempImg = image.rescale(0.25);
// tempImg = tempImg.cvtColor(cv.COLOR_RGB2RGBA)
tempImg = tempImg.bgrToGray();
tempImg = tempImg.threshold(127, 255, cv.THRESH_BINARY);

const x = tempImg.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

// const devicePort = 0;
// const wCap = new cv.VideoCapture(devicePort);
// cv.waitKey(100)
// console.log(wCap);
cv.imshowWait("Test", tempImg);

// cv.imwrite("./test.png", tempImg);
