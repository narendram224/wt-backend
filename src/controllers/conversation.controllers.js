import { catchAsyncError } from '../middleware';
import Conversation from '../models/Conversation.model';
// import { APIFeature, ErrorHandler } from '../Utills';

const conversationController = {
    addConversation: catchAsyncError(async (req, res) => {
        const { senderId, receiverId } = req.body;
        const exist = await Conversation.findOne({
            members: { $all: [senderId, receiverId] },
        });
        console.log('ExitOnError', exist, senderId, receiverId);
        res.status(200).json({ success: false });
        // if (exist) {
        //     return res.status(200).json({
        //         success: true,
        //         message: 'Conversation is already exist',
        //         data: {
        //             conversationId: exist._id,
        //         },
        //     });
        // }
        // const newConversation = new Conversation({
        //     member: [senderId, receiverId],
        // });
        // await newConversation.save();
        // return res.status(201).json({
        //     success: true,
        //     message: 'Conversation is successfully created',
        // });
    }),
};
export default conversationController;
