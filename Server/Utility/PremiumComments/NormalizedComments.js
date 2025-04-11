
export const normalizedComments = (commentsTree) => {
    const byId = {};
    const topLevel = [];

    const walk = (list , parent = null) => {
        list.forEach(comment => {
            const {_id , replies = [] , ...rest} = comment;

            byId[_id] = {
                _id,
                parent,
                replies: replies.map(reply => reply._id),
                ...rest
            };

            if(!parent) topLevel.push(_id);
        })
    }

    walk(commentsTree);
    return {byId , topLevel}
}