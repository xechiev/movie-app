/* eslint-disable camelcase */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Rate } from 'antd';
import { format } from 'date-fns';
import Context from '../hooks/context';
import Minify from '../support-func/minify-text';
import SEARCH_IMG from '../api/search-img';
import PosterDefault from '../api/poster-default';
import SearchGenreMovie from '../support-func/search-genres';
import ColorRating from '../support-func/raiting-color';

import 'antd/dist/antd.css';
import '../movie/movie.css';

export default function Rated({ backdrop_path, genre_ids, title, overview, vote_average, release_date, rating }) {
  const { genresList } = useContext(Context);

  return (
    <div className="movie">
      <img className="poster" src={backdrop_path ? SEARCH_IMG + backdrop_path : (backdrop_path = PosterDefault)} alt={title} />
      <div className="info">
        <h3>{Minify(title, 15)}</h3>
        <span className={ColorRating(vote_average).join(' ')}>
          <p className="ratingNumber">{vote_average}</p>
        </span>
        <p className="releaseData">{format(new Date(release_date), 'PP')}</p>
        {SearchGenreMovie(genre_ids, genresList)}
        <p className="describe">{Minify(overview, 200)}</p>
        <Rate count={10} disabled defaultValue={rating} />
      </div>
    </div>
  );
}
Rated.defaultProps = {
  release_date: '1992-03-08',
  backdrop_path: PosterDefault,
  genre_ids: '',
};

Rated.propTypes = {
  backdrop_path: PropTypes.string,
  title: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  vote_average: PropTypes.number.isRequired,
  release_date: PropTypes.string,
  genre_ids: PropTypes.arrayOf(PropTypes.number),
  rating: PropTypes.number.isRequired,
};
