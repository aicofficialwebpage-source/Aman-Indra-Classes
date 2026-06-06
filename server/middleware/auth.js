import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token, access denied.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token parsing failed, access denied.' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_aic_jwt_token_key_102938');
    if (!verified) {
      return res.status(401).json({ message: 'Token verification failed, access denied.' });
    }

    req.admin = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token, access denied.', error: err.message });
  }
};

export default auth;
