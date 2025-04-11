import { PremiumComment } from "../../models/PremiumCommentSection.model.js";
import { normalizedComments } from "./NormalizedComments.js";

export const getNestedComment = async (examId) => {
    const allComments = await PremiumComment.find({examId})
    .populate('author' , 'name')
    .lean();

    const map = {};
    const root = [];

    allComments.forEach(comment => {
        comment.replies = [];
        map[comment._id.toString()] = comment;
    })

    allComments.forEach(comment => {
        if(comment.parent) {
            map[comment.parent.toString()]?.replies.push(comment);
        } else {
            root.push(comment)
        }
    })

    return normalizedComments(root);
}