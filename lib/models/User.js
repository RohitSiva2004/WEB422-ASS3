import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  password: String,
  favourites: [String]
});

const User = mongoose.models.users || mongoose.model('users', userSchema);

export default User;

