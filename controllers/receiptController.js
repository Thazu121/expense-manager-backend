import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

import { receiptModel } from "../models/receiptModel.js";
import { expenseModel } from "../models/expenseModel.js";
import { ocrQueue } from "../queues/ocrQueue.js";

const isValidId = (id) =>
mongoose.Types.ObjectId.isValid(id);

const uploadToCloudinary = (buffer) => {
return new Promise((resolve, reject) => {
const stream = cloudinary.uploader.upload_stream(
{
folder: "receipts",
},
(err, result) => {
if (result) resolve(result);
else reject(err);
}
);
streamifier
  .createReadStream(buffer)
  .pipe(stream);


});
};

export const uploadReceipt = async (req, res) => {
try {
if (!req.file) {
return res.status(400).json({
success: false,
message: "No file uploaded",
});
}


const cloudinaryResult =
  await uploadToCloudinary(
    req.file.buffer
  );

const receipt =
  await receiptModel.create({
    userId: req.user.id,
    imageUrl:
      cloudinaryResult.secure_url,
    cloudinaryId:
      cloudinaryResult.public_id,
    ocrStatus: "pending",
  });

await ocrQueue.add(
  "process-ocr",
  {
    receiptId: receipt._id,
    imageUrl: receipt.imageUrl,
  }
);

return res.status(201).json({
  success: true,
  receipt,
});


} catch (err) {
console.log(
"UPLOAD ERROR:",
err
);


return res.status(500).json({
  success: false,
  message: err.message,
});


}
};

export const getReceipts = async (
req,
res,
next
) => {
try {
const receipts =
await receiptModel
.find({
userId: req.user.id,
})
.sort({
createdAt: -1,
});


return res.json({
  success: true,
  receipts,
});


} catch (err) {
next(err);
}
};

export const getSingleReceipt =
async (req, res, next) => {
try {
if (
!isValidId(req.params.id)
) {
return res.status(400).json({
success: false,
message: "Invalid ID",
});
}


  const receipt =
    await receiptModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

  if (!receipt) {
    return res.status(404).json({
      success: false,
      message:
        "Receipt not found",
    });
  }

  return res.json({
    success: true,
    receipt,
  });
} catch (err) {
  next(err);
}


};

export const updateReceipt =
async (req, res) => {
try {
if (
!isValidId(req.params.id)
) {
return res.status(400).json({
success: false,
message: "Invalid ID",
});
}


  const updateData = {
    merchantName:
      req.body.merchantName,
    extractedAmount:
      req.body.extractedAmount,
    extractedDate:
      req.body.extractedDate,
    category:
      req.body.category ||
      "General",
  };

  const receipt =
    await receiptModel.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      updateData,
      {
        new: true,
      }
    );

  if (!receipt) {
    return res.status(404).json({
      success: false,
      message:
        "Receipt not found",
    });
  }

  if (receipt.expenseId) {
    await expenseModel.findByIdAndUpdate(
      receipt.expenseId,
      {
        category:
          receipt.category,
      }
    );
  }

  return res.json({
    success: true,
    receipt,
  });
} catch (err) {
  console.log(
    "UPDATE RECEIPT ERROR:",
    err
  );

  return res.status(500).json({
    success: false,
    message: err.message,
  });
}


};

export const getReceiptStatus =
async (req, res, next) => {
try {
const receipt =
await receiptModel.findOne({
_id: req.params.id,
userId: req.user.id,
});

  if (!receipt) {
    return res.status(404).json({
      success: false,
      message:
        "Receipt not found",
    });
  }

  return res.json({
    success: true,
    status:
      receipt.ocrStatus,
    confidence:
      receipt.confidenceScore,
    merchant:
      receipt.merchantName,
    amount:
      receipt.extractedAmount,
  });
} catch (err) {
  next(err);
}


};

export const verifyReceipt =
async (req, res, next) => {
try {
const receipt =
await receiptModel.findOneAndUpdate(
{
_id: req.params.id,
userId: req.user.id,
},
{
isVerified: true,
},
{
new: true,
}
);


  if (!receipt) {
    return res.status(404).json({
      success: false,
      message:
        "Receipt not found",
    });
  }

  return res.json({
    success: true,
    receipt,
  });
} catch (err) {
  next(err);
}


};

export const linkReceiptToExpense =
async (req, res, next) => {
try {
const { expenseId } =
req.body;


  const receipt =
    await receiptModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

  if (!receipt) {
    return res.status(404).json({
      success: false,
      message:
        "Receipt not found",
    });
  }

  const expense =
    await expenseModel.findById(
      expenseId
    );

  if (!expense) {
    return res.status(404).json({
      success: false,
      message:
        "Expense not found",
    });
  }

  receipt.expenseId =
    expense._id;

  await receipt.save();

  return res.json({
    success: true,
    receipt,
  });
} catch (err) {
  next(err);
}


};

export const deleteReceipt =
async (req, res, next) => {
try {
const receipt =
await receiptModel.findOne({
_id: req.params.id,
userId: req.user.id,
});

  if (!receipt) {
    return res.status(404).json({
      success: false,
      message:
        "Receipt not found",
    });
  }

  if (
    receipt.cloudinaryId
  ) {
    await cloudinary.uploader.destroy(
      receipt.cloudinaryId
    );
  }

  await receipt.deleteOne();

  return res.json({
    success: true,
    message:
      "Receipt deleted successfully",
  });
} catch (err) {
  next(err);
}

};
