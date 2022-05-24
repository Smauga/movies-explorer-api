const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const AccessError = require('../errors/AccessError');
const DataError = require('../errors/DataError');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const { country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN } = req.body;

  Movie.create({ country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: id,
    movieId,
    nameRU,
    nameEN, })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') next(new DataError('Некорректные данные'));
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => new NotFoundError('Нет карточки по заданному id'))
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) throw new AccessError('Невозможно удалить чужой фильм');
      Movie.findByIdAndRemove(req.params.cardId)
        .then((deletedMovie) => res.send(deletedMovie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') next(new DataError('Некорректный id фильма'));
      next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
