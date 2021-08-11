const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {MovieDb} = require('moviedb-promise');
//Подключение к API CinemaDB
const movieDb = new MovieDb('8887e6529c3a8912df32b3d6c11e7875');
const mongoose = require('mongoose');
const passport = require('passport');
const {check, validationResult} = require('express-validator');

// Рендер главной страницы
router.get('/', (req, res) => {
    movieDb
        //Получение списка фильмов
        .discoverMovie({
            language: 'ru-RU',
            with_genres: 27,
            sort_by: "popularity.desc",
        })
        //Создание и заполнения массива списком фильмов
        .then((item) => {
            const movieList = [];
            item.results.slice(0, 4).map(({id, title, poster_path}) => {
                const item = {id, title, poster_path};
                movieList.push(item);
            })
            return movieList;
        })
        .then((array) => {
            movieDb
                //Получения списка сериалов
                .listInfo({
                    id: 7099344,
                    language: 'ru-RU'
                })
                //Заполнения массива списком сериалов и рендер на страницу
                .then((list) => {
                    list.items.slice(0, 4).map(({id, name, poster_path}) => {
                        const item = {id, name, poster_path};
                        array.push(item);
                    })
                    res.render('index', {movieList: array});
                })
            return array;
        })
        .catch(err => console.log(err));
})

router.get('/personalPage', (req, res) => {
    if (req.isAuthenticated()) {
        const userAddedMovieList = req.user.addedFilms.map(Number);
        const userWatchedMovieList = req.user.watchedFilms.map(Number);
        const userAddedPosterList = [];
        const userWatchedPosterList = [];
        userAddedMovieList.forEach((movieID) => {
            userAddedPosterList.push(
                movieDb
                    .movieInfo({id: movieID, language: 'ru-RU'})
                    .then(({poster_path, id}) => {
                        return {poster_path, id};
                    })
                    .catch(err => console.log(err))
            );
        });
        userWatchedMovieList.forEach((movieID) => {
            userWatchedPosterList.push(
                movieDb
                    .movieInfo({id: movieID, language: 'ru-RU'})
                    .then(({poster_path, id}) => {
                        return {poster_path, id};
                    })
                    .catch(err => console.log(err))
            );
        });

        Promise.all(userAddedPosterList)
            .then((addedList) => {
                Promise.all(userWatchedPosterList)
                    .then((watchedList) => {
                        res.render('personalPage', {
                            userAddedPosterList: addedList,
                            userWatchedPosterList: watchedList
                        });
                    })
            })
            .catch(err => console.log(err));
    } else {
        res.redirect('/register');
    }
})

router.post('/search', (req, res) => {
    const title = req.body.title;
    movieDb
        .searchMovie({
            query: title,
            language: 'ru-RU'
        })
        .then((movieList) => {
            return movieList.results[0].id;
        })
        .then((movieID) => {
            res.redirect(`/movie/${movieID}`);
        })
        .catch(err => console.log(err));
})

module.exports = router;