import express from 'express'
import { createNewComment, deleteCommentAndReplies, getCommentbyId, getDeepNestedComments, likeUnlikeComment } from '../../controller/mongoController/premiumComment.controller.js';

const router = express.Router();

router.post('/' , createNewComment);
router.post('/like' , likeUnlikeComment);
router.delete('/' , deleteCommentAndReplies);
router.get('/:examId' , getDeepNestedComments)
router.post('/comments-by-id' , getCommentbyId)


export default router;