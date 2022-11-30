import express from 'express';
import { consersationController, userController } from '../controllers';
const router = express.Router();
// initilize the router
router
    .route('/user')
    .get(userController.getUsers)
    .post(userController.addNewUser);
router
    .route('/user/:id')
    .get(userController.getSingleUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);
router.route('/user/conversation').post(consersationController.addConversation);
router
    .route('/user/conversation/:senderId/:receiverId')
    .get(consersationController.getConversation);

export default router;
