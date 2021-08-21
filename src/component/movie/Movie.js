/* eslint-disable camelcase */
import React, { useContext, useState } from 'react';
import { format } from 'date-fns';
import { Rate } from 'antd';
import PropTypes from 'prop-types';
import ApiService from '../../api/ApiService';
import Context from '../../hooks/context';
import minify from '../../support-func/minify-text';
import searchGenreMovie from '../../support-func/searchGenreMovie';
import colorRating from '../../support-func/raiting-color';

import 'antd/dist/antd.css';
import './movie.css';

export default function Movie({ id, poster_path, genre_ids, title, overview, vote_average, release_date, rating }) {
  const { genresList, guestID, setHaveRatedMovie, movieRatingSaved } = useContext(Context);
  const [valueDefault, setValueDefault] = useState(rating)
  const apiService = new ApiService();

  if (!release_date) {
    release_date = null;
  }
  
  const selectStar = (number, movie_id) => {
    setValueDefault(number)
    movieRatingSaved({ rating: number, id: movie_id })
    apiService.postStars(number, movie_id, guestID);
    setHaveRatedMovie(false);
  };
  
  return (
    <div className="movie">
      <img className="poster" src={apiService.getDefaultPoster(poster_path)} alt={title} />
      <div className="info">
        <h5>{title}</h5>
        <span className={colorRating(vote_average).join(' ')}>
          <p className="ratingNumber">{vote_average}</p>
        </span>
        <p className="releaseData">{format(new Date(release_date), 'PP')}</p>
        <div>{searchGenreMovie(genre_ids, genresList)}</div>
        <p className="describe">{minify(overview, 235)}</p>
        <Rate 
          count={10} 
          value={rating} 
          onChange={(number) => selectStar(number, id, guestID)} 
          defaultValue={valueDefault}
        />
      </div>
    </div>
  );
}

Movie.defaultProps = {
  release_date: '1992-03-08',
  genre_ids: '',
  poster_path: '',
  rating: 0,
};

Movie.propTypes = {
  id: PropTypes.number.isRequired,
  poster_path: PropTypes.string,
  title: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  vote_average: PropTypes.number.isRequired,
  release_date: PropTypes.string,
  genre_ids: PropTypes.arrayOf(PropTypes.number),
  rating: PropTypes.number,
};
