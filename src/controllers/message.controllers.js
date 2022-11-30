import { catchAsyncError } from '../middleware';
import Conversation from '../models/Conversation.model';
import Message from '../models/Message.model';
import path from 'path';
import { APIFeature, ErrorHandler } from '../Utills';

const roomController = {
    // get all message  api/v1/message
    getMessage: catchAsyncError(async (req, res) => {
        const resultPerpage = 25;
        const totalCount = await Message.countDocuments();
        const roomsInfo = new APIFeature(Message.find(), req.query)
            .search()
            .filter()
            .pagination(resultPerpage);
        const rooms = await roomsInfo.query;
        res.status(200).json({
            success: true,
            count: rooms.length,
            productCount: totalCount,
            rooms,
        });
    }),
    // get all message  api/v1/message/room/:id
    getRoomMessages: catchAsyncError(async (req, res) => {
        const { roomId } = req.params;
        const resultPerpage = 25;
        const totalCount = await Message.countDocuments();
        const roomsMsgs = new APIFeature(
            Message.find({ conversationId: roomId }),
            req.query
        )
            .search()
            .filter()
            .pagination(resultPerpage);
        const messages = await roomsMsgs.query;
        res.status(200).json({
            success: true,
            data: {
                count: messages.length,
                productCount: totalCount,
                messages,
            },
        });
    }),

    // add new message  api/v1/admin/message/new
    addNewMessage: catchAsyncError(async (req, res) => {
        const reqMessage = req.body.message;
        const reqBody = req.body || {};
        if (req.body.type === 'image') {
            console.log(path.extname(reqMessage).slice(1));
            reqBody.extension = path.extname(reqMessage).slice(1);
        }

        const message = await Message.create(reqBody);
        await Conversation.findByIdAndUpdate(req.body.conversationId, {
            message: reqMessage,
        });
        res.status(200).json({
            success: true,
            data: message,
        });
    }),

    // get single message  api/v1/message/:roomId
    getSingleMessage: catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const message = await Message.findById(id);
        if (!message) {
            return next(new ErrorHandler('Message not fount', 404));
        }
        res.status(200).json({
            success: true,
            message,
        });
    }),
    // update new message  api/v1/admin/message/:id
    updateMessage: catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        let message = await Message.findById(id);
        if (!message) {
            return next(new ErrorHandler('Message not fount!', 404));
        }
        message = await Message.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
        res.status(200).json({
            success: true,
            message,
        });
    }),

    // delete message  api/v1/admin/message/:id
    deleteMessage: catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        let message = await Message.findById(id);
        if (!message) {
            return next(new ErrorHandler('Message not fount!', 404));
        }
        await message.remove();
        res.status(200).json({
            success: true,
        });
    }),
};

export default roomController;
