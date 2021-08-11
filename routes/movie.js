const express = require('express');
const router = express.Router();
const {MovieDb} = require('moviedb-promise');
const movieDb = new MovieDb('8887e6529c3a8912df32b3d6c11e7875');
const passport = require('passport');
const User = require('../models/user');
const {check, validationResult} = require('express-validator');
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    const movieGrid = movieDb
        .discoverMovie({
            language: 'ru-RU',
            with_genres: 27,
            sort_by: "popularity.desc",
        })
        .then((item) => {
            return item.results.map(({id, title, original_title, poster_path, backdrop_path}) => {
                return {id, title, original_title, poster_path, backdrop_path};
            });
        })
        .catch((err) => console.log(err));

    const movieSlider = movieDb
        .listInfo({
            id: 7100744,
            language: 'ru-RU'
        })
        .then((list) => {
            return list.items.map(({id, title, backdrop_path}) => {
                return {id, title, backdrop_path};
            });
        })
        .catch((err) => console.log(err))

    Promise.all([movieGrid, movieSlider])
        .then(([grid, slider]) => {
            console.log(grid);
            res.render('movies', {gridList: grid, sliderList: slider})
        })


})

router.get('/:movieID', function (req, res) {
    const movieID = req.params['movieID'];
    movieDb
        .movieInfo({
            id: movieID,
            language: 'ru-RU'
        })
        .then((item) => {
            const {
                id,
                poster_path,
                title,
                original_title,
                overview,
                release_date,
                tagline,
                genres,
                runtime,
                status,
                original_language,

            } = item;
            return movieDescr = {
                id,
                poster_path,
                title,
                original_title,
                overview,
                release_date,
                tagline,
                genres,
                runtime,
                status,
                original_language,
            };
        })
        .then((movieDescr) => {
            movieDb
                .movieSimilar({
                    id: movieID,
                    language: 'ru-RU'
                })
                .then((recList) => {
                    const recImgs = [];
                    recList.results.slice(0, 5).map(({poster_path, id}) => {
                        const item = {poster_path, id};
                        recImgs.push(item);
                    })
                    return recImgs;
                })
                .then((recImgs) => {
                    const genres = movieDescr.genres.map((item) => {
                        return item.name
                    });
                    movieDb
                        .movieVideos({id: movieID})
                        .then((source) => {
                            const filtered = source.results.filter((el) => {
                                return el.type === "Trailer";
                            })
                            console.log(filtered)
                            if (filtered.length === 0) {
                                console.log('ПУСТО')
                                filtered.push({
                                    key: 'E4WlUXrJgy4',
                                });
                            }
                            console.log(filtered);
                            if (req.isAuthenticated() && req.user.addedFilms.indexOf(`${movieID}`) !== -1) {

                                res.render('moviePage', {
                                    movieDescr: movieDescr,
                                    recImgs: recImgs,
                                    genres: genres,
                                    req: req,
                                    video: filtered[0].key
                                });
                            } else {
                                res.render('moviePage', {
                                    movieDescr: movieDescr,
                                    recImgs: recImgs,
                                    genres: genres,
                                    req: req,
                                    video: filtered[0].key
                                });
                            }
                        })

                })
                .catch(err => console.log(err));
        })
        .catch((err) => console.log(err));
})

router.post('/:movieID/add', (req, res) => {
    const movieID = req.body.movieDescr;
    console.log(movieID);
    if (req.isAuthenticated()) {
        if (req.user.addedFilms.indexOf(`${movieID}`) === -1) {
            User.updateOne({'_id': req.user._id}, {$addToSet: {'addedFilms': movieID}}, {
                new: true,
                strict: false
            }, (err) => {
                if (err)
                    console.log(err);
                console.log('Added');
            });
        } else {
            User.updateOne({
                '_id': req.user._id,
                'addedFilms': `${movieID}`
            }, {$pullAll: {'addedFilms': [movieID]}}, {}, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('deleted');
                }
            });
        }
    } else {
        return res.redirect('/register');
    }
    res.status(204).send();
});


router.post('/:movieID/watch', (req, res) => {
    const movieID = req.body.movieDescr;
    console.log(movieID);
    if (req.isAuthenticated()) {
        if (req.user.watchedFilms.indexOf(`${movieID}`) === -1) {
            User.updateOne({'_id': req.user._id}, {$addToSet: {'watchedFilms': movieID}}, {
                new: true,
                strict: false
            }, (err) => {
                if (err)
                    console.log(err);
                console.log('Watched');
            });
        } else {
            User.updateOne({
                '_id': req.user._id,
                'watchedFilms': `${movieID}`
            }, {$pullAll: {'watchedFilms': [movieID]}}, {}, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('forgotten');
                }
            });
        }
    } else {
        return res.redirect('/register');
    }
    res.status(204).send();
});

module.exports = router;