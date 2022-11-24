import express from 'express';
import { userController } from '../controllers';
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

export default router;
