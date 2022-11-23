import express from 'express';
import { roomController } from '../controllers';
const router = express.Router();
// initilize the router
router
    .route('/room')
    .get(roomController.getRoom)
    .post(roomController.addNewRoom);
router
    .route('/room/:id')
    .get(roomController.getSingleRoom)
    .patch(roomController.updateRoom)
    .delete(roomController.deleteRoom);

export default router;
