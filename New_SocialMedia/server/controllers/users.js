import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


// Controller function to fetch multiple users
export const getUsersByIds = async (req, res) => {
  try {
    const { userIds } = req.body; // Array of user IDs
    const users = await User.find({ _id: { $in: userIds } }).select("_id firstName lastName picturePath");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};


export const getRecommendations = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUser = await User.findById(id);
    const user = await User.find({_id: { $nin: [...loggedInUser.friends, ...loggedInUser.friendRequests, id] },}).select("-password");
    const formattedUsers = user.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    // console.log(formattedUsers);
    res.status(200).json(formattedUsers);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    // console.log(formattedFriends);
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const RemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } 
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const getFriendRequests = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate("friendRequests", "_id firstName lastName picturePath");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user.friendRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching friend requests", error: error.message });
  }
};


export const sendFriendRequest = async (req, res) => {
  try {
    const { id } = req.params; // sender
    const { receiverId } = req.body;

    if (id === receiverId) {
      return res.status(400).json({ message: "You cannot send a request to yourself." });
    }

    const sender = await User.findById(id);
    const receiver = await User.findById(receiverId);

    if (!receiver || !sender) {
      return res.status(404).json({ message: "User not found." });
    }

    if (receiver.friends.includes(id) || sender.friends.includes(receiverId)) {
      return res.status(400).json({ 
        message: "You are already friends.",
        success: false
       });
    }

    if (receiver.friendRequests.includes(id)) {
      return res.status(400).json({ 
        message: "Friend request already sent.",
        success: false
       });
    }

    if (sender.friendRequests.includes(receiverId)) {
      return res.status(400).json({ 
        message: "This user has already sent you a request.",
        success: false
      });
    }

    receiver.friendRequests.push(id);
    await receiver.save();

    res.status(200).json({ 
      message: "Friend request sent successfully!",
      success: true
     });
  } catch (error) {
    res.status(500).json({ 
      message: "Error sending friend request",
      error: error.message,
      success: false
     });
  }
};


export const respondToFriendRequest = async (req, res) => {
  try {
    const { id } = req.params; // ID of the user responding to the request
    const { senderId, accept } = req.body; // ID of the request sender and response (true/false)

    const user = await User.findById(id);
    const sender = await User.findById(senderId);

    if (!user || !sender) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.friendRequests.includes(senderId)) {
      return res.status(400).json({ message: "Friend request not found." });
    }

    // Remove from friendRequests
    user.friendRequests = user.friendRequests.filter((reqId) => reqId.toString() !== senderId);

    if (accept) {
      user.friends.push(senderId);
      sender.friends.push(id);
    }

    await user.save();
    await sender.save();

    res.status(200).json({ message: accept ? "Friend request accepted!" : "Friend request rejected!" });
  } catch (error) {
    res.status(500).json({ message: "Error responding to friend request", error: error.message });
  }
};
