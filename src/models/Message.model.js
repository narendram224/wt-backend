import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
const MessagaSchema = new Schema(
    {
        type: { type: String, default: 'message' },
        message: { type: String, required: [true, 'Messgae is required'] },
        userName: { type: String, required: [true, 'User name is required'] },
        userImage: {
            type: String,
            default: 'https://joeschmoe.io/api/v1/random',
        },
        room: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Room',
        },
    },
    { timestamps: true }
);

const Message = model('Message', MessagaSchema);

export default Message;
