import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const { userName, password, password2 } = req.body;

    if (req.query.action === 'register') {
      if (password !== password2) {
        return res.status(422).json({ message: 'Passwords do not match' });
      }

      try {
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({
          userName,
          password: hash,
          favourites: []
        });

        await newUser.save();
        return res.status(200).json({ message: `User ${userName} successfully registered` });
      } catch (err) {
        if (err.code === 11000) {
          return res.status(422).json({ message: 'User Name already taken' });
        }
        return res.status(422).json({ message: `Error creating user: ${err}` });
      }
    }

    if (req.query.action === 'login') {
      try {
        const user = await User.findOne({ userName }).exec();
        if (!user) {
          return res.status(422).json({ message: 'User not found' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return res.status(422).json({ message: 'Incorrect password' });
        }

        const payload = {
          _id: user._id,
          userName: user.userName
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET);
        return res.status(200).json({ message: 'login successful', token });
      } catch (err) {
        return res.status(422).json({ message: `Unable to find user: ${err}` });
      }
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}

