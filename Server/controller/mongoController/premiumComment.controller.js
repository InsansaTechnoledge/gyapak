import { PremiumComment } from "../../models/PremiumCommentSection.model.js";
import { APIError } from "../../Utility/ApiError.js"
import { APIResponse } from "../../Utility/ApiResponse.js";
import { getNestedComment } from "../../Utility/PremiumComments/GetNestedComments.js";
import mongoose ,{Types} from "mongoose";
export const getDeepNestedComments = async (req , res) => {
    try {
        const {examId} = req.params;
        const normalized = await getNestedComment(examId);

        return new APIResponse(200, normalized , 'fetched full comment tree').send(res);
    } catch(e) {
        return new APIError(500, [e.message , 'Error building comment tree']).send(res);
    }
}

export const createNewComment = async (req , res) => {
    try{
        const {content , examId , author , parent = null } = req.body;

        let newComment = await PremiumComment.create({
            content,
            examId,
            author,
            parent
        })

        newComment = await PremiumComment.findById(newComment._id).populate('author' , 'name').lean()

        newComment.replies = [];

        return new APIResponse(200 , newComment , 'you posted a comment').send(res);

    } catch(e) {
        return new APIError(500 , [e.message , 'error creating new comment']).send(res);
    }
}

export const likeUnlikeComment = async (req, res) => {
    try {
        const { commentId, userId } = req.body;

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return new APIError(400, ['Invalid commentId or userId']).send(res);
        }

        const comment = await PremiumComment.findById(commentId);
        if (!comment) {
            return new APIError(404, ['Comment not found']).send(res);
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const index = comment.likes.findIndex(
            (id) => id.toString() === userObjectId.toString()
        );

        if (index === -1) {
            comment.likes.push(userObjectId); // Like
        } else {
            comment.likes.splice(index, 1); // Unlike
        }

        const updatedComment = await comment.save();

        return new APIResponse(200, updatedComment.likes, 'Like/Unlike successful').send(res);
    } catch (e) {
        return new APIError(500, [e.message, 'There was an error in like/unlike the comment']).send(res);
    }
};

const deleteCommentRecursively = async (commentId , examId , deletedIds = []) => {
    const childComments = await PremiumComment.find({parent: commentId});

    for (const child of childComments) {
        await deleteCommentRecursively(child._id , examId, deletedIds);
    }

    await PremiumComment.findByIdAndDelete(commentId);
    deletedIds.push(commentId);

    return deletedIds;
}

export const deleteCommentAndReplies = async (req , res) => {
    try{    
        const {commentId , examId} = req.body;

        const comment = await PremiumComment.findById(commentId);

        if (!comment) {
            return new APIError(404, ['Comment not found']).send(res);
        }

        const deletedIds = await deleteCommentRecursively(commentId , examId);

        return new APIResponse(200, deletedIds , 'deleted successfully').send(res);

    } catch (e) {
        return new APIError(500, [e.message , 'there was an error in deleting']).send(res);
    }
}

export const getCommentbyId = async (req, res) => {
    try {
      const { ids, examId } = req.body;
  
      if (!Array.isArray(ids)) {
        return new APIError(400, ['"ids" is required and must be a non-empty array']).send(res);
      }
  
      // Convert all IDs to ObjectId
      const objectIds = ids.map(id => Types.ObjectId.createFromHexString(id));
  
      let comments = await PremiumComment.find({ _id: { $in: objectIds } })
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .lean();
  
      const allComments = await PremiumComment.find({examId: examId});
      comments = comments.map(comment => ({
        ...comment,
        replies: allComments.filter(comm => (comm.parent && comm.parent.equals(comment._id))).map(comm => comm._id)
  
      }))
  
  
      // if(!comments || comments.length === 0){
      //   return new APIError(404, ['No comments found for this parent']).send(res);
      // }
  
      return new APIResponse(200, comments, 'Fetched comments successfully').send(res);
    } catch (e) {
      return new APIError(500, [e.message, 'There was an error fetching comment']).send(res);
    }
  };
  