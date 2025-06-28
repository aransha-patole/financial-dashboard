import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach decoded user info to req.user
    req.user = { userId: decoded.id };
 // ✅ Matches what your controller expects


    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized access', error: error.message });
  }
};

export default userAuth;
