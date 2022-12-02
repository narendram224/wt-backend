import { catchAsyncError } from '../middleware';
import Conversation from '../models/Conversation.model';
// import { APIFeature, ErrorHandler } from '../Utills';

const conversationController = {
    addConversation: catchAsyncError(async (req, res) => {
        const { senderId, receiverId } = req.body;
        const exist = await Conversation.findOne({
            members: { $all: [senderId, receiverId] },
        });
        // res.status(200).json({ success: false });
        if (exist) {
            return res.status(200).json({
                success: true,
                message: 'Conversation is already exist',
                data: {
                    conversationId: exist._id,
                },
            });
        }
        const newConversation = new Conversation({
            members: [senderId, receiverId],
        });
        await newConversation.save();
        return res.status(201).json({
            success: true,
            message: 'Conversation is successfully created',
        });
    }),
    getConversation: catchAsyncError(async (req, res) => {
        const { senderId, receiverId } = req.params;
        const conversation = await Conversation.findOne({
            members: { $all: [senderId, receiverId] },
        });
        if (conversation) {
            return res.status(200).json({
                success: true,
                message: 'Conversation is already exist',
                data: conversation,
            });
        }

        return res.status(404).json({
            success: true,
            message: 'Conversation not found',
        });
    }),
};
export default conversationController;
