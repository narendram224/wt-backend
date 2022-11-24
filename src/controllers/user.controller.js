import { catchAsyncError } from '../middleware';
import User from '../models/User.model';
import { APIFeature, ErrorHandler } from '../Utills';

const userController = {
    // get all message  api/v1/message
    getUsers: catchAsyncError(async (req, res) => {
        const resultPerpage = 25;
        const totalCount = await User.countDocuments();
        const roomsInfo = new APIFeature(User.find(), req.query)
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

    // add new message  api/v1/admin/message/new
    addNewUser: catchAsyncError(async (req, res) => {
        const message = await User.create(req.body);
        res.status(200).json({
            success: true,
            message,
        });
    }),

    // get single message  api/v1/message/:roomId
    getSingleUser: catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const message = await User.findById(id);
        if (!message) {
            return next(new ErrorHandler('User not fount', 404));
        }
        res.status(200).json({
            success: true,
            message,
        });
    }),
    // update new message  api/v1/admin/message/:id
    updateUser: catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        let message = await User.findById(id);
        if (!message) {
            return next(new ErrorHandler('User not fount!', 404));
        }
        message = await User.findByIdAndUpdate(id, req.body, {
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
    deleteUser: catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        let message = await User.findById(id);
        if (!message) {
            return next(new ErrorHandler('User not fount!', 404));
        }
        await message.remove();
        res.status(200).json({
            success: true,
        });
    }),
};

export default userController;
