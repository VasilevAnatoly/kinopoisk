const MovieEntity = require("../index").MovieEntity;
const DateEntity = require("../index").DateEntity;
const CommentEntity = require("../index").CommentEntity;
const DateMovieEntity = require("../index").DateMovieEntity;

function getMovies(req, res) {
    MovieEntity.findAll({
            limit: 10,
            attributes: ['id', 'name', 'origin_name', 'year', 'rate'],
            include: [{
                model: DateEntity,
                where: {
                    date: req.query.date
                },
                attributes: ["id"],
                through: {
                    attributes: ['position'],
                },
            }],
            order: [
                [DateEntity, DateMovieEntity, 'position', 'ASC']
            ]
        })
        .then((movies) => {
            if (movies.length) {
                res.status(200).send(movies);
            } else {
                res.status(200).send([]);
            }
        })
        .catch((error) => {
            res.status(200).send({
                message: "Error retrieving movies: " + error.message
            });
        });
}

function getMovieById(req, res) {
    MovieEntity.findOne({
            where: {
                id: req.params.movieId
            },
            include: [{
                model: CommentEntity
            }]
        })
        .then((movie) => {
            if (movie) {
                res.status(200).send(movie);
            } else {
                res.send({
                    message: `Could not find movie by id = ${req.params.movieId}`
                });
            }
        })
        .catch((error) => {
            res.status(200).send({
                message: `Error retrieving movie by id = ${req.params.movieId}: ` + error.message
            });
        });
}

function newMovieLikeDislike(movieId, like) {
    return MovieEntity.increment(like === "like" ? 'likes' : 'dislikes', {
        where: {
            id: movieId
        }
    });
}

function createMovies(moviesArray) {
    return new Promise((resolve, reject) => {
        MovieEntity.bulkCreate(moviesArray, {
                returning: true
            })
            .then((movies) => {
                resolve(movies);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

module.exports = {
    getMovies,
    getMovieById,
    newMovieLikeDislike,
    createMovies
};