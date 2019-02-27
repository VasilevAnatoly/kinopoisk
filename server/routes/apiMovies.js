const express = require('express');
const database = process.cwd() + '/database/';
const controllers = require(database + 'controllers');

const movies = controllers.movies;

var router = express.Router();

router.route('/')
    .get(movies.getMovies);

router.route('/:movieId').get(movies.getMovieById);

module.exports = router;