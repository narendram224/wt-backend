import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
const ConversitionSchema = new Schema(
    {
        members: {
            type: Array,
        },
        message: String,
    },
    { timestamps: true }
);

const Conversation = model('conversation', ConversitionSchema);

export default Conversation;
