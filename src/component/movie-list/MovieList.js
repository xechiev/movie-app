import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Context from '../../hooks/context';
import Movie from '../movie/Movie';

export default function MovieList({ arr }) {
  const { movies, ratedMovies } = useContext(Context);
  let elements = [];
  if (arr === ratedMovies) {
    elements = ratedMovies.map((movie) => <li key={movie.id} className="movies"><Movie {...movie} /></li>);
  } 
  if (arr === movies) {
    elements = arr.map((movie) => {
      movie.rating = 0;
      ratedMovies.map((movie2) => {
        if (movie.id === movie2.id) {
          movie.rating = movie2.rating;
        }
        return movie.rating
      }) 

      return (
        <li key={movie.id} className="movies">
          <Movie {...movie} />
        </li>
      )
    })
  }

  return (
    <ul className="movie-list">
      {elements}
    </ul>
  )
}

MovieList.propTypes = {
  arr: PropTypes.arrayOf(PropTypes.object).isRequired,
}
