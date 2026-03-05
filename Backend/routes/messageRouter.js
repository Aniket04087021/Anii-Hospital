import express from 'express';
import { deleteMessage, getAllMessages, sendMessage } from '../controller/messageController.js';
import { isAdminAuthenticated } from '../middlewares/auth.js';



const router = express.Router();

router.post('/send',sendMessage);
router.get('/all', isAdminAuthenticated, getAllMessages);
router.delete('/:id', isAdminAuthenticated, deleteMessage);


export default router;
