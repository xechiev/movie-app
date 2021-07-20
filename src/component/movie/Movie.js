/* eslint-disable camelcase */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Rate } from 'antd';
import { format } from 'date-fns';
import DOMEN from '../api/domen';
import KEY_API from '../api/key-api';
import Context from '../hooks/context';
import Minify from '../support-func/minify-text';
import SEARCH_IMG from '../api/search-img';
import PosterDefault from '../api/poster-default';
import SearchGenreMovie from '../support-func/search-genres';
import ColorRating from '../support-func/raiting-color';

import 'antd/dist/antd.css';
import './movie.css';

export default function Movie({ id, backdrop_path, genre_ids, title, overview, vote_average, release_date }) {
  const { genresList, guestID, getRatedMovie } = useContext(Context);

  if (!release_date) {
    release_date = null;
  }

  const selectStar = async (number, movie_id, key, guestSessionId) => {
    const value = number;
    await fetch(`${DOMEN}/movie/${movie_id}/rating?api_key=${key}&guest_session_id=${guestSessionId}`, {
      method: 'POST',
      body: JSON.stringify({
        value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    getRatedMovie(guestID, KEY_API)
  };

  return (
    <div className="movie">
      <img className="poster" src={backdrop_path ? SEARCH_IMG + backdrop_path : (backdrop_path = PosterDefault)} alt={title} />
      <div className="info">
        <h3>{Minify(title, 18)}</h3>
        <span className={ColorRating(vote_average).join(' ')}>
          <p className="ratingNumber">{vote_average}</p>
        </span>
        <p className="releaseData">{format(new Date(release_date), 'PP')}</p>
        {SearchGenreMovie(genre_ids, genresList)}
        <p className="describe">{Minify(overview, 200)}</p>
        <Rate count={10} onChange={(number) => selectStar(number, id, KEY_API, guestID)} />
      </div>
    </div>
  );
}

Movie.defaultProps = {
  release_date: '1992-03-08',
  backdrop_path: PosterDefault,
  genre_ids: '',
};

Movie.propTypes = {
  id: PropTypes.number.isRequired,
  backdrop_path: PropTypes.string,
  title: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  vote_average: PropTypes.number.isRequired,
  release_date: PropTypes.string,
  genre_ids: PropTypes.arrayOf(PropTypes.number),
};
