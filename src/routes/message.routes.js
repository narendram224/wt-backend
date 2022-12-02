import express from 'express';
import { messageController, uploadController } from '../controllers';
import { upload } from '../middleware';
const router = express.Router();
// initilize the router
router
    .route('/message')
    .get(messageController.getMessage)
    .post(messageController.addNewMessage);
router.get('/message/conversation/:roomId', messageController.getRoomMessages);
router.get('/message/lastMessage/:roomId', messageController.getRoomMessages);
router
    .route('/message/:id')
    .get(messageController.getSingleMessage)
    .patch(messageController.updateMessage)
    .delete(messageController.deleteMessage);

router.post('/file-upload', upload.single('file'), uploadController.fileUpload);
router.get('/file/:filename', uploadController.getuploadedFile);

export default router;
