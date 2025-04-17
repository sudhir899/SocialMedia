import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const { receiverId } = req.params;

    const notifications = await Notification.find({ receiver: receiverId })
      .sort({ createdAt: -1 }); 

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};



export const createNotification = async (req, res) => {
    try {
      const { sender, receiver, type, desc } = req.body;
  
      if (!sender || !receiver || !type || !desc) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const newNotification = new Notification({
        sender,
        receiver,
        type,
        desc,
      });
  
      const savedNotification = await newNotification.save();
  
      res.status(201).json(savedNotification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ error: "Failed to create notification" });
    }
  };
  