import { catchAsyncError } from '../middleware';
import { API_URL, SERVER_VERSION } from '../config';
import mongoose from 'mongoose';
import Grid from 'gridfs-stream';

let gfs;
let gridFsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gridFsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'fs',
    });
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('fs');
});

const uploadController = {
    fileUpload: catchAsyncError(async (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'file not found !',
            });
        }
        const imageUrl = `${API_URL}/api/${SERVER_VERSION}/file/${req.file.filename}`;
        res.status(200).json({
            success: true,
            data: {
                imageUrl,
            },
        });
    }),
    getuploadedFile: catchAsyncError(async (req, res) => {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        if (!file) {
            res.status(404).json({
                success: false,
                message: 'Image Not found',
            });
        }
        const readStream = gridFsBucket.openDownloadStream(file._id);
        readStream.pipe(res);
    }),
};

export default uploadController;
