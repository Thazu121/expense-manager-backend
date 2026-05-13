import mongoose from "mongoose"

const notificationSchema= new mongoose.Schema({
      userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
      title:  {

        },
        message:{

        },
        isRead:{
            
        }
})