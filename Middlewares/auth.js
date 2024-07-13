import jwt from 'jsonwebtoken';

//////// Function verifyToken
function verifyToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
     const decoded = jwt.verify(token, 'your-secret-key');
     req.userId = decoded.userId;
     next();
     } catch (error) {
     res.status(401).json({ error: 'Invalid token' });
     }
     };

     export {verifyToken};