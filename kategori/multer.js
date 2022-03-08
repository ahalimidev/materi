const multer = require("multer");
const path = require("path");
const tools = require("../middleware/ramdom_text");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
        cb(null,path.join(__dirname + '/foto/'));
    },
    filename:async function (req, file, cb) {
        cb(null, tools.makeid(15) + path.extname(file.originalname));
    }
});

// check type of file will upload
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};

// exports
module.exports.upload = multer(
	{ 
		storage: storage, 
		fileFilter: imageFilter,
		limits: {
			fileSize: 1000000 //max 2mb
		} 
	}
);