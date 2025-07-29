import jwt from 'jsonwebtoken';

const authenticateUser = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader)
    return res.status(401).json({ msg: 'Access denied. No token provided.' });

  // Extract token from "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token)
    return res.status(401).json({ msg: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user info (e.g. id) available on req.user
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

export default authenticateUser;
