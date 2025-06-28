import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData } from '../controllers/userController.js';
import userModel from '../models/userModel.js';

const userRouter = express.Router();
userRouter.get('/profile',userAuth,getUserData);

// GET /api/user/profile - get current user's profile
userRouter.get('/profile', userAuth, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ data: user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default userRouter;