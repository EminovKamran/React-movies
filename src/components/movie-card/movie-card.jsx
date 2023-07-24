import React, { Component } from 'react';
import { format, parseISO } from 'date-fns';
import { Rate } from 'antd';

import { MoviesConsumer } from '../moviesContext/moviesContext';
import noPoster from '../../img/icons-no-image.png';
import './movie-card.css';

export default class MovieCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // eslint-disable-next-line class-methods-use-this
  showGenre(allGenres, moviesGenres) {
    const movieGenresId = moviesGenres.map((id) =>
      allGenres.genres.find((elem) => elem.id === id),
    );

    return movieGenresId.map((genre, index) => {
      if (index < 3) {
        return (
          <li key={genre.id} className='genre__item'>
            {genre.name}
          </li>
        );
      }
      return null;
    });
  }

  correctText() {
    const { overviewMovies } = this.props;
    let textLength = 0;
    const words = overviewMovies.split(' ');
    // eslint-disable-next-line array-callback-return,consistent-return
    const textIndex = words.findIndex((el, i) => {
      textLength += el.length;
      if (textLength > 140) {
        return i;
      }
    });

    return `${words.slice(0, textIndex).join(' ')}...`;
  }

  render() {
    const {
      titleMovies,
      overviewMovies,
      posterMovies,
      releaseDateMovies,
      voteAverage,
      changeMoviesRating,
      filmRating,
      moviesGenres,
    } = this.props;

    let MoviesVoteAverageColor;

    if (voteAverage <= 3) {
      MoviesVoteAverageColor = '#E90000';
    } else if (voteAverage > 3 && voteAverage < 5) {
      MoviesVoteAverageColor = '#E97E00';
    } else if (voteAverage >= 5 && voteAverage < 7) {
      MoviesVoteAverageColor = '#E9D100';
    } else {
      MoviesVoteAverageColor = '#66E900';
    }

    const movieRating = +voteAverage.toFixed(1);
    const poster = `https://image.tmdb.org/t/p/original${posterMovies}`;
    const useCorrectText = this.correctText();
    const correctDate =
      releaseDateMovies === ''
        ? 'Unknown Date'
        : format(parseISO(releaseDateMovies), 'MMMM d, y');
    const description =
      overviewMovies.length > 140 ? useCorrectText : 'Unknown overview';

    return (
      <MoviesConsumer>
        {(allGenres) => (
          <div className='card'>
            <img
              src={posterMovies === null ? noPoster : poster}
              alt='Pictures'
            />
            <ul className='card__item'>
              <ul className='card__header'>
                <li className='card__title'>{titleMovies}</li>
                <li
                  className='card__rating'
                  style={{ borderColor: MoviesVoteAverageColor }}
                >
                  {movieRating}
                </li>
              </ul>
              <li className='card__release-date'>{correctDate}</li>
              Mo
              <ul className='genre'>
                {this.showGenre(allGenres, moviesGenres)}
              </ul>
              <li className='card__overview'>{description}</li>
              <Rate
                allowHalf
                defaultValue={filmRating}
                count={10}
                onChange={changeMoviesRating}
              />
            </ul>
          </div>
        )}
      </MoviesConsumer>
    );
  }
}
