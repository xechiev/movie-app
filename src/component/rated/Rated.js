/* eslint-disable camelcase */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Rate } from 'antd';
import { format } from 'date-fns';
import Context from '../../hooks/context';
import minify from '../../support-func/minify-text';
import SEARCH_IMG from '../../api/search-img';
import posterDefault from '../../api/poster-default';
import searchGenreMovie from '../../support-func/searchGenreMovie';
import colorRating from '../../support-func/raiting-color';
import getDefaultPoster from '../../support-func/getDefaultPoster';

import 'antd/dist/antd.css';
import '../movie/movie.css';

export default function Rated({ backdrop_path, genre_ids, title, overview, vote_average, release_date, rating }) {
  const { genresList } = useContext(Context);

  return (
    <li className="movie">
      <img className="poster" src={getDefaultPoster(backdrop_path, SEARCH_IMG, posterDefault)} alt={title} />
      <div className="info">
        <h5>{title}</h5>
        <span className={colorRating(vote_average).join(' ')}>
          <p className="ratingNumber">{vote_average}</p>
        </span>
        <p className="releaseData">{format(new Date(release_date), 'PP')}</p>
        <div>{searchGenreMovie(genre_ids, genresList)}</div>
        <p className="describe">{minify(overview, 200)}</p>
        <Rate count={10} disabled defaultValue={rating} />
      </div>
    </li>
  );
}
Rated.defaultProps = {
  release_date: '1992-03-08',
  backdrop_path: posterDefault,
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
