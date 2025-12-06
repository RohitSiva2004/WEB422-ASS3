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
  try {
    if (!process.env.MONGO_URL) {
      return res.status(500).json({ message: 'Database configuration error: MONGO_URL not set' });
    }
    
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error: JWT_SECRET not set' });
    }

    await connectDB();

    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { id } = req.query;

    if (req.method === 'PUT') {
      try {
        const user = await User.findById(decoded._id).exec();
        if (!user) {
          return res.status(422).json({ message: 'User not found' });
        }

        if (user.favourites.length >= 50) {
          return res.status(422).json({ message: 'Maximum favourites reached' });
        }

        const updatedUser = await User.findByIdAndUpdate(
          decoded._id,
          { $addToSet: { favourites: id } },
          { new: true }
        ).exec();

        return res.status(200).json(updatedUser.favourites);
      } catch (err) {
        return res.status(422).json({ message: 'Unable to update favourites' });
      }
    }

    if (req.method === 'DELETE') {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          decoded._id,
          { $pull: { favourites: id } },
          { new: true }
        ).exec();

        if (!updatedUser) {
          return res.status(422).json({ message: 'User not found' });
        }

        return res.status(200).json(updatedUser.favourites);
      } catch (err) {
        return res.status(422).json({ message: 'Unable to remove favourite' });
      }
    }

    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  } catch (err) {
    if (err.message && err.message.includes('MONGO_URL')) {
      return res.status(500).json({ message: 'Database configuration error: MONGO_URL not set' });
    }
    return res.status(500).json({ message: `Server error: ${err.message || 'Unknown error'}` });
  }
}

