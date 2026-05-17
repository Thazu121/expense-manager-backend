import multer from "multer";
import path from "path";



const storage = multer.diskStorage({

  destination: function (
    req,
    file,
    cb
  ) {

    cb(
      null,
      "uploads/receipts"
    )
  },

  filename: function (
    req,
    file,
    cb
  ) {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(
        Math.random() * 1E9
      ) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});



const fileFilter = (
  req,
  file,
  cb
) => {

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only jpg, jpeg, png and webp images are allowed"
      ),
      false
    );
  }
};



const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize:
      5 * 1024 * 1024,
  },
})



export default upload