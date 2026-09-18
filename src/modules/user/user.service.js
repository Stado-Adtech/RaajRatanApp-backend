import User from "./user.model.js";

export const getUserProfile = async (userId) => {
  return await User.findById(userId).select("-otp");
};

export const getAllUsers = async () => {
  return await User.find().select("-otp").sort({ createdAt: -1 });
};

export const completeUserProfile = async (userId, payload) => {
  const name = (payload.name || "").trim();
  const email = (payload.email || "").trim().toLowerCase();

  const update = {

    name: payload.name?.trim() || "",
    email: payload.email?.trim().toLowerCase() || "",

    country: payload.country || "India",
    state: payload.state || "",
    city: payload.city || "",
    address: payload.address || "",
    pincode: payload.pincode || "",
    dob: payload.dob || "",
    spouseDob: payload.spouseDob || "",
    anniversaryDate: payload.anniversaryDate || "",
    panNumber: payload.panNumber?.toUpperCase() || "",
  };

   update.isProfileComplete =
    Boolean(update.name && update.email);

  const user = await User.findByIdAndUpdate(userId, update, { new: true }).select("-otp");
  return user;
};