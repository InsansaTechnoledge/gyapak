import api from './api.js'

// get full nested comments
export const fetchNestedComments = async (examId) => {
    const res = await api.get(`/api/v1i2/comment/${examId}`)
    return res.data;
}

// post new comment 
export const createComment = async({content, examId, author, parent = null}) => {
    const res = await api.post('/api/v1i2/comment' , {
        content,
        examId,
        author,
        parent
    })

    return res.data;
}

// like unlike comment 
export const toggleLikeComment = async (commentId , userId) => {
    const res = await api.post('/api/v1i2/comment/like' , {commentId, userId})
    return res.data;
}

// delete comments nest 
export const deleteComment = async (commentId, examId) => {
    const res = await api.delete('/api/v1i2/comment' , {commentId, examId})
    return res.data;
}

// get comments by id 
export const getCommentsByIds = async (ids , examId) => {
    const res = await api.post('/api/v1i2/comment/comments-by-id' , {ids, examId})
    return res.data;
}
 