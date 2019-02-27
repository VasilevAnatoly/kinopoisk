const puppeteer = require('puppeteer');
const async = require('async');
const _ = require('underscore');
const fs = require("fs");
const request = require("request");

const database = process.cwd() + '/database/';
const controllers = require(database + 'controllers');
const movies = controllers.movies;
const dates = controllers.dates;
const dateMovies = controllers.dateMovies;

let scrapeTopMonthMovies = () => {
    return new Promise((resolve, reject) => {
        let today = new Date();
        let month28days = [today.toISOString().substring(0, 10)];

        for (var i = 1; i < 28; i++) {
            let date = new Date();
            date.setDate(today.getDate() - i);
            month28days.push(date.toISOString().substring(0, 10));
        }

        let allmovies = [];

        const _browser = puppeteer.launch({
            headless: false,
            args: ['--start-maximized']
        });

        async.each(month28days, (dayString, callback) => {
                scrapeMoviesTableByDate(_browser, dayString).then(movies => {
                    movies.forEach(movie => {
                        movie.date = dayString;
                    });
                    allmovies = allmovies.concat(movies);
                    callback();
                }).catch(err => {
                    callback(err);
                });
            },
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    _browser.then(browser => browser.close());
                    resolve(allmovies);
                }
            });
    });
};

let scrapeMoviesTableByDate = (_browser, dayString) => {
    return new Promise((resolve, reject) => {
        try {
            let _page;
            _browser.then(browser => (_page = browser.newPage()))
                .then(page => page.goto(`https://www.kinopoisk.ru/top/day/${dayString}`, {
                    waitUntil: 'domcontentloaded'
                }))
                .then(() => _page)
                .then(page => page.$$eval(
                    "[id^='top250_place_']",
                    nodes =>
                    nodes.map(element => {
                        let position = element.querySelector("td:nth-child(1) > a").getAttribute("name");
                        let fullName = element.querySelector("td:nth-child(2) > a") ? element.querySelector("td:nth-child(2) > a").innerText : null;
                        let rate = element.querySelector("td:nth-child(3) > div a") ? parseFloat(element.querySelector("td:nth-child(3) > div a").innerText) : null;
                        let originName = element.querySelector("td:nth-child(2) > span") !== null ? element.querySelector("td:nth-child(2) > span").innerText : null;
                        let link = element.querySelector("td:nth-child(2) > a").href;

                        return {
                            position: position,
                            name: fullName.substring(0, fullName.length - 7),
                            origin_name: originName ? originName : fullName.substring(0, fullName.length - 7),
                            rate: rate,
                            year: fullName.substring(fullName.length - 5, fullName.length - 1),
                            link: link
                        };
                    })
                )).then(movies => {
                    _page.then(page => page.close());
                    resolve(movies);
                });
        } catch (err) {
            reject(err);
        }
    });
}

let scrapeMoviesInfo = (moviesArray) => {
    return new Promise((resolve, reject) => {
        let size = 5; //размер подмассива
        let subarray = []; //массив в который будет выведен результат.
        for (let i = 0; i < Math.ceil(moviesArray.length / size); i++) {
            subarray[i] = moviesArray.slice((i * size), (i * size) + size);
        }

        const _browser = puppeteer.launch({
            headless: false,
            args: ['--start-maximized']
        });

        let asyncFunc = (movies10Array) => {
            return new Promise((resolve, reject) => {
                async.each(movies10Array, (movie, callback) => {
                        scrapeMovieInfo(_browser, movie.link).then(movieInfo => {
                            try {
                                let imagePath = "/previews/preview" + '-' + Date.now() + ".jpg";
                                downloadMoviePreview(movieInfo.imageUrl, "public" + imagePath);
                                movie.image = imagePath;
                                movie.description = movieInfo.description;
                                callback();
                            } catch (err) {
                                callback(err);
                            }
                        }).catch(err => {
                            callback(err);
                        });

                    },
                    function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
            });
        }

        let promisesQueue = (arrayArrayMovies) => {
            return arrayArrayMovies.reduce((promise, movieArray) => {
                return promise
                    .then((result) => {
                        return asyncFunc(movieArray).then(result => {});
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
            }, Promise.resolve());
        }

        promisesQueue(subarray)
            .then(() => resolve(_browser.then(browser => browser.close())))
            .catch(err => reject(err));
    });
};

let scrapeMovieInfo = (_browser, movieLink) => {
    return new Promise((resolve, reject) => {
        try {
            let _page;
            let _description = '';
            let _imageUrl = '';

            _browser.then(browser => (_page = browser.newPage()))
                .then(page => page.goto(movieLink, {
                    waitUntil: 'domcontentloaded'
                }))
                .then(() => _page)
                .then(page => page.$eval(
                    ".film-synopsys",
                    element => {
                        return element.innerText;
                    }
                ))
                .then(description => {
                    _description = description;
                })
                .then(() => _page)
                .then(page => page.$eval(
                    "a.popupBigImage > img",
                    element => {
                        return element.src;
                    }
                ))
                .then(imageUrl => {
                    _imageUrl = imageUrl;
                })
                .then(() => _page)
                .then(page => {
                    page.close();
                    resolve({
                        description: _description,
                        imageUrl: _imageUrl
                    });
                });
        } catch (err) {
            reject(err);
        }
    });
}


let downloadMoviePreview = (uri, filename) => {
    request.head(uri, function (err, res, body) {
        request(uri)
            .pipe(fs.createWriteStream(filename));
    });
}


scrapeTopMonthMovies().then((scrapedMovies) => {
    var uniqueMovies = _.uniq(scrapedMovies, (movie) => {
        return movie.name;
    });

    let today = new Date();
    let month28days = [today.toISOString().substring(0, 10)];

    for (var i = 1; i < 28; i++) {
        let prevDay = new Date();
        prevDay.setDate(today.getDate() - i);
        month28days.push(prevDay.toISOString().substring(0, 10));
    }

    dates.createDates(month28days).then((datesEntities) => {
        scrapeMoviesInfo(uniqueMovies).then(() => {
            movies.createMovies(uniqueMovies).then((moviesEntities) => {
                let movies = moviesEntities.map(movie => {
                    return movie.dataValues
                });
                let dates = datesEntities.map(date => {
                    return date.dataValues
                });

                dates.forEach((date) => {
                    let topMoviesByDate = scrapedMovies.filter(movie => {
                        return movie.date.toString() === date.date.toString();
                    });

                    let moviesWithPositionsByDate = topMoviesByDate.map(topMov => {
                        let currMovie = movies.find(movie => {
                            return topMov.name.toString() === movie.name.toString();
                        });
                        return {
                            dateId: date.id,
                            movieId: currMovie.id,
                            position: topMov.position
                        }
                    });

                    dateMovies.createDateMovies(moviesWithPositionsByDate).then((dateMoviesEntities) => {});
                });
            });
        });
    });
}).catch((err) => {
    console.log("Error: " + err.message);
});