import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

function getTokenFromRequest(req) {
  if (req.headers.authorization && req.headers.authorization.startsWith('JWT ')) {
    return req.headers.authorization.substring(4);
  }
  return null;
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    try {
      const user = await User.findById(decoded._id).exec();
      if (!user) {
        return res.status(422).json({ message: 'User not found' });
      }
      return res.status(200).json(user.favourites);
    } catch (err) {
      return res.status(422).json({ message: `Unable to get favourites: ${err}` });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}

