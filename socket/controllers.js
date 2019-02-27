const controllers = require("../database/controllers");
const comments = controllers.comments;
const movies = controllers.movies;

function addCommentLikeDislike(data) {
  const client = this;
  comments.newCommentLikeDislike(data.body.commentId, data.body.like)
    .then(() => {
      client.emit("newCommentLikeDislike", data.body);
      client.broadcast.emit("newCommentLikeDislike", data.body);
    })
    .catch(err => {
      console.log(err.message);
    });
}

function addMovieLikeDislike(data) {
  const client = this;
  movies.newMovieLikeDislike(data.body.movieId, data.body.like)
    .then(() => {
      client.emit("newMovieLikeDislike", data.body);
      client.broadcast.emit("newMovieLikeDislike", data.body);
    })
    .catch(err => {
      console.log(err.message);
    });
}

function addCommentToMovie(data) {
  const client = this;
  comments.addCommentToMovie(data.body.author, data.body.comment, data.body.movieId)
    .then(newComment => {
      let plainComment = newComment.get({
        plain: true
      });
      client.emit("newCommentToMovie", plainComment);
      client.broadcast.emit("newCommentToMovie", plainComment);
    })
    .catch(err => {
      console.log(err.message);
    });
}


module.exports = {
  addCommentLikeDislike,
  addMovieLikeDislike,
  addCommentToMovie
}