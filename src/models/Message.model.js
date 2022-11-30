import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
const MessagaSchema = new Schema(
    {
        type: { type: String, default: 'message' },
        message: { type: String, required: [true, 'Messgae is required'] },
        imageText: { type: String, default: '' },
        extension: { type: String, default: '' },
        senderId: { type: String, required: [true, 'User name is required'] },
        receiverId: { type: String, required: [true, 'User name is required'] },
        conversationId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Conversation',
        },
    },
    { timestamps: true }
);

const Message = model('Message', MessagaSchema);

export default Message;
