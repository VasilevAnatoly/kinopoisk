const CommentEntity = require("../index").CommentEntity;

function addCommentToMovie(author, comment, movieId) {
    return CommentEntity.create({
        author: author,
        comment: comment,
        movieId: movieId
    }, {
        raw: true,
    });
}

function newCommentLikeDislike(commentId, like) {
    return CommentEntity.increment(like === "like" ? 'likes' : 'dislikes', {
        where: {
            id: commentId
        }
    });
}

module.exports = {
    addCommentToMovie,
    newCommentLikeDislike
};