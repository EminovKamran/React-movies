import React, { Component } from 'react';
import { Alert, Spin } from 'antd';

import TmdbService from '../../service/tmdb-service';
import MovieCard from '../movie-card';

import './movie-list.css';

export default class MovieList extends Component {
  tmdbRes = new TmdbService();

  constructor(props) {
    super(props);
    this.state = {
      dataBase: [],
      status: null,
    };
  }

  componentDidMount() {
    this.tmdbRes.setGuestSessionId();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.searchValue !== prevProps.searchValue ||
      this.props.pageNumber !== prevProps.pageNumber ||
      this.props.activeTab !== prevProps.activeTab
    ) {
      this.getMovies();
    }
  }

  getMovies() {
    const { searchValue, pageNumber } = this.props;

    this.setState({
      status: 'loading',
    });

    let resourcePromise = null;

    if (this.props.activeTab === '1') {
      resourcePromise = this.updateRating(searchValue, pageNumber);
    } else {
      resourcePromise = this.tmdbRes.getRatedMovie(pageNumber);
    }

    resourcePromise
      .then((resource) => {
        const body = resource.results;
        const totalPageNumber = resource.total_pages * 10;
        this.props.onTotalPagesChange(totalPageNumber);

        if (this.props.activeTab === '2' && body.length === 0) {
          this.setState({
            status: 'emptyRatingMovies',
          });
          this.props.updateStatus('emptyRatingMovies');
        } else if (body.length === 0 && searchValue !== '') {
          this.setState({
            status: 'error',
          });
          this.props.updateStatus('error');
        } else {
          this.setState({
            dataBase: body,
            status: null,
          });
          this.props.updateStatus(null);
        }
      })
      .catch(() => {
        this.setState({
          status: 'warning',
        });
      });
  }

  updateRating(searchValue, pageNumber) {
    return this.tmdbRes
      .getFilms(searchValue, pageNumber)
      .then((resourceSearch) =>
        this.tmdbRes.getRatedMovie(pageNumber).then((resourceRated) => {
          resourceSearch.results.forEach((elemSearch) => {
            resourceRated.results.forEach((elemRated) => {
              if (elemSearch.id === elemRated.id) {
                // eslint-disable-next-line no-param-reassign
                elemSearch.rating = elemRated.rating;
              }
            });
          });
          return resourceSearch;
        }),
      );
  }

  renderCard() {
    const { dataBase } = this.state;
    return dataBase.map((item) => {
      const {
        id: idMovies,
        title: titleMovies,
        overview: overviewMovies,
        poster_path: posterMovies,
        release_date: releaseDateMovies,
        vote_average: voteAverage,
        genre_ids: moviesGenres,
        rating: filmRating = 0,
      } = item;
      return (
        <MovieCard
          key={idMovies}
          idMovies={idMovies}
          titleMovies={titleMovies}
          overviewMovies={overviewMovies}
          posterMovies={posterMovies}
          releaseDateMovies={releaseDateMovies}
          voteAverage={voteAverage}
          moviesGenres={moviesGenres}
          changeMoviesRating={(value) => {
            this.tmdbRes.sendRatedMovie(idMovies, value);
          }}
          filmRating={filmRating}
        />
      );
    });
  }

  render() {
    const { dataBase, status } = this.state;

    if (status === 'warning') {
      return (
        <Alert type='error' message='Error' description='Invalid connection' />
      );
    }

    if (status === 'loading') {
      return (
        <Spin tip='Loading...'>
          <Alert
            message='Trying to get a list of movies'
            type='info'
            showIcon
          />
        </Spin>
      );
    }

    if (status === 'emptyRatingMovies') {
      return (
        <Alert message='There are no rated movies' type='warning' showIcon />
      );
    }

    if (status === 'error') {
      return (
        <Alert
          message='No movies found for your search'
          type='warning'
          showIcon
        />
      );
    }
    const elements = this.renderCard(dataBase);
    return <div className='card-list'>{elements}</div>;
  }
}
