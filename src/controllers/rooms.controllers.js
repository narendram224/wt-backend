import { catchAsyncError } from '../middleware';
import Room from '../models/RoomInfo.model';
import { APIFeature, ErrorHandler } from '../Utills';

const roomController = {
    // get all room  api/v1/room
    getRoom: catchAsyncError(async (req, res) => {
        console.log('requ', req.originalUrl);
        const resultPerpage = 4;
        const totalCount = await Room.countDocuments();
        const roomsInfo = new APIFeature(Room.find(), req.query)
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

    // add new room  api/v1/admin/room/new
    addNewRoom: catchAsyncError(async (req, res) => {
        const room = await Room.create(req.body);
        res.status(200).json({
            success: true,
            room,
        });
    }),

    // get single room  api/v1/room/:roomId
    getSingleRoom: catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const room = await Room.findById(id);
        if (!room) {
            return next(new ErrorHandler('Room not fount', 404));
        }
        res.status(200).json({
            success: true,
            room,
        });
    }),
    // update new room  api/v1/admin/room/:id
    updateRoom: catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        let room = await Room.findById(id);
        if (!room) {
            return next(new ErrorHandler('Room not fount!', 404));
        }
        room = await Room.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
        res.status(200).json({
            success: true,
            room,
        });
    }),

    // delete room  api/v1/admin/room/:id
    deleteRoom: catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        let room = await Room.findById(id);
        if (!room) {
            return next(new ErrorHandler('Room not fount!', 404));
        }
        await room.remove();
        res.status(200).json({
            success: true,
        });
    }),
};

export default roomController;
