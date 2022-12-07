import { MONGODB_PASSWORD, MONGODB_URL, MONGODB_USER_NAME } from '../config';
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const url = `mongodb+srv://${MONGODB_USER_NAME}:${MONGODB_PASSWORD}@${MONGODB_URL}`;

const storage = new GridFsStorage({
    url,
    options: { useUnifiedTopology: true, useNewUrlParser: true },
    file: (req, file) => {
        const match = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'application/pdf',
            '.csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
        ];
        if (match.indexOf(file.mimetype) !== -1) {
            return `${Date.now()}-file-${file.originalname}`;
        }
        return {
            bucketName: 'Photos',
            filename: `${Date.now()}-file-${file.originalname}`,
        };
    },
});

export default multer({ storage });
