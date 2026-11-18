import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  avatar: { type: String, default: 'https://testingbot.com/free-online-tools/random-avatar/200?u=u837kfei139kn' },
  email: { type: String, required: true, unique: true },
  password: {type: String, required: true},
  status: { type: String, default: 'online' },
  lastseenAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
},{ timestamps: true });

const User=mongoose.model('User', UserSchema);
export default User;
