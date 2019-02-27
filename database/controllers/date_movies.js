const DateMovieEntity = require("../index").DateMovieEntity;

function createDateMovies(dateMoviesArray) {
    return new Promise((resolve, reject) => {
        DateMovieEntity.bulkCreate(dateMoviesArray, {
                returning: true
            })
            .then((dateMovies) => {
                resolve(dateMovies);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

module.exports = {
    createDateMovies
};