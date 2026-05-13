import mongoose from "mongoose"

const activitylogSchema= new mongoose.Schema({
      userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        action:{

        },
        description:{
            
        }
    })