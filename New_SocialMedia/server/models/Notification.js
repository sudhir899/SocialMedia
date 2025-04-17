import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    sender:
      { 
        type: mongoose.Schema.Types.ObjectId,
         ref: "User" 
    },
    receiver:
      { 
        type: mongoose.Schema.Types.ObjectId,
         ref: "User" 
    },
    type:{
        type:String,
        required: true
    },
    desc:{
        type: String,
        required: true
    },
    
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
