/* eslint-disable camelcase */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Rate } from 'antd';
import { format } from 'date-fns';
import KEY_API from '../../api/key-api';
import Context from '../../hooks/context';
import minify from '../../support-func/minify-text';
import SEARCH_IMG from '../../api/search-img';
import posterDefault from '../../api/poster-default';
import searchGenreMovie from '../../support-func/searchGenreMovie';
import colorRating from '../../support-func/raiting-color';
import getDefaultPoster from '../../support-func/getDefaultPoster';

import 'antd/dist/antd.css';
import './movie.css';

export default function Movie({ id, backdrop_path, genre_ids, title, overview, vote_average, release_date, rating }) {
  const { genresList, guestID } = useContext(Context);

  if (!release_date) {
    release_date = null;
  }

  const selectStar = async (number, movie_id, key, guestSessionId) => {
    const value = number;
    await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/rating?api_key=${key}&guest_session_id=${guestSessionId}`, {
      method: 'POST',
      body: JSON.stringify({
        value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  return (
    <div className="movie">
      <img className="poster" src={getDefaultPoster(backdrop_path, SEARCH_IMG, posterDefault)} alt={title} />
      <div className="info">
        <h5>{title}</h5>
        <span className={colorRating(vote_average).join(' ')}>
          <p className="ratingNumber">{vote_average}</p>
        </span>
        <p className="releaseData">{format(new Date(release_date), 'PP')}</p>
        <div>{searchGenreMovie(genre_ids, genresList)}</div>
        <p className="describe">{minify(overview, 235)}</p>
        <Rate count={10} defaultValue={rating} onChange={(number) => selectStar(number, id, KEY_API, guestID)} />
      </div>
    </div>
  );
}

Movie.defaultProps = {
  release_date: '1992-03-08',
  backdrop_path: posterDefault,
  genre_ids: '',
  rating: 0,
};

Movie.propTypes = {
  id: PropTypes.number.isRequired,
  backdrop_path: PropTypes.string,
  title: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  vote_average: PropTypes.number.isRequired,
  release_date: PropTypes.string,
  genre_ids: PropTypes.arrayOf(PropTypes.number),
  rating: PropTypes.number,
};
