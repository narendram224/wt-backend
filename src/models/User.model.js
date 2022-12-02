import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
const UserSchema = new Schema(
    {
        type: { type: String, default: 'user' },
        name: { type: String, required: [true, 'User Name is required'] },
        email: { type: String, required: [true, 'Email  is required'] },
        image: {
            type: String,
            default: 'https://joeschmoe.io/api/v1/random',
        },
        id: {
            type: String,
            required: true,
            unique: true,
        },
        lastMessage: { type: String, default: '' },
    },
    { timestamps: true }
);

const User = model('User', UserSchema);

export default User;
