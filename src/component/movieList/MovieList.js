import React from 'react';
import PropTypes from 'prop-types';
import Movie from '../movie/Movie';

export default function MovieList({ arr, ratedMovie }) {
  const elements = arr.map((movie) => {
    if (ratedMovie) {
      ratedMovie.map((movie2) => {
        const movie1 = movie;
          if (movie1.id === movie2.id) {
            movie1.rating = movie2.rating
          }
          return movie1.rating
      })
      return <li key={movie.id} className="movies"><Movie {...movie} /></li>
    }
     return <li key={movie.id} className="movies"><Movie {...movie} /></li>
  })

  return (
    <ul className="movie-list">
      {elements}
    </ul>
  )
}
MovieList.defaultProps = {
  ratedMovie: undefined,
}

MovieList.propTypes = {
  arr: PropTypes.arrayOf(PropTypes.object).isRequired,
  ratedMovie: PropTypes.arrayOf(PropTypes.object),
}

