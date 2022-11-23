import express from 'express';
import { messageController } from '../controllers';
const router = express.Router();
// initilize the router
router
    .route('/message')
    .get(messageController.getMessage)
    .post(messageController.addNewMessage);
router.get('/message/room/:roomId', messageController.getRoomMessages);
router
    .route('/message/:id')
    .get(messageController.getSingleMessage)
    .patch(messageController.updateMessage)
    .delete(messageController.deleteMessage);

export default router;
