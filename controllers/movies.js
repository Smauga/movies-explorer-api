const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');

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
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN, })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') next(new BadRequestError('Некорректные данные'));
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => new NotFoundError('Нет карточки по заданному id'))
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) throw new ForbiddenError('Невозможно удалить чужой фильм');
      Movie.findByIdAndRemove(req.params.movieId)
        .then((deletedMovie) => res.send(deletedMovie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') next(new BadRequestError('Некорректный id фильма'));
      next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
