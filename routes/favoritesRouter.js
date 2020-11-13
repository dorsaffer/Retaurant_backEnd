const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favorites = require('../models/favorites');
var authenticate = require('./authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors, (req, res, next) => {
    Favorites.find({})
      .populate('user')
      .populate('dishes')
      .then((favorites) => {
        var favs = favorites.filter(fav => fav.user._id === req.user._id)[0];
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favs);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate('user')
      .populate('dishes')
      .then((favorites) => {
        const favs = favorites.filter(fav => fav.user._id === req.user._id)[0];
        if (favs !== null) {
          for (var i of req.body) {
            if (!favs.dishes.includes(i._id)) {
              favs.dishes.push(i._id);
            }
          }
          favs.save()
            .then((fav) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(fav);
            }, (err) => next(err))
            .catch((err) => next(err));
        } else {
          Favorites.create({ user: req.user.id })
            .then((favorite) => {
              for (var i of req.body) {
                favorite.dishes.push(i._id);
              }
              favorite.save()
                .then((fav) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(fav);
                }, (err) => next(err))
                .catch((err) => next(err));
            });
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
      .then((favorites) => {
        var favs = favorites.filter(fav => fav.user === req.user._id)[0];
        if (favs !== null) {
          Favorites.findByIdAndRemove(favs._id)
            .then((fav) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(fav);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
      });
  });

favoriteRouter.route('/:dishId')
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/' + req.params.dishId);
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
      .then((favorites) => {
        var favs = favorites.filter(fav => fav.user === req.user._id)[0];
        if (favs === null) {
          Favorites.create({ user: req.user.id })
            .then((favorite) => {
              favorite.dishes.push(req.params.dishId)
              favorite.save()
                .then((resp) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
            });
        } else if (favorite.dishes.indexOf(req.params.dishId) === -1) {
          favorite.dishes.push(req.params.dishId)
          favorite.save()
            .then((resp) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
      });
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/' + req.params.dishId);
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
      .then((favorites) => {
        var favs = favorites.filter(fav => fav.user === req.user._id)[0];
        if (favs !== null) {
          favs.dishes = favs.dishes.filter(dish => dish !== req.params.dishId);
          favs.save()
            .then((fav) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(fav);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
      });
  });

module.exports = favoriteRouter;