import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        const userId = req.user.userId; // comes from the token
        const user = await userModel.findById(userId).select('-password -verifyOtp -verifyOtpExpireAt');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ success : true, userData:{
            name: user.name,
            isAccountVerified: user.isAccountVerified
        }});
    } catch (error) {   
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}